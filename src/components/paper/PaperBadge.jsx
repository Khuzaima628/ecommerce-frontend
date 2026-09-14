import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-paper-3 text-ink-3 border-paper-edge",
  red: "bg-ink-red/12 text-ink-red border-ink-red/45",
  green: "bg-ink-green/12 text-ink-green border-ink-green/45",
  blue: "bg-ink-blue/12 text-ink-blue border-ink-blue/45",
  kraft: "bg-kraft/14 text-kraft border-kraft/50",
  orange: "bg-muted-orange/16 text-kraft border-muted-orange/50",
};

export default function PaperBadge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[2px] border px-2 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.1em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
