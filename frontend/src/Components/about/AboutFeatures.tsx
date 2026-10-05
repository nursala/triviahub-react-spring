// src/components/about/AboutFeatures.tsx
// Features section: displays feature cards in a responsive grid.
// Maps FEATURES array into cards using the reusable InfoCard component.

import InfoCard from "../InfoCard.tsx";
import { FEATURES } from "../../data/aboutData.ts";

/**
 * AboutFeatures - presentation component for the features section.
 *
 * Why separated:
 * - Features are a distinct visual and logical section
 * - Can be updated independently without touching other sections
 * - Uses FEATURES data from aboutData.ts
 *
 * Bootstrap classes:
 * - row-cols-1/row-cols-md-2/row-cols-lg-3: responsive grid that adapts automatically
 *   (1 column on mobile, 2 on tablets, 3 on desktop)
 * - g-3: gap utility (spacing between cards)
 * - col d-flex: makes each card take up full height for consistent alignment
 */
export default function AboutFeatures() {
  return (
    <section className="mb-5">
      <h2 className="h5 mb-3">Features</h2>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {FEATURES.map((f) => (
          <div key={f.id} className="col d-flex">
            <InfoCard
              title={
                <>
                  <span style={{ fontSize: 20 }}>{f.emoji}</span>
                  <span className="ms-2">{f.title}</span>
                </>
              }
            >
              <p className="mb-0 text-muted small">{f.description}</p>
            </InfoCard>
          </div>
        ))}
      </div>
    </section>
  );
}

