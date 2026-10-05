/**
 * QuizForm Component
 *
 * Presentational "Add Quiz" form card. Renders the title/category/description
 * fields and submit button, and reports every change back to the parent.
 * Holds no state of its own — the parent (AdminPanel) owns the draft, the
 * submission flag, and the validation/API logic.
 */

import type { FormEvent } from "react";
import { Spinner } from "react-bootstrap";
import type { QuizDraft } from "../../utils/adminDrafts.ts";

/**
 * Props accepted by QuizForm.
 */
interface QuizFormProps {
  /** Current values of the title/category/description fields. */
  draft: QuizDraft;
  /** Whether a create request is currently in flight (disables inputs and shows a spinner). */
  isSubmitting: boolean;
  /**
   * Called whenever a field's value changes.
   * @param field the draft key being edited ("title" | "category" | "description")
   * @param value the new raw input value
   */
  onFieldChange: (field: keyof QuizDraft, value: string) => void;
  /**
   * Called when the form is submitted.
   * @param event the originating form submit event (parent calls preventDefault)
   */
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

/**
 * QuizForm
 *
 * Why presentational:
 * - Receives the draft and submission state as props and only renders inputs
 * - Delegates every change and the submit action to the parent via callbacks
 * - Contains no API calls, validation, or notification logic
 */
function QuizForm({ draft, isSubmitting, onFieldChange, onSubmit }: QuizFormProps) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h5 mb-3">Add Quiz</h2>
        <form onSubmit={onSubmit} className="vstack gap-3">
          <div>
            <label className="form-label" htmlFor="quizTitle">Title</label>
            <input
              id="quizTitle"
              className="form-control"
              value={draft.title}
              onChange={(e) => onFieldChange("title", e.target.value)}
              placeholder="Enter quiz title"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="quizCategory">Category</label>
            <input
              id="quizCategory"
              className="form-control"
              value={draft.category}
              onChange={(e) => onFieldChange("category", e.target.value)}
              placeholder="e.g. science"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="quizDescription">Description</label>
            <textarea
              id="quizDescription"
              className="form-control"
              rows={3}
              value={draft.description}
              onChange={(e) => onFieldChange("description", e.target.value)}
              placeholder="Short quiz description"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Creating...
              </>
            ) : (
              "Add Quiz"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default QuizForm;
