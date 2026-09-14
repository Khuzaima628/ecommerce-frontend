import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useData } from "../../context/DataContext.jsx";
import { useSession } from "../../context/SessionContext.jsx";
import PaperScatter from "../paper/PaperScatter.jsx";
import PaperLeaf from "../paper/PaperLeaf.jsx";
import { CobWeb, HangingSpider, RestingSpider, ScuttlingSpider } from "../paper/PaperCobweb.jsx";
import { LightShaft, DustMotes, Moth, Rat, Flies, Gutter } from "../paper/PaperAtmosphere.jsx";
import { PinnedString } from "../paper/PaperBoardKit.jsx";
import { BloodStain, Handprint, ClawMarks, DreadStamp } from "../paper/PaperHorror.jsx";
import { UnfinishedNote } from "../paper/PaperMarginalia.jsx";
import DashboardSidebar, { NAV } from "./DashboardSidebar.jsx";

/**
 * Two shells in one:
 *
 * - signed out (landing, login) keeps the wide masthead, because those
 *   pages are a shopfront rather than a workspace;
 * - signed in gets the desk layout — a standing index-board down the
 *   left, a slim ledger strip across the top, and the work in the middle.
 */
export default function AppShell({ children }) {
  const { currentUser, bootstrapping, logout } = useSession();
  const { getCartItems } = useData();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const cartCount = currentUser
    ? getCartItems(currentUser.id).reduce((n, i) => n + i.quantity, 0)
    : 0;

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const signOut = () => {
    logout();
    setMenuOpen(false);
    navigate({ to: "/login" });
  };

  /* ---------------- restoring session from a stored token ---------------- */

  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-live="polite">
        <p className="font-hand text-2xl text-paper-2/70">Turning the page…</p>
      </div>
    );
  }

  /* ---------------- signed out: shopfront ---------------- */

  if (!currentUser) {
    return (
      <div className="min-h-screen">
        <header className="relative z-20 border-b-2 border-double border-paper-edge bg-paper-1 shadow-lift">
          <span aria-hidden="true" className="paper-grain opacity-30" />
          <span aria-hidden="true" className="crack-field opacity-25" />
          <div className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
            <Link to="/" className="mr-auto flex items-baseline gap-2">
              <span className="font-hand text-3xl leading-none text-ink-1">The Paper Desk</span>
              <span className="hidden font-body text-[10px] uppercase tracking-[0.28em] text-kraft sm:inline">
                multi-vendor goods
              </span>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>

        <footer className="mx-auto max-w-6xl px-4 pb-10 text-center sm:px-6">
          <p className="font-hand text-xl text-paper-2/80">
            Everything here is written in pencil — refresh the page and the desk is tidied.
          </p>
        </footer>
      </div>
    );
  }

  /* ---------------- signed in: the desk ---------------- */

  const role = currentUser.role;
  const links = NAV[role] ?? [];
  const current = [...links]
    .sort((a, b) => b.to.length - a.to.length)
    .find((l) => pathname === l.to || pathname.startsWith(l.to + "/"));

  const sidebar = (
    <DashboardSidebar
      currentUser={currentUser}
      cartCount={cartCount}
      onNavigate={() => setMenuOpen(false)}
      onSignOut={signOut}
    />
  );

  return (
    <div className={cn("flex min-h-screen", `role-${role}`)}>
      {/* ---- standing board, fixed on desktop ---- */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block xl:w-72">
        {sidebar}
      </aside>

      {/* ---- mobile drawer ---- */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ink-1/55 backdrop-blur-[1px]"
          />
          <div className="animate-drift-in absolute inset-y-0 left-0 w-72 max-w-[85vw]">
            {sidebar}
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="absolute right-2 top-2 z-20 rounded-[2px] border border-paper-edge bg-paper-1 p-1.5 text-ink-3 shadow-sheet"
              aria-label="Close menu"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* ---- the working surface ---- */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* slim ledger strip */}
        <header className="relative z-20 border-b border-paper-edge bg-paper-2 shadow-sheet">
          <span aria-hidden="true" className="aged-panel" />

          <div className="relative flex items-center gap-3 px-4 py-2.5 sm:px-6">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="paper-nav"
              className="rounded-[2px] border border-paper-edge bg-paper-1 p-1.5 text-ink-3 shadow-sheet transition-transform hover:-rotate-2 lg:hidden"
            >
              <Menu className="size-4" aria-hidden="true" />
              <span className="sr-only">Open menu</span>
            </button>

            <div className="min-w-0">
              <p className="font-body text-[9px] font-semibold uppercase tracking-[0.28em] text-kraft">
                {role} desk
              </p>
              <p className="truncate font-hand text-2xl leading-none text-ink-1">
                {current?.label ?? "The Paper Desk"}
              </p>
            </div>

            <span
              aria-hidden="true"
              className="ml-auto hidden select-none font-display text-[10px] uppercase tracking-[0.24em] text-ink-faint sm:block"
            >
              entered by hand · no. {String(currentUser.id.length * 7).padStart(3, "0")}
            </span>

            <span aria-hidden="true" className="pointer-events-none hidden lg:block">
              <PaperLeaf seed={`strip-${role}`} specimen="laurel" tone="kraft" size={40} className="opacity-40" />
            </span>
          </div>

          {/* torn lower lip on the strip */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-1 h-1.5 bg-paper-2 torn-bottom"
          />
        </header>

        <main className="relative flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {/*
            The working area is a cork pinboard in a timber frame; the
            paper sheets sit pinned on top of it. Everything decorative
            lives in this one clipped layer, so nothing here can overflow
            the page or clip a sticky element inside the routes below.
          */}
          <span
            aria-hidden="true"
            className="cork-board cork-frame cork-torn-corner pointer-events-none absolute inset-0 overflow-hidden"
          >
            {/* the cork has crumbled in patches and is riddled with the
                holes of every pin that was ever pushed into it */}
            <span className="cork-worn" />
            <span className="cork-pinholes" />

            {/* wear, damp and grime over the whole board in one pass */}
            <span className="aged-board" />

            {/* daylight from the window, and the dust in it */}
            <LightShaft />
            <DustMotes />

            {/* red thread strung pin to pin across the cork */}
            <PinnedString seed={`thread-${role}`} points={5} opacity={0.42} />

            {/* webs in all four corners of the board */}
            <CobWeb corner="tl" size={150} opacity={0.24} />
            <CobWeb corner="tr" size={118} opacity={0.2} />
            <CobWeb corner="br" size={132} opacity={0.18} />
            <CobWeb corner="bl" size={104} opacity={0.16} />

            {/*
              Two abseiling and three sitting. They are seeded off the
              role, so each dashboard keeps its own arrangement and the
              spiders never jump about between renders.
            */}
            <HangingSpider
              seed={`abseil-a-${role}`}
              size={22}
              drop={130}
              clip={230}
              className="left-[22%] top-0 sm:left-[30%]"
            />
            <HangingSpider
              seed={`abseil-b-${role}`}
              size={15}
              drop={86}
              clip={168}
              className="right-[16%] top-0 opacity-75"
            />
            <RestingSpider seed={`rest-a-${role}`} size={16} className="right-6 top-14 opacity-70" />
            <RestingSpider
              seed={`rest-b-${role}`}
              size={13}
              className="bottom-16 left-8 opacity-60"
            />
            <RestingSpider
              seed={`rest-c-${role}`}
              size={11}
              className="bottom-6 right-[28%] opacity-50"
            />

            {/* and something that got in through the window */}
            <Moth seed={`moth-${role}`} size={20} />

            {/* ---- the archive has a history ---- */}
            <BloodStain />
            <span className="black-damp" />
            <Handprint seed={`hand-${role}`} size={112} className="bottom-[18%] left-[6%]" />
            <ClawMarks seed={`claw-${role}`} size={168} className="right-[8%] top-[24%]" />
            <DreadStamp seed={`dread-a-${role}`} size="lg" className="left-[8%] top-[12%]" />
            <DreadStamp seed={`dread-b-${role}`} size="sm" className="bottom-[10%] right-[12%]" />
            <UnfinishedNote seed={`scrawl-${role}`} className="bottom-[30%] right-[6%]" />

            {/* ---- and it is not empty ---- */}
            <ScuttlingSpider seed={`dash-a-${role}`} size={17} className="left-0 top-[38%]" />
            <ScuttlingSpider seed={`dash-b-${role}`} size={13} className="left-0 top-[72%]" />
            <Rat seed={`rat-${role}`} size={46} />
            <Flies seed={`flies-${role}`} count={3} className="left-[14%] top-[56%]" />

            {/* the lamp is going; this sits over everything else */}
            <Gutter seed={`gutter-${role}`} />
            <span className="dread-vignette" />
          </span>

          {/* litter strewn across the board, behind the work */}
          <PaperScatter seed={`desk-${role}`} count={6} className="opacity-45" />

          <div className="relative mx-auto w-full max-w-6xl">{children}</div>
        </main>

        <footer className="relative px-4 pb-8 text-center sm:px-6">
          <p className="font-hand text-lg text-paper-2/75">
            Everything here is written in pencil — refresh the page and the desk is tidied.
          </p>
        </footer>
      </div>
    </div>
  );
}
