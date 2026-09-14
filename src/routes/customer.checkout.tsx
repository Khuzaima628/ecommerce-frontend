import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/customer/CheckoutPage.jsx";

export const Route = createFileRoute("/customer/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — The Paper Desk" },
      { name: "description", content: "Confirm your order docket and stamp it paid." },
      { property: "og:title", content: "Checkout — The Paper Desk" },
      { property: "og:description", content: "Confirm your order docket and stamp it paid." },
    ],
  }),
  component: () => (
    <RequireRole role="customer">
      <Page />
    </RequireRole>
  ),
});
