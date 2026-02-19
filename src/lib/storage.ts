import { CardState, createInitialState } from "./sm2";

const SR_KEY = "faguide-sr-state";
const STREAK_KEY = "faguide-streak";
const LAST_STUDY_KEY = "faguide-last-study";

export function loadAllCardStates(): Record<string, CardState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SR_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveAllCardStates(states: Record<string, CardState>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SR_KEY, JSON.stringify(states));
}

export function getCardState(cardId: string): CardState {
  const all = loadAllCardStates();
  return all[cardId] ?? createInitialState(cardId);
}

export function saveCardState(state: CardState): void {
  const all = loadAllCardStates();
  all[state.cardId] = state;
  saveAllCardStates(all);
}

export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  try {
    return parseInt(localStorage.getItem(STREAK_KEY) || "0", 10);
  } catch {
    return 0;
  }
}

export function recordStudySession(): void {
  if (typeof window === "undefined") return;

  const today = new Date().toISOString().split("T")[0];
  const lastStudy = localStorage.getItem(LAST_STUDY_KEY);
  let streak = getStreak();

  if (lastStudy === today) {
    return; // Already recorded today
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastStudy === yesterdayStr) {
    streak += 1;
  } else if (lastStudy !== today) {
    streak = 1;
  }

  localStorage.setItem(STREAK_KEY, String(streak));
  localStorage.setItem(LAST_STUDY_KEY, today);
}
