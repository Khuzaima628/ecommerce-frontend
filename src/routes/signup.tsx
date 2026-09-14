import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "../pages/auth/AuthPage.jsx";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Join the day book — The Paper Desk" },
      { name: "description", content: "Create your place at The Paper Desk." },
    ],
  }),
  component: () => <AuthPage mode="signup" />,
});
