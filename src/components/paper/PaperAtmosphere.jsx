import { cn } from "@/lib/utils";
import { jitterFor } from "../../lib/paper.js";

/**
 * Air and light over the board.
 *
 * Every layer here lightens — the shaft and the dust both blend with
 * `screen`, so they can only lift what is underneath, never darken it.
 * All of it is aria-hidden and non-interactive, and the global
 * prefers-reduced-motion rule stills the movement.
 */

/** A shaft of daylight falling across the board, breathing slowly. */
export function LightShaft({ className }) {
  return (
    <span
      aria-hidden="true"
      className={cn("light-shaft animate-lamp-breathe pointer-events-none", className)}
    />
  );
}

/** Dust hanging in the shaft. */
export function DustMotes({ className }) {
  return <span aria-hidden="true" className={cn("dust-motes pointer-events-none", className)} />;
}

/**
 * Something low and quick along the bottom of the board.
 *
 * Deliberately a flat silhouette — a rat you only half-see is worse
 * than one drawn in detail.
 */
export function Rat({ seed = "rat", size = 46, className }) {
  const duration = 32 + Math.round(jitterFor(seed, "rd") * 26);
  const delay = Math.round(jitterFor(seed, "rdl") * 24);

  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 bottom-2 overflow-hidden", className)}
      style={{ height: size }}
    >
      <span
        className="animate-rat-dart absolute bottom-0 left-0 block"
        style={{ "--rat-duration": `${duration}s`, "--rat-delay": `${delay}s` }}
      >
        <svg width={size} height={size * 0.5} viewBox="0 0 100 50" fill="oklch(0.26 0.02 50)">
          {/* body, haunch and snout in one silhouette */}
          <path d="M22 40 C16 40 10 36 11 30 C12 24 20 20 30 19 C38 18 46 20 54 22 C62 24 70 25 76 22 C80 20 84 22 83 26 C82 30 76 32 70 33 C74 35 76 38 74 41 L64 41 C64 37 60 34 54 34 C46 34 40 37 36 40 Z" />
          {/* ear and eye */}
          <circle cx="78" cy="19" r="4.5" />
          <circle cx="81" cy="25" r="1.1" fill="oklch(0.7 0.03 60)" />
          {/* tail */}
          <path
            d="M12 32 C6 34 2 38 4 43"
            fill="none"
            stroke="oklch(0.26 0.02 50)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* legs */}
          <path
            d="M30 40 L28 47 M44 39 L43 47 M62 40 L63 47"
            stroke="oklch(0.26 0.02 50)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </span>
  );
}

/** Flies working a slow circuit over one spot. */
export function Flies({ seed = "flies", count = 3, className, style }) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none", className)}
      style={style}
    >
      {Array.from({ length: count }, (_, i) => {
        const s = `${seed}#${i}`;
        return (
          <span
            key={s}
            className="animate-fly-orbit absolute block"
            style={{
              left: Math.round(jitterFor(s, "fx") * 22),
              top: Math.round(jitterFor(s, "fy") * 22),
              "--fly-duration": `${5 + Math.round(jitterFor(s, "fd") * 6)}s`,
              "--fly-delay": `-${Math.round(jitterFor(s, "fdl") * 6)}s`,
            }}
          >
            <svg width="7" height="7" viewBox="0 0 10 10">
              <ellipse cx="5" cy="5.5" rx="2" ry="2.8" fill="oklch(0.24 0.02 50)" />
              <ellipse cx="2.6" cy="4" rx="2.2" ry="1.2" fill="oklch(0.5 0.02 50)" opacity="0.5" />
              <ellipse cx="7.4" cy="4" rx="2.2" ry="1.2" fill="oklch(0.5 0.02 50)" opacity="0.5" />
            </svg>
          </span>
        );
      })}
    </span>
  );
}

/**
 * The lamp guttering — a dark wash that flares in for a beat or two and
 * then settles, as if the flame nearly went out.
 */
export function Gutter({ seed = "gutter", className }) {
  const duration = 16 + Math.round(jitterFor(seed, "gd") * 16);
  const delay = Math.round(jitterFor(seed, "gdl") * 12);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "animate-gutter pointer-events-none absolute inset-0 bg-[oklch(0.22_0.03_48)]",
        className,
      )}
      style={{ "--gutter-duration": `${duration}s`, "--gutter-delay": `${delay}s` }}
    />
  );
}

/** A pale moth, wings going, wandering across and out the other side. */
export function Moth({ seed = "moth", size = 20, className }) {
  const duration = 30 + Math.round(jitterFor(seed, "md") * 22); // 30–52s
  const delay = 4 + Math.round(jitterFor(seed, "mdl") * 14);

  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <span
        className="animate-moth-cross absolute left-0 top-0 block"
        style={{ "--moth-duration": `${duration}s`, "--moth-delay": `${delay}s` }}
      >
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          {/* wings flutter as one group, mirrored around the body */}
          <g className="animate-moth-flutter" style={{ transformOrigin: "20px 20px" }}>
            <path
              d="M20 20 C12 8 2 10 4 18 C5 24 13 25 20 21 Z"
              fill="oklch(0.9 0.03 88)"
              fillOpacity="0.85"
            />
            <path
              d="M20 20 C28 8 38 10 36 18 C35 24 27 25 20 21 Z"
              fill="oklch(0.93 0.025 88)"
              fillOpacity="0.85"
            />
            <path
              d="M20 21 C14 26 8 30 12 34 C15 37 19 30 20 25 Z"
              fill="oklch(0.86 0.035 84)"
              fillOpacity="0.75"
            />
            <path
              d="M20 21 C26 26 32 30 28 34 C25 37 21 30 20 25 Z"
              fill="oklch(0.88 0.03 84)"
              fillOpacity="0.75"
            />
          </g>
          {/* body + antennae */}
          <ellipse cx="20" cy="22" rx="1.9" ry="6" fill="oklch(0.66 0.04 74)" />
          <path
            d="M19 16 C17 12 15 11 13 10 M21 16 C23 12 25 11 27 10"
            stroke="oklch(0.68 0.04 74)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </span>
  );
}
