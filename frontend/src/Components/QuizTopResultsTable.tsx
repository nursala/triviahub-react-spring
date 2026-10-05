/**
 * QuizTopResultsTable Component
 *
 * Displays a table of the top results for a specific quiz.
 * Purely presentational component that renders provided result data.
 */

import type { FC } from "react";
import type { GameResult } from "../utils/apiClient.ts";

interface Props {
  results: GameResult[];
}

const QuizTopResultsTable: FC<Props> = ({ results }) => {
  if (!results || results.length === 0) {
    return <p className="text-muted">No results submitted for this quiz yet.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-sm table-striped align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Score</th>
            <th>Correct</th>
            <th>Time</th>
            <th>Hints</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr key={r.id}>
              <td>{idx + 1}</td>
              <td>{r.playerName}</td>
              <td>{r.score}</td>
              <td>{r.correctAnswers != null && r.totalQuestions != null ? `${r.correctAnswers}/${r.totalQuestions}` : "—"}</td>
              <td>{r.durationSeconds != null ? `${r.durationSeconds}s` : "—"}</td>
              <td>{r.hintsUsed != null ? r.hintsUsed : "—"}</td>
              <td>{r.playedAt ? new Date(r.playedAt).toLocaleString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizTopResultsTable;
