import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { orderApi } from "../../lib/orderApi.js";
import { ApiError } from "../../lib/api.js";
import { money } from "../../lib/paper.js";
import PaperHeader from "../../components/paper/PaperHeader.jsx";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperBadge from "../../components/paper/PaperBadge.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";
import StripePaymentFields from "../../components/payment/StripePaymentFields.jsx";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const requested = useRef(false);

  useEffect(() => {
    // Guards against React 18 Strict Mode's dev-time double-invoke of
    // effects, which would otherwise call POST /order twice and create two
    // separate orders (and empty the cart / reserve stock twice) from a
    // single page load.
    if (requested.current) return;
    requested.current = true;

    orderApi
      .create()
      .then((data) => setOrder(data))
      .catch((err) =>
        setLoadError(err instanceof ApiError ? err.message : "Could not place your order."),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <PaperSpinner label="filing your order…" />
      </div>
    );
  }

  if (loadError) {
    return (
      <PaperEmptyState
        title="Nothing to check out"
        hint={loadError}
        action={
          <PaperButton as={Link} to="/customer/cart" variant="stamp">
            Back to your cart
          </PaperButton>
        }
      />
    );
  }

  if (!order) {
    return (
      <PaperEmptyState
        title="Nothing to check out"
        hint="Your cart is empty, or none of its items are still in stock."
        action={
          <PaperButton as={Link} to="/customer/products" variant="stamp">
            Back to the catalog
          </PaperButton>
        }
      />
    );
  }

  return (
    <div>
      <PaperHeader
        eyebrow="the till"
        title="Checkout"
        description="Check the docket, then continue to secure payment."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <PaperPanel title="Order summary" subtitle="Prices are recorded as they stand today.">
          <ul className="divide-y divide-dashed divide-paper-edge">
            {order.items.map((line) => (
              <li key={line.productId} className="flex flex-wrap justify-between gap-2 py-3">
                <div>
                  <p className="font-display text-base text-ink-1">{line.productName}</p>
                  <p className="text-sm text-ink-faint">
                    {money(line.price)} × {line.quantity}
                  </p>
                </div>
                <p className="font-display text-lg text-ink-1">
                  {money(line.price * line.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </PaperPanel>

        <PaperPanel title="Payment" subtitle="Your payment details stay on this private slip." className="h-fit" torn>
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-3">Method</span>
            <PaperBadge tone="kraft">Card payment</PaperBadge>
          </div>
          <div className="mt-4 border-t border-dashed border-paper-edge pt-4">
            <StripePaymentFields orderId={order._id} />
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-paper-edge pt-3">
            <span className="font-display text-lg text-ink-2">Total</span>
            <span className="font-display text-2xl text-ink-1">{money(order.totalAmount)}</span>
          </div>
        </PaperPanel>
      </div>
    </div>
  );
}
