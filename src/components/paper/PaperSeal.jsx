import { cn } from "@/lib/utils";
import { tiltFor, jitterFor } from "../../lib/paper.js";

/**
 * A blob of red sealing wax pressed onto the page.
 *
 * The four dies live in /public/decor. They were supplied as JPEGs with
 * a checkerboard painted in where the transparency should have been, so
 * they have been re-cut as PNGs with a real alpha channel — dropping the
 * JPEGs straight in would have put a grey chequered square on the paper.
 *
 * Decorative by default: aria-hidden, non-interactive, and it never
 * carries meaning on its own. Pass `label` only when the seal genuinely
 * stands in for a word (a signed-off order, say) and the word is not
 * already written next to it.
 */

export const SEAL_DIES = ["rose", "crest", "script", "plain"];

const SRC = {
  rose: "/decor/seal-rose.png",
  crest: "/decor/seal-crest.png",
  script: "/decor/seal-script.png",
  plain: "/decor/seal-plain.png",
};

export default function PaperSeal({
  die,
  seed = "seal",
  size = 72,
  label,
  className,
  style,
}) {
  const pick = die ?? SEAL_DIES[Math.floor(jitterFor(seed, "die") * SEAL_DIES.length) % SEAL_DIES.length];
  const angle = tiltFor(seed + "|seal", 14);

  return (
    <img
      src={SRC[pick] ?? SRC.plain}
      alt={label ?? ""}
      aria-hidden={label ? undefined : "true"}
      loading="lazy"
      decoding="async"
      width={size}
      height={size}
      className={cn(
        "pointer-events-none block select-none",
        "[filter:drop-shadow(0_2px_3px_oklch(0.3_0.03_70/0.4))_saturate(0.92)]",
        className,
      )}
      style={{ width: size, height: size, transform: `rotate(${angle}deg)`, ...style }}
    />
  );
}
