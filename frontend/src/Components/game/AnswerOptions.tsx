/**
 * AnswerOptions renders the four answer buttons for a quiz question.
 * Applies Bootstrap color feedback (success/danger) after the user has answered.
 *
 * @param options - Array of exactly 4 answer strings.
 * @param selectedIndex - Index chosen by the user, or null before selection.
 * @param correctIndex - Index of the correct answer used for feedback coloring.
 * @param showFeedback - When true, colors are applied to indicate correctness.
 * @param onSelect - Callback invoked with the chosen answer index.
 * @param disabled - When true, all buttons are disabled.
 */

interface AnswerOptionsProps {
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  showFeedback: boolean;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export default function AnswerOptions({ options, selectedIndex, correctIndex, showFeedback, onSelect, disabled = false }: AnswerOptionsProps) {
  return (
    <div className="row g-2">
      {options.map((opt, idx) => {
        const isSelected = selectedIndex === idx;
        let className = "btn w-100 text-start";

        if (!showFeedback) {
          className += isSelected ? " btn-primary" : " btn-outline-primary";
        } else {
          // Show feedback: correct -> primary, incorrect selection -> danger
          if (idx === correctIndex) {
            className += " btn-success";
          } else if (isSelected && idx !== correctIndex) {
            className += " btn-danger";
          } else {
            className += " btn-outline-secondary";
          }
        }

        return (
          <div key={idx} className="col-12 col-md-6">
            <button type="button" className={className} disabled={disabled || showFeedback} onClick={() => onSelect(idx)}>
              {opt}
            </button>
          </div>
        );
      })}
    </div>
  );
}

