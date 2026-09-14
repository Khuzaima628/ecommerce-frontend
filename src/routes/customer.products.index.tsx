import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/customer/CatalogPage.jsx";

export const Route = createFileRoute("/customer/products/")({
  head: () => ({
    meta: [
      { title: "Catalog — The Paper Desk" },
      { name: "description", content: "Browse handmade paper goods from every stall on the floor." },
      { property: "og:title", content: "Catalog — The Paper Desk" },
      { property: "og:description", content: "Browse handmade paper goods from every stall on the floor." },
    ],
  }),
  component: () => (
    <RequireRole role="customer">
      <Page />
    </RequireRole>
  ),
});
