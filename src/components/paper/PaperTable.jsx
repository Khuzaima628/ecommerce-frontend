import { cn } from "@/lib/utils";
import PaperCard from "./PaperCard.jsx";

/**
 * Ledger-style table on wide screens; stacked paper slips on narrow ones.
 * columns: [{ key, header, render(row), hideOnMobile }]
 */
export default function PaperTable({ columns, rows, keyOf, caption, className }) {
  return (
    <div className={cn("relative", className)}>
      {/* ledger margin rule — the red line ruled down every day book */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1.5 hidden w-px bg-ink-red/25 md:block"
      />
      <table className="hidden w-full border-collapse text-left text-sm md:table">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b-2 border-double border-paper-edge">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className="px-3 py-2 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-kraft"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={keyOf(row)}
              className={cn(
                "border-b border-dashed border-paper-edge align-middle transition-colors hover:bg-paper-2/70",
                i % 2 === 1 && "bg-paper-2/35",
              )}
            >
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-3 text-ink-2">
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={keyOf(row)}>
            <PaperCard tiltId={keyOf(row)} tiltRange={0.8} className="bg-paper-2">
              <dl className="space-y-2">
                {columns.map((c) => (
                  <div key={c.key} className="flex flex-wrap items-center justify-between gap-2">
                    <dt className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-kraft">
                      {c.header}
                    </dt>
                    <dd className="text-right text-sm text-ink-2">{c.render(row)}</dd>
                  </div>
                ))}
              </dl>
            </PaperCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
