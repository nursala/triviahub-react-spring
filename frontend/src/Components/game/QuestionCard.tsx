/**
 * QuestionCard Component
 *
 * Displays a quiz question with answer options and hint functionality.
 * Purely presentational component that renders the current question.
 */

import type { Question } from "../../utils/apiClient.ts";
import AnswerOptions from "./AnswerOptions.tsx";
import HintBox from "./HintBox.tsx";

interface QuestionCardProps {
  question: Question;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  showFeedback: boolean;
  usedHint: boolean;
  onHint: () => void;
  showHint: boolean;
  disabledOptions?: boolean;
}

export default function QuestionCard({ question, selectedIndex, onSelect, showFeedback, usedHint, onHint, showHint, disabledOptions = false }: QuestionCardProps) {
  return (
    <div>
      <h5 className="card-title mb-3">{question.text}</h5>

      <AnswerOptions
        options={question.options}
        selectedIndex={selectedIndex}
        correctIndex={question.correctIndex}
        showFeedback={showFeedback}
        onSelect={onSelect}
        disabled={disabledOptions}
      />

      {showFeedback && selectedIndex !== null ? (
        <div className={`alert mt-3 mb-0 ${selectedIndex === question.correctIndex ? "alert-success" : "alert-danger"}`} role="status">
          {selectedIndex === question.correctIndex ? "Correct answer." : `Incorrect answer. Correct answer: ${question.options[question.correctIndex]}`}
        </div>
      ) : null}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <button type="button" className="btn btn-outline-secondary" onClick={onHint} disabled={usedHint}>
            Hint
          </button>
        </div>

        <div className="small text-muted">Difficulty: {question.difficulty}</div>
      </div>

      <HintBox hint={question.hint} visible={showHint} />
    </div>
  );
}

