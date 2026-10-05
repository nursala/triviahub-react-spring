
/**
 * QuizResultsGrid Component
 *
 * Displays a grid of quiz cards or "no results" message.
 * Purely presentational component that renders provided quiz data.
 */

import type { Quiz } from "../../utils/apiClient.ts";
import QuizCard from "./QuizCard.tsx";

interface QuizResultsGridProps {
  filteredQuizzes: Quiz[];
  questionCountByQuizId: Record<string, number>;
  /**
   * True when the initial fetch failed (server unavailable at startup).
   * While true, every card's Play button is disabled regardless of its
   * individual question count — the PDF's "Server unavailable" edge case.
   */
  isServerUnavailable: boolean;
}

/**
 * Determines whether a given quiz's Play button should be disabled and, if
 * so, the human-readable reason to surface on its card.
 *
 * Precedence: a global server outage takes priority over a quiz-specific
 * "no questions" state, since in that situation the question count itself
 * may be stale or unknown.
 *
 * @param isServerUnavailable whether the initial quiz fetch failed
 * @param questionCount the number of questions known for this quiz
 * @returns the disabled reason to display, or undefined when Play is allowed
 */
function getPlayDisabledReason(isServerUnavailable: boolean, questionCount: number): string | undefined {
  if (isServerUnavailable) return "Server unavailable";
  if (questionCount === 0) return "No questions yet";
  return undefined;
}

/**
 * QuizResultsGrid
 *
 * Why separated:
 * - Results display is a distinct section
 * - Parent only passes filtered data — no filtering logic here
 * - Can change grid layout (cards, list, table) without touching filters
 * - Can add pagination or infinite scroll here later
 * - Easy to test: pass filtered quizzes and verify grid renders
 *
 * Pure presentation:
 * - Receives filtered quizzes from parent
 * - Receives question counts from parent
 * - Derives each card's disabled reason from `isServerUnavailable` and the
 *   quiz's question count, but performs no fetching or filtering itself
 */
function QuizResultsGrid({ filteredQuizzes, questionCountByQuizId, isServerUnavailable }: QuizResultsGridProps) {
  // No quizzes match the current filters
  if (filteredQuizzes.length === 0) {
    return (
      <div className="alert alert-info" role="status">
        <strong>No quizzes found.</strong> Try adjusting your search or category filter.
      </div>
    );
  }

  // Display matching quizzes in a responsive grid
  return (
    <section>
      <p className="text-muted mb-3">Showing {filteredQuizzes.length} quiz(zes).</p>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {filteredQuizzes.map((quiz) => {
          const questionCount = questionCountByQuizId[quiz.id] || 0;

          return (
            <div key={quiz.id} className="col">
              <QuizCard
                quiz={quiz}
                questionCount={questionCount}
                disabledReason={getPlayDisabledReason(isServerUnavailable, questionCount)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default QuizResultsGrid;

