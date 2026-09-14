import PaperStamp from "../paper/PaperStamp.jsx";

export default function AuthShowcase({ variant = "welcome" }) {
  const title = variant === "accounts" ? (
    <>
      Choose a place,
      <br />
      then begin.
    </>
  ) : (
    <>
      A better sort
      <br />
      of market.
    </>
  );

  return (
    <aside className="relative hidden min-h-[42rem] overflow-hidden bg-ink-2 px-7 py-9 text-paper-1 shadow-lift [clip-path:polygon(0_1%,98%_0,100%_3%,99%_97%,96%_100%,2%_98%,0_94%)] sm:px-10 lg:block">
      <span aria-hidden="true" className="paper-grain opacity-15" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-paper-1/65">
              The Paper Desk
            </p>
            <h2 className="mt-2 font-hand text-6xl leading-[0.82] text-paper-1">{title}</h2>
          </div>
          <img
            src="/58dfe6a3-3c4d-4f86-a077-0377ed7d4c31_removalai_preview.png"
            alt=""
            className="h-20 w-20 rotate-[8deg] object-contain opacity-90"
          />
        </div>

        <div className="my-auto py-12">
          <p className="max-w-md font-display text-xl italic leading-relaxed text-paper-1/80">
            Handmade goods, small stubborn tools, and the makers who still care how things feel
            in the hand.
          </p>
          <div className="mt-8 border-y border-paper-1/25 py-4">
            <p className="font-hand text-3xl text-paper-1/90">
              “The best desk has room for one more idea.”
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-dashed border-paper-1/25 pt-4">
          <p className="font-hand text-2xl leading-none text-paper-1/75">
            Open daily · filed carefully
          </p>
          <PaperStamp tone="kraft">Est. 1984</PaperStamp>
        </div>
      </div>
    </aside>
  );
}
