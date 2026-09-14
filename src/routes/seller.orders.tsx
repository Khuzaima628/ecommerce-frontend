import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/seller/OrdersPage.jsx";

export const Route = createFileRoute("/seller/orders")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Stall orders — The Paper Desk" },
      { name: "description", content: "Orders containing your products, with status controls." },
      { property: "og:title", content: "Stall orders — The Paper Desk" },
      { property: "og:description", content: "Orders containing your products, with status controls." },
    ],
  }),
  component: () => (
    <RequireRole role="seller">
      <Page />
    </RequireRole>
  ),
});
