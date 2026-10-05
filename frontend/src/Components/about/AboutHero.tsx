// src/components/about/AboutHero.tsx
// Hero section: top banner with title, subtitle and quick badges.
// Uses Bootstrap utilities (bg-light, p-4, rounded-3) for a clean, modern banner.

import { PAGE_META } from "../../data/aboutData.ts";

/**
 * AboutHero - presentation component for the hero section.
 *
 * Why separated:
 * - Hero is its own visual section, independent of content below
 * - Can be reused, styled or tested independently
 * - Imports from aboutData.ts so content is centralized
 *
 * Bootstrap classes:
 * - p-4 p-md-5: padding that scales with screen size
 * - bg-light: light grey background for visual hierarchy
 * - rounded-3: Bootstrap's large border-radius for modern look
 * - shadow-sm: subtle shadow for depth
 * - d-flex / align-items-md-center: flexbox for responsive layout
 */
export default function AboutHero(){
  return (
    <header className="mb-5">
      <div className="p-4 p-md-5 bg-light rounded-3 shadow-sm">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          {/* Left: title and subtitle */}
          <div>
            <h1 className="display-6 mb-1">{PAGE_META.title}</h1>
            <p className="lead text-muted mb-0">{PAGE_META.subtitle}</p>
          </div>

          {/* Right: badges and stack info */}
          <div className="text-md-end">
            <div className="mb-1">
              <span className="badge bg-primary me-1">Stage 2</span>
              <span className="badge bg-secondary">Full-Stack</span>
            </div>
            <small className="text-muted d-block">React + TypeScript • Spring Boot • Java 25 • Bootstrap</small>
          </div>
        </div>
      </div>
    </header>
  );
}

