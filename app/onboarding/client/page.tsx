import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ClientOnboardingPageClient } from "./ClientOnboardingPageClient";
import { ClientOnboardingSkeleton } from "@/app/onboarding/components/OnboardingSkeleton";

export const metadata: Metadata = {
  title: "Client Onboarding — StaffSync Talent Network",
  description:
    "Complete your corporate client profile to unlock direct enterprise contract-to-contract (C-C) and contract-to-hire (C-H) engagements.",
};

export default function ClientOnboardingPage() {
  return (
    <Suspense fallback={<ClientOnboardingSkeleton />}>
      <ClientOnboardingPageClient />
    </Suspense>
  );
}
