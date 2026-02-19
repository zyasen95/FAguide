"use client";

import { useState, useCallback } from "react";
import { Flashcard, shuffle } from "@/lib/flashcards";
import { Rating, applyRating } from "@/lib/sm2";
import { getCardState, saveCardState, recordStudySession } from "@/lib/storage";

export function useStudySession(initialCards: Flashcard[]) {
  const [queue, setQueue] = useState<Flashcard[]>(() => shuffle(initialCards));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const currentCard = queue[currentIndex] ?? null;
  const totalCards = queue.length;

  const flip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const rate = useCallback(
    (rating: Rating) => {
      if (!currentCard) return;

      const state = getCardState(currentCard.id);
      const newState = applyRating(state, rating);
      saveCardState(newState);
      recordStudySession();

      // If "Again", re-queue to end
      if (rating === 0) {
        setQueue((prev) => [...prev, currentCard]);
      }

      setReviewedCount((prev) => prev + 1);
      setIsFlipped(false);

      if (currentIndex + 1 >= queue.length && rating !== 0) {
        setCompleted(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentCard, currentIndex, queue.length]
  );

  const restart = useCallback(() => {
    setQueue(shuffle(initialCards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompleted(false);
    setReviewedCount(0);
  }, [initialCards]);

  return {
    currentCard,
    isFlipped,
    flip,
    rate,
    completed,
    currentIndex: Math.min(currentIndex, totalCards - 1),
    totalCards,
    reviewedCount,
    restart,
  };
}
