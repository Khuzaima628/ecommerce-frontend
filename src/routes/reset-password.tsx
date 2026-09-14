import { createFileRoute } from "@tanstack/react-router";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage.jsx";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => ({
    resetToken: typeof search["resetToken"] === "string" ? (search["resetToken"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Set a new password — The Paper Desk" },
      { name: "description", content: "Choose a new password for your Paper Desk account." },
    ],
  }),
  component: ResetPasswordPage,
});
