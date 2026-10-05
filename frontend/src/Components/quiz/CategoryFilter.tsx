// src/Components/quiz/CategoryFilter.tsx
// Presentational category filter dropdown component.
// Handles category selection via controlled component pattern.

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * CategoryFilter
 *
 * Why presentational:
 * - Only receives props and calls parent callback
 * - Does not own the selection state
 * - Parent is source of truth for selectedCategory
 *
 * Controlled component pattern:
 * - value prop from parent
 * - onChange callback to parent
 * - Parent controls which category is selected
 */
function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="mb-4">
      <label htmlFor="categoryFilter" className="form-label">
        Category
      </label>
      <select
        id="categoryFilter"
        className="form-select"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="Filter quizzes by category"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;
