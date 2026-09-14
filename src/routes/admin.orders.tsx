import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/admin/OrdersPage.jsx";

export const Route = createFileRoute("/admin/orders")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "All orders — The Paper Desk" },
      { name: "description", content: "Every order docket on the platform, filterable by status." },
      { property: "og:title", content: "All orders — The Paper Desk" },
      { property: "og:description", content: "Every order docket on the platform, filterable by status." },
    ],
  }),
  component: () => (
    <RequireRole role="admin">
      <Page />
    </RequireRole>
  ),
});
