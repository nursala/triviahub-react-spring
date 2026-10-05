/**
 * Post-game results page for a single quiz.
 * Shows the player's latest local outcome alongside leaderboard data fetched
 * from the backend when that data is available.
 */
import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import {
  fetchQuizById,
  fetchQuizLeaderboard,
  type Quiz,
  type GameResult,
} from "../utils/apiClient.ts";
import ResultSummaryCard from "../Components/ResultSummaryCard.tsx";
import QuizTopResultsTable from "../Components/QuizTopResultsTable.tsx";
import EmptyState from "../Components/EmptyState.tsx";
import { InlineAlert } from "../utils/notificationUtils";

export default function Results() {
  const { quizId } = useParams();
  const location = useLocation();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [topResults, setTopResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Recent result, and an optional save-failure flag, may be passed in
  // navigation state from GameScreen. The "Server fails during game (save
  // result)" edge case relies on `saveError` being present alongside the
  // locally-computed result: GameScreen still hands the player their result
  // even when persisting it failed, so it can be shown here regardless.
  const navigationState = location.state as { result?: GameResult; saveError?: string } | null;
  const stateResult = navigationState?.result;
  const saveError = navigationState?.saveError;

  /**
   * Quiz metadata and leaderboard data are loaded together so the page can
   * render a consistent heading and table state from the same request cycle.
   */
  useEffect(() => {
    if (!quizId) return;

    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [fetchedQuiz, fetchedResults] = await Promise.all([
          fetchQuizById(quizId, controller.signal),
          fetchQuizLeaderboard(quizId, controller.signal),
        ]);

        setQuiz(fetchedQuiz);
        setTopResults(fetchedResults);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;

        const errorMessage =
          err && typeof err === "object" && "error" in err
            ? (err as { error: string }).error
            : "Failed to load results";

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, [quizId]);

  if (loading) {
    return (
      <main className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading results...</span>
          </Spinner>
          <p className="text-muted">Loading quiz results...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-5">
        <h1 className="h4 mb-3">Results</h1>
        <InlineAlert
          notification={{
            id: "error-alert",
            type: "danger",
            title: "Error Loading Results",
            message: error,
            dismissible: false,
          }}
        />
        <div className="mb-4 d-flex gap-2 flex-wrap mt-3">
          <Link to="/quizzes" className="btn btn-primary">
            Back to Quiz Browser
          </Link>
          <Link to="/" className="btn btn-outline-secondary">
            Go Home
          </Link>
          <Link to="/leaderboard" className="btn btn-outline-info">
            View Leaderboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <h1 className="h4 mb-3">Results {quiz ? `â€” ${quiz.title}` : ""}</h1>

      {!quiz && (
        <>
          <InlineAlert
            notification={{
              id: "quiz-not-found",
              type: "warning",
              message: "Quiz not found. Check the URL.",
              dismissible: false,
            }}
          />
          <div className="mb-4 d-flex gap-2 flex-wrap mt-3">
            <Link to="/quizzes" className="btn btn-primary">
              Back to Quiz Browser
            </Link>
            <Link to="/" className="btn btn-outline-secondary">
              Go Home
            </Link>
            <Link to="/leaderboard" className="btn btn-outline-info">
              View Leaderboard
            </Link>
          </div>
        </>
      )}

      {stateResult ? (
        <>
          {saveError && (
            <InlineAlert
              notification={{
                id: "save-error-alert",
                type: "warning",
                title: "Result not saved to the server",
                message: `${saveError}. Showing your local result below â€” it will not appear on the leaderboard until the connection is restored and you play again.`,
                dismissible: false,
              }}
            />
          )}
          <ResultSummaryCard result={stateResult} />
        </>
      ) : (
        <>
          <EmptyState message="No recent result found. Play this quiz first." />
          <div className="mb-4 d-flex gap-2 flex-wrap mt-3">
            <Link to="/quizzes" className="btn btn-primary">
              Back to Quiz Browser
            </Link>
            <Link to="/" className="btn btn-outline-secondary">
              Go Home
            </Link>
            <Link to="/leaderboard" className="btn btn-outline-info">
              View Leaderboard
            </Link>
          </div>
        </>
      )}

      <div className="mb-4 d-flex gap-2 flex-wrap">
        <Link
          to={quiz ? `/play/${quiz.id}` : "/quizzes"}
          className="btn btn-primary"
        >
          Play Again
        </Link>
        <Link to="/quizzes" className="btn btn-outline-secondary">
          Browse Quizzes
        </Link>
        <Link to="/leaderboard" className="btn btn-outline-info">
          View Leaderboard
        </Link>
      </div>

      <h2 className="h5 mt-4">Top results for this quiz</h2>

      <QuizTopResultsTable results={topResults} />
    </main>
  );
}
