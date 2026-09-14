import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/seller/ProductsPage.jsx";

export const Route = createFileRoute("/seller/products")({
  head: () => ({
    meta: [
      { title: "Your products — The Paper Desk" },
      { name: "description", content: "Create, edit, restock and hide the goods on your stall." },
      { property: "og:title", content: "Your products — The Paper Desk" },
      { property: "og:description", content: "Create, edit, restock and hide the goods on your stall." },
    ],
  }),
  component: () => (
    <RequireRole role="seller">
      <Page />
    </RequireRole>
  ),
});
