import { cn } from "@/lib/utils";
import { jitterFor, tiltFor } from "../../lib/paper.js";

/**
 * The unpleasant end of the archive: handprints, claw marks and the
 * stamps nobody wants to find on their file.
 *
 * Same rules as the rest of the dressing — aria-hidden, never
 * interactive, deterministic from a seed. These run darker than the
 * ordinary wear on purpose, so the components here keep to the margins
 * and none of them is placed directly under a block of body copy.
 */

/** A smeared hand, pressed and then dragged down the sheet. */
export function Handprint({ seed = "hand", size = 120, className, style }) {
  const flip = jitterFor(seed, "flip") > 0.5;
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none", className)}
      style={{
        transform: `rotate(${tiltFor(seed, 22)}deg) scaleX(${flip ? -1 : 1})`,
        ...style,
      }}
    >
      <svg
        width={size}
        height={size * 1.25}
        viewBox="0 0 100 125"
        fill="oklch(0.33 0.14 27)"
        className="mix-blend-multiply opacity-40"
      >
        {/* palm */}
        <path d="M30 62 C26 50 28 40 34 36 C40 32 56 32 63 37 C70 42 73 52 71 64 C69 78 60 88 50 88 C40 88 33 78 30 62 Z" />
        {/* fingers, splayed and uneven */}
        <path d="M33 40 C30 30 28 20 30 12 C31 7 37 6 39 11 C41 18 41 30 41 38 Z" />
        <path d="M43 37 C41 26 40 14 42 6 C43 1 49 1 51 6 C53 14 52 27 51 36 Z" />
        <path d="M54 36 C53 26 54 15 57 8 C59 3 64 4 65 9 C66 17 63 28 62 37 Z" />
        <path d="M64 40 C65 32 68 23 71 18 C74 13 79 15 78 21 C77 29 73 38 71 44 Z" />
        {/* thumb */}
        <path d="M30 60 C23 56 16 52 13 47 C10 42 15 37 20 41 C25 45 30 51 33 56 Z" />
        {/* the drag, where the hand slid down */}
        <path
          d="M34 86 C33 98 34 110 33 120 L40 120 C41 108 40 96 41 86 Z"
          fillOpacity="0.5"
        />
        <path
          d="M50 88 C50 100 51 112 50 122 L57 122 C58 110 57 98 57 88 Z"
          fillOpacity="0.42"
        />
        <path d="M64 84 C65 94 65 104 64 114 L70 114 C71 104 71 94 70 84 Z" fillOpacity="0.35" />
      </svg>
    </span>
  );
}

/** Four gouges torn through the surface. */
export function ClawMarks({ seed = "claw", size = 150, className, style }) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none", className)}
      style={{ transform: `rotate(${tiltFor(seed, 30)}deg)`, ...style }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {[0, 1, 2, 3].map((i) => {
          const x = 16 + i * 21;
          const lean = (i - 1.5) * 5;
          return (
            <g key={i}>
              {/* the torn channel */}
              <path
                d={`M${x} 6 C${x + lean} 34 ${x + lean * 1.4} 62 ${x + lean * 1.1} 94`}
                stroke="oklch(0.3 0.05 48)"
                strokeWidth={4.2 - i * 0.5}
                strokeLinecap="round"
                opacity="0.42"
              />
              {/* the lip of raised fibre catching the light */}
              <path
                d={`M${x + 2.6} 8 C${x + lean + 2.6} 35 ${x + lean * 1.4 + 2.6} 62 ${x + lean * 1.1 + 2.6} 92`}
                stroke="oklch(0.93 0.02 88)"
                strokeWidth="1.1"
                strokeLinecap="round"
                opacity="0.5"
              />
            </g>
          );
        })}
      </svg>
    </span>
  );
}

const DREAD_WORDS = [
  "deceased",
  "do not open",
  "condemned",
  "missing",
  "no next of kin",
  "sealed 1902",
  "do not file",
  "returned unopened",
  "last entry",
  "withdrawn",
];

/**
 * The stamp that ends a file. Heavier ink than the ordinary stamps in
 * PaperScatter, and always in the dried-blood red.
 */
export function DreadStamp({ seed = "dread", word, size = "md", className, style }) {
  const text = word ?? DREAD_WORDS[Math.floor(jitterFor(seed, "d") * DREAD_WORDS.length) % DREAD_WORDS.length];
  const sizes = {
    sm: "text-[11px] px-2 py-0.5 border-2",
    md: "text-[15px] px-3 py-1 border-[3px]",
    lg: "text-[22px] px-4 py-1.5 border-4",
  };

  return (
    <span
      aria-hidden="true"
      className={cn(
        "stamp-impression pointer-events-none absolute select-none whitespace-nowrap",
        "rounded-[2px] border-double font-display font-bold uppercase tracking-[0.2em]",
        "border-[oklch(0.36_0.15_27)] text-[oklch(0.34_0.15_27)] opacity-[0.55]",
        sizes[size] ?? sizes.md,
        className,
      )}
      style={{ transform: `rotate(${tiltFor(seed + "|s", 16)}deg)`, ...style }}
    >
      {text}
    </span>
  );
}

/** A stain of old blood soaked through a surface. */
export function BloodStain({ spatter = true, className }) {
  return (
    <>
      <span aria-hidden="true" className={cn("blood-soak", className)} />
      {spatter && <span aria-hidden="true" className="blood-spatter" />}
    </>
  );
}
