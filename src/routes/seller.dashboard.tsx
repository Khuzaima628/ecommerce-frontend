import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/seller/DashboardPage.jsx";

export const Route = createFileRoute("/seller/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Seller dashboard — The Paper Desk" },
      { name: "description", content: "Stall statistics, recent orders and your activity log." },
      { property: "og:title", content: "Seller dashboard — The Paper Desk" },
      { property: "og:description", content: "Stall statistics, recent orders and your activity log." },
    ],
  }),
  component: () => (
    <RequireRole role="seller">
      <Page />
    </RequireRole>
  ),
});
