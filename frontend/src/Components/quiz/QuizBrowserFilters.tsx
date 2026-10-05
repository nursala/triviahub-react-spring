// src/Components/quiz/QuizBrowserFilters.tsx
// Presentational filters section component.
// Groups SearchBox and CategoryFilter together.
// Parent passes state and callbacks.

import SearchBox from "./SearchBox.tsx";
import CategoryFilter from "./CategoryFilter.tsx";

interface QuizBrowserFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * QuizBrowserFilters
 *
 * Why separated:
 * - Groups related filter controls together
 * - Can be shown/hidden or reorganized without touching QuizBrowser
 * - Can add new filters (difficulty, date, etc.) in one place
 * - Easier to test filters as a unit
 *
 * Data flow:
 * - All state still lives in parent (QuizBrowser)
 * - Props down: searchTerm, categories, selectedCategory
 * - Callbacks up: onSearchChange, onCategoryChange
 */
function QuizBrowserFilters({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
}: QuizBrowserFiltersProps) {
  return (
    <section className="mb-5">
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <SearchBox searchTerm={searchTerm} onSearchChange={onSearchChange} />
        </div>

        <div className="col-12 col-md-6">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </div>
    </section>
  );
}

export default QuizBrowserFilters;

