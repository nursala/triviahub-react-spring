// src/components/about/AboutTeam.tsx
// Team section: displays team members with avatars and roles.
// Also includes course information in a second card.

import InfoCard from "../InfoCard.tsx";
import { TEAM } from "../../data/aboutData.ts";

/**
 * Avatar - small helper component for displaying team member initials.
 * Reused locally to avoid duplication within this section.
 *
 * Bootstrap classes:
 * - d-inline-flex / align-items-center / justify-content-center: centers content
 * - rounded-circle: makes it circular
 * - bg-primary / bg-success: color variation per index
 */
function Avatar({ name, color = "primary" }: { name: string; color?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`d-inline-flex align-items-center justify-content-center rounded-circle bg-${color} text-white`}
      style={{ width: 44, height: 44, fontWeight: 600 }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/**
 * AboutTeam - presentation component for team/submitters section.
 *
 * Why separated:
 * - Team info is required for university submissions
 * - Isolated and easy to update when team composition changes
 * - Combines team + course info in a logical grouping
 *
 * Bootstrap classes:
 * - d-flex align-items-center: aligns avatar and text horizontally
 * - fw-semibold: bold font weight for names
 * - small text-muted: smaller, greyed text for roles
 */
export default function AboutTeam(){
  return (
    <section className="mb-5">
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <InfoCard title="Team / Submitters">
            <ul className="list-unstyled mb-0">
              {TEAM.map((m, i) => (
                <li key={m.id} className="d-flex align-items-center mb-3">
                  <Avatar name={m.name} color={i % 2 === 0 ? "primary" : "success"} />
                  <div className="ms-3">
                    <div className="fw-semibold">{m.name}</div>
                    <div className="small text-muted">{m.role ?? "Contributor"}</div>
                    {m.email ? <div className="small text-muted">{m.email}</div> : null}
                  </div>
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>

        <div className="col-12 col-md-6">
          <InfoCard title="Project Overview">
            <p className="mb-2">
              TriviaHub is a Stage 2 full-stack project for browsing quizzes, managing quiz content, playing quiz sessions,
              saving results, and viewing leaderboard data.
            </p>
            <p className="small text-muted mb-0">
              Course and instructor details are provided in the official submission form when required.
            </p>
          </InfoCard>
        </div>
      </div>
    </section>
  );
}

