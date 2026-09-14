import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { tiltFor } from "../../lib/paper.js";
import PaperSeal from "./PaperSeal.jsx";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

/** The one modal in the app: a sheet dropped onto the corkboard desk. */
export default function PaperModal({
  open,
  onClose,
  title,
  description,
  footer,
  tone = "paper",
  size = "md",
  children,
}) {
  const sheetRef = useRef(null);
  const restoreRef = useRef(null);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !sheetRef.current) return;
      const nodes = Array.from(sheetRef.current.querySelectorAll(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null,
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      const node = sheetRef.current?.querySelector(FOCUSABLE);
      (node || sheetRef.current)?.focus();
    }, 20);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const tilt = tiltFor(title || "modal", 1.1);
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-3xl" };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-10"
      onKeyDown={onKeyDown}
    >
      {/* corkboard backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-desk/70 backdrop-blur-[1px]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
        }}
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "animate-paper-in paper-surface relative w-full rounded-[2px] shadow-modal outline-none",
          tone === "warning" ? "torn-edges bg-paper-2" : "fold-corner",
          widths[size],
        )}
        style={{ "--tilt": `${tilt}deg`, transform: `rotate(${tilt}deg)` }}
      >
        <span aria-hidden="true" className="paper-grain" />
        <span aria-hidden="true" className="wrinkle-field opacity-40" />
        <span aria-hidden="true" className="crack-deep opacity-30" />
        <span aria-hidden="true" className="crack-field opacity-35" />
        <span aria-hidden="true" className="foxing opacity-45" />
        <span aria-hidden="true" className="edge-wear" />
        {/* strip of tape holding the sheet down */}
        <span
          aria-hidden="true"
          className="tape-strip absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 opacity-90"
        />
        {/* wax seal on the corner of anything that needs signing off */}
        <PaperSeal seed={`modal-${title}`} size={62} className="absolute -right-5 -top-5" />
        <div className="relative">
          <header className="flex items-start justify-between gap-4 border-b border-dashed border-paper-edge px-5 pb-3 pt-6">
            <div>
              <h2 className="font-hand text-3xl leading-none text-ink-1">{title}</h2>
              {description && <p className="mt-1.5 text-sm text-ink-3">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-[2px] border border-paper-edge bg-paper-2 px-2 py-1 font-body text-xs font-bold uppercase tracking-widest text-ink-3 transition-all hover:-rotate-2 hover:bg-paper-3 active:scale-95"
            >
              Close ✕
            </button>
          </header>
          <div className="px-5 py-4">{children}</div>
          {footer && (
            <footer className="flex flex-wrap justify-end gap-2 border-t border-dashed border-paper-edge px-5 py-3">
              {footer}
            </footer>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
