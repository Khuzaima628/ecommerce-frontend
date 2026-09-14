import { cn } from "@/lib/utils";

/** A punched paper price/label tag hung on a bit of string. */
export default function PaperTag({ className, children }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center rounded-[2px] border border-paper-edge bg-paper-2 py-1 pl-5 pr-3 font-display text-sm font-semibold text-ink-2 shadow-sheet",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute left-1.5 h-2 w-2 rounded-full border border-paper-edge bg-desk/40"
      />
      {children}
    </span>
  );
}
