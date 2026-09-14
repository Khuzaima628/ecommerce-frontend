import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardList,
  Heart,
  LayoutGrid,
  Package,
  ScrollText,
  ShoppingBasket,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { tiltFor } from "../../lib/paper.js";
import PaperAvatar from "../paper/PaperAvatar.jsx";
import PaperBadge from "../paper/PaperBadge.jsx";
import PaperButton from "../paper/PaperButton.jsx";
import PaperLeaf from "../paper/PaperLeaf.jsx";
import PaperScatter from "../paper/PaperScatter.jsx";
import PaperSeal from "../paper/PaperSeal.jsx";
import { Ribbon, Pushpin, Staple } from "../paper/PaperBoardKit.jsx";
import { Marginalia } from "../paper/PaperMarginalia.jsx";
import { CobWeb, RestingSpider, ScuttlingSpider } from "../paper/PaperCobweb.jsx";
import { BloodStain, ClawMarks, DreadStamp } from "../paper/PaperHorror.jsx";

/**
 * The standing index-board down the left of every signed-in screen.
 *
 * Same destinations as the old top bar — only the arrangement and the
 * dressing changed.
 */

export const NAV = {
  customer: [
    { to: "/customer/products", label: "Catalog", icon: BookOpen },
    { to: "/customer/wishlist", label: "Wishlist", icon: Heart },
    { to: "/customer/cart", label: "Cart", icon: ShoppingBasket },
    { to: "/customer/orders", label: "My Orders", icon: ScrollText },
    { to: "/profile", label: "Profile", icon: UserRound },
  ],
  seller: [
    { to: "/seller/dashboard", label: "Dashboard", icon: LayoutGrid },
    { to: "/seller/products", label: "Products", icon: Package },
    { to: "/seller/orders", label: "Orders", icon: ClipboardList },
    { to: "/seller/profile", label: "Shop Profile", icon: Store },
    { to: "/profile", label: "Profile", icon: UserRound },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutGrid },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/orders", label: "Orders", icon: ClipboardList },
    { to: "/profile", label: "Profile", icon: UserRound },
  ],
};

const ROLE_LABEL = {
  customer: "customer ledger",
  seller: "seller's stall",
  admin: "back office",
};

