import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cartApi } from "../../lib/cartApi.js";
import { ApiError } from "../../lib/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import { money } from "../../lib/paper.js";
import PaperHeader from "../../components/paper/PaperHeader.jsx";
import PaperCard from "../../components/paper/PaperCard.jsx";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperBadge from "../../components/paper/PaperBadge.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";

export default function CartPage() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    setLoadError("");
    cartApi
      .list()
      .then((data) => setItems(data))
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : "Could not load your cart."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const lines = items.map((item) => {
    const product = item.productId;
    const available = product ? product.stock : 0;
    const payable = Math.min(item.quantity, available);
    return { item, product, available, payable, over: item.quantity > available };
  });

  const total = lines.reduce((sum, l) => sum + (l.product ? l.product.price * l.payable : 0), 0);
  const hasPayable = lines.some((l) => l.payable > 0);

  const setQuantity = async (productId, quantity) => {
    setBusyId(productId);
    try {
      if (quantity <= 0) {
        await cartApi.remove(productId);
        setItems((prev) => prev.filter((i) => i.productId?._id !== productId));
        toast("Removed from cart", { tone: "warning" });
      } else {
        const updated = await cartApi.update(productId, quantity);
        setItems((prev) =>
          prev.map((i) => (i.productId?._id === productId ? { ...i, quantity: updated.quantity } : i)),
        );
      }
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not update your cart.", { tone: "warning" });
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (productId) => {
    setBusyId(productId);
    try {
      await cartApi.remove(productId);
      setItems((prev) => prev.filter((i) => i.productId?._id !== productId));
      toast("Removed from cart", { tone: "warning" });
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not remove that item.", { tone: "warning" });
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <PaperSpinner label="fetching the basket…" />
      </div>
    );
  }

  return (
    <div>
      <PaperHeader
        eyebrow="the basket"
        title="Your cart"
        description="Slips stacked in the order you picked them up."
      />

      {loadError && (
        <p role="alert" className="mb-4 font-hand text-lg text-ink-red">
          ↳ {loadError}
        </p>
      )}

      {lines.length === 0 ? (
        <PaperEmptyState
          title="The cart is empty"
          hint="Nothing has been picked up yet, so there is nothing to check out."
          action={
            <PaperButton as={Link} to="/customer/products" variant="stamp">
              Browse the catalog
            </PaperButton>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <ul className="space-y-4">
            {lines.map(({ item, product, available, over }) => (
              <li key={item.productId?._id ?? item._id} className="animate-paper-in">
                <PaperCard tiltId={item.productId?._id} tiltRange={0.9} layered className="bg-paper-1">
                  <div className="flex flex-wrap items-start gap-4">
                    {product && (
                      <img
                        src={product.images?.[0]}
                        alt={product.productName}
                        className="h-20 w-20 border border-paper-edge object-cover mix-blend-multiply saturate-[0.7]"
                      />
                    )}
                    <div className="min-w-[12rem] flex-1">
                      <h3 className="font-display text-base text-ink-1">
                        {product ? product.productName : "Item no longer sold"}
                      </h3>
                      <p className="text-sm text-ink-faint">
                        {product ? money(product.price) : "—"} each
                      </p>
                      {over && (
                        <p
                          role="alert"
                          className="mt-1 -rotate-[0.6deg] font-hand text-lg leading-tight text-ink-red"
                        >
                          ↳ only {available} left — the order will be capped at {available}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-1">
                        <PaperButton
                          size="sm"
                          aria-label={`Decrease quantity of ${product?.productName ?? "item"}`}
                          disabled={busyId === item.productId?._id}
                          onClick={() => setQuantity(item.productId?._id, item.quantity - 1)}
                        >
                          −
                        </PaperButton>
                        <span className="min-w-8 text-center font-display text-lg text-ink-1">
                          {item.quantity}
                        </span>
                        <PaperButton
                          size="sm"
                          aria-label={`Increase quantity of ${product?.productName ?? "item"}`}
                          disabled={item.quantity >= available || busyId === item.productId?._id}
                          onClick={() => setQuantity(item.productId?._id, item.quantity + 1)}
                        >
                          +
                        </PaperButton>
                        <PaperButton
                          size="sm"
                          variant="ghost"
                          className="ml-2"
                          disabled={busyId === item.productId?._id}
                          onClick={() => remove(item.productId?._id)}
                        >
                          Remove
                        </PaperButton>
                      </div>
                    </div>
                    <div className="text-right">
                      <PaperBadge tone="kraft">Subtotal</PaperBadge>
                      <p className="mt-1 font-display text-xl text-ink-1">
                        {money((product?.price ?? 0) * item.quantity)}
                      </p>
                    </div>
                  </div>
                </PaperCard>
              </li>
            ))}
          </ul>

          <PaperPanel title="Running total" className="h-fit" torn>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-3">Items</dt>
                <dd className="text-ink-1">{lines.reduce((n, l) => n + l.item.quantity, 0)}</dd>
              </div>
              <div className="flex justify-between border-t border-dashed border-paper-edge pt-2">
                <dt className="font-display text-lg text-ink-2">Payable</dt>
                <dd className="font-display text-2xl text-ink-1">{money(total)}</dd>
              </div>
            </dl>
            <PaperButton
              as={hasPayable ? Link : "button"}
              to={hasPayable ? "/customer/checkout" : undefined}
              variant="stamp"
              size="lg"
              disabled={!hasPayable}
              className="mt-4 w-full"
            >
              Proceed to checkout
            </PaperButton>
            {!hasPayable && (
              <p className="mt-2 font-hand text-lg leading-tight text-ink-red">
                ↳ nothing in the cart is currently in stock
              </p>
            )}
          </PaperPanel>
        </div>
      )}
    </div>
  );
}
