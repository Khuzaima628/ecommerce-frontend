import { Link, useSearch } from "@tanstack/react-router";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperStamp from "../../components/paper/PaperStamp.jsx";

/**
 * Landing page for Stripe's cancel_url, which the backend points at this
 * app's own origin (e.g. http://localhost:8080/customer/checkout/cancel).
 */
export default function CheckoutCancelPage() {
  const { orderId } = useSearch({ strict: false });

  return (
    <div className="mx-auto max-w-lg">
      <PaperPanel className="torn-edges bg-paper-1 shadow-lift" bodyClassName="px-6 py-8 sm:px-10 sm:py-10">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <PaperStamp tone="orange">cancelled</PaperStamp>
          </div>
          <h1 className="font-hand text-5xl leading-none text-ink-1">Payment cancelled</h1>
          <p className="mt-3 font-display text-sm leading-relaxed text-ink-2">
            {orderId
              ? `Docket ${orderId} was not paid — your order still sits pending, and nothing was charged.`
              : "No payment was made — nothing was charged."}
          </p>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3 border-t border-dashed border-paper-edge pt-5">
          <PaperButton as={Link} to="/customer/cart">
            Back to cart
          </PaperButton>
          <PaperButton as={Link} to="/customer/orders" variant="stamp">
            View my orders
          </PaperButton>
        </div>
      </PaperPanel>
    </div>
  );
}
