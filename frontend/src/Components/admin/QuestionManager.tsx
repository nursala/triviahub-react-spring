/**
 * QuestionManager Component
 *
 * Presentational "Question Management" card. Renders the question list for
 * the currently selected quiz — including the no-selection, loading, empty,
 * and populated states — plus the add/edit/delete actions. Holds no state of
 * its own — the parent (AdminPanel) owns the selection, the fetched
 * questions, the loading flag, and all CRUD logic.
 */

import { Spinner } from "react-bootstrap";
import type { Question, Quiz } from "../../utils/apiClient.ts";

/**
 * Props accepted by QuestionManager.
 */
interface QuestionManagerProps {
  /** The quiz whose questions are being managed, or null when no quiz is selected. */
  selectedQuiz: Quiz | null;
  /** Questions belonging to the selected quiz, already loaded by the parent. */
  questions: Question[];
  /** Total question count to display in the badge (falls back to questions.length upstream). */
  questionCount: number;
  /** Whether the questions for the selected quiz are currently being fetched. */
  isLoading: boolean;
  /** Called when the "Add Question" button is pressed. */
  onAddQuestion: () => void;
  /**
   * Called when the Edit button for a question is pressed.
   * @param question the question to edit
   */
  onEditQuestion: (question: Question) => void;
  /**
   * Called when the Delete button for a question is pressed.
   * @param question the question to delete
   */
  onDeleteQuestion: (question: Question) => void;
}

/**
 * QuestionManager
 *
 * Why presentational:
 * - Receives the selected quiz, its questions, and the loading state as props
 * - Delegates add/edit/delete actions entirely to the parent via callbacks
 * - Contains no API calls, fetching effects, or notification logic
 *
 * State coverage:
 * - No quiz selected: shows a guidance alert and hides the action buttons
 * - Loading: shows a centered spinner with an accessible busy region
 * - Loaded but empty: shows an informational alert
 * - Loaded with data: renders the numbered question list with actions
 */
function QuestionManager({
  selectedQuiz,
  questions,
  questionCount,
  isLoading,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}: QuestionManagerProps) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h5 mb-1">Question Management</h2>
            <p className="text-muted small mb-0">
              {selectedQuiz ? `Questions for ${selectedQuiz.title}` : "Select a quiz to view its questions."}
            </p>
          </div>
          {selectedQuiz ? (
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary">{isLoading ? "Loading..." : `${questionCount} total`}</span>
              <button type="button" className="btn btn-primary btn-sm" onClick={onAddQuestion}>
                Add Question
              </button>
            </div>
          ) : null}
        </div>

        {!selectedQuiz ? (
          <div className="alert alert-info mb-0" role="status">
            Select a quiz from the list above to load its questions.
          </div>
        ) : isLoading ? (
          <div className="d-flex justify-content-center align-items-center py-4" aria-live="polite" aria-busy="true">
            <Spinner animation="border" role="status" className="me-2" />
            <span className="text-muted">Loading questions...</span>
          </div>
        ) : questions.length === 0 ? (
          <div className="alert alert-info mb-0" role="status">
            This quiz has no questions yet.
          </div>
        ) : (
          <div className="vstack gap-3">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-3 p-3">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                  <div>
                    <h3 className="h6 mb-1">
                      {index + 1}. {question.text}
                    </h3>
                    <div className="small text-muted">Difficulty: {question.difficulty}</div>
                  </div>
                  <div className="d-flex flex-column align-items-end gap-2">
                    <span className="badge bg-secondary">
                      Correct: {question.options[question.correctIndex] ?? "—"}
                    </span>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => onEditQuestion(question)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onDeleteQuestion(question)}
                      >
                        Delete
                      </button>
                    </div>
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

export default QuestionManager;
