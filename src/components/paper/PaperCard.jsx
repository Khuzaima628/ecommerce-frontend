import { cn } from "@/lib/utils";
import { tiltFor, jitterFor } from "../../lib/paper.js";
import { Pushpin } from "./PaperBoardKit.jsx";

/**
 * A single sheet of paper. Tilt is derived from `tiltId` so a card never
 * jumps to a new angle between renders.
 */
export default function PaperCard({
  tiltId,
  tiltRange = 1.2,
  as: Tag = "div",
  className,
  children,
  layered = false,
  foldCorner = false,
  interactive = false,
  pin,
  style,
  ...rest
}) {
  const tilt = tiltId ? tiltFor(tiltId, tiltRange) : 0;
  // Roughly one card in three gets a pin, so a grid never looks stamped out.
  const pinned = pin ?? (tiltId ? jitterFor(tiltId, "pin") < 0.34 : false);
  // About one sheet in five is never quite still. Kept rare and very
  // small — the point is that you are not sure you saw it.
  const breathes = tiltId ? jitterFor(tiltId, "breathe") < 0.2 : false;

  return (
    <div
      className={cn("relative", breathes && "animate-breathe-sheet")}
      style={{
        transform: `rotate(${tilt}deg)`,
        "--tilt": `${tilt}deg`,
        "--breathe-duration": `${7 + Math.round(jitterFor(tiltId ?? "s", "bd") * 6)}s`,
        "--breathe-delay": `-${Math.round(jitterFor(tiltId ?? "s", "bdl") * 8)}s`,
      }}
    >
      {layered && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-[3px] translate-y-[4px] rotate-[0.7deg] border border-paper-edge bg-paper-3 shadow-sheet"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-[1px] translate-y-[2px] -rotate-[0.4deg] border border-paper-edge bg-paper-2"
          />
        </>
      )}
      <Tag
        className={cn(
          "paper-surface relative rounded-[2px] p-4 transition-all duration-200",
          foldCorner && "fold-corner",
          interactive &&
            "hover:-translate-y-0.5 hover:shadow-lift focus-within:-translate-y-0.5 focus-within:shadow-lift",
          className,
        )}
        style={style}
        {...rest}
      >
        {/*
          One composite layer, not six.

          A card is the most-repeated surface in the app — a catalog
          renders twenty of them — and every separate `mix-blend-mode`
          layer forces the compositor to re-read the backdrop. Six
          blended layers per card was costing far more than it showed,
          so the whole stack is baked into a single painted element.
        */}
        <span aria-hidden="true" className="aged-sheet rounded-[2px]" />
        {/* every third card or so is pinned rather than just resting */}
        {pinned && <Pushpin seed={`card-${tiltId ?? "sheet"}`} size={10} className="-left-1 -top-1" />}
        <div className="relative">{children}</div>
      </Tag>
    </div>
  );
}
