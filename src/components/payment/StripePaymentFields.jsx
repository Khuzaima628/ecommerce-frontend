import { useState } from "react";
import { orderApi } from "../../lib/orderApi.js";
import PaperBadge from "../paper/PaperBadge.jsx";
import PaperButton from "../paper/PaperButton.jsx";
import PaperStamp from "../paper/PaperStamp.jsx";

/** Redirects customers to Stripe Checkout instead of collecting card data in this app. */
export default function StripePaymentFields({ orderId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const { url } = await orderApi.checkout(orderId);
      if (!url) throw new Error("The hosted checkout desk is not available yet.");
      window.location.assign(url);
    } catch (checkoutError) {
      setError(checkoutError.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="torn-edges relative bg-paper-2 px-4 py-4 shadow-sheet">
        <span aria-hidden="true" className="paper-grain opacity-45" />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PaperStamp tone="green">secure checkout</PaperStamp>
              <PaperBadge tone="kraft">Stripe hosted</PaperBadge>
            </div>
            <span className="font-hand text-xl text-kraft">no card details kept here</span>
          </div>
          <p className="mt-3 font-display text-sm leading-relaxed text-ink-3">
            You’ll be taken to Stripe’s secure payment page to enter your card, expiry date, CVC,
            ZIP code, and billing details.
          </p>
        </div>
      </div>

      <PaperButton variant="stamp" size="lg" className="w-full" disabled={loading} onClick={openCheckout}>
        {loading ? "Opening secure checkout…" : "Continue to secure checkout"}
      </PaperButton>

      {error && (
        <p role="alert" className="font-hand text-lg leading-tight text-ink-red">
          ↳ {error}
        </p>
      )}
    </div>
  );
}
