export interface Flashcard {
  id: string;
  case: string;
  category: string;
  question: string;
  answer: string;
  explanation: string;
}

export interface FlashcardData {
  flashcards: Flashcard[];
}

export async function loadFlashcards(): Promise<Flashcard[]> {
  const res = await fetch("/flashcards.json");
  const data: FlashcardData = await res.json();
  return data.flashcards;
}

export function getCases(cards: Flashcard[]): string[] {
  return [...new Set(cards.map((c) => c.case))];
}

export function getCategories(cards: Flashcard[]): string[] {
  return [...new Set(cards.map((c) => c.category))];
}

export function filterByCase(cards: Flashcard[], caseName: string): Flashcard[] {
  return cards.filter((c) => c.case === caseName);
}

export function filterByCategory(cards: Flashcard[], category: string): Flashcard[] {
  return cards.filter((c) => c.category === category);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
