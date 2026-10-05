/**
 * GameHeader displays the quiz title, category, description, and a Quit button.
 *
 * @param title - The quiz title.
 * @param category - Optional quiz category label.
 * @param description - Optional quiz description text.
 * @param onQuit - Callback triggered when the player clicks the Quit button.
 */

interface GameHeaderProps {
  title: string;
  category?: string;
  description?: string;
  onQuit: () => void;
}

export default function GameHeader({ title, category, description, onQuit }: GameHeaderProps) {
  return (
    <header className="d-flex align-items-start justify-content-between mb-4">
      <div>
        <h2 className="h4 mb-1">{title}</h2>
        {category ? <div className="text-muted mb-2">Category: {category}</div> : null}
        {description ? <p className="small text-muted mb-0">{description}</p> : null}
      </div>

      <div>
        <button type="button" className="btn btn-outline-danger" onClick={onQuit}>
          Quit
        </button>
      </div>
    </header>
  );
}

