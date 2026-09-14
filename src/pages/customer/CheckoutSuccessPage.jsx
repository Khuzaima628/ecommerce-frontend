import { useEffect, useRef, useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { orderApi } from "../../lib/orderApi.js";
import { ApiError } from "../../lib/api.js";
import { money } from "../../lib/paper.js";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperStamp from "../../components/paper/PaperStamp.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";

const POLL_MS = 2000;
const POLL_ATTEMPTS = 10;

/**
 * Landing page for Stripe's success_url, which the backend points at this
 * app's own origin (e.g. http://localhost:8080/customer/checkout/success).
 * Works whether or not ?orderId=... is attached to that redirect:
 *   - present → fetch that exact order
 *   - absent → fall back to the customer's most recent order via GET /order
 * Either way it polls briefly, since the Stripe webhook that flips
 * paymentStatus to "paid" can land a moment after the redirect does.
 */
export default function CheckoutSuccessPage() {
  const { orderId } = useSearch({ strict: false });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const attemptsRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    attemptsRef.current = 0;

    const fetchOrder = () =>
      orderId ? orderApi.getOne(orderId) : orderApi.list().then((list) => list[0] ?? null);

    const poll = () => {
      fetchOrder()
        .then((data) => {
          if (cancelled) return;
          if (!data) {
            setLoadError("Could not find that order.");
            setLoading(false);
            return;
          }
          setOrder(data);
          attemptsRef.current += 1;
          if (data.paymentStatus !== "paid" && attemptsRef.current < POLL_ATTEMPTS) {
            setTimeout(poll, POLL_MS);
          } else {
            setLoading(false);
          }
        })
        .catch((err) => {
          if (cancelled) return;
          setLoadError(err instanceof ApiError ? err.message : "Could not find that order.");
          setLoading(false);
        });
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <PaperSpinner label="checking with the till…" />
      </div>
    );
  }

  if (loadError || !order) {
    return (
      <PaperEmptyState
        title="Couldn't confirm that order"
        hint={loadError || "Something went wrong locating your order."}
        action={
          <PaperButton as={Link} to="/customer/orders" variant="stamp">
            View my orders
          </PaperButton>
        }
      />
    );
  }

  const paid = order.paymentStatus === "paid";

  return (
    <div className="mx-auto max-w-lg">
      <PaperPanel className="torn-edges bg-paper-1 shadow-lift" bodyClassName="px-6 py-8 sm:px-10 sm:py-10">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <PaperStamp tone={paid ? "green" : "orange"} animate>
              {paid ? "paid" : order.paymentStatus}
            </PaperStamp>
          </div>
          <h1 className="font-hand text-5xl leading-none text-ink-1">
            {paid ? "Order placed" : "Almost there"}
          </h1>
          <p className="mt-3 font-display text-sm leading-relaxed text-ink-2">
            {paid
              ? `Docket ${order._id} has been filed.`
              : "We're still waiting to hear back from Stripe about this payment. Check your order history in a moment."}
          </p>
        </div>

        <ul className="mt-6 divide-y divide-dashed divide-paper-edge text-sm">
          {order.items.map((line) => (
            <li key={line.productId} className="flex justify-between py-2">
              <span className="text-ink-2">
                {line.productName} × {line.quantity}
              </span>
              <span className="text-ink-1">{money(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-right font-display text-xl text-ink-1">{money(order.totalAmount)}</p>

        <div className="mt-7 flex flex-wrap justify-center gap-3 border-t border-dashed border-paper-edge pt-5">
          <PaperButton as={Link} to="/customer/products">
            Keep browsing
          </PaperButton>
          <PaperButton as={Link} to="/customer/orders" variant="stamp">
            View my orders
          </PaperButton>
        </div>
      </PaperPanel>
    </div>
  );
}
