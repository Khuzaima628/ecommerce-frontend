import { createFileRoute } from "@tanstack/react-router";
import Page from "../pages/LandingPage.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Paper Desk — a marketplace made of paper and ink" },
      { name: "description", content: "A vintage multi-vendor market of handmade paper goods, inks and small stubborn tools — torn, stamped and pinned to the desk." },
      { property: "og:title", content: "The Paper Desk — a marketplace made of paper and ink" },
      { property: "og:description", content: "A vintage multi-vendor market of handmade paper goods, inks and small stubborn tools — torn, stamped and pinned to the desk." },
    ],
  }),
  component: Page,
});
