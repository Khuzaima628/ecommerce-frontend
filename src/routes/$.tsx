import { createFileRoute } from "@tanstack/react-router";
import NotFoundPage from "../pages/NotFoundPage.jsx";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Nothing on this desk — The Paper Desk" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotFoundPage,
});
