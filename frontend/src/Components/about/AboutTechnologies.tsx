// src/components/about/AboutTechnologies.tsx
// Technologies section: displays tech stack using badges.
// Simple, clean listing of the tools and libraries used.

import InfoCard from "../InfoCard.tsx";
import { TECHNOLOGIES } from "../../data/aboutData.ts";

/**
 * AboutTechnologies - presentation component for technologies section.
 *
 * Why separated:
 * - Technologies are independently updatable
 * - May change across phases; isolated in this file makes updates easy
 * - Reuses InfoCard for consistency
 *
 * Bootstrap classes:
 * - badge: small inline labels for tech names
 * - bg-light border text-dark: subtle styling for badges
 * - py-2 px-3: padding inside badge
 * - shadow-sm: subtle depth
 */
export default function AboutTechnologies() {
  return (
    <section className="mb-5">
      <h2 className="h5 mb-3">Technologies</h2>

      <div className="row g-3">
        <div className="col-12">
          <InfoCard title="Stack">
            <div className="d-flex flex-wrap gap-2">
              {TECHNOLOGIES.map((t) => (
                <span key={t.id} className="badge bg-light border text-dark py-2 px-3 shadow-sm">
                  <strong>{t.name}</strong>
                  {t.tag ? <small className="text-muted ms-2">• {t.tag}</small> : null}
                </span>
              ))}
            </div>
            <p className="small text-muted mt-3 mb-0">
              Bootstrap 5 provides layout utilities and components that reduce custom CSS and keep everything responsive.
            </p>
          </InfoCard>
        </div>
      </div>
    </section>
  );
}

