import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "../pages/auth/AuthPage.jsx";

export const Route = createFileRoute("/forgot-password/verify")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search["email"] === "string" ? (search["email"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Check the post — The Paper Desk" },
      { name: "description", content: "Confirm the code sent to reset your password." },
    ],
  }),
  component: () => <AuthPage mode="forgot-verify" />,
});
