import { cn } from "@/lib/utils";
import { tiltFor, jitterFor } from "../../lib/paper.js";

/**
 * Pressed botanical specimens — the dried leaves you find flattened
 * between the pages of an old ledger.
 *
 * Purely decorative: every specimen is aria-hidden and never
 * intercepts pointer events. Shape, angle and size are derived from
 * `seed` so a leaf never moves between renders (SSR-stable).
 */

const SPECIMENS = {
  /* Fan-shaped ginkgo, notched at the crown. */
  ginkgo: (
    <>
      <path
        d="M50 92 C50 74 49 62 47 54 C40 44 24 40 18 30 C28 16 40 10 50 10 C60 10 72 16 82 30 C76 40 60 44 53 54 C51 62 50 74 50 92 Z"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <path
        d="M50 92 C50 74 49 62 47 54 C40 44 24 40 18 30 C28 16 40 10 50 10 C60 10 72 16 82 30 C76 40 60 44 53 54 C51 62 50 74 50 92 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {[24, 33, 42, 50, 58, 67, 76].map((x, i) => (
        <path
          key={x}
          d={`M50 56 L${x} ${20 + Math.abs(i - 3) * 3}`}
          stroke="currentColor"
          strokeWidth="0.8"
          strokeOpacity="0.7"
        />
      ))}
      <path d="M50 92 L50 56" stroke="currentColor" strokeWidth="2" />
    </>
  ),

  /* Lobed oak leaf. */
  oak: (
    <>
      <path
        d="M50 96 L50 74 C40 76 32 72 30 64 C20 66 14 60 16 52 C7 47 8 38 15 34 C10 26 15 17 24 18 C25 9 34 5 41 10 C44 3 55 3 59 10 C66 5 75 9 76 18 C85 17 90 26 85 34 C92 38 93 47 84 52 C86 60 80 66 70 64 C68 72 60 76 50 74 Z"
        fill="currentColor"
        fillOpacity="0.45"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M50 96 L50 16" stroke="currentColor" strokeWidth="1.8" />
      {[
        [32, 58],
        [68, 58],
        [28, 44],
        [72, 44],
        [32, 30],
        [68, 30],
      ].map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          d={`M50 ${y + 8} L${x} ${y}`}
          stroke="currentColor"
          strokeWidth="0.9"
          strokeOpacity="0.65"
        />
      ))}
    </>
  ),

  /* Fern frond — paired pinnae down a curving rachis. */
  fern: (
    <>
      <path
        d="M50 96 C48 72 46 48 50 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {Array.from({ length: 9 }, (_, i) => {
        const y = 84 - i * 9;
        const len = 30 - i * 2.6;
        const droop = 6 - i * 0.4;
        return (
          <g key={y}>
            <path
              d={`M50 ${y} C${50 - len * 0.5} ${y - droop} ${50 - len * 0.8} ${y - droop} ${50 - len} ${y - droop * 1.6}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeOpacity="0.55"
            />
            <path
              d={`M50 ${y} C${50 + len * 0.5} ${y - droop} ${50 + len * 0.8} ${y - droop} ${50 + len} ${y - droop * 1.6}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeOpacity="0.55"
            />
          </g>
        );
      })}
    </>
  ),

  /* Simple ovate leaf with a strong midrib — laurel / bay. */
  laurel: (
    <>
      <path
        d="M50 94 C30 78 20 56 24 36 C28 18 40 8 50 6 C60 8 72 18 76 36 C80 56 70 78 50 94 Z"
        fill="currentColor"
        fillOpacity="0.45"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M50 94 L50 6" stroke="currentColor" strokeWidth="1.8" />
      {[24, 36, 48, 60, 72].map((y) => (
        <g key={y}>
          <path
            d={`M50 ${y} C42 ${y - 4} 34 ${y - 6} 28 ${y - 12}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeOpacity="0.6"
          />
          <path
            d={`M50 ${y} C58 ${y - 4} 66 ${y - 6} 72 ${y - 12}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeOpacity="0.6"
          />
        </g>
      ))}
    </>
  ),

  /* Curled and holed — this one died a long time before it was pressed. */
  withered: (
    <>
      <path
        d="M50 96 C34 84 22 66 26 46 C29 30 38 16 48 8 C54 14 50 24 54 32 C58 40 70 40 74 50 C79 62 70 82 50 96 Z"
        fill="currentColor"
        fillOpacity="0.4"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      {/* the edge has curled back on itself */}
      <path
        d="M26 46 C34 44 40 48 42 56 C44 64 40 72 32 74"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.7"
      />
      <path d="M50 96 C48 74 48 46 48 8" stroke="currentColor" strokeWidth="1.6" />
      {[30, 44, 58, 72].map((y) => (
        <path
          key={y}
          d={`M49 ${y} C58 ${y - 5} 64 ${y - 3} 70 ${y - 10}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeOpacity="0.55"
        />
      ))}
      {/* holes eaten clean through */}
      <ellipse cx="40" cy="62" rx="4.5" ry="3.2" fill="var(--paper-1)" />
      <ellipse cx="58" cy="48" rx="3" ry="4" fill="var(--paper-1)" />
      <ellipse cx="52" cy="76" rx="2.4" ry="2" fill="var(--paper-1)" />
    </>
  ),

  /* A small sprig — three leaves and a pair of dried berries. */
  sprig: (
    <>
      <path
        d="M50 96 C50 74 52 56 58 38 C62 26 66 18 68 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse cx="36" cy="66" rx="15" ry="7" transform="rotate(-28 36 66)" fill="currentColor" fillOpacity="0.45" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="72" cy="52" rx="14" ry="6.5" transform="rotate(24 72 52)" fill="currentColor" fillOpacity="0.45" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="42" cy="38" rx="12" ry="6" transform="rotate(-38 42 38)" fill="currentColor" fillOpacity="0.45" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="60" cy="72" r="4.5" fill="currentColor" fillOpacity="0.55" stroke="currentColor" strokeWidth="1" />
      <circle cx="68" cy="80" r="3.5" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="1" />
    </>
  ),
};

export const SPECIMEN_NAMES = Object.keys(SPECIMENS);

export default function PaperLeaf({
  specimen,
  seed = "leaf",
  size = 72,
  tone = "sepia",
  className,
  style,
}) {
  const pick = specimen ?? SPECIMEN_NAMES[Math.floor(jitterFor(seed, "sp") * SPECIMEN_NAMES.length) % SPECIMEN_NAMES.length];
  const angle = tiltFor(seed + "|leaf", 40);

  const tones = {
    sepia: "text-sepia",
    kraft: "text-kraft",
    green: "text-ink-green",
    ink: "text-ink-3",
    red: "text-ink-red",
  };

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn("pressed-specimen pointer-events-none select-none", tones[tone] ?? tones.sepia, className)}
      style={{ transform: `rotate(${angle}deg)`, ...style }}
    >
      {SPECIMENS[pick] ?? SPECIMENS.laurel}
    </svg>
  );
}
