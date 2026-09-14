import { cn } from "@/lib/utils";
import PaperLeaf from "./PaperLeaf.jsx";
import PaperScatter from "./PaperScatter.jsx";
import PaperSeal from "./PaperSeal.jsx";
import { Marginalia, FolioMark } from "./PaperMarginalia.jsx";

/** Page masthead — handwritten title on a torn strip of paper. */
export default function PaperHeader({ eyebrow, title, description, actions, className }) {
  return (
    <div
      className={cn(
        "torn-bottom relative mb-6 bg-paper-2 px-5 pb-8 pt-5 shadow-sheet sm:px-7",
        className,
      )}
    >
      {/* the whole wear stack in one blended pass — see aged-panel */}
      <span aria-hidden="true" className="aged-panel" />
      <span
        aria-hidden="true"
        className="fold-line absolute inset-y-0 left-1/3 w-6 opacity-60"
      />
      <span
        aria-hidden="true"
        className="tape-strip absolute top-0 right-10 h-6 w-20 rotate-[5deg]"
      />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-6 right-4 opacity-60">
        <PaperLeaf seed={`hdr-${title}`} tone="sepia" size={78} />
      </span>
      <PaperSeal
        seed={`hdr-seal-${title}`}
        size={54}
        className="absolute bottom-3 left-5 opacity-90 sm:left-7"
      />
      <Marginalia seed={`hdr-note-${title}`} className="right-6 top-2" />
      <FolioMark seed={`hdr-folio-${title}`} className="bottom-9 right-6" />
      <PaperScatter seed={`hdr-${title}`} count={3} className="opacity-60" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.24em] text-kraft">
              {eyebrow}
            </p>
          )}
          <h1 className="ink-bleed font-hand text-4xl leading-none text-ink-1 sm:text-5xl">{title}</h1>
          {description && (
            <p className="mt-2 max-w-xl text-sm text-ink-3">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
