import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { favouriteApi } from "../lib/favouriteApi.js";
import { ApiError } from "../lib/api.js";
import { useSession } from "./SessionContext.jsx";
import { useToast } from "./ToastContext.jsx";

const FavouritesContext = createContext(null);

/**
 * One shared list of the current customer's favourited product ids, loaded
 * once via GET /product/favourite so every heart button on screen can look
 * itself up without a separate request per card.
 */
export function FavouritesProvider({ children }) {
  const { currentUser } = useSession();
  const { toast } = useToast();
  const [productIds, setProductIds] = useState(new Set());
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "customer") {
      setProductIds(new Set());
      return;
    }
    favouriteApi
      .list()
      .then((data) => setProductIds(new Set(data.map((f) => f.product?._id ?? f.product_id))))
      .catch(() => {
        // Favourites are a nice-to-have; a failed load just leaves hearts unfilled.
      });
  }, [currentUser]);

  const isFavourited = useCallback((productId) => productIds.has(productId), [productIds]);

  const toggleFavourite = useCallback(
    async (productId) => {
      setBusyId(productId);
      try {
        const { favourited } = await favouriteApi.toggle(productId);
        setProductIds((prev) => {
          const next = new Set(prev);
          if (favourited) next.add(productId);
          else next.delete(productId);
          return next;
        });
        toast(favourited ? "Added to wishlist" : "Removed from wishlist");
      } catch (err) {
        toast(err instanceof ApiError ? err.message : "Could not update your wishlist.", {
          tone: "warning",
        });
      } finally {
        setBusyId(null);
      }
    },
    [toast],
  );

  const value = useMemo(
    () => ({ isFavourited, toggleFavourite, busyId }),
    [isFavourited, toggleFavourite, busyId],
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used inside <FavouritesProvider>");
  return ctx;
}
