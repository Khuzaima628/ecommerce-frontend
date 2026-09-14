import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/customer/CheckoutSuccessPage.jsx";

export const Route = createFileRoute("/customer/checkout/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: typeof search["orderId"] === "string" ? (search["orderId"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Order placed — The Paper Desk" },
      { name: "description", content: "Your payment was received and the order has been filed." },
      { property: "og:title", content: "Order placed — The Paper Desk" },
      { property: "og:description", content: "Your payment was received and the order has been filed." },
    ],
  }),
  component: () => (
    <RequireRole role="customer">
      <Page />
    </RequireRole>
  ),
});
