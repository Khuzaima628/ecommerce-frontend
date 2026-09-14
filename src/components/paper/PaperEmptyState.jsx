import { cn } from "@/lib/utils";

/** Blank torn slip used wherever a list has nothing on it. */
export default function PaperEmptyState({ title, hint, action, className }) {
  return (
    <div
      className={cn(
        "torn-edges relative mx-auto w-full max-w-md bg-paper-2 px-6 py-10 text-center shadow-sheet",
        className,
      )}
    >
      <span aria-hidden="true" className="paper-grain" />
      <div className="relative">
        <span aria-hidden="true" className="mb-2 block font-hand text-3xl text-ink-faint">
          ~ nothing on this part of the desk ~
        </span>
        <h3 className="font-display text-lg text-ink-2">{title}</h3>
        {hint && <p className="mx-auto mt-1 max-w-xs text-sm text-ink-faint">{hint}</p>}
        {action && <div className="mt-4 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
