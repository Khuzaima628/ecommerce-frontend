import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/customer/WishlistPage.jsx";

export const Route = createFileRoute("/customer/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — The Paper Desk" },
      { name: "description", content: "Everything you have pinned to the board, ready to add to the cart." },
      { property: "og:title", content: "Wishlist — The Paper Desk" },
      { property: "og:description", content: "Everything you have pinned to the board, ready to add to the cart." },
    ],
  }),
  component: () => (
    <RequireRole role="customer">
      <Page />
    </RequireRole>
  ),
});
