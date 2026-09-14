import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/customer/OrdersPage.jsx";

export const Route = createFileRoute("/customer/orders")({
  head: () => ({
    meta: [
      { title: "My orders — The Paper Desk" },
      { name: "description", content: "Every order docket you have filed, with live status stamps." },
      { property: "og:title", content: "My orders — The Paper Desk" },
      { property: "og:description", content: "Every order docket you have filed, with live status stamps." },
    ],
  }),
  component: () => (
    <RequireRole role="customer">
      <Page />
    </RequireRole>
  ),
});
