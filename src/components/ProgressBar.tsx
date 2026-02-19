"use client";

interface Props {
  value: number;
  max: number;
  label: string;
  color?: string;
}

export default function ProgressBar({ value, max, label, color = "var(--color-primary)" }: Props) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-value">{value}/{max}</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
