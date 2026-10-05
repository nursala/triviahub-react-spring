/**
 * AboutIntroGoals
 * Keeps the About page intro/goals section modular and reusable.
 */
export default function AboutIntroGoals() {
  return (
    <section className="mb-5">
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title mb-3">What is TriviaHub?</h5>
              <p className="mb-0">
                TriviaHub is a full-stack quiz platform where users can browse quizzes, play games, save results,
                and view leaderboard data through a connected Spring Boot backend.
              </p>
              <p className="text-muted small mb-0 mt-2">
                The project uses a React frontend with a Java backend and serialized file persistence for assignment data.
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title mb-3">Stage 2 Goals</h5>
              <ul className="mb-0">
                <li>Connect the frontend to the REST API</li>
                <li>Persist quizzes, questions, and results using `.ser` files</li>
                <li>Support admin CRUD for quizzes and questions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
