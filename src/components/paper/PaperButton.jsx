import { cn } from "@/lib/utils";

const variants = {
  stamp:
    "bg-ink-2 text-paper-1 border-ink-2 hover:bg-ink-3 shadow-sheet [text-shadow:0_1px_0_rgba(0,0,0,0.25)]",
  tag: "bg-paper-2 text-ink-2 border-paper-edge hover:bg-paper-3 shadow-sheet",
  kraft: "bg-kraft text-paper-1 border-kraft hover:brightness-110 shadow-sheet",
  danger: "bg-ink-red text-paper-1 border-ink-red hover:brightness-110 shadow-sheet",
  ghost: "bg-transparent text-ink-3 border-transparent hover:bg-paper-3 hover:border-paper-edge",
};

const sizes = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-2.5 text-base",
};

/** Pressed-paper button. Disabled reads as a faded paper tag, never a browser grey. */
export default function PaperButton({
  variant = "tag",
  size = "md",
  className,
  disabled = false,
  type = "button",
  as: Tag = "button",
  children,
  ...rest
}) {
  return (
    <Tag
      type={Tag === "button" ? type : undefined}
      disabled={Tag === "button" ? disabled : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "relative inline-flex select-none items-center justify-center gap-2 rounded-[2px] border font-body font-semibold uppercase tracking-[0.08em]",
        "transition-all duration-150 ease-out",
        sizes[size],
        variants[variant],
        !disabled &&
          "hover:-translate-y-[1px] hover:rotate-[-0.4deg] active:translate-y-0 active:scale-[0.97] active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)]",
        disabled &&
          "pointer-events-none cursor-not-allowed border-dashed border-paper-edge bg-paper-3 text-ink-faint opacity-70 shadow-none",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
