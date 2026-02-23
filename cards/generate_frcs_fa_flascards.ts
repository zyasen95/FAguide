// generate_frcs_fa_flashcards.ts
/* eslint-disable no-console */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import OpenAI from "openai";
import { FRCS_FA_SYLLABUS, type SyllabusTopic } from "./frcs_fa_syllabus";

// --------------------
// Types
// --------------------
type Flashcard = {
  case: string;          // e.g. "Pilon fracture - staged fixation"
  category: string;      // e.g. "Trauma > Pilon > Approaches"
  question: string;
  answer: string;
  explanation: string;
  tags?: string[];       // optional: ["FRCS", "BOFAS", "approach", ...] (no fake citations)
  difficulty?: "Core" | "FRCS";
};

type FlashcardFile = {
  meta: {
    generated_at_utc: string;
    model: string;
    total_cards: number;
    notes: string;
  };
  flashcards: Flashcard[];
};

// --------------------
// Config
// --------------------
const MODEL = process.env.OPENAI_MODEL ?? "gpt-5";
const OUTPUT_PATH = path.resolve(process.cwd(), "frcs_fa_flashcards.json");

// Batch sizing: smaller batches reduce JSON failures + duplicates
const BATCH_SIZE = Number(process.env.BATCH_SIZE ?? 18);

// Safety limits
const MAX_TOTAL_CARDS = Number(process.env.MAX_TOTAL_CARDS ?? 1000);
const MAX_ITERATIONS_PER_TOPIC = Number(process.env.MAX_ITERATIONS_PER_TOPIC ?? 80);

// If you want more determinism, you can set temperature low-ish
const TEMPERATURE = Number(process.env.TEMPERATURE ?? 0.4);

// --------------------
// Prompt (the important bit)
// --------------------
function buildPrompt(topic: SyllabusTopic, needed: number) {
  const procedures = topic.procedures.length ? topic.procedures.join("; ") : "(none listed)";
  const difficulty = topic.difficulty_bias ?? "FRCS";

  return `
You are generating exceptionally high-yield FRCS (Tr & Orth) Foot & Ankle flashcards for UK exam prep.

Hard requirements:
- Output MUST be valid JSON only (no markdown, no commentary).
- Output schema:
{
  "flashcards": [
    {
      "case": string,
      "category": string,
      "question": string,
      "answer": string,
      "explanation": string,
      "tags"?: string[],
      "difficulty"?: "Core" | "FRCS"
    }
  ]
}

Quality requirements (non-negotiable):
- FRCS-level specificity: include decision-making, indications/contraindications, imaging interpretation, approaches, fixation constructs, complication avoidance, salvage options, and common viva traps.
- No fluff: each question should test something a consultant would actually quiz.
- Explanations must teach: include “why”, common pitfalls, and if relevant 1–2 key differentials or alternatives.
- Avoid ambiguous questions. Avoid “list everything” unless tightly scoped.
- Avoid duplicates and near-duplicates. If a question is only a rewording, do NOT include it.
- Use UK terminology (e.g. tibialis posterior, syndesmosis, WB radiographs).
- Do NOT invent citations or claim you read a specific page. You can use tags like "BOFAS-style" or "Orthobullets-style" but do not fabricate references.

Topic to generate:
- Domain: ${topic.domain}
- Topic: ${topic.topic}
- Core procedures/techniques to cover: ${procedures}
- Difficulty bias: ${difficulty}

Generate exactly ${needed} NEW flashcards for this topic.
Guidance on structure:
- "case": short scenario/procedure anchor (e.g. "Pilon fracture – staged fixation")
- "category": hierarchical (e.g. "Trauma > Pilon > Approaches")
- "question": single clear prompt
- "answer": concise, exam-appropriate
- "explanation": 2–6 sentences, include reasoning and key pitfalls

Return JSON only.
`.trim();
}

