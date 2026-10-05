// src/components/InfoCard.tsx
// Reusable card component using Bootstrap 5.
// Purpose: Enforce consistent card styling across the app and reduce duplication.
// Pattern: Children pattern allows flexible content inside the card.

interface InfoCardProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string; // optional customization
}

/**
 * InfoCard - simple, reusable Bootstrap card wrapper.
 *
 * Why this matters:
 * - Single source of truth for card styling (h-100, shadow-sm, border-0, etc.)
 * - Easy to update card appearance globally by editing this one file
 * - Reduces boilerplate across multiple pages
 * - Typed props with TypeScript for clarity and safety
 */
export default function InfoCard({ title, children, className = "" }: InfoCardProps) {
  return (
    <div className={`card h-100 shadow-sm border-0 rounded-4 ${className}`}>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-3">{title}</h5>
        {children}
      </div>
    </div>
  );
}

