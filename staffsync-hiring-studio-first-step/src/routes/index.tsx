import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/client/requirements" });
  },
  head: () => ({
    meta: [
      { title: "StaffSync — Hiring Requirements" },
      { name: "description", content: "Create, improve and publish job descriptions with StaffSync AI." },
      { property: "og:title", content: "StaffSync — Hiring Requirements" },
      { property: "og:description", content: "AI-assisted hiring requirement builder." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