// --------------------
// Utilities
// --------------------
function normalise(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[“”"]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/[^a-z0-9\-\s>"'.:,/()]/g, "")
    .trim();
}

function cardKey(c: Flashcard): string {
  const raw = `${normalise(c.case)}||${normalise(c.category)}||${normalise(c.question)}`;
  return crypto.createHash("sha1").update(raw).digest("hex");
}

function safeJsonParse(maybeJson: string): any | null {
  try {
    return JSON.parse(maybeJson);
  } catch {
    return null;
  }
}

function extractFirstJsonObject(text: string): string | null {
  // Responses API typically gives clean JSON if instructed, but guard anyway:
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

function validateFlashcard(x: any): x is Flashcard {
  if (!x || typeof x !== "object") return false;
  const required = ["case", "category", "question", "answer", "explanation"];
  for (const k of required) {
    if (typeof x[k] !== "string" || x[k].trim().length < 2) return false;
  }
  if (x.tags != null) {
    if (!Array.isArray(x.tags) || x.tags.some((t: any) => typeof t !== "string")) return false;
  }
  if (x.difficulty != null) {
    if (x.difficulty !== "Core" && x.difficulty !== "FRCS") return false;
  }
  return true;
}

// --------------------
// Main generation
// --------------------
async function main() {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const out: FlashcardFile = fs.existsSync(OUTPUT_PATH)
    ? JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"))
    : {
        meta: {
          generated_at_utc: new Date().toISOString(),
          model: MODEL,
          total_cards: 0,
          notes:
            "FRCS (Tr & Orth) Foot & Ankle flashcards generated via API. De-duplicated by (case+category+question).",
        },
        flashcards: [],
      };

  // Build a global keyset for dedupe
  const seen = new Set<string>();
  for (const c of out.flashcards) {
    if (validateFlashcard(c)) seen.add(cardKey(c));
  }

  const countsByTopicId: Record<string, number> = {};
  for (const topic of FRCS_FA_SYLLABUS) countsByTopicId[topic.id] = 0;

  // Recount existing file into topic counts if you re-run
  // (best-effort: match by prefix in category)
  for (const c of out.flashcards) {
    if (!validateFlashcard(c)) continue;
    const t = FRCS_FA_SYLLABUS.find((x) => c.category.toLowerCase().includes(x.topic.toLowerCase().slice(0, 18)));
    if (t) countsByTopicId[t.id] += 1;
  }

  for (const topic of FRCS_FA_SYLLABUS) {
    let have = countsByTopicId[topic.id] ?? 0;
    const target = topic.target_cards;

    console.log(`\n=== ${topic.domain} | ${topic.topic}`);
    console.log(`Have ${have}/${target}`);

    let iterations = 0;

    while (have < target) {
      if (out.flashcards.length >= MAX_TOTAL_CARDS) {
        console.warn(`Reached MAX_TOTAL_CARDS=${MAX_TOTAL_CARDS}. Stopping.`);
        break;
      }
      if (iterations++ > MAX_ITERATIONS_PER_TOPIC) {
        console.warn(`Too many iterations for topic ${topic.id}. Stopping this topic to avoid loops.`);
        break;
      }

      const needNow = Math.min(BATCH_SIZE, target - have);
      const prompt = buildPrompt(topic, needNow);

      const resp = await client.responses.create({
        model: MODEL,
        input: prompt,
        // The JS docs show Responses API usage with `input` and reading `output_text`. :contentReference[oaicite:1]{index=1}
        temperature: TEMPERATURE,
      });

      const rawText = resp.output_text ?? "";
      const jsonSlice = extractFirstJsonObject(rawText);
      const parsed = jsonSlice ? safeJsonParse(jsonSlice) : safeJsonParse(rawText);

      if (!parsed || !Array.isArray(parsed.flashcards)) {
        console.warn("Model returned invalid JSON. Retrying batch...");
        continue;
      }

      const fresh: Flashcard[] = [];
      for (const item of parsed.flashcards) {
        if (!validateFlashcard(item)) continue;

        // Force hierarchical category prefix if the model didn't comply
        if (!item.category.includes(">")) {
          item.category = `${topic.domain} > ${topic.topic} > ${item.category}`;
        }

        const k = cardKey(item);
        if (seen.has(k)) continue;

        // simple near-dup guard: identical normalised question
        const qNorm = normalise(item.question);
        const tooSimilar = out.flashcards.some(
          (c) => validateFlashcard(c) && normalise(c.question) === qNorm
        );
        if (tooSimilar) continue;

        // add default difficulty
        if (!item.difficulty) item.difficulty = topic.difficulty_bias === "Mixed" ? "Core" : "FRCS";
        // add a couple useful tags
        item.tags = Array.from(
          new Set([...(item.tags ?? []), "FRCS", "Foot&Ankle", topic.domain])
        );

        seen.add(k);
        fresh.push(item);
      }

      if (fresh.length === 0) {
        console.warn("Batch produced no usable new cards after validation/dedupe. Retrying...");
        continue;
      }

      out.flashcards.push(...fresh);
      have += fresh.length;
      countsByTopicId[topic.id] = have;

      out.meta.generated_at_utc = new Date().toISOString();
      out.meta.model = MODEL;
      out.meta.total_cards = out.flashcards.length;

      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2), "utf8");
      console.log(`+${fresh.length} cards (now ${have}/${target}). Total file: ${out.flashcards.length}`);
    }
  }

  console.log(`\nDONE. Wrote: ${OUTPUT_PATH}`);
  console.log(`Total cards: ${out.flashcards.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});