"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flashcard, loadFlashcards, getCases } from "@/lib/flashcards";
import { isDue, getMasteryLevel, MasteryLevel, createInitialState } from "@/lib/sm2";
import { loadAllCardStates, getStreak } from "@/lib/storage";
import ProgressBar from "@/components/ProgressBar";

const MASTERY_COLORS: Record<MasteryLevel, string> = {
  new: "var(--color-mastery-new)",
  learning: "var(--color-mastery-learning)",
  familiar: "var(--color-mastery-familiar)",
  mastered: "var(--color-mastery-mastered)",
};

const MASTERY_LABELS: Record<MasteryLevel, string> = {
  new: "New",
  learning: "Learning",
  familiar: "Familiar",
  mastered: "Mastered",
};

export default function DashboardPage() {
  const router = useRouter();
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
  const streak = getStreak();
  const cases = getCases(cards);

  const dueCount = cards.filter((c) => {
    const s = states[c.id];
    return !s || isDue(s);
  }).length;

  const masteryBreakdown: Record<MasteryLevel, number> = {
    new: 0,
    learning: 0,
    familiar: 0,
    mastered: 0,
  };

  cards.forEach((c) => {
    const s = states[c.id] ?? createInitialState(c.id);
    const level = getMasteryLevel(s);
    masteryBreakdown[level]++;
  });

  const caseStats = cases.map((caseName) => {
    const caseCards = cards.filter((c) => c.case === caseName);
    const studied = caseCards.filter((c) => {
      const s = states[c.id];
      return s && s.repetitions > 0;
    }).length;
    return { caseName, total: caseCards.length, studied };
  });

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      <div className="dashboard-stats">
        <div className="stat-card stat-card-lg">
          <span className="stat-value stat-value-accent">{dueCount}</span>
          <span className="stat-label">Cards Due Today</span>
        </div>
        <div className="stat-card stat-card-lg">
          <span className="stat-value">{streak}</span>
          <span className="stat-label">Day Streak</span>
        </div>
      </div>

      <section className="dashboard-section">
        <h2>Mastery Breakdown</h2>
        <div className="mastery-grid">
          {(Object.keys(masteryBreakdown) as MasteryLevel[]).map((level) => (
            <div key={level} className="mastery-item">
              <div className="mastery-dot" style={{ backgroundColor: MASTERY_COLORS[level] }} />
              <div className="mastery-info">
                <span className="mastery-label">{MASTERY_LABELS[level]}</span>
                <span className="mastery-count">{masteryBreakdown[level]}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mastery-bar">
          {(Object.keys(masteryBreakdown) as MasteryLevel[]).map((level) => {
            const pct = (masteryBreakdown[level] / cards.length) * 100;
            if (pct === 0) return null;
            return (
              <div
                key={level}
                className="mastery-bar-segment"
                style={{
                  width: `${pct}%`,
                  backgroundColor: MASTERY_COLORS[level],
                }}
              />
            );
          })}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>By Case</h2>
        {caseStats.map((cs) => (
          <ProgressBar
            key={cs.caseName}
            label={cs.caseName}
            value={cs.studied}
            max={cs.total}
            color="var(--color-primary)"
          />
        ))}
      </section>

      <section className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button className="btn-primary" onClick={() => router.push("/study?mode=due")}>
            Study Due Cards ({dueCount})
          </button>
          <button className="btn-secondary" onClick={() => router.push("/study?mode=all")}>
            Study All Cards
          </button>
        </div>
      </section>
    </div>
  );
}
