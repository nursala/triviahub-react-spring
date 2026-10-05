/**
 * Active gameplay page.
 * Coordinates quiz loading, the reducer-driven game machine, and final result
 * submission without pushing backend concerns into presentational components.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGameSession } from "../hooks/useGameSession.ts";
import { useQuizMachine } from "../hooks/useQuizMachine.ts";
import { Spinner } from "react-bootstrap";
import GameHeader from "../Components/game/GameHeader.tsx";
import GameProgress from "../Components/game/GameProgress.tsx";
import QuestionCard from "../Components/game/QuestionCard.tsx";
import QuitModal from "../Components/game/QuitModal.tsx";
import { calculateScore } from "../utils/scoreUtils.ts";
import {
  fetchQuizById,
  fetchRandomQuestionsForQuiz,
  saveGameResult,
  type APIError,
  type GameResult,
  type Quiz,
  type Question,
} from "../utils/apiClient.ts";
import { InlineAlert } from "../utils/notificationUtils";
import { generateNotificationId, type Notification } from "../utils/notificationUtils";

export default function GameScreen() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { startSession, endSession } = useGameSession();
  const { state, initGame, selectAnswer, recordHintUsage, goToNextQuestion, setPlayerName } = useQuizMachine();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingResult, setIsSubmittingResult] = useState(false);

  // Overlay and submission feedback remain outside the reducer because they do
  // not affect gameplay transitions.
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  // The finished state can be observed across multiple renders, so a ref keeps
  // result submission idempotent for one playthrough.
  const hasSubmittedResultRef = useRef(false);

  const currentQuestion = useMemo(
    () => quizQuestions[state.currentQuestionIndex],
    [quizQuestions, state.currentQuestionIndex]
  );

  /**
   * Redirecting on missing quizzes or empty question sets avoids rendering a
   * dead-end game screen for scenarios that the browser can recover from.
   */
  useEffect(() => {
    if (!quizId) return;

    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [fetchedQuiz, fetchedQuestions] = await Promise.all([
          fetchQuizById(quizId, controller.signal),
          fetchRandomQuestionsForQuiz(quizId, controller.signal),
        ]);

        if (fetchedQuestions.length === 0) {
          navigate("/quizzes", {
            replace: true,
            state: {
              toast: {
                type: "warning",
                message: `"${fetchedQuiz.title}" has no questions yet, so it can't be played.`,
              },
            },
          });
          return;
        }

        setQuiz(fetchedQuiz);
        setQuizQuestions(fetchedQuestions);
        startSession(quizId!);
        initGame();
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        if (err && typeof err === "object" && "status" in err && (err as APIError).status === 404) {
          navigate("/quizzes", {
            replace: true,
            state: {
              toast: {
                type: "warning",
                message: "This quiz is no longer available â€” it may have been removed while you were browsing.",
              },
            },
          });
          return;
        }

        const errorMessage =
          err && typeof err === "object" && "error" in err
            ? (err as { error: string }).error
            : "Failed to load quiz. Please try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => controller.abort();
  }, [quizId, navigate, startSession, initGame]);

  /**
   * Correctness and duplicate-answer protection remain in the reducer so the
   * page component only forwards user intent.
   */
  const handleSelectAnswer = useCallback((answerIndex: number) => {
    if (!currentQuestion) return;
    selectAnswer(answerIndex, currentQuestion.correctIndex);
  }, [currentQuestion, selectAnswer]);

  /**
   * Hint tracking is delegated to the reducer so a repeated click cannot count
   * twice for the same question.
   */
  const handleUseHint = useCallback(() => {
    if (!currentQuestion) return;
    recordHintUsage(currentQuestion.id);
  }, [currentQuestion, recordHintUsage]);

  /**
   * The results page must still receive a local result when persistence fails,
   * otherwise the player would finish a quiz and land on an empty end state.
   */
  const finishQuiz = useCallback(async () => {
    if (!quizId || !quiz) return;

    setIsSubmittingResult(true);
    const controller = new AbortController();

    const totalQuestions = quizQuestions.length;
    const score = calculateScore({
      correctAnswers: state.correctAnswers,
      totalQuestions,
      durationSeconds: state.secondsElapsed,
      hintsUsed: state.hintsUsed,
    });

    const resultPayload = {
      quizId,
      quizTitle: quiz.title,
      playerName: state.playerName?.trim() || "Anonymous",
      score,
      correctAnswers: state.correctAnswers,
      totalQuestions,
      hintsUsed: state.hintsUsed,
      attempts: state.attempts,
      durationSeconds: state.secondsElapsed,
    };

    const localResult: GameResult = {
      ...resultPayload,
      id: "temp",
      playedAt: new Date().toISOString(),
    };

    try {
      await saveGameResult(resultPayload, controller.signal);
      endSession();

      setNotification({
        id: generateNotificationId(),
        type: "success",
        message: "Your result has been saved successfully!",
        autoClose: true,
      });

      setTimeout(() => {
        navigate(`/results/${quizId}`, { state: { result: localResult } });
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;

      const errorMessage =
        err && typeof err === "object" && "error" in err
          ? (err as { error: string }).error
          : "Failed to save your result to the server.";

      endSession();

      // The backend call failed, but the player's local outcome is still valid
      // and should be shown immediately on the results screen.
      navigate(`/results/${quizId}`, {
        state: { result: localResult, saveError: errorMessage },
      });
    } finally {
      setIsSubmittingResult(false);
    }
  }, [
    quizId,
    quiz,
    quizQuestions.length,
    state.correctAnswers,
    state.secondsElapsed,
    state.hintsUsed,
    state.attempts,
    state.playerName,
    navigate,
    endSession,
  ]);

  /**
   * The ref guard prevents duplicate submissions if the finished state is
   * observed across multiple renders.
   */
  useEffect(() => {
    if (state.status !== "finished" || hasSubmittedResultRef.current) return;

    hasSubmittedResultRef.current = true;
    finishQuiz();
  }, [state.status, finishQuiz]);

  /**
   * The reducer decides whether progressing means showing the next question or
   * transitioning into the finished state.
   */
  const handleNextQuestion = useCallback(() => {
    if (state.selectedAnswer === null) return;

    const isLastQuestion = state.currentQuestionIndex === quizQuestions.length - 1;
    goToNextQuestion(isLastQuestion);
  }, [state.selectedAnswer, state.currentQuestionIndex, quizQuestions.length, goToNextQuestion]);

  const handleConfirmQuit = useCallback(() => {
    endSession();
    navigate("/quizzes");
  }, [navigate, endSession]);

  if (loading) {
    return (
      <main className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading quiz...</span>
          </Spinner>
          <p className="text-muted">Loading quiz and questions...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-5">
        <InlineAlert
          notification={{
            id: "error-alert",
            type: "danger",
            title: "Error Loading Quiz",
            message: error,
            dismissible: false,
          }}
        />
        <div className="d-flex gap-2 flex-wrap mt-3">
          <Link to="/quizzes" className="btn btn-primary">
            Back to Quiz Browser
          </Link>
          <Link to="/" className="btn btn-outline-secondary">
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  if (!quizId) {
    return (
      <main className="container py-5">
        <InlineAlert
          notification={{
            id: "no-quiz",
            type: "warning",
            message: "No quiz selected. Please open a quiz from the Quiz Browser.",
            dismissible: false,
          }}
        />
        <div className="d-flex gap-2 flex-wrap mt-3">
          <Link to="/quizzes" className="btn btn-primary">
            Back to Quiz Browser
          </Link>
          <Link to="/" className="btn btn-outline-secondary">
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  // The load effect already redirects for these recoverable cases; rendering
  // nothing avoids flashing an intermediate dead-end screen.
  if (!quiz || quizQuestions.length === 0) {
    return null;
  }

  const isLastQuestion = state.currentQuestionIndex === quizQuestions.length - 1;
  const hasAnswered = state.selectedAnswer !== null;
  const usedHint = currentQuestion ? state.usedHintQuestionIds.includes(currentQuestion.id) : false;

  return (
    <main className="container py-5">
      <GameHeader
        title={quiz.title}
        category={quiz.category}
        description={quiz.description}
        onQuit={() => setShowQuitModal(true)}
      />

      {notification && (
        <InlineAlert
          notification={notification}
          onDismiss={() => setNotification(null)}
        />
      )}

      {state.currentQuestionIndex === 0 && state.selectedAnswer === null && (
        <div className="alert alert-info mb-4">
          <label htmlFor="playerNameInput" className="form-label">
            Enter your name:
          </label>
          <input
            id="playerNameInput"
            type="text"
            className="form-control"
            placeholder="Anonymous"
            value={state.playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={50}
          />
        </div>
      )}

      <GameProgress
        current={state.currentQuestionIndex + 1}
        total={quizQuestions.length}
        secondsElapsed={state.secondsElapsed}
      />

      <section className="card shadow-sm">
        <div className="card-body">
          <QuestionCard
            question={currentQuestion}
            selectedIndex={state.selectedAnswer}
            onSelect={handleSelectAnswer}
            showFeedback={hasAnswered}
            usedHint={usedHint}
            onHint={handleUseHint}
            showHint={usedHint}
          />

          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="small text-muted">
              Correct: {state.correctAnswers} / {quizQuestions.length}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNextQuestion}
              disabled={!hasAnswered || isSubmittingResult}
            >
              {isSubmittingResult ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Submitting...
                </>
              ) : isLastQuestion ? (
                "Finish Quiz"
              ) : (
                "Next Question"
              )}
            </button>
          </div>
        </div>
      </section>

      <QuitModal show={showQuitModal} onCancel={() => setShowQuitModal(false)} onConfirm={handleConfirmQuit} />
    </main>
  );
}
