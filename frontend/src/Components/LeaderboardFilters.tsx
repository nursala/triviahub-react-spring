/**
 * LeaderboardFilters Component
 *
 * Provides filtering and sorting controls for the leaderboard.
 * Allows filtering by quiz, searching by player/quiz name, and sorting options.
 * Purely presentational component that only renders provided data.
 */

import type { FC } from "react";
import type { Quiz } from "../utils/apiClient.ts";

interface Props {
  quizzes: Quiz[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedQuiz: string;
  setSelectedQuiz: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
}

const LeaderboardFilters: FC<Props> = ({ quizzes, searchTerm, setSearchTerm, selectedQuiz, setSelectedQuiz, sortBy, setSortBy }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row g-2">
          <div className="col-12 col-md-4">
            <label className="form-label small">Search</label>
            <input
              className="form-control form-control-sm"
              placeholder="Player name or quiz title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label small">Filter quiz</label>
            <select
              className="form-select form-select-sm"
              value={selectedQuiz}
              onChange={(e) => setSelectedQuiz(e.target.value)}
            >
              <option value="all">All quizzes</option>
              {quizzes.map((q) => (
                <option key={q.id} value={q.id}>{q.title}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label small">Sort by</label>
            <select
              className="form-select form-select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="score">Score (high → low)</option>
              <option value="date">Date (new → old)</option>
              <option value="player">Player (A → Z)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardFilters;

