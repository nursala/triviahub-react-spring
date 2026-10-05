// src/Components/home/HomeHero.tsx
// Hero section for the Home page.
// Keeps the page introduction clean, responsive, and reusable.

/**
 * HomeHero - top banner for TriviaHub.
 *
 * Architectural note:
 * - This section is presentational only.
 * - It keeps the Home page composition simple and mirrors the modular About page.
 */
export default function HomeHero() {
  return (
    <header className="mb-5">
      <div className="p-4 p-md-5 bg-light rounded-4 shadow-sm">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-8">
            <h1 className="display-6 mb-3">TriviaHub</h1>
            <p className="lead text-muted mb-3">
              Quiz Creation & Playing Platform.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

