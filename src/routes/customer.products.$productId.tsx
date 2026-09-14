import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/customer/ProductDetailPage.jsx";

export const Route = createFileRoute("/customer/products/$productId")({
  head: () => ({
    meta: [
      { title: "Product — The Paper Desk" },
      { name: "description", content: "Full details, stock and seller for a single paper-desk product." },
      { property: "og:title", content: "Product — The Paper Desk" },
      { property: "og:description", content: "Full details, stock and seller for a single paper-desk product." },
    ],
  }),
  component: () => (
    <RequireRole role="customer">
      <Page />
    </RequireRole>
  ),
});
