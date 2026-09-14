import { cn } from "@/lib/utils";
import { jitterFor, tiltFor } from "../../lib/paper.js";
import PaperLeaf, { SPECIMEN_NAMES } from "./PaperLeaf.jsx";
import PaperSeal from "./PaperSeal.jsx";

/**
 * A decorative litter layer: faded stamps, pressed leaves, ink blots,
 * coffee rings, pins and paperclips strewn across a surface.
 *
 * Placement is deliberately irregular — positions come from a hash of
 * `seed` rather than an even grid — but it is deterministic, so the
 * mess is identical on the server and the client and never reshuffles
 * on re-render.
 *
 * The whole layer is aria-hidden and pointer-events:none. It renders
 * behind content, so it can never cover or block anything.
 */

const WORDS = [
  "filed",
  "paid",
  "seen",
  "entered",
  "desk copy",
  "received",
  "no. 41",
  "duplicate",
  "settled",
  "checked",
  "posted",
  "in order",
];

const KINDS = ["stamp", "leaf", "round", "blot", "ring", "pin", "clip", "leaf", "seal", "stamp", "scribble"];

const TONES = ["kraft", "sepia", "ink", "red", "green"];

const TONE_CLASS = {
  kraft: "text-kraft border-kraft",
  sepia: "text-sepia border-sepia",
  ink: "text-ink-faint border-ink-faint",
  red: "text-ink-red border-ink-red",
  green: "text-ink-green border-ink-green",
};

/** Word stamp, pressed crooked and unevenly inked. */
function DecorStamp({ seed, tone }) {
  const word = WORDS[Math.floor(jitterFor(seed, "w") * WORDS.length) % WORDS.length];
  const scale = 0.8 + jitterFor(seed, "sc") * 0.85;
  return (
    <span
      className={cn(
        "stamp-impression inline-block whitespace-nowrap rounded-[3px] border-2 border-double px-2.5 py-1",
        "font-display text-[13px] font-bold uppercase tracking-[0.22em]",
        TONE_CLASS[tone],
      )}
      style={{ transform: `scale(${scale.toFixed(2)})` }}
    >
      {word}
    </span>
  );
}

/** Round postal cancellation. */
function DecorRoundStamp({ seed, tone }) {
  const size = 58 + Math.round(jitterFor(seed, "rs") * 34);
  const year = 1890 + Math.floor(jitterFor(seed, "yr") * 40);
  return (
    <span
      className={cn(
        "stamp-impression flex items-center justify-center rounded-full border-2",
        TONE_CLASS[tone],
      )}
      style={{ width: size, height: size }}
    >
      <span
        className={cn(
          "flex h-[78%] w-[78%] flex-col items-center justify-center gap-[1px] rounded-full border border-dashed",
          "font-display text-[8px] font-bold uppercase leading-none tracking-[0.1em]",
        )}
      >
        <span>the</span>
        <span className="text-[9px]">paper</span>
        <span className="tracking-[0.18em]">{year}</span>
      </span>
    </span>
  );
}

/** Bent paperclip. */
function DecorClip({ seed }) {
  const size = 26 + Math.round(jitterFor(seed, "cl") * 16);
  return (
    <svg
      viewBox="0 0 40 90"
      width={size}
      height={size * 2.2}
      className="text-ink-faint/55"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
    >
      <path d="M28 74 L28 20 C28 9 12 9 12 20 L12 70 C12 82 32 82 32 70 L32 26" />
    </svg>
  );
}

/** A few looping pen marks — someone testing whether the nib still works. */
function DecorScribble({ seed }) {
  const size = 46 + Math.round(jitterFor(seed, "sb") * 30);
  return (
    <svg
      viewBox="0 0 100 50"
      width={size * 1.7}
      height={size}
      className="text-ink-blue/35"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M4 34 C14 8 22 44 32 20 C40 2 46 40 56 26 C64 15 70 38 82 22 C88 14 92 24 96 20" />
      <path d="M10 44 C26 38 44 46 62 40 C74 36 84 42 94 38" strokeOpacity="0.6" />
    </svg>
  );
}

export default function PaperScatter({ seed = "desk", count = 7, className }) {
  const items = Array.from({ length: count }, (_, i) => {
    const s = `${seed}#${i}`;
    const kind = KINDS[Math.floor(jitterFor(s, "k") * KINDS.length) % KINDS.length];
    const tone = TONES[Math.floor(jitterFor(s, "t") * TONES.length) % TONES.length];

    // Push items toward the margins so the middle of a surface stays
    // legible: the horizontal band is biased to the outer thirds.
    const hx = jitterFor(s, "x");
    const left = hx < 0.5 ? hx * 0.26 : 0.74 + (hx - 0.5) * 0.52;
    const top = jitterFor(s, "y") * 0.88 + 0.02;

    return {
      key: s,
      kind,
      tone,
      style: {
        left: `${(left * 100).toFixed(1)}%`,
        top: `${(top * 100).toFixed(1)}%`,
        transform: `rotate(${tiltFor(s + "|r", 26)}deg)`,
      },
    };
  });

  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 select-none overflow-hidden", className)}
    >
      {items.map(({ key, kind, tone, style }) => (
        <span key={key} className="absolute" style={style}>
          {kind === "stamp" && <DecorStamp seed={key} tone={tone} />}
          {kind === "round" && <DecorRoundStamp seed={key} tone={tone} />}
          {kind === "leaf" && (
            <PaperLeaf
              seed={key}
              tone={tone === "red" ? "sepia" : tone}
              size={48 + Math.round(jitterFor(key, "lz") * 54)}
              specimen={SPECIMEN_NAMES[Math.floor(jitterFor(key, "ls") * SPECIMEN_NAMES.length) % SPECIMEN_NAMES.length]}
              className="opacity-70"
            />
          )}
          {kind === "blot" && (
            <span
              className="ink-blot block"
              style={{
                width: 14 + Math.round(jitterFor(key, "bz") * 26),
                height: 14 + Math.round(jitterFor(key, "bz") * 26),
                opacity: 0.14,
              }}
            />
          )}
          {kind === "ring" && (
            <span
              className="coffee-ring block"
              style={{
                width: 54 + Math.round(jitterFor(key, "rz") * 52),
                height: 54 + Math.round(jitterFor(key, "rz") * 52),
                opacity: 0.6,
              }}
            />
          )}
          {kind === "pin" && (
            <span
              className="rust-pin block"
              style={{
                width: 9 + Math.round(jitterFor(key, "pz") * 7),
                height: 9 + Math.round(jitterFor(key, "pz") * 7),
                opacity: 0.7,
              }}
            />
          )}
          {kind === "seal" && (
            <PaperSeal seed={key} size={38 + Math.round(jitterFor(key, "sz") * 30)} className="opacity-80" />
          )}
          {kind === "clip" && <DecorClip seed={key} />}
          {kind === "scribble" && <DecorScribble seed={key} />}
        </span>
      ))}
    </span>
  );
}
