/**
 * StatsSection Component
 *
 * Displays interactive platform statistics fetched from the backend.
 * Shows total quizzes, questions, and games played with loading and error states.
 * Refactored for Phase 2 to use backend API instead of mock data.
 */

import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import InfoCard from "../InfoCard.tsx";
import { fetchAllQuizzes, fetchAllResults } from "../../utils/apiClient.ts";

type StatItem = {
  id: string;
  label: string;
  value: number;
  loading?: boolean;
};

/**
 * StatsSection Component
 *
 * Fetches and displays platform statistics including:
 * - Total number of quizzes
 * - Total number of questions across all quizzes
 * - Number of games played (results)
 *
 * Uses AbortController for cleanup and proper memory management.
 */
export default function StatsSection() {
  const [stats, setStats] = useState<StatItem[]>([
    { id: "quizzes", label: "Total Quizzes", value: 0, loading: true },
    { id: "questions", label: "Total Questions", value: 0, loading: true },
    { id: "results", label: "Games Played", value: 0, loading: true },
  ]);

  useEffect(() => {
    const controller = new AbortController();

    const loadStats = async () => {
      try {
        const [quizzes, results] = await Promise.all([
          fetchAllQuizzes(controller.signal),
          fetchAllResults(controller.signal),
        ]);

        // Calculate total questions from question count in quizzes
        const totalQuestions = quizzes.reduce(
          (sum, q) => sum + (q.questionCount ?? 0),
          0
        );

        setStats([
          { id: "quizzes", label: "Total Quizzes", value: quizzes.length },
          { id: "questions", label: "Total Questions", value: totalQuestions },
          { id: "results", label: "Games Played", value: results.length },
        ]);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        // On error, show zero values
        setStats([
          { id: "quizzes", label: "Total Quizzes", value: 0 },
          { id: "questions", label: "Total Questions", value: 0 },
          { id: "results", label: "Games Played", value: 0 },
        ]);
      }
    };

    loadStats();
    return () => controller.abort();
  }, []);

  return (
    <section className="mb-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 mb-0">Platform Stats</h2>
        <span className="badge bg-primary">Live Data</span>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-3">
        {stats.map((stat) => (
          <div key={stat.id} className="col">
            <InfoCard title={stat.label}>
              {stat.loading ? (
                <div className="d-flex justify-content-center py-3">
                  <Spinner animation="border" size="sm" />
                </div>
              ) : (
                <div className="display-6 fw-semibold text-primary mb-2">
                  {stat.value}
                </div>
              )}
            </InfoCard>
          </div>
        ))}
      </div>
    </section>
  );
}
