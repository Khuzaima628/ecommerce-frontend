import { createFileRoute } from "@tanstack/react-router";
import RequireRole from "../components/common/RequireRole.jsx";
import Page from "../pages/admin/UsersPage.jsx";

export const Route = createFileRoute("/admin/users")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Users — The Paper Desk" },
      { name: "description", content: "The register of everyone on the floor, filterable by role." },
      { property: "og:title", content: "Users — The Paper Desk" },
      { property: "og:description", content: "The register of everyone on the floor, filterable by role." },
    ],
  }),
  component: () => (
    <RequireRole role="admin">
      <Page />
    </RequireRole>
  ),
});
