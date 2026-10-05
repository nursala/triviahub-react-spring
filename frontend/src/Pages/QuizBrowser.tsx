/**
 * Quiz discovery page.
 * Keeps browsing usable even when gameplay redirects back here with an edge
 * case or when the backend is temporarily unavailable.
 */
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import type { Quiz } from "../utils/apiClient.ts";
import { fetchAllQuizzes } from "../utils/apiClient.ts";
import QuizBrowserHeader from "../Components/quiz/QuizBrowserHeader.tsx";
import QuizBrowserFilters from "../Components/quiz/QuizBrowserFilters.tsx";
import QuizResultsGrid from "../Components/quiz/QuizResultsGrid.tsx";
import {
  InlineAlert,
  ToastNotification,
  generateNotificationId,
  type Notification,
  type NotificationType,
} from "../utils/notificationUtils";

/**
 * Shape of the router-state payload GameScreen attaches when it redirects
 * back to the Quiz Browser after detecting an edge case. QuizBrowser consumes
 * it once on arrival and converts it into a transient toast notification.
 */
interface QuizBrowserNavigationState {
  toast?: {
    type: NotificationType;
    message: string;
  };
}

export default function QuizBrowser() {
  const location = useLocation();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  /**
   * The lazy initializer reads the router state exactly once at mount,
   * deriving state during render instead of syncing it through an extra effect
   * and render cycle.
   */
  const [toastNotification, setToastNotification] = useState<Notification | null>(() => {
    const navigationState = location.state as QuizBrowserNavigationState | null;
    if (!navigationState?.toast) return null;

    return {
      id: generateNotificationId(),
      type: navigationState.toast.type,
      message: navigationState.toast.message,
      autoClose: true,
    };
  });

  /**
   * On failure, the page stays interactive and simply disables play actions so
   * browsing is still possible while the backend is unavailable.
   */
  useEffect(() => {
    const controller = new AbortController();

    const loadQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedQuizzes = await fetchAllQuizzes(controller.signal);
        setQuizzes(fetchedQuizzes);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;

        const errorMessage =
          err && typeof err === "object" && "error" in err
            ? (err as { error: string }).error
            : "Failed to load quizzes";

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
    return () => controller.abort();
  }, []);

  /**
   * Router state is cleared after capture so refresh or back-navigation does
   * not replay the same one-off toast.
   */
  useEffect(() => {
    const navigationState = location.state as QuizBrowserNavigationState | null;
    if (!navigationState?.toast) return;

    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  /**
   * Categories are derived from live quiz data so the filter cannot drift away
   * from what the backend currently exposes.
   */
  const categories = useMemo<string[]>(() => {
    return Array.from(
      new Set(quizzes.map((q) => q.category).filter((cat) => cat))
    );
  }, [quizzes]);

  /**
   * Filtering stays client-side because the dataset is small and immediate
   * feedback matters more here than introducing query-specific endpoints.
   */
  const filteredQuizzes = useMemo<Quiz[]>(() => {
    return quizzes.filter((quiz) => {
      if (selectedCategory && quiz.category !== selectedCategory) {
        return false;
      }
      return (
        !searchTerm ||
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [quizzes, selectedCategory, searchTerm]);

  /**
   * The grid consumes a lookup table rather than searching the quiz array for
   * every card render.
   */
  const questionCountByQuizId = useMemo<Record<string, number>>(() => {
    return quizzes.reduce((counts, quiz) => {
      counts[quiz.id] = quiz.questionCount ?? 0;
      return counts;
    }, {} as Record<string, number>);
  }, [quizzes]);

  if (loading) {
    return (
      <main className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading quizzes...</span>
          </Spinner>
          <p className="text-muted">Loading available quizzes...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      {toastNotification && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
          <ToastNotification
            notification={toastNotification}
            onDismiss={() => setToastNotification(null)}
          />
        </div>
      )}

      <QuizBrowserHeader />

      {error && (
        <InlineAlert
          notification={{
            id: "server-unavailable-banner",
            type: "danger",
            title: "Server unavailable",
            message: `${error}. Quiz data may be incomplete and Play has been disabled until the connection is restored.`,
            dismissible: false,
          }}
        />
      )}

      <QuizBrowserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <QuizResultsGrid
        filteredQuizzes={filteredQuizzes}
        questionCountByQuizId={questionCountByQuizId}
        isServerUnavailable={!!error}
      />
    </main>
  );
}
