import { cn } from "@/lib/utils";
import { useSession } from "../../context/SessionContext.jsx";
import { useFavourites } from "../../context/FavouritesContext.jsx";

/** Stamped heart mark. Shoppers only — sellers and admins never see it. */
export default function WishlistHeart({ productId, className, size = "md" }) {
  const { currentUser } = useSession();
  const { isFavourited, toggleFavourite, busyId } = useFavourites();
  if (!currentUser || currentUser.role !== "customer") return null;

  const on = isFavourited(productId);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Remove from wishlist" : "Add to wishlist"}
      disabled={busyId === productId}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavourite(productId);
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[2px] border-2 border-double px-2 py-0.5",
        "font-display text-[11px] font-bold uppercase tracking-[0.14em] shadow-sheet transition-all",
        "hover:-translate-y-[1px] active:scale-[0.97]",
        on
          ? "-rotate-[7deg] border-ink-red bg-ink-red/10 text-ink-red"
          : "-rotate-[2deg] border-paper-edge bg-paper-2 text-ink-faint hover:text-ink-red",
        size === "sm" && "px-1.5 text-[10px]",
        className,
      )}
    >
      <span aria-hidden="true" className="text-sm leading-none">
        {on ? "♥" : "♡"}
      </span>
      {on ? "Saved" : "Save"}
    </button>
  );
}
