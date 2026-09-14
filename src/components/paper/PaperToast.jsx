import { cn } from "@/lib/utils";
import { useToast } from "../../context/ToastContext.jsx";
import { tiltFor } from "../../lib/paper.js";

const tones = {
  kraft: "bg-paper-2 text-ink-2 border-kraft/45",
  warning: "bg-paper-2 text-ink-red border-ink-red/50",
};

function Note({ toast, onDismiss, index }) {
  const tilt = tiltFor(toast.id, 1.6);
  return (
    <li
      className={cn(
        "torn-bottom pointer-events-auto relative w-[19rem] max-w-[calc(100vw-2rem)] border px-4 pb-6 pt-3 shadow-lift",
        tones[toast.tone],
        toast.leaving ? "animate-lift-away" : "animate-peel-in",
      )}
      style={{
        "--toast-tilt": `${tilt}deg`,
        transform: `rotate(${tilt}deg) translateX(${index * -4}px)`,
      }}
    >
      <span aria-hidden="true" className="paper-grain opacity-40" />
      <span
        aria-hidden="true"
        className="absolute -top-2 left-1/2 h-4 w-16 -translate-x-1/2 rotate-[-3deg] border border-paper-edge/60 bg-paper-1/80 shadow-sheet"
      />
      <div className="relative flex items-start gap-3">
        <p className="flex-1 font-body text-sm font-semibold leading-snug">{toast.message}</p>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notice"
          className="-mr-1 -mt-1 rounded-[2px] px-1.5 font-display text-base font-bold leading-none text-ink-faint transition-colors hover:text-ink-red"
        >
          ✕
        </button>
      </div>
      {toast.note && (
        <p className="relative mt-1 font-hand text-lg leading-tight text-ink-faint">{toast.note}</p>
      )}
    </li>
  );
}

/** Fixed pile of sticky notes. Informational only — never traps focus. */
export default function PaperToastViewport() {
  const { toasts, dismiss } = useToast();
  if (toasts.length === 0) return null;
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex justify-end"
    >
      <ul className="flex flex-col-reverse items-end gap-2">
        {toasts.map((t, i) => (
          <Note key={t.id} toast={t} index={i} onDismiss={dismiss} />
        ))}
      </ul>
    </div>
  );
}
