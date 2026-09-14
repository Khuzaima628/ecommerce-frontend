import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/seller/ProfilePage.jsx";

export const Route = createFileRoute("/seller/profile")({
  head: () => ({
    meta: [
      { title: "Shop profile — The Paper Desk" },
      { name: "description", content: "Edit the sign above your stall: name, bio and initial." },
      { property: "og:title", content: "Shop profile — The Paper Desk" },
      { property: "og:description", content: "Edit the sign above your stall: name, bio and initial." },
    ],
  }),
  component: () => (
    <RequireRole role="seller">
      <Page />
    </RequireRole>
  ),
});
