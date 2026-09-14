import { cn } from "@/lib/utils";
import PaperScatter from "./PaperScatter.jsx";
import { DividerTab, Pushpin, Staple } from "./PaperBoardKit.jsx";
import { Marginalia } from "./PaperMarginalia.jsx";

/** A larger sheet used for page sections. Optional torn bottom edge. */
export default function PaperPanel({
  title,
  subtitle,
  actions,
  torn = false,
  scatter = true,
  className,
  bodyClassName,
  children,
}) {
  return (
    <section
      className={cn(
        "paper-surface relative rounded-[2px]",
        torn && "torn-bottom pb-8",
        className,
      )}
    >
      {/*
        Grain, cracks, foxing, fold, damp and thumbed edges in a single
        blended pass. This was ten separate `mix-blend-mode` layers, and
        a page renders several panels — each blended layer forces the
        compositor to re-read its backdrop, so the cost multiplied.
      */}
      <span aria-hidden="true" className="aged-panel rounded-[2px]" />
      {scatter && <PaperScatter seed={`panel-${title ?? "sheet"}`} count={2} className="opacity-60" />}

      {/*
        The index tab and the pin sit outside the panel's box, so they
        are only drawn on untorn panels — `torn-bottom` is a clip-path,
        and a clip-path would slice anything hanging over the edge.
      */}
      {!torn && title && (
        <>
          <DividerTab
            label={title.slice(0, 12)}
            seed={`tab-${title}`}
            className="-top-[21px] right-8"
          />
          <Pushpin seed={`panel-pin-${title}`} size={11} className="-left-1.5 -top-1.5" />
          <Staple seed={`panel-staple-${title}`} length={15} className="-right-1 bottom-3" />
        </>
      )}

      <Marginalia seed={`panel-note-${title ?? "sheet"}`} className="bottom-2 right-4" />

      <div className="relative">
        {(title || actions) && (
          <header className="flex flex-wrap items-end justify-between gap-3 border-b border-dashed border-paper-edge px-4 py-3 sm:px-6">
            <div>
              {title && <h2 className="font-display text-xl text-ink-2">{title}</h2>}
              {subtitle && <p className="mt-0.5 text-sm text-ink-faint">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </header>
        )}
        <div className={cn("px-4 py-4 sm:px-6", bodyClassName)}>{children}</div>
      </div>
    </section>
  );
}
