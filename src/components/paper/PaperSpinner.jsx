import { cn } from "@/lib/utils";

/** Ink blot spreading on paper — used for every simulated async pause. */
export default function PaperSpinner({ label = "Working…", className, size = 22 }) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-2 text-ink-3", className)}>
      <span
        aria-hidden="true"
        className="inline-block rounded-full border-2 border-dashed border-kraft border-t-ink-red"
        style={{ width: size, height: size, animation: "ink-spin 900ms linear infinite" }}
      />
      <span className="font-hand text-lg leading-none">{label}</span>
    </span>
  );
}
