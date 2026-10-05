/**
 * HintBox renders an informational Bootstrap alert containing the hint text.
 * Returns null when not visible so it occupies no layout space.
 *
 * @param hint - The hint string to display.
 * @param visible - Whether the hint box should be rendered.
 */

interface HintBoxProps {
  hint: string;
  visible: boolean;
}

export default function HintBox({ hint, visible }: HintBoxProps) {
  if (!visible) return null;
  return (
    <div className="alert alert-info mt-3" role="status">
      <strong>Hint:</strong> {hint}
    </div>
  );
}

