/**
 * ConfirmDeleteModal Component
 *
 * Generic presentational confirmation dialog for destructive delete actions.
 * It replaces what were previously two near-identical modals (one for quizzes,
 * one for questions) with a single reusable component driven entirely by
 * props. Holds no state of its own — the parent (AdminPanel) owns the
 * visibility, the target item, the in-flight flag, and the actual delete call.
 */

import { Button, Modal, Spinner } from "react-bootstrap";

/**
 * Props accepted by ConfirmDeleteModal.
 */
interface ConfirmDeleteModalProps {
  /** Whether the dialog should be visible. */
  show: boolean;
  /** Dialog heading, e.g. "Delete quiz?" or "Delete question?". */
  title: string;
  /** Name or label of the item being deleted, rendered in bold inside the confirmation sentence (e.g. a quiz title or a question's text). */
  itemName: string;
  /** Explanatory sentence describing what will happen if the user confirms (e.g. cascading effects). */
  warningText: string;
  /** Whether the delete request is currently in flight (disables both buttons and shows a spinner on Delete). */
  isDeleting: boolean;
  /** Called when the user cancels the deletion (Cancel button or dialog dismissal). */
  onCancel: () => void;
  /** Called when the user confirms the deletion (Delete button). */
  onConfirm: () => void;
}

/**
 * ConfirmDeleteModal
 *
 * Why presentational and generic:
 * - Receives everything that varies between use cases (title, item name, warning text) as props
 * - Delegates cancellation and confirmation entirely to the parent via callbacks
 * - Contains no API calls or knowledge of whether it is deleting a quiz, a question, or anything else
 *
 * Reuse:
 * - AdminPanel renders this once for quiz deletion and once for question deletion,
 *   passing different copy and wiring it to the matching confirm handler and loading flag
 */
function ConfirmDeleteModal({ show, title, itemName, warningText, isDeleting, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5 mb-0">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-2">
          You are about to delete <strong>{itemName}</strong>.
        </p>
        <p className="text-muted mb-0">{warningText}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? <><Spinner animation="border" size="sm" className="me-2" />Deleting...</> : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDeleteModal;
