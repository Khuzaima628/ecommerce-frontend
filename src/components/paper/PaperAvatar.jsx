import { cn } from "@/lib/utils";
import { tiltFor } from "../../lib/paper.js";

/**
 * A portrait mounted on the page with photo corners — the same
 * treatment used on the personal file in ProfilePage, in a size that
 * fits the sidebar.
 *
 * `src` is optional: the seed data carries initials rather than image
 * files, so the initial is the default portrait.
 */

const SIZES = {
  sm: { frame: "p-1.5", box: "h-9 w-9", type: "text-2xl", corner: "h-2 w-2" },
  md: { frame: "p-2", box: "h-12 w-12", type: "text-3xl", corner: "h-2.5 w-2.5" },
  lg: { frame: "p-2.5", box: "h-16 w-16", type: "text-4xl", corner: "h-3 w-3" },
};

export default function PaperAvatar({
  initial = "?",
  src,
  alt = "",
  size = "md",
  seed,
  tape = false,
  className,
}) {
  const s = SIZES[size] ?? SIZES.md;
  const tilt = tiltFor(seed ?? initial, 2.4);

  return (
    <span className={cn("relative inline-block shrink-0", className)}>
      {tape && (
        <span
          aria-hidden="true"
          className="tape-strip absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-[-5deg]"
        />
      )}
      <span
        className={cn(
          "relative block border border-paper-edge bg-paper-2 shadow-lift",
          s.frame,
        )}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <span aria-hidden="true" className="paper-grain opacity-40" />
        {src ? (
          <img
            src={src}
            alt={alt}
            className={cn(
              "relative block border-2 border-double border-kraft object-cover saturate-[0.7]",
              s.box,
            )}
          />
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              "relative flex items-center justify-center border-2 border-double border-kraft bg-paper-1",
              "font-hand leading-none text-kraft",
              s.box,
              s.type,
            )}
          >
            {initial}
          </span>
        )}
        {["-left-0.5 -top-0.5", "-right-0.5 -top-0.5", "-bottom-0.5 -left-0.5", "-bottom-0.5 -right-0.5"].map(
          (pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={cn("absolute border border-paper-edge/70 bg-paper-3/85", pos, s.corner)}
            />
          ),
        )}
      </span>
    </span>
  );
}
