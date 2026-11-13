import React, { Suspense } from "react";
import type { Metadata } from "next";
import { OnboardingPageClient } from "./OnboardingPageClient";
import { OnboardingSkeleton } from "./components/OnboardingSkeleton";

export const metadata: Metadata = {
  title: "Onboarding — StaffSync Talent Network",
  description:
    "Complete your profile to unlock direct enterprise contract-to-contract (C-C) and contract-to-hire (C-H) engagements.",
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingSkeleton />}>
      <OnboardingPageClient />
    </Suspense>
  );
}
