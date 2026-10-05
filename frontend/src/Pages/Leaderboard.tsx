/**
 * Global leaderboard page.
 * Combines backend leaderboard data with client-side filtering so players can
 * explore rankings without issuing a new request for every UI change.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  fetchAllQuizzes,
  fetchAllResults,
  fetchGlobalLeaderboard,
  type Quiz,
  type GameResult,
} from "../utils/apiClient.ts";
import LeaderboardFilters from "../Components/LeaderboardFilters.tsx";
import LeaderboardTable from "../Components/LeaderboardTable.tsx";
import EmptyState from "../Components/EmptyState.tsx";
import { InlineAlert } from "../utils/notificationUtils";

type SortBy = "score" | "date" | "player";

export default function Leaderboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<SortBy>("score");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState<string>("all");
  const [reloadToken, setReloadToken] = useState(0);

  /**
   * The dedicated leaderboard endpoint already applies the default score-based
   * ranking, so it is used only for the default "all quizzes by score" view.
   * Other views require the broader result set for local reshaping.
   */
  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [fetchedQuizzes, fetchedResults] = await Promise.all([
          fetchAllQuizzes(controller.signal),
          selectedQuiz === "all" && sortBy === "score"
            ? fetchGlobalLeaderboard(controller.signal)
            : fetchAllResults(controller.signal),
        ]);

        setQuizzes(fetchedQuizzes);
        setResults(fetchedResults);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;

        const errorMessage =
          err && typeof err === "object" && "error" in err
            ? (err as { error: string }).error
            : "Unable to connect to the server. Please check that the backend is running and try again.";

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, [reloadToken, selectedQuiz, sortBy]);

  /**
   * Filtering is derived in one memoized pass so table rendering stays simple
   * and the "top 20" rule is applied after every active filter.
   */
  const filteredAndSorted = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filteredByQuiz =
      selectedQuiz === "all"
        ? results
        : results.filter(({ quizId }) => quizId === selectedQuiz);

    const filteredByTerm =
      term.length === 0
        ? filteredByQuiz
        : filteredByQuiz.filter(({ quizId, playerName }) => {
            const quizTitle = quizzes.find(({ id }) => id === quizId)?.title ?? "";
            return (
              (playerName ?? "").toLowerCase().includes(term) ||
              quizTitle.toLowerCase().includes(term)
            );
          });

    const sortedResults = [...filteredByTerm].sort((a, b) => {
      if (sortBy === "score") {
        return b.score - a.score;
      }
      if (sortBy === "date") {
        const firstDate = a.playedAt ? new Date(a.playedAt).getTime() : 0;
        const secondDate = b.playedAt ? new Date(b.playedAt).getTime() : 0;
        return secondDate - firstDate;
      }
      return (a.playerName ?? "").localeCompare(b.playerName ?? "");
    });

    return sortedResults.slice(0, 20);
  }, [sortBy, searchTerm, selectedQuiz, results, quizzes]);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value as SortBy);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setReloadToken((currentToken) => currentToken + 1);
  }, []);

  if (loading) {
    return (
      <main className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading leaderboard...</span>
          </Spinner>
          <p className="text-muted">Loading leaderboard data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-5">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h1 className="h4 mb-1">Leaderboard</h1>
            <p className="text-muted mb-0">Top players across all quizzes</p>
          </div>
          <Link to="/" className="btn btn-sm btn-outline-secondary">
            Home
          </Link>
        </div>
        <InlineAlert
          notification={{
            id: "error-alert",
            type: "danger",
            title: "Error Loading Leaderboard",
            message: error,
            dismissible: false,
          }}
        />
        <div className="d-flex flex-wrap gap-2 mt-3">
          <button type="button" className="btn btn-primary" onClick={handleRetry}>
            Retry
          </button>
          <Link to="/quizzes" className="btn btn-outline-secondary">
            Browse Quizzes
          </Link>
        </div>
      </main>
    );
  }


  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h1 className="h4 mb-1">Leaderboard</h1>
          <p className="text-muted mb-0">Top players across all quizzes</p>
        </div>
        <Link to="/" className="btn btn-sm btn-outline-secondary">
          Home
        </Link>
      </div>

      <LeaderboardFilters
        quizzes={quizzes}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedQuiz={selectedQuiz}
        setSelectedQuiz={setSelectedQuiz}
        sortBy={sortBy}
        setSortBy={handleSortChange}
      />

      {filteredAndSorted.length === 0 ? (
        <EmptyState message="No leaderboard results found." />
      ) : (
        <LeaderboardTable results={filteredAndSorted} quizzes={quizzes} />
      )}
    </main>
  );
}