export default function DashboardSidebar({
  currentUser,
  cartCount,
  onNavigate,
  onSignOut,
}) {
  const role = currentUser.role;
  const links = NAV[role] ?? [];
  const initial = currentUser.avatarInitial ?? (currentUser.name ?? "?").charAt(0);
  const displayName = currentUser.shopName ?? currentUser.name;

  return (
    <div className="relative flex h-full flex-col">
      {/* ---- the board itself: clipped separately so shadows survive ---- */}
      <span
        aria-hidden="true"
        className="board-kraft torn-right absolute inset-0 border-r shadow-[6px_0_18px_-8px_oklch(0.25_0.03_70/0.5)]"
      />
      {/* grain, cracks, foxing, crease, damp and grime in one pass */}
      <span aria-hidden="true" className="aged-board" />
      <PaperScatter seed={`rail-${role}`} count={4} className="opacity-70" />

      {/* punched binder holes down the outer margin */}
      <span aria-hidden="true" className="punch-holes absolute inset-y-0 left-2 w-3.5" />

      {/* tape holding the board to the desk */}
      <span
        aria-hidden="true"
        className="tape-strip absolute -top-2 left-6 h-6 w-24 rotate-[-4deg]"
      />

      {/* ribbon marker hung over the top edge */}
      <Ribbon className="right-7 top-0 z-10" height={88} width={15} />

      {/* a web in the corner of the board, and its tenant */}
      <CobWeb corner="bl" size={96} opacity={0.18} />
      <RestingSpider seed={`rail-spider-${role}`} size={12} className="bottom-24 left-4 opacity-55" />

      {/* whatever happened here reached the index board too */}
      <BloodStain spatter={false} />
      <ClawMarks seed={`rail-claw-${role}`} size={92} className="right-1 top-[42%]" />
      <DreadStamp seed={`rail-dread-${role}`} size="sm" className="bottom-[38%] left-6" />
      <ScuttlingSpider seed={`rail-dash-${role}`} size={12} className="left-0 top-[58%]" />

      {/* ---- masthead ---- */}
      <div className="relative z-10 px-5 pb-4 pl-9 pt-6">
        <Link to="/" onClick={onNavigate} className="block">
          <span className="block font-hand text-3xl leading-none text-ink-1">The Paper Desk</span>
          <span className="mt-1 block font-body text-[9px] uppercase tracking-[0.3em] text-kraft">
            multi-vendor goods
          </span>
        </Link>

        <span className="mt-3 inline-flex items-center gap-2">
          <span
            className={cn(
              "inline-block rotate-[-4deg] rounded-[3px] border-2 border-double px-2 py-0.5",
              "font-display text-[10px] font-bold uppercase tracking-[0.18em] opacity-90",
              role === "admin" && "border-ink-red text-ink-red",
              role === "seller" && "border-ink-green text-ink-green",
              role === "customer" && "border-ink-blue text-ink-blue",
            )}
          >
            {ROLE_LABEL[role] ?? role}
          </span>
        </span>
      </div>

      <span aria-hidden="true" className="relative z-10 mx-5 block border-t border-dashed border-board-edge/70" />

      {/* ---- index of sections ---- */}
      <nav aria-label="Main" className="relative z-10 flex-1 overflow-y-auto px-3 py-4 pl-8">
        <p className="letterpress mb-2 px-2 font-body text-[10px] font-bold uppercase tracking-[0.26em] text-ink-faint">
          Index
        </p>

        {/* somebody's pencil note down the side of the index */}
        <Marginalia seed={`rail-note-${role}`} className="right-2 top-1 text-sm" />

        <ul className="space-y-1">
          {links.map((l, i) => {
            const Icon = l.icon;
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={onNavigate}
                  activeProps={{
                    "data-current": "true",
                    className:
                      "border-paper-edge bg-paper-1 text-ink-1 shadow-sheet",
                  }}
                  style={{ "--tilt": `${tiltFor(l.to, 0.7)}deg` }}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-[2px] border border-transparent px-2.5 py-2",
                    "font-body text-sm font-semibold text-ink-3 transition-all duration-150",
                    "hover:border-board-edge/70 hover:bg-paper-2/70 hover:rotate-[-0.5deg]",
                    "data-[current=true]:rotate-[var(--tilt)]",
                  )}
                >
                  {/* inked margin bar on the active sheet */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-1 -left-px w-[3px] bg-role-ink opacity-0 transition-opacity group-data-[current=true]:opacity-90"
                  />
                  <Icon aria-hidden="true" className="size-4 shrink-0 opacity-70" strokeWidth={1.75} />
                  <span className="flex-1">{l.label}</span>

                  {l.label === "Cart" && cartCount > 0 && (
                    <PaperBadge tone="red">{cartCount}</PaperBadge>
                  )}

                  {/* a tiny tick pencilled beside whatever page you're on */}
                  <span
                    aria-hidden="true"
                    className="font-hand text-xl leading-none text-role-ink opacity-0 transition-opacity group-data-[current=true]:opacity-80"
                  >
                    ✓
                  </span>

                  {i === 1 && (
                    <span
                      aria-hidden="true"
                      className="rust-pin absolute -right-1 top-1 h-2 w-2 opacity-0 transition-opacity group-data-[current=true]:opacity-80"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* a specimen pressed into the lower margin of the board */}
        <span aria-hidden="true" className="pointer-events-none mt-6 block pl-4 opacity-70">
          <PaperLeaf seed={`rail-sprig-${role}`} specimen="fern" tone="sepia" size={92} />
        </span>
      </nav>

      {/* ---- the card pinned at the foot of the board ---- */}
      <div className="relative z-10 mt-auto px-3 pb-5 pl-8 pt-3">
        <span
          aria-hidden="true"
          className="tape-strip absolute -top-1 left-1/2 h-5 w-20 -translate-x-1/2 rotate-[3deg]"
        />

        <div className="relative rounded-[2px] border border-paper-edge bg-paper-1 p-3 shadow-lift">
          <span aria-hidden="true" className="paper-grain opacity-40" />
          <span aria-hidden="true" className="foxing opacity-30" />
          <span aria-hidden="true" className="thumb-smudge" />

          {/* the card is pinned and stapled to the board */}
          <Pushpin seed={`card-pin-${currentUser.id}`} size={10} className="-left-1 -top-1" />
          <Staple seed={`card-staple-${currentUser.id}`} length={14} className="bottom-2 left-2" />

          <div className="relative flex items-center gap-3">
            <PaperAvatar initial={initial} size="md" seed={currentUser.id} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-sm font-bold leading-tight text-ink-1">
                {displayName}
              </span>
              <span className="mt-0.5 block truncate font-body text-[10px] uppercase tracking-[0.18em] text-kraft">
                {role}
              </span>
            </span>
          </div>

          <div className="relative mt-3 space-y-2">
            <PaperButton size="sm" variant="tag" className="w-full" onClick={onSignOut}>
              Sign out
            </PaperButton>
          </div>
        </div>

        {/* the shop's seal, pressed over the corner of the card */}
        <PaperSeal
          seed={`rail-seal-${currentUser.id}`}
          size={46}
          className="absolute -bottom-1 right-1"
        />

        <p className="relative mt-2 text-center font-hand text-base leading-none text-ink-faint">
          filed under {initial}
        </p>
      </div>
    </div>
  );
}
