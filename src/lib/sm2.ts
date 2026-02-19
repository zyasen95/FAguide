export interface CardState {
  cardId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string; // ISO date string YYYY-MM-DD
}

export type Rating = 0 | 2 | 4 | 5;

export const RATING_LABELS: Record<Rating, string> = {
  0: "Again",
  2: "Hard",
  4: "Good",
  5: "Easy",
};

export function createInitialState(cardId: string): CardState {
  return {
    cardId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: todayStr(),
  };
}

export function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export function isDue(state: CardState): boolean {
  return state.nextReviewDate <= todayStr();
}

export function applyRating(state: CardState, rating: Rating): CardState {
  const q = rating;

  if (q < 3) {
    // Failed — reset repetitions, schedule for tomorrow
    return {
      ...state,
      repetitions: 0,
      interval: 1,
      easeFactor: Math.max(1.3, state.easeFactor - 0.2),
      nextReviewDate: addDays(todayStr(), 1),
    };
  }

  let newInterval: number;
  const newReps = state.repetitions + 1;

  if (state.repetitions === 0) {
    newInterval = 1;
  } else if (state.repetitions === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(state.interval * state.easeFactor);
  }

  const newEF = Math.max(
    1.3,
    state.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  );

  return {
    ...state,
    repetitions: newReps,
    interval: newInterval,
    easeFactor: newEF,
    nextReviewDate: addDays(todayStr(), newInterval),
  };
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export type MasteryLevel = "new" | "learning" | "familiar" | "mastered";

export function getMasteryLevel(state: CardState): MasteryLevel {
  if (state.repetitions === 0) return "new";
  if (state.interval < 7) return "learning";
  if (state.interval < 21) return "familiar";
  return "mastered";
}
