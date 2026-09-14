import { cn } from "@/lib/utils";
import { jitterFor, tiltFor } from "../../lib/paper.js";

/**
 * Pencil notes somebody left in the margin, and the typed folio mark in
 * the corner of a sheet.
 *
 * Decorative: aria-hidden and non-interactive. The notes are drawn from
 * a fixed pool and chosen by hash, so a given surface always carries the
 * same remark.
 */

const NOTES = [
  "check this",
  "see overleaf",
  "ask the clerk",
  "copy filed",
  "agreed ✓",
  "per ledger",
  "chase Monday",
  "nb.",
  "counted twice",
  "left as is",
];

/**
 * Notes that stop mid-word. No ellipsis and no full stop — the hand
 * simply stopped, which reads worse than any finished sentence.
 */
const UNFINISHED = [
  "it was here again last nigh",
  "do not let him sign th",
  "the count is wrong every mor",
  "who filed this I never",
  "tell them not to open the",
  "I can hear it in the sto",
  "the ninth entry is not m",
  "he came back for the ledg",
];

/** A remark pencilled into the margin at whatever angle the hand fell. */
export function Marginalia({ seed = "note", note, className, style }) {
  const text = note ?? NOTES[Math.floor(jitterFor(seed, "n") * NOTES.length) % NOTES.length];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute select-none whitespace-nowrap",
        "font-hand text-base leading-none text-ink-faint/70",
        className,
      )}
      style={{ transform: `rotate(${tiltFor(seed + "|m", 9)}deg)`, ...style }}
    >
      {text}
    </span>
  );
}

/**
 * A note in a shakier hand that breaks off part-way through a word,
 * with the pen trailing off the end of it.
 */
export function UnfinishedNote({ seed = "unfinished", className, style }) {
  const text = UNFINISHED[Math.floor(jitterFor(seed, "u") * UNFINISHED.length) % UNFINISHED.length];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute flex select-none items-center gap-1 whitespace-nowrap",
        "font-hand text-[15px] leading-none text-[oklch(0.38_0.06_28)]/65",
        className,
      )}
      style={{ transform: `rotate(${tiltFor(seed + "|u", 6)}deg)`, ...style }}
    >
      {text}
      {/* the pen dragging off the page */}
      <svg width="26" height="8" viewBox="0 0 26 8" fill="none" className="opacity-60">
        <path
          d="M1 3 C7 2 12 5 17 4 C20 3.4 23 5 25 7"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/** The folio number a clerk typed in the corner. */
export function FolioMark({ seed = "folio", className, style }) {
  const n = 1 + Math.floor(jitterFor(seed, "f") * 480);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "letterpress pointer-events-none absolute select-none",
        "font-display text-[10px] uppercase tracking-[0.3em] text-ink-faint/60",
        className,
      )}
      style={style}
    >
      fol. {String(n).padStart(3, "0")}
    </span>
  );
}
