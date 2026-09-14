import { cn } from "@/lib/utils";
import { ORDER_STAGES, stageOf } from "../../context/DataContext.jsx";
import PaperStamp from "./PaperStamp.jsx";

const LABELS = { pending: "Pending", paid: "Paid", shipped: "Shipped", delivered: "Delivered" };
const STATE_WORD = { done: "done", active: "current", ahead: "not yet" };

function Marker({ state, index }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-bold",
        state === "done" && "border-ink-green bg-paper-2 text-ink-green shadow-sheet",
        state === "active" &&
          "h-11 w-11 -rotate-6 border-double border-[3px] border-kraft bg-paper-1 text-base text-kraft shadow-sheet animate-wet-ink",
        state === "ahead" && "border-dashed border-paper-edge bg-paper-3/60 text-ink-faint",
      )}
    >
      {state === "done" ? "✓" : index + 1}
    </span>
  );
}

/**
 * The order's journey as one line of rubber-stamped stops.
 * Cancelled orders are shown as a branch end-state, not squeezed onto the line.
 */
export default function PaperStepper({ order, role, onAdvance, onCancel }) {
  if (!order) return null;

  if (order.status === "cancelled") {
    return (
      <div className="torn-edges relative bg-paper-2 px-4 py-4 shadow-sheet">
        <span aria-hidden="true" className="paper-grain opacity-40" />
        <div className="relative flex flex-wrap items-center gap-3">
          <PaperStamp tone="red">cancelled</PaperStamp>
          <p className="font-hand text-xl leading-none text-ink-faint">
            This docket left the line — the journey ended here.
          </p>
        </div>
      </div>
    );
  }

  const current = stageOf(order);
  const closed = order.status === "delivered";
  const canCancel = !closed && current <= 1;

  return (
    <div className="relative">
      <ol className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-0">
        {ORDER_STAGES.map((stage, i) => {
          const state = i < current ? "done" : i === current ? "active" : "ahead";
          const sellerCanAdvance = role === "seller" && !closed && i === current + 1;
          const interactive = sellerCanAdvance;
          const reason =
            role === "seller" && !closed && i > current + 1
              ? i === current + 2
                ? `Mark ${LABELS[ORDER_STAGES[current + 1]].toLowerCase()} first`
                : "Work through the stages in order"
              : null;

          return (
            <li key={stage} className="flex flex-1 items-start gap-3 sm:flex-col sm:items-center">
              <div className="flex items-center gap-0 sm:w-full">
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden h-px flex-1 sm:block",
                    i === 0 && "invisible",
                    i <= current
                      ? "bg-ink-2/70"
                      : "bg-[repeating-linear-gradient(to_right,var(--paper-edge)_0_6px,transparent_6px_12px)]",
                  )}
                />
                {interactive ? (
                  <button
                    type="button"
                    onClick={() => onAdvance?.(i)}
                    className="rounded-full focus-visible:outline-2"
                  >
                    <Marker state={state} index={i} />
                    <span className="sr-only">Mark order as {LABELS[stage]}</span>
                  </button>
                ) : (
                  <Marker state={state} index={i} />
                )}
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden h-px flex-1 sm:block",
                    i === ORDER_STAGES.length - 1 && "invisible",
                    i < current
                      ? "bg-ink-2/70"
                      : "bg-[repeating-linear-gradient(to_right,var(--paper-edge)_0_6px,transparent_6px_12px)]",
                  )}
                />
              </div>

              <div className="min-w-0 sm:mt-1 sm:text-center">
                <p
                  className={cn(
                    "font-body text-xs font-bold uppercase tracking-[0.12em]",
                    state === "ahead" ? "text-ink-faint" : "text-ink-2",
                  )}
                >
                  {LABELS[stage]}
                </p>
                <p className="font-hand text-base leading-none text-ink-faint">
                  {STATE_WORD[state]}
                  {sellerCanAdvance && " · click to stamp"}
                </p>
                {reason && (
                  <p className="mt-1 -rotate-[0.8deg] font-hand text-base leading-tight text-ink-red/80">
                    ↳ {reason}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-dashed border-paper-edge pt-3">
        {closed ? (
          <p className="font-hand text-lg text-ink-faint">
            Delivered — this record is closed and can no longer be changed.
          </p>
        ) : canCancel ? (
          <button
            type="button"
            onClick={() => onCancel?.()}
            className="rounded-[2px] border border-dashed border-ink-red/60 bg-paper-2 px-3 py-1 font-body text-xs font-bold uppercase tracking-[0.1em] text-ink-red transition-colors hover:bg-ink-red/10"
          >
            Cancel this order
          </button>
        ) : (
          <p className="font-hand text-lg text-ink-faint">
            Already shipped — cancelling is no longer possible.
          </p>
        )}
      </div>
    </div>
  );
}
