/**
 * GameProgress displays the current question index, elapsed time, and a Bootstrap progress bar.
 *
 * @param current - Current question number (1-based).
 * @param total - Total number of questions in the quiz.
 * @param secondsElapsed - Elapsed game time in seconds.
 */

interface GameProgressProps {
  current: number; // 1-based
  total: number;
  secondsElapsed: number;
}

export default function GameProgress({ current, total, secondsElapsed }: GameProgressProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="small">Question {current} of {total}</div>
        <div className="small text-muted">Time: {secondsElapsed}s</div>
      </div>

      <div className="progress">
        <div className="progress-bar" role="progressbar" style={{ width: `${percent}%` }} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} />
      </div>
    </div>
  );
}

