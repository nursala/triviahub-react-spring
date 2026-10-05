/**
 * QuizEditModal Component
 *
 * Presentational modal dialog for editing an existing quiz's title, category,
 * and description. Holds no state of its own — the parent (AdminPanel) owns
 * the edit draft, the saving flag, and the validation/API logic. Visibility
 * is fully controlled by the `quiz` prop: the modal is shown whenever it is
 * non-null and hidden when it is null.
 */

import { Button, Modal, Spinner } from "react-bootstrap";
import type { Quiz } from "../../utils/apiClient.ts";
import type { QuizDraft } from "../../utils/adminDrafts.ts";

/**
 * Props accepted by QuizEditModal.
 */
interface QuizEditModalProps {
  /** The quiz currently being edited, or null when the modal should be hidden. */
  quiz: Quiz | null;
  /** Current values of the title/category/description fields being edited. */
  draft: QuizDraft;
  /** Whether a save request is currently in flight (disables inputs and buttons, shows a spinner). */
  isSaving: boolean;
  /**
   * Called whenever a field's value changes.
   * @param field the draft key being edited ("title" | "category" | "description")
   * @param value the new raw input value
   */
  onFieldChange: (field: keyof QuizDraft, value: string) => void;
  /** Called when the user cancels the edit (Cancel button or dialog dismissal). */
  onCancel: () => void;
  /** Called when the user confirms the save (Save changes button). */
  onSave: () => void;
}

/**
 * QuizEditModal
 *
 * Why presentational:
 * - Receives the target quiz, the draft, and the saving state as props
 * - Delegates every change, cancellation, and save action to the parent via callbacks
 * - Contains no API calls, validation, or notification logic
 *
 * Visibility:
 * - `show` is derived directly from `quiz !== null`, so the parent controls
 *   the dialog simply by setting/clearing the quiz being edited
 */
function QuizEditModal({ quiz, draft, isSaving, onFieldChange, onCancel, onSave }: QuizEditModalProps) {
  return (
    <Modal show={quiz !== null} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5 mb-0">Edit quiz</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="vstack gap-3">
          <div>
            <label className="form-label" htmlFor="editQuizTitle">Title</label>
            <input
              id="editQuizTitle"
              className="form-control"
              value={draft.title}
              onChange={(e) => onFieldChange("title", e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="editQuizCategory">Category</label>
            <input
              id="editQuizCategory"
              className="form-control"
              value={draft.category}
              onChange={(e) => onFieldChange("category", e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="editQuizDescription">Description</label>
            <textarea
              id="editQuizDescription"
              className="form-control"
              rows={3}
              value={draft.description}
              onChange={(e) => onFieldChange("description", e.target.value)}
              disabled={isSaving}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave} disabled={isSaving}>
          {isSaving ? <><Spinner animation="border" size="sm" className="me-2" />Saving...</> : "Save changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default QuizEditModal;
