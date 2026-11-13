import { createFileRoute } from "@tanstack/react-router";
import { RequirementsList } from "@/components/requirements/RequirementsList";
import posterAsset from "@/assets/robot-poster.webp.asset.json";

export const Route = createFileRoute("/client/requirements")({
  head: () => ({ meta: [
    { title: "My Requirements · StaffSync" },
    { name: "description", content: "Manage your job descriptions and hiring needs with StaffSync." },
    { property: "og:title", content: "My Requirements · StaffSync" },
    { property: "og:description", content: "Manage your job descriptions and hiring needs with StaffSync." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "preload", as: "image", href: posterAsset.url }] }),
  component: RequirementsList,
});