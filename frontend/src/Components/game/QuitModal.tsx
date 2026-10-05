interface QuitModalProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function QuitModal({ show, onCancel, onConfirm }: QuitModalProps) {
  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="quit-modal-title">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="quit-modal-title">
                Quit quiz?
              </h2>
              <button type="button" className="btn-close" aria-label="Close" onClick={onCancel} />
            </div>
            <div className="modal-body">
              <p className="mb-0">Your current quiz progress will be lost.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                Continue Quiz
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirm}>
                Quit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
