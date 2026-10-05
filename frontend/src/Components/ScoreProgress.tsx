import type { FC } from "react";

interface Props {
  label?: string;
  value: number; // 0-100
  height?: number;
  colorClass?: string; // e.g. 'bg-success'
}

const ScoreProgress: FC<Props> = ({ label, value, height = 12, colorClass = "bg-success" }) => {
  const pct = Math.max(0, Math.min(100, Math.round(value ?? 0)));
  return (
    <div className="mb-3">
      {label && (
        <div className="d-flex justify-content-between mb-1 small text-muted">
          <div>{label}</div>
          <div>{pct}%</div>
        </div>
      )}
      <div className="progress" style={{ height }}>
        <div
          className={`progress-bar ${colorClass}`}
          role="progressbar"
          style={{ width: `${pct}%` }}
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default ScoreProgress;

