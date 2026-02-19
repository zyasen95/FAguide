"use client";

import { Flashcard as FlashcardType } from "@/lib/flashcards";

interface Props {
  card: FlashcardType;
  isFlipped: boolean;
  onFlip: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Anatomy: "badge-blue",
  Alignment: "badge-green",
  Principles: "badge-purple",
  Fixation: "badge-orange",
  Complications: "badge-red",
  Deformity: "badge-yellow",
  Radiology: "badge-cyan",
  Osteotomy: "badge-pink",
  Strategy: "badge-indigo",
  "Soft Tissue": "badge-teal",
  Osseous: "badge-amber",
};

export default function Flashcard({ card, isFlipped, onFlip }: Props) {
  const badgeClass = CATEGORY_COLORS[card.category] || "badge-blue";

  return (
    <div className="card-scene" onClick={onFlip}>
      <div className={`card-flipper ${isFlipped ? "card-flipped" : ""}`}>
        {/* Front */}
        <div className="card-face card-front">
          <span className={`card-badge ${badgeClass}`}>{card.category}</span>
          <p className="card-question">{card.question}</p>
          <span className="card-hint">Tap to reveal</span>
        </div>

        {/* Back */}
        <div className="card-face card-back">
          <span className={`card-badge ${badgeClass}`}>{card.category}</span>
          <p className="card-answer">{card.answer}</p>
          <p className="card-explanation">{card.explanation}</p>
          <span className="card-case-label">{card.case}</span>
        </div>
      </div>
    </div>
  );
}
