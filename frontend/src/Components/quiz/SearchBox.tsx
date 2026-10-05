// src/Components/quiz/SearchBox.tsx
// Presentational search input component for QuizBrowser.
// Handles user input via controlled component pattern.
// No local state — parent controls the search term.

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

/**
 * SearchBox
 *
 * Why presentational:
 * - Only receives props and calls parent callback
 * - Does not own the search state
 * - Reusable in any filtering context
 *
 * Controlled component pattern:
 * - value prop from parent
 * - onChange callback to parent
 * - Parent is source of truth for searchTerm
 */
function SearchBox({ searchTerm, onSearchChange }: SearchBoxProps) {
  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-control form-control-lg"
        placeholder="Search quizzes by title..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search quizzes"
      />
    </div>
  );
}

export default SearchBox;
