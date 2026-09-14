import { cn } from "@/lib/utils";
import { jitterFor, tiltFor } from "../../lib/paper.js";

/**
 * The hardware that holds a pinboard together: pushpins, staples,
 * index tabs, a ribbon marker, and the red thread strung between pins.
 *
 * All decorative — aria-hidden, pointer-events:none, deterministic from
 * a seed so the server and client agree.
 */

/** A brass pushpin, optionally bleeding a little rust into the paper. */
export function Pushpin({ seed = "pin", size = 11, rust = true, className, style }) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
      style={style}
    >
      {rust && (
        <span
          className="rust-halo absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: size * 3.1, height: size * 3.1, opacity: 0.5 }}
        />
      )}
      <span
        className="pushpin relative block"
        style={{ width: size, height: size, transform: `rotate(${tiltFor(seed, 20)}deg)` }}
      />
    </span>
  );
}

/** A wire staple, flattened into the corner of a sheet. */
export function Staple({ seed = "staple", length = 15, className, style }) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
      style={{ transform: `rotate(${tiltFor(seed, 34)}deg)`, ...style }}
    >
      <span
        className="rust-halo absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: length * 2.4, height: length * 2.4, opacity: 0.34 }}
      />
      <span className="staple relative block rounded-[1px]" style={{ width: length, height: 2.5 }} />
    </span>
  );
}

/**
 * Red thread strung between pins across a board.
 *
 * The line is drawn with a non-scaling stroke so it keeps its weight
 * however the box is stretched; the pins are separate round elements so
 * they never squash with it.
 */
export function PinnedString({ seed = "string", points = 4, className, opacity = 0.5 }) {
  const nodes = Array.from({ length: points }, (_, i) => ({
    x: 6 + (i * 88) / Math.max(1, points - 1),
    y: 12 + jitterFor(`${seed}#${i}`, "sy") * 68,
  }));

  const d = nodes
    .map((p, i) => {
      if (i === 0) return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      const prev = nodes[i - 1];
      // sag the thread between each pair of pins
      const cx = (prev.x + p.x) / 2;
      const cy = Math.max(prev.y, p.y) + 5 + jitterFor(`${seed}#${i}`, "sag") * 5;
      return `Q${cx.toFixed(1)} ${cy.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d={d}
          stroke="oklch(0.55 0.17 27)"
          strokeWidth="1.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={opacity}
        />
        <path
          d={d}
          stroke="oklch(0.82 0.09 30)"
          strokeWidth="0.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={opacity * 0.7}
          transform="translate(0,-0.6)"
        />
      </svg>

      {nodes.map((p, i) => (
        <Pushpin
          key={`${seed}-${i}`}
          seed={`${seed}-pin-${i}`}
          size={10}
          className="-translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        />
      ))}
    </span>
  );
}

/** A card-index tab poking up out of the top edge of a panel. */
export function DividerTab({ label, seed = "tab", className, style }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "divider-tab pointer-events-none absolute select-none px-2.5 py-1",
        "font-body text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-kraft",
        className,
      )}
      style={{ transform: `rotate(${tiltFor(seed, 1.2)}deg)`, ...style }}
    >
      {label}
    </span>
  );
}

/** A ribbon page-marker hanging down a board. */
export function Ribbon({ className, style, height = 96, width = 16 }) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute block", className)}
      style={{
        width,
        height,
        background:
          "linear-gradient(96deg, oklch(0.62 0.16 26), oklch(0.5 0.15 26) 52%, oklch(0.66 0.15 28))",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
        boxShadow: "0 2px 5px -1px oklch(0.45 0.04 70 / 0.4)",
        ...style,
      }}
    />
  );
}
