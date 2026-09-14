import { cn } from "@/lib/utils";
import { jitterFor } from "../../lib/paper.js";

/**
 * Corner cobwebs and the spider that keeps them.
 *
 * All decorative: aria-hidden, pointer-events:none, and rendered behind
 * the work. The abseiling spider respects prefers-reduced-motion through
 * the global reduce rule in styles.css, which flattens every animation —
 * so a reduced-motion visitor simply gets a spider sitting still.
 */

const CORNERS = {
  tl: { pos: "left-0 top-0", spin: "rotate(0deg)" },
  tr: { pos: "right-0 top-0", spin: "scaleX(-1)" },
  bl: { pos: "left-0 bottom-0", spin: "scaleY(-1)" },
  br: { pos: "right-0 bottom-0", spin: "scale(-1, -1)" },
};

/** A quarter web strung across a corner: guy lines plus catch spirals. */
export function CobWeb({ corner = "tl", size = 150, className, opacity = 0.3 }) {
  const c = CORNERS[corner] ?? CORNERS.tl;
  const rays = [0, 12, 25, 39, 54, 69, 78, 90];

  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none", c.pos, className)}
      style={{ transform: c.spin, opacity }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        className="text-paper-1"
        strokeLinecap="round"
      >
        {/* radial guy lines anchored into the corner */}
        {rays.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1="0"
              y1="0"
              x2={(Math.cos(rad) * 104).toFixed(1)}
              y2={(Math.sin(rad) * 104).toFixed(1)}
              strokeWidth="0.6"
              strokeOpacity="0.85"
            />
          );
        })}

        {/* catch spirals — each one sags a little between the guys */}
        {[20, 33, 46, 60, 75, 90].map((r, ring) => {
          const sag = 1 + ring * 0.06;
          const d = rays
            .map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x = Math.cos(rad) * r;
              const y = Math.sin(rad) * r;
              if (i === 0) return `M${x.toFixed(1)} ${y.toFixed(1)}`;
              const prev = (rays[i - 1] * Math.PI) / 180;
              const mid = (prev + rad) / 2;
              const cx = Math.cos(mid) * (r / sag);
              const cy = Math.sin(mid) * (r / sag);
              return `Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join(" ");
          return <path key={r} d={d} strokeWidth="0.5" strokeOpacity="0.6" />;
        })}

        {/* a torn strand or two, because nobody dusts a paper desk */}
        <path d="M18 4 Q30 16 24 30" strokeWidth="0.45" strokeOpacity="0.35" />
        <path d="M4 22 Q16 30 12 44" strokeWidth="0.45" strokeOpacity="0.3" />
      </svg>
    </span>
  );
}

/**
 * The spider itself — eight legs, drawn small.
 *
 * Sepia rather than black: at this size a dark silhouette reads as a
 * hole punched in the board instead of an insect on it.
 */
function SpiderBody({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      className="text-sepia/80"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      {/* legs, four a side, each with a knee */}
      {[
        "M17 18 C10 14 7 9 3 7",
        "M17 20 C9 19 6 18 2 16",
        "M17 22 C9 23 6 26 3 28",
        "M17 24 C10 27 8 32 5 35",
        "M23 18 C30 14 33 9 37 7",
        "M23 20 C31 19 34 18 38 16",
        "M23 22 C31 23 34 26 37 28",
        "M23 24 C30 27 32 32 35 35",
      ].map((d) => (
        <path key={d} d={d} strokeOpacity="0.9" />
      ))}
      {/* cephalothorax + abdomen */}
      <ellipse cx="20" cy="18" rx="4" ry="3.4" fill="currentColor" stroke="none" />
      <ellipse cx="20" cy="25" rx="6" ry="7" fill="currentColor" stroke="none" />
      {/* a dull marking on the back */}
      <path d="M20 21 L20 30" stroke="var(--paper-1)" strokeWidth="1.2" strokeOpacity="0.45" />
    </svg>
  );
}

/**
 * A spider hanging on a thread. `drop` is how far it abseils.
 *
 * The thread is drawn extending upward out of the clip box, so it stays
 * anchored to the ceiling no matter where the spider is.
 */
export function HangingSpider({
  seed = "spider",
  size = 22,
  drop = 110,
  clip = 200,
  className,
  style,
}) {
  const duration = 18 + Math.round(jitterFor(seed, "dur") * 16); // 18–34s
  const delay = Math.round(jitterFor(seed, "del") * 9);

  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none overflow-hidden", className)}
      style={{ height: clip, width: size + 12, ...style }}
    >
      <span
        className="animate-spider-abseil absolute left-0 top-0 block"
        style={{
          "--drop": `${drop}px`,
          "--abseil-duration": `${duration}s`,
          "--abseil-delay": `${delay}s`,
        }}
      >
        {/* silk, running up out of the box */}
        <span
          className="absolute bottom-full left-1/2 block w-px -translate-x-1/2 bg-paper-1/55"
          style={{ height: clip + drop + 40 }}
        />
        <SpiderBody size={size} />
      </span>
    </span>
  );
}

/**
 * A spider that bolts across the board and is gone.
 *
 * It is invisible for most of the cycle and crosses in a couple of
 * seconds — the stillness either side is what makes the dash land.
 */
export function ScuttlingSpider({ seed = "scuttle", size = 17, className, style }) {
  const duration = 24 + Math.round(jitterFor(seed, "sc") * 26); // 24–50s
  const delay = Math.round(jitterFor(seed, "scd") * 20);

  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none", className)}
      style={style}
    >
      <span
        className="animate-scuttle block"
        style={{ "--scuttle-duration": `${duration}s`, "--scuttle-delay": `${delay}s` }}
      >
        <span className="animate-skitter block">
          <SpiderBody size={size} />
        </span>
      </span>
    </span>
  );
}

/** A spider sitting in its web rather than hanging from it. */
export function RestingSpider({ seed = "resting", size = 20, className, style }) {
  const duration = 5 + Math.round(jitterFor(seed, "tw") * 6);
  const delay = Math.round(jitterFor(seed, "twd") * 5);
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none", className)}
      style={style}
    >
      <span
        className="animate-spider-twitch block"
        style={{ "--twitch-duration": `${duration}s`, "--twitch-delay": `${delay}s` }}
      >
        <SpiderBody size={size} />
      </span>
    </span>
  );
}
