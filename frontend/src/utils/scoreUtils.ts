/**
 * Shared quiz-score formula.
 * Centralizing the calculation prevents gameplay, results, and leaderboard
 * views from drifting if scoring rules are adjusted later.
 */
export function calculateScore({
  correctAnswers,
  totalQuestions,
  durationSeconds,
  hintsUsed,
}: {
  correctAnswers: number;
  totalQuestions: number;
  durationSeconds: number;
  hintsUsed: number;
}): number {
  if (totalQuestions <= 0) return 0;
  const accuracy = correctAnswers / totalQuestions;
  const speedFactor = Math.max(0.5, 1 - durationSeconds / (totalQuestions * 30));
  const hintPenalty = 1 - (hintsUsed / totalQuestions) * 0.3;
  const score = Math.round(accuracy * speedFactor * hintPenalty * 100);
  return Math.max(0, Math.min(100, score));
}

