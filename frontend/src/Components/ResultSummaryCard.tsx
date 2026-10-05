/**
 * ResultSummaryCard Component
 *
 * Displays a formatted summary of a quiz result including score, accuracy, and statistics.
 * Purely presentational component that renders provided result data.
 */

import type { FC } from "react";
import ScoreProgress from "./ScoreProgress.tsx";
import type { GameResult } from "../utils/apiClient.ts";

interface Props {
  result: GameResult;
}

const ResultSummaryCard: FC<Props> = ({ result }) => {
  const score = Math.round(result.score ?? 0);
  const correct = result.correctAnswers ?? null;
  const total = result.totalQuestions ?? null;
  const accuracy = correct != null && total != null && total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Latest Result — {result.playerName ?? 'Player'}</h5>

        <p className="mb-2">Score: <strong>{score}</strong></p>

        <ScoreProgress label="Score" value={score} height={18} colorClass="bg-success" />
        <ScoreProgress label="Accuracy" value={accuracy} height={12} colorClass="bg-info" />

        <div className="row text-muted small">
          <div className="col-6">Correct: {correct != null ? `${correct}` : '—'}</div>
          <div className="col-6">Total: {total != null ? `${total}` : '—'}</div>
          <div className="col-6">Time: {result.durationSeconds != null ? `${result.durationSeconds}s` : '—'}</div>
          <div className="col-6">Hints used: {result.hintsUsed != null ? result.hintsUsed : '—'}</div>
        </div>
      </div>
    </div>
  );
};

export default ResultSummaryCard;

