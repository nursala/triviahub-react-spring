// src/Components/quiz/QuizBrowserHeader.tsx
// Presentational header component for Quiz Browser page.
// Displays the title and description.

/**
 * QuizBrowserHeader
 *
 * Why separated:
 * - Header is a distinct visual section
 * - Can be updated without affecting filters or results
 * - Can be styled or restructured independently
 * - Reusable in other pages if needed
 *
 * Pure presentation — no state, no logic.
 */
function QuizBrowserHeader() {
  return (
    <header className="mb-5">
      <h1 className="display-6 mb-2">Quiz Browser</h1>
      <p className="lead text-muted">
        Browse and play quizzes from the collection below. Select a quiz and click Play to start.
      </p>
    </header>
  );
}

export default QuizBrowserHeader;

