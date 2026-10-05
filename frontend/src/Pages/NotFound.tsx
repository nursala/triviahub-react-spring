import { Link } from "react-router-dom";

/**
 * NotFound page rendered for any unmatched route.
 * Displays a warning banner with navigation links back to home and the quiz browser.
 */
export default function NotFound() {
  return (
    <main className="container py-5">
      <div className="alert alert-warning mb-4" role="alert">
        <h1 className="h4 mb-2">Page not found</h1>
        <p className="mb-0">The page you requested does not exist or the URL may be incorrect.</p>
      </div>

      <div className="d-flex gap-2 flex-wrap">
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
        <Link to="/quizzes" className="btn btn-outline-secondary">
          Back to Quiz Browser
        </Link>
      </div>
    </main>
  );
}

