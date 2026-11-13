import robotPoster from "@/assets/robot-poster.webp.asset.json";
import robotModel from "@/assets/models/requirements-pocket-robot.glb.asset.json";
import { createFileRoute } from "@tanstack/react-router";
import { RequirementBuilder } from "@/components/requirements/RequirementBuilder";

export const Route = createFileRoute("/client/requirements_/new")({
  head: () => ({
    meta: [
      { title: "Create Hiring Requirement · StaffSync" },
      { name: "description", content: "Upload or create a job description with StaffSync AI, then review and publish your hiring requirement." },
      { property: "og:title", content: "Create Hiring Requirement · StaffSync" },
      { property: "og:description", content: "AI-assisted job description builder for recruiters." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preload", href: robotPoster.url, as: "image", type: "image/webp" },
      // Start downloading the 3D robot immediately so it appears quickly after refresh.
      { rel: "preload", href: robotModel.url, as: "fetch", type: "model/gltf-binary", crossOrigin: "anonymous" },
    ],
  }),
  component: () => <RequirementBuilder />,
});

