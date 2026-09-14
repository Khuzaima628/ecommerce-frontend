import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/customer/CartPage.jsx";

export const Route = createFileRoute("/customer/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — The Paper Desk" },
      { name: "description", content: "Review the slips in your cart before checking out." },
      { property: "og:title", content: "Your cart — The Paper Desk" },
      { property: "og:description", content: "Review the slips in your cart before checking out." },
    ],
  }),
  component: () => (
    <RequireRole role="customer">
      <Page />
    </RequireRole>
  ),
});
