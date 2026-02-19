"use client";

import { Rating, RATING_LABELS } from "@/lib/sm2";

interface Props {
  onRate: (rating: Rating) => void;
  disabled?: boolean;
}

const RATING_STYLES: Record<Rating, string> = {
  0: "rating-again",
  2: "rating-hard",
  4: "rating-good",
  5: "rating-easy",
};

const RATINGS: Rating[] = [0, 2, 4, 5];

export default function RatingButtons({ onRate, disabled }: Props) {
  return (
    <div className="rating-buttons">
      {RATINGS.map((r) => (
        <button
          key={r}
          onClick={() => onRate(r)}
          disabled={disabled}
          className={`rating-btn ${RATING_STYLES[r]}`}
        >
          {RATING_LABELS[r]}
        </button>
      ))}
    </div>
  );
}
