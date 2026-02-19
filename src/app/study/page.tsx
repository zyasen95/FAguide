"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Flashcard as FlashcardType, loadFlashcards, filterByCase, filterByCategory } from "@/lib/flashcards";
import { isDue } from "@/lib/sm2";
import { loadAllCardStates } from "@/lib/storage";
import FlashcardComponent from "@/components/Flashcard";
import RatingButtons from "@/components/RatingButtons";
import { useStudySession } from "@/hooks/useStudySession";
import { Suspense } from "react";

function StudyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") || "all";
  const filter = searchParams.get("filter") || "";

  const [cards, setCards] = useState<FlashcardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlashcards().then((all) => {
      let filtered: FlashcardType[];

      switch (mode) {
        case "case":
          filtered = filterByCase(all, filter);
          break;
        case "category":
          filtered = filterByCategory(all, filter);
          break;
        case "due": {
          const states = loadAllCardStates();
          filtered = all.filter((c) => {
            const s = states[c.id];
            return !s || isDue(s);
          });
          break;
        }
        default:
          filtered = all;
      }

      setCards(filtered);
      setLoading(false);
    });
  }, [mode, filter]);

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="page-center">
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h2>All caught up!</h2>
          <p>No cards due for review right now.</p>
          <button className="btn-primary" onClick={() => router.push("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return <StudySession cards={cards} mode={mode} filter={filter} />;
}

function StudySession({ cards, mode, filter }: { cards: FlashcardType[]; mode: string; filter: string }) {
  const router = useRouter();
  const { currentCard, isFlipped, flip, rate, completed, currentIndex, totalCards, reviewedCount, restart } =
    useStudySession(cards);

  // Swipe handling — only on the card area
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only track swipes originating on the card
    if (!cardRef.current?.contains(e.target as Node)) return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      touchStart.current = null;

      // Require 40px horizontal swipe, mostly horizontal
      if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) return;

      if (!isFlipped) {
        flip();
      }
    },
    [isFlipped, flip]
  );

  if (completed) {
    return (
      <div className="page-center">
        <div className="completion-screen">
          <div className="completion-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2>Session Complete!</h2>
          <p>You reviewed {reviewedCount} cards.</p>
          <div className="completion-actions">
            <button className="btn-primary" onClick={restart}>
              Study Again
            </button>
            <button className="btn-secondary" onClick={() => router.push("/")}>
              Home
            </button>
            <button className="btn-secondary" onClick={() => router.push("/dashboard")}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const modeLabel = mode === "case" ? filter : mode === "category" ? filter : mode === "due" ? "Due Cards" : "All Cards";

  return (
    <div
      className="study-page"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="study-header">
        <button className="btn-back" onClick={() => router.push("/")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="study-mode-label">{modeLabel}</span>
        <span className="study-progress">
          {Math.min(currentIndex + 1, totalCards)} / {totalCards}
        </span>
      </div>

      <div className="study-progress-bar">
        <div
          className="study-progress-fill"
          style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
        />
      </div>

      {currentCard && (
        <>
          <div ref={cardRef}>
            <FlashcardComponent card={currentCard} isFlipped={isFlipped} onFlip={flip} />
          </div>
          <div className={`rating-container ${isFlipped ? "rating-visible" : "rating-hidden"}`}>
            <RatingButtons onRate={rate} disabled={!isFlipped} />
          </div>
        </>
      )}
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense
      fallback={
        <div className="page-center">
          <div className="spinner" />
        </div>
      }
    >
      <StudyContent />
    </Suspense>
  );
}
