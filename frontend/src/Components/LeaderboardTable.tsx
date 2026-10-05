/**
 * LeaderboardTable Component
 *
 * Displays a table of leaderboard results with player rankings.
 * Presentational component that only renders provided data.
 */

import type { FC } from "react";
import type { GameResult, Quiz } from "../utils/apiClient.ts";
import { Link } from "react-router-dom";

interface Props {
  results: GameResult[];
  quizzes: Quiz[];
}

const LeaderboardTable: FC<Props> = ({ results, quizzes }) => {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="table-responsive">
      <table className="table table-sm table-striped align-middle">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Quiz</th>
            <th>Score</th>
            <th>Correct</th>
            <th>Time</th>
            <th>Hints</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => {
            const quiz = quizzes.find((q) => q.id === r.quizId);
            return (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.playerName}</td>
                <td>
                  {quiz ? (
                    <Link to="/quizzes" className="text-decoration-none">
                      {quiz.title}
                    </Link>
                  ) : (
                    r.quizId
                  )}
                </td>
                <td>{r.score}</td>
                <td>
                  {r.correctAnswers != null && r.totalQuestions != null
                    ? `${r.correctAnswers}/${r.totalQuestions}`
                    : "—"}
                </td>
                <td>{r.durationSeconds != null ? `${r.durationSeconds}s` : "—"}</td>
                <td>{r.hintsUsed != null ? r.hintsUsed : "—"}</td>
                <td>{r.playedAt ? new Date(r.playedAt).toLocaleString() : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
