// src/Components/home/StartGameButton.tsx
// Call-to-action button for starting the game.
// Keeps Home.tsx clean and makes the button reusable.

import { Link } from "react-router-dom";

/**
 * StartGameButton
 *
 * Why separated:
 * - Single responsibility: render a primary CTA button
 * - Reusable across multiple pages
 * - Easy to modify button styling or behavior
 * - Keeps Home composition page focused
 */
export default function StartGameButton() {
  return (
    <section className="mb-5">
      <div className="d-grid gap-2 d-md-flex">
        <Link to="/quizzes" className="btn btn-primary btn-lg flex-fill py-3">
          Browse Quizzes
        </Link>
        <Link to="/leaderboard" className="btn btn-outline-secondary btn-lg flex-fill py-3">
          View Leaderboard
        </Link>
      </div>
    </section>
  );
}

