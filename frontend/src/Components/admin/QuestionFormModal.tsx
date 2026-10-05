/**
 * QuestionFormModal Component
 *
 * Presentational modal dialog for adding or editing a question — its text,
 * four answer options, correct answer index, difficulty, and hint. Holds no
 * state of its own — the parent (AdminPanel) owns the draft, the saving flag,
 * and the validation/API logic. Visibility and title are fully controlled by
 * the `mode` prop: the modal is shown whenever it is non-null.
 */

import { Button, Modal, Spinner } from "react-bootstrap";
import type { QuestionDraft, QuestionDraftTextField } from "../../utils/adminDrafts.ts";

const CORRECT_INDEX_CHOICES = ["0", "1", "2", "3"] as const;
const DIFFICULTY_CHOICES = ["easy", "medium", "hard"] as const;

/**
 * Props accepted by QuestionFormModal.
 */
interface QuestionFormModalProps {
  /** "add" to create a new question, "edit" to modify one, or null to hide the modal. */
  mode: "add" | "edit" | null;
  /** Current values of the question form fields. */
  draft: QuestionDraft;
  /** Whether a save request is currently in flight (disables inputs and buttons, shows a spinner). */
  isSaving: boolean;
  /**
   * Called whenever a non-options field's value changes.
   * @param field the draft key being edited ("text" | "correctIndex" | "hint" | "difficulty")
   * @param value the new raw input value
   */
  onFieldChange: (field: QuestionDraftTextField, value: string) => void;
  /**
   * Called whenever one of the four answer options changes.
   * @param index the option's position (0-3)
   * @param value the new raw input value
   */
  onOptionChange: (index: number, value: string) => void;
  /** Called when the user cancels the dialog (Cancel button or dismissal). */
  onCancel: () => void;
  /** Called when the user confirms the save (Add Question / Save changes button). */
  onSave: () => void;
}

/**
 * QuestionFormModal
 *
 * Why presentational:
 * - Receives the mode, the draft, and the saving state as props
 * - Delegates every change, cancellation, and save action to the parent via callbacks
 * - Contains no API calls, validation, or notification logic
 *
 * Visibility and labeling:
 * - `show` is derived directly from `mode !== null`
 * - The title and the primary button label switch between "Add" and "Edit" based on `mode`
 */
function QuestionFormModal({
  mode,
  draft,
  isSaving,
  onFieldChange,
  onOptionChange,
  onCancel,
  onSave,
}: QuestionFormModalProps) {
  return (
    <Modal show={mode !== null} onHide={onCancel} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="h5 mb-0">{mode === "add" ? "Add question" : "Edit question"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="vstack gap-3">
          <div>
            <label className="form-label" htmlFor="questionText">Question text</label>
            <textarea
              id="questionText"
              className="form-control"
              rows={3}
              value={draft.text}
              onChange={(e) => onFieldChange("text", e.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="row g-3">
            {draft.options.map((option, index) => (
              <div className="col-12 col-md-6" key={index}>
                <label className="form-label" htmlFor={`questionOption${index}`}>Option {index + 1}</label>
                <input
                  id={`questionOption${index}`}
                  className="form-control"
                  value={option}
                  onChange={(e) => onOptionChange(index, e.target.value)}
                  disabled={isSaving}
                />
              </div>
            ))}
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="correctIndex">Correct answer index</label>
              <select
                id="correctIndex"
                className="form-select"
                value={draft.correctIndex}
                onChange={(e) => onFieldChange("correctIndex", e.target.value)}
                disabled={isSaving}
              >
                {CORRECT_INDEX_CHOICES.map((choice) => (
                  <option key={choice} value={choice}>{choice}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                className="form-select"
                value={draft.difficulty}
                onChange={(e) => onFieldChange("difficulty", e.target.value)}
                disabled={isSaving}
              >
                {DIFFICULTY_CHOICES.map((choice) => (
                  <option key={choice} value={choice}>{choice}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="hint">Hint</label>
              <input
                id="hint"
                className="form-control"
                value={draft.hint}
                onChange={(e) => onFieldChange("hint", e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <><Spinner animation="border" size="sm" className="me-2" />Saving...</>
          ) : mode === "add" ? (
            "Add Question"
          ) : (
            "Save changes"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default QuestionFormModal;
