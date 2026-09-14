import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../pages/LoginPage.jsx";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign the day book — The Paper Desk" },
      {
        name: "description",
        content: "Pick a customer, seller or admin to work this paper-built marketplace.",
      },
      { property: "og:title", content: "Sign the day book — The Paper Desk" },
      {
        property: "og:description",
        content: "Pick a customer, seller or admin to work this paper-built marketplace.",
      },
    ],
  }),
  component: LoginPage,
});
