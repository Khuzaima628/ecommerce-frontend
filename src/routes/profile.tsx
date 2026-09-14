import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useSession } from "../context/SessionContext.jsx";
import Page from "../pages/ProfilePage.jsx";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your file — The Paper Desk" },
      {
        name: "description",
        content: "View and edit your own account details on one hand-filed sheet of paper.",
      },
      { property: "og:title", content: "Your file — The Paper Desk" },
      {
        property: "og:description",
        content: "View and edit your own account details on one hand-filed sheet of paper.",
      },
    ],
  }),
  component: ProfileRoute,
});

function ProfileRoute() {
  const { currentUser, bootstrapping } = useSession();
  if (bootstrapping) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Page />;
}
