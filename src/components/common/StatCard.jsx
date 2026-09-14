import PaperCard from "../paper/PaperCard.jsx";
import PaperLeaf from "../paper/PaperLeaf.jsx";
import { jitterFor } from "../../lib/paper.js";

/** A figure copied out of the day book onto its own slip. */
export default function StatCard({ label, value, note }) {
  // One slip in three gets a specimen pressed into the corner, so the
  // row of tiles never reads as a repeating pattern.
  const dressing = Math.floor(jitterFor(label, "dress") * 3);

  return (
    <PaperCard tiltId={label} tiltRange={1} foldCorner className="h-full bg-paper-2">
      {dressing === 0 && (
        <span aria-hidden="true" className="pointer-events-none absolute -right-1 -top-2 opacity-45">
          <PaperLeaf seed={`stat-${label}`} tone="sepia" size={62} />
        </span>
      )}
      {dressing === 1 && (
        <span
          aria-hidden="true"
          className="rust-pin pointer-events-none absolute right-3 top-2 h-2.5 w-2.5 opacity-75"
        />
      )}

      <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-kraft">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl font-bold text-ink-1">{value}</p>
      {note && <p className="mt-1 font-hand text-lg leading-tight text-ink-faint">{note}</p>}

      {/* ruled underscore, as if the figure were entered on a ledger line */}
      <span
        aria-hidden="true"
        className="mt-2 block h-px w-full bg-role-ink opacity-25"
      />
    </PaperCard>
  );
}
