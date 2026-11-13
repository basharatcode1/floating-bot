import React, { Suspense } from "react";
import type { Metadata } from "next";
import { VendorOnboardingPageClient } from "./VendorOnboardingPageClient";
import { VendorOnboardingSkeleton } from "@/app/onboarding/components/OnboardingSkeleton";

export const metadata: Metadata = {
  title: "Vendor Onboarding — StaffSync Talent Network",
  description:
    "Complete your vendor agency profile to monetize bench talent and receive enterprise contract requirements.",
};

export default function VendorOnboardingPage() {
  return (
    <Suspense fallback={<VendorOnboardingSkeleton />}>
      <VendorOnboardingPageClient />
    </Suspense>
  );
}
