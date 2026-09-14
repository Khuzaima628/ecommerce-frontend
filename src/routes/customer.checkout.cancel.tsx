import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/customer/CheckoutCancelPage.jsx";

export const Route = createFileRoute("/customer/checkout/cancel")({
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: typeof search["orderId"] === "string" ? (search["orderId"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Payment cancelled — The Paper Desk" },
      { name: "description", content: "Checkout was cancelled before payment completed." },
      { property: "og:title", content: "Payment cancelled — The Paper Desk" },
      { property: "og:description", content: "Checkout was cancelled before payment completed." },
    ],
  }),
  component: () => (
    <RequireRole role="customer">
      <Page />
    </RequireRole>
  ),
});
