/**
 * QuizCard Component
 *
 * Displays a single quiz as a card with metadata and play button.
 * Purely presentational component showing quiz information.
 */

import { Link } from "react-router-dom";
import type { Quiz } from "../../utils/apiClient.ts";

interface QuizCardProps {
  quiz: Quiz;
  questionCount: number;
  /**
   * When set, the Play action is disabled and this text is shown to explain
   * why (e.g. "Server unavailable" or "No questions yet"). When omitted or
   * undefined, the card behaves normally and Play navigates to the game.
   */
  disabledReason?: string;
}

/**
 * QuizCard
 *
 * Why presentational:
 * - Only receives props and renders UI
 * - No local state or filtering logic
 * - Reusable in any quiz listing context
 *
 * Data flow:
 * - quiz: Quiz object from parent (parent filters)
 * - questionCount: how many questions belong to this quiz (computed by parent)
 * - disabledReason: when present, parent has determined Play must be blocked
 *   (e.g. "Server unavailable at startup" or "Quiz has 0 questions" edge cases)
 *
 * Router integration:
 * - When enabled, clicking Play navigates to /play/${quiz.id}
 * - GameScreen.tsx will receive the quizId via useParams()
 * - GameScreen will then find questions matching that quizId
 *
 * Disabled state:
 * - A React Router `Link` cannot be meaningfully disabled (it stays focusable
 *   and navigable), so when `disabledReason` is set we render a plain disabled
 *   `<button>` instead, with the reason surfaced as a tooltip and small caption.
 */
function QuizCard({ quiz, questionCount, disabledReason }: QuizCardProps) {
  const isPlayDisabled = Boolean(disabledReason);

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-2">{quiz.title}</h5>

        {quiz.category ? (
          <div className="mb-2">
            <span className="badge bg-secondary">{quiz.category}</span>
          </div>
        ) : null}

        {quiz.description ? <p className="card-text text-muted small mb-3">{quiz.description}</p> : null}

        <div className="mt-auto">
          <p className="text-muted small mb-3">
            <strong>{questionCount}</strong> question{questionCount !== 1 ? "s" : ""}
          </p>

          {isPlayDisabled ? (
            <button type="button" className="btn btn-primary w-100" disabled title={disabledReason}>
              Play
            </button>
          ) : (
            <Link to={`/play/${quiz.id}`} className="btn btn-primary w-100">
              Play
            </Link>
          )}

          {isPlayDisabled && (
            <p className="text-muted small text-center mt-2 mb-0">{disabledReason}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizCard;
