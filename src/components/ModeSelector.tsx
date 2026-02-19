"use client";

import { useRouter } from "next/navigation";
import { Flashcard, getCases, getCategories } from "@/lib/flashcards";
import { isDue } from "@/lib/sm2";
import { loadAllCardStates } from "@/lib/storage";

interface Props {
  cards: Flashcard[];
}

export default function ModeSelector({ cards }: Props) {
  const router = useRouter();
  const cases = getCases(cards);
  const categories = getCategories(cards);

  const states = loadAllCardStates();
  const dueCount = cards.filter((c) => {
    const s = states[c.id];
    return !s || isDue(s);
  }).length;

  const navigate = (mode: string, filter?: string) => {
    const params = new URLSearchParams({ mode });
    if (filter) params.set("filter", filter);
    router.push(`/study?${params.toString()}`);
  };

  return (
    <div className="mode-selector">
      <button className="mode-card" onClick={() => navigate("all")}>
        <div className="mode-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <h3>All Cards</h3>
        <p>{cards.length} cards</p>
      </button>

      <button className="mode-card mode-card-accent" onClick={() => navigate("due")}>
        <div className="mode-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h3>Due Cards</h3>
        <p>{dueCount} due</p>
      </button>

      <div className="mode-section">
        <h4 className="mode-section-title">By Case</h4>
        <div className="mode-grid">
          {cases.map((c) => (
            <button key={c} className="mode-card-sm" onClick={() => navigate("case", c)}>
              <h3>{c}</h3>
              <p>{cards.filter((card) => card.case === c).length} cards</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mode-section">
        <h4 className="mode-section-title">By Category</h4>
        <div className="mode-grid">
          {categories.map((cat) => (
            <button key={cat} className="mode-card-sm" onClick={() => navigate("category", cat)}>
              <h3>{cat}</h3>
              <p>{cards.filter((card) => card.category === cat).length} cards</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
