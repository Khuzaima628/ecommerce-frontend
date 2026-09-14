import { Link } from "@tanstack/react-router";
import { useData } from "../context/DataContext.jsx";
import { useSession, HOME_FOR_ROLE } from "../context/SessionContext.jsx";
import { money } from "../lib/paper.js";
import PaperCard from "../components/paper/PaperCard.jsx";
import PaperButton from "../components/paper/PaperButton.jsx";
import PaperStamp from "../components/paper/PaperStamp.jsx";
import PaperTag from "../components/paper/PaperTag.jsx";
import PaperBadge from "../components/paper/PaperBadge.jsx";

export default function LandingPage() {
  const { catalogProducts, users, orders } = useData();
  const { currentUser } = useSession();

  const makers = new Set(catalogProducts.map((p) => p.sellerId)).size;
  const categories = new Set(catalogProducts.map((p) => p.category)).size;
  const featured = [...catalogProducts]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.stock - a.stock)
    .slice(0, 4);

  const start = currentUser ? HOME_FOR_ROLE[currentUser.role] : "/login";

  return (
    <div className="space-y-10">
      {/* ---------------- hero: a collage pinned to the desk ---------------- */}
      <section className="relative">
        <div className="torn-hero crumple-deep relative bg-paper-1 px-5 pb-14 pt-12 sm:px-12 sm:pb-20 sm:pt-16">
          <span aria-hidden="true" className="paper-grain opacity-60" />
          <span aria-hidden="true" className="aged-wash" />

          {/* decorative marks, sparingly */}
          <span
            aria-hidden="true"
            className="absolute right-7 top-9 h-48 w-48 "
          >
            <img
              src="/58dfe6a3-3c4d-4f86-a077-0377ed7d4c31_removalai_preview.png"
              alt=""
              className="h-full w-full "
            />
            <span className="hidden flex h-[calc(100%-12px)] w-[calc(100%-12px)] flex-col items-center justify-center rounded-[46%_54%_50%_50%/50%_45%_55%_50%] border-2 border-[#d7b88b]/35 px-2 shadow-[inset_0_0_0_2px_rgba(35,5,8,0.3),inset_2px_2px_4px_rgba(255,190,160,0.15)]">
              <span className="font-body text-[7px] font-bold uppercase tracking-[0.2em] text-[#e0c397]/75">
                The Paper Desk
              </span>
              <span className="my-0.5 text-[9px] leading-none text-[#e0c397]/60">✦</span>
              <span className="font-hand text-4xl font-bold leading-none text-[#e0c397]/90 sm:text-5xl">PD</span>
              <span className="mt-0.5 h-px w-8 bg-[#e0c397]/45" />
              <span className="mt-1 font-body text-[6px] font-bold uppercase tracking-[0.16em] text-[#e0c397]/70">
                Est. 1984 · sealed
              </span>
            </span>
          </span>
          <span
            aria-hidden="true"
            className="ink-blot absolute bottom-16 left-6 h-10 w-10 opacity-60"
          />
          <span
            aria-hidden="true"
            className="ink-blot absolute right-1/3 top-6 h-4 w-4 opacity-40"
          />
          <span
            aria-hidden="true"
            className="fold-line absolute inset-y-0 left-[38%] w-8 opacity-50"
          />

          <div className="relative mx-auto max-w-3xl text-center">
            <span className="paper-ribbon inline-block rotate-[-1.6deg] bg-kraft px-10 py-1.5 font-body text-[11px] font-bold uppercase tracking-[0.32em] text-paper-1 shadow-sheet">
              Established on a very cluttered desk
            </span>

            <h1 className="mt-6 font-hand text-6xl leading-[0.92] text-ink-1 sm:text-8xl">
              The Paper Desk
            </h1>

            <p className="mx-auto mt-4 max-w-xl font-display text-lg italic leading-relaxed text-ink-3">
              A multi-vendor market of paper, ink and small stubborn tools — laid out
              like a catalogue that has been thumbed through for forty years.
            </p>

            <p className="mt-5 font-hand text-2xl text-kraft">
              {catalogProducts.length} handmade goods from {makers} maker
              {makers === 1 ? "" : "s"} · {categories} departments · {orders.length} dockets filed
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-6 -top-5 rotate-[-16deg] rounded-[3px] border-2 border-double border-ink-red px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-ink-red opacity-80"
                >
                  open daily
                </span>
                <PaperButton as={Link} to={start} variant="stamp" size="lg">
                  Browse the Catalog
                </PaperButton>
              </div>
              {!currentUser && (
                <PaperButton as={Link} to="/login" variant="tag" size="lg">
                  Sign in as any role
                </PaperButton>
              )}
            </div>
          </div>

          {/* small paper objects laid on top */}
          <span
            aria-hidden="true"
            className="absolute left-4 top-6 hidden rotate-[-9deg] border border-paper-edge bg-paper-2 px-3 py-1 font-hand text-xl text-ink-3 shadow-sheet lg:block"
          >
            no. 1 of many
          </span>
          <span
            aria-hidden="true"
            className="absolute bottom-10 right-10 hidden rotate-[7deg] border border-paper-edge bg-paper-3 px-3 py-1 font-body text-[10px] uppercase tracking-[0.24em] text-kraft shadow-sheet sm:block"
          >
            hand torn · hand stamped
          </span>
        </div>
      </section>

      {/* ---------------- featured strip ---------------- */}
      {/* <section>
        <div className="torn-bottom relative -rotate-[0.4deg] bg-paper-2 px-5 pb-8 pt-4 shadow-lift sm:px-7">
          <span aria-hidden="true" className="paper-grain opacity-50" />
          <div className="relative flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.24em] text-kraft">
                pinned to the board
              </p>
              <h2 className="font-hand text-4xl leading-none text-ink-1">Featured this week</h2>
            </div>
            <PaperStamp tone="kraft">picked by hand</PaperStamp>
          </div>
        </div>

        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <li key={p.id} className="animate-paper-in">
              <PaperCard tiltId={p.id} tiltRange={2} layered foldCorner interactive className="h-full bg-paper-1 p-3">
                <div className="mb-3 overflow-hidden border border-paper-edge bg-paper-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-square w-full object-cover mix-blend-multiply saturate-[0.72]"
                  />
                </div>
                <h3 className="font-display text-base leading-snug text-ink-1">
                  <Link
                    to="/customer/products/$productId"
                    params={{ productId: p.id }}
                    className="hover:ink-underline"
                  >
                    {p.name}
                  </Link>
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <PaperTag>{money(p.price)}</PaperTag>
                  <PaperBadge tone="kraft">{p.category}</PaperBadge>
                </div>
              </PaperCard>
            </li>
          ))}
        </ul>
      </section> */}

      {/* ---------------- makers ---------------- */}
      <section className="deckle-edge relative bg-paper-1 px-5 py-8 shadow-lift sm:px-8">
        <span aria-hidden="true" className="paper-grain opacity-40" />
        <div className="relative">
          <h2 className="font-hand text-4xl leading-none text-ink-1">The makers</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {users
              .filter((u) => u.role === "seller" && !u.banned)
              .map((u) => (
                <li key={u.id}>
                  <PaperCard tiltId={u.id} className="h-full bg-paper-2">
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-12 w-12 shrink-0 rotate-[-3deg] items-center justify-center border-2 border-double border-kraft bg-paper-1 font-hand text-3xl leading-none text-kraft"
                      >
                        {u.avatarInitial ?? u.name.charAt(0)}
                      </span>
                      <div>
                        <h3 className="font-display text-base text-ink-1">{u.shopName ?? u.name}</h3>
                        <p className="mt-1 text-sm leading-snug text-ink-faint">{u.bio}</p>
                      </div>
                    </div>
                  </PaperCard>
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* ---------------- editorial desk notes ---------------- */}
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="torn-edges relative rotate-[-0.5deg] bg-paper-2 px-6 py-8 shadow-lift sm:px-10">
          <span aria-hidden="true" className="paper-grain opacity-50" />
          <div className="relative">
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.26em] text-kraft">
              a note from the desk
            </p>
            <h2 className="mt-2 max-w-lg font-hand text-5xl leading-[0.9] text-ink-1">
              Good things should show their fingerprints.
            </h2>
            <p className="mt-5 max-w-xl font-display text-base leading-relaxed text-ink-3">
              We believe the best objects carry a little evidence of the person who made them:
              a deckled edge, a crooked stitch, a colour that settles differently on every sheet.
              The Desk gathers those small-batch goods in one well-used place.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <PaperStamp tone="red">properly made</PaperStamp>
              <span className="font-hand text-2xl text-kraft">since the first good idea</span>
            </div>
          </div>
        </article>

        <aside className="relative border-y-2 border-double border-paper-edge bg-paper-1 px-6 py-8 sm:px-8">
          <span aria-hidden="true" className="paper-grain opacity-35" />
          <div className="relative">
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.26em] text-kraft">
              the house rules
            </p>
            <ul className="mt-5 space-y-4">
              <li className="flex gap-3 border-b border-dashed border-paper-edge pb-3">
                <span className="font-hand text-2xl text-ink-red">01</span>
                <p className="font-display text-sm leading-relaxed text-ink-2">
                  Buy fewer things. Keep the things you buy for a very long time.
                </p>
              </li>
              <li className="flex gap-3 border-b border-dashed border-paper-edge pb-3">
                <span className="font-hand text-2xl text-ink-red">02</span>
                <p className="font-display text-sm leading-relaxed text-ink-2">
                  Support the maker whose name is written on the label.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="font-hand text-2xl text-ink-red">03</span>
                <p className="font-display text-sm leading-relaxed text-ink-2">
                  Leave room on your desk for one more beautiful, useful thing.
                </p>
              </li>
            </ul>
          </div>
        </aside>
      </section>

      {/* ---------------- how the desk works ---------------- */}
      <section className="relative border-y-2 border-double border-paper-edge bg-paper-2 px-5 py-9 text-ink-1 shadow-lift sm:px-9">
        <span aria-hidden="true" className="paper-grain opacity-45" />
        <div className="relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.26em] text-kraft">
                three small motions
              </p>
              <h2 className="font-hand text-5xl leading-none">How the desk works</h2>
            </div>
            <span className="hidden rotate-[-4deg] border border-kraft/60 px-3 py-1 font-display text-[10px] uppercase tracking-[0.2em] text-kraft sm:block">
              no hurry · no fuss
            </span>
          </div>

          <ol className="mt-7 grid gap-5 md:grid-cols-3">
            <li className="relative border-t border-kraft/45 pt-4">
              <span className="font-hand text-4xl text-ink-red/75">01</span>
              <h3 className="mt-2 font-display text-lg">Find your next favourite</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-3">
                Browse the stalls, follow a thread, and let the right object find you.
              </p>
            </li>
            <li className="relative border-t border-kraft/45 pt-4">
              <span className="font-hand text-4xl text-ink-red/75">02</span>
              <h3 className="mt-2 font-display text-lg">Pin it to your board</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-3">
                Save a piece for later, or put it straight in the cart when the feeling is right.
              </p>
            </li>
            <li className="relative border-t border-kraft/45 pt-4">
              <span className="font-hand text-4xl text-ink-red/75">03</span>
              <h3 className="mt-2 font-display text-lg">Give it a good home</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-3">
                Your order is filed, stamped, and sent from the maker’s own little corner.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* ---------------- closing invitation ---------------- */}
      <section className="relative overflow-hidden border-2 border-dashed border-kraft/60 bg-paper-3 px-6 py-10 text-center shadow-sheet sm:px-10">
        <span aria-hidden="true" className="coffee-ring absolute -left-8 -top-8 h-24 w-24 opacity-40" />
        <span aria-hidden="true" className="ink-blot absolute -bottom-3 -right-3 h-12 w-12 opacity-30" />
        <div className="relative mx-auto max-w-2xl">
          <PaperStamp tone="red">the counter is open</PaperStamp>
          <h2 className="mt-4 font-hand text-5xl leading-none text-ink-1 sm:text-6xl">
            Come in, have a look around.
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-display text-base italic leading-relaxed text-ink-3">
            There is always another drawer to open, another maker to meet, and something useful
            waiting beneath the dust.
          </p>
          <PaperButton as={Link} to={start} variant="stamp" size="lg" className="mt-6">
            Enter the catalog
          </PaperButton>
        </div>
      </section>
    </div>
  );
}
