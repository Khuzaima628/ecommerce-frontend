import { cn } from "@/lib/utils";

const tones = {
  red: "text-ink-red border-ink-red",
  green: "text-ink-green border-ink-green",
  blue: "text-ink-blue border-ink-blue",
  kraft: "text-kraft border-kraft",
  ink: "text-ink-2 border-ink-2",
};

/** Rubber-stamp impression. The word itself carries the meaning, not the colour. */
export default function PaperStamp({ tone = "red", className, children, animate = false }) {
  return (
    <span
      className={cn(
        "inline-block rotate-[-7deg] rounded-[3px] border-2 border-double px-2 py-0.5",
        "font-display text-[11px] font-bold uppercase tracking-[0.18em] opacity-85",
        tones[tone],
        animate && "animate-stamp-in",
        className,
      )}
    >
      {children}
    </span>
  );
}
