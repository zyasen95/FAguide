"use client";

import { useEffect, useState } from "react";
import { Flashcard, loadFlashcards } from "@/lib/flashcards";
import { isDue, createInitialState } from "@/lib/sm2";
import { loadAllCardStates, getStreak } from "@/lib/storage";
import ModeSelector from "@/components/ModeSelector";

export default function HomePage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlashcards().then((data) => {
      setCards(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
      </div>
    );
  }

  const states = loadAllCardStates();
  const dueCount = cards.filter((c) => {
    const s = states[c.id];
    return !s || isDue(s);
  }).length;
  const studiedCount = Object.keys(states).filter((id) => {
    const s = states[id];
    return s && s.repetitions > 0;
  }).length;
  const streak = getStreak();

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>FAguide</h1>
        <p className="home-subtitle">Orthopaedic Surgery Flashcards</p>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <span className="stat-value">{dueCount}</span>
          <span className="stat-label">Due Today</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{studiedCount}</span>
          <span className="stat-label">Studied</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{streak}</span>
          <span className="stat-label">Day Streak</span>
        </div>
      </div>

      <ModeSelector cards={cards} />
    </div>
  );
}
