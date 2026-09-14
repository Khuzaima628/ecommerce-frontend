import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "../pages/auth/AuthPage.jsx";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Find your way back — The Paper Desk" },
      { name: "description", content: "Request a password reset for The Paper Desk." },
    ],
  }),
  component: () => <AuthPage mode="forgot" />,
});
