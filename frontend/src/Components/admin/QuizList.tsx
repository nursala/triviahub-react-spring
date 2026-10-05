/**
 * QuizList Component
 *
 * Presentational "Existing Quizzes" card. Renders the list of quizzes with
 * selection highlighting plus edit/delete actions, and reports every
 * interaction back to the parent. Holds no state of its own — the parent
 * (AdminPanel) owns the quiz list, the current selection, and all CRUD logic.
 */

import type { Quiz } from "../../utils/apiClient.ts";

/**
 * Props accepted by QuizList.
 */
interface QuizListProps {
  /** Quizzes to display, already loaded by the parent. */
  quizzes: Quiz[];
  /** ID of the currently selected quiz, used to highlight the matching row. */
  selectedQuizId: string | null;
  /** Whether a quiz deletion is currently in flight (disables every Delete button). */
  isDeleting: boolean;
  /**
   * Called when a quiz row is activated (clicked or confirmed via keyboard).
   * @param quizId the ID of the quiz to select
   */
  onSelect: (quizId: string) => void;
  /**
   * Called when the Edit button for a quiz is pressed.
   * @param quiz the quiz to edit
   */
  onEdit: (quiz: Quiz) => void;
  /**
   * Called when the Delete button for a quiz is pressed.
   * @param quiz the quiz to delete
   */
  onDelete: (quiz: Quiz) => void;
}

/**
 * QuizList
 *
 * Why presentational:
 * - Receives the quiz collection and selection state as props and only renders rows
 * - Delegates selection, editing, and deletion entirely to the parent via callbacks
 * - Contains no API calls, filtering, or notification logic
 *
 * Accessibility:
 * - Each row is keyboard-activatable (Enter / Space) in addition to being clickable
 * - Action buttons stop event propagation so they don't also trigger row selection
 */
function QuizList({ quizzes, selectedQuizId, isDeleting, onSelect, onEdit, onDelete }: QuizListProps) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Existing Quizzes</h2>
          <span className="badge bg-primary">{quizzes.length} total</span>
        </div>

        {quizzes.length === 0 ? (
          <div className="alert alert-info mb-0">No quizzes available.</div>
        ) : (
          <div className="row g-3">
            {quizzes.map((quiz) => (
              <div className="col-12" key={quiz.id}>
                <div
                  className={`border rounded-3 p-3 d-flex flex-column flex-md-row justify-content-between gap-3 ${selectedQuizId === quiz.id ? "border-primary bg-primary-subtle" : ""}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(quiz.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(quiz.id);
                    }
                  }}
                >
                  <div>
                    <h3 className="h6 mb-1">{quiz.title}</h3>
                    <div className="text-muted small mb-1">Category: {quiz.category}</div>
                    <div className="text-muted small mb-0">Questions: {quiz.questionCount ?? 0}</div>
                    {quiz.description ? <p className="small mb-0 mt-2">{quiz.description}</p> : null}
                  </div>

                  <div className="align-self-start d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(quiz);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(quiz);
                      }}
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizList;
