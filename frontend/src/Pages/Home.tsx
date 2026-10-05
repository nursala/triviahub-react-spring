/**
 * Landing page for TriviaHub.
 * Combines static marketing content with live aggregate counts from the
 * backend so the first screen reflects current platform activity.
 */
import { useEffect, useState } from "react";
import HomeHero from "../Components/home/HomeHero.tsx";
import StartGameButton from "../Components/home/StartGameButton.tsx";
import InfoCard from "../Components/InfoCard.tsx";
import { fetchAllQuizzes, fetchAllResults } from "../utils/apiClient.ts";
import { InlineAlert } from "../utils/notificationUtils";

type HomeStats = {
  quizzes: number;
  questions: number;
  gamesPlayed: number;
};

export default function Home() {
  const [stats, setStats] = useState<HomeStats>({
    quizzes: 0,
    questions: 0,
    gamesPlayed: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();

    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const [quizzesData, resultsData] = await Promise.all([
          fetchAllQuizzes(controller.signal),
          fetchAllResults(controller.signal),
        ]);

        // The page presents one aggregate metric, so the total is derived here
        // instead of adding a backend endpoint dedicated only to this view.
        const totalQuestions = quizzesData.reduce((sum, quiz) => {
          return sum + (typeof quiz.questionCount === "number" ? quiz.questionCount : 0);
        }, 0);

        setStats({
          quizzes: quizzesData.length,
          questions: totalQuestions,
          gamesPlayed: resultsData.length,
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        const message = err instanceof Error ? err.message : "Failed to load home statistics.";
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadStats();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main className="container py-5">
      <HomeHero />

      {error ? (
        <InlineAlert
          notification={{
            id: "home-stats-error",
            type: "danger",
            title: "Unable to load statistics",
            message: error,
            dismissible: false,
          }}
        />
      ) : null}

      <section className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h5 mb-0">Platform Stats</h2>
          <span className="badge bg-secondary">Live backend data</span>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5" aria-live="polite" aria-busy="true">
            <div className="spinner-border text-primary" role="status" aria-label="Loading statistics">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 g-3">
            <div className="col">
              <InfoCard title="Total Quizzes">
                <div className="display-6 fw-semibold text-primary mb-2">{stats.quizzes}</div>
              </InfoCard>
            </div>
            <div className="col">
              <InfoCard title="Total Questions">
                <div className="display-6 fw-semibold text-primary mb-2">{stats.questions}</div>
              </InfoCard>
            </div>
            <div className="col">
              <InfoCard title="Games Played">
                <div className="display-6 fw-semibold text-primary mb-2">{stats.gamesPlayed}</div>
              </InfoCard>
            </div>
          </div>
        )}
      </section>

      <StartGameButton />
    </main>
  );
}
