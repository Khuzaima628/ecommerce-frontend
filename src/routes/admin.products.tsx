import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/admin/ProductsPage.jsx";

export const Route = createFileRoute("/admin/products")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "All products — The Paper Desk" },
      { name: "description", content: "Every product listed across all stalls." },
      { property: "og:title", content: "All products — The Paper Desk" },
      { property: "og:description", content: "Every product listed across all stalls." },
    ],
  }),
  component: () => (
    <RequireRole role="admin">
      <Page />
    </RequireRole>
  ),
});
