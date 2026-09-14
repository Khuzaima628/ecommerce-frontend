import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { favouriteApi } from "../../lib/favouriteApi.js";
import { cartApi } from "../../lib/cartApi.js";
import { ApiError } from "../../lib/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useFavourites } from "../../context/FavouritesContext.jsx";
import PaperHeader from "../../components/paper/PaperHeader.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperBadge from "../../components/paper/PaperBadge.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";
import ProductCard from "../../components/common/ProductCard.jsx";

export default function WishlistPage() {
  const { toast } = useToast();
  const { toggleFavourite } = useFavourites();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    setLoadError("");
    favouriteApi
      .list()
      .then((data) => setEntries(data))
      .catch((err) =>
        setLoadError(err instanceof ApiError ? err.message : "Could not load your wishlist."),
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const addToCart = async (productId) => {
    setBusyId(productId);
    try {
      await cartApi.add(productId, 1);
      toast("Added to cart");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not add that to your cart.", { tone: "warning" });
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (productId) => {
    setBusyId(productId);
    try {
      await toggleFavourite(productId);
      setEntries((prev) => prev.filter((e) => (e.product?._id ?? e.product_id) !== productId));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <PaperSpinner label="unpinning the board…" />
      </div>
    );
  }

  return (
    <div>
      <PaperHeader
        eyebrow="the pin board"
        title="Saved for later"
        description="Everything you have pinned up, ready to be taken to the counter."
      />

      {loadError && (
        <p role="alert" className="mb-4 font-hand text-lg text-ink-red">
          ↳ {loadError}
        </p>
      )}

      {entries.length === 0 ? (
        <PaperEmptyState
          title="Nothing pinned to the board yet"
          hint="Tap the heart on any product and it will be waiting here."
          action={
            <PaperButton as={Link} to="/customer/products" variant="stamp">
              Browse the catalog
            </PaperButton>
          }
        />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => {
            const product = entry.product;
            const productId = product?._id ?? entry.product_id;
            if (!product) {
              return (
                <li key={entry._id} className="animate-paper-in">
                  <PaperBadge tone="red">No longer available</PaperBadge>
                </li>
              );
            }
            return (
              <li key={entry._id} className="animate-paper-in">
                <div className="flex h-full flex-col gap-2">
                  <ProductCard product={product} />
                  <div className="flex flex-wrap items-center gap-2">
                    <PaperButton
                      size="sm"
                      variant="stamp"
                      disabled={product.stock === 0 || busyId === productId}
                      onClick={() => addToCart(productId)}
                    >
                      {product.stock === 0 ? "Out of stock" : "Add to cart"}
                    </PaperButton>
                    <PaperButton
                      size="sm"
                      variant="ghost"
                      disabled={busyId === productId}
                      onClick={() => remove(productId)}
                    >
                      Remove
                    </PaperButton>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
