"use client";

import React, { useEffect, useState } from "react";
import { useSignup } from "@/app/components/auth/SignupContext";
import { VendorOnboardingForm } from "@/app/components/auth/onboarding/VendorOnboardingForm";
import { OnboardingLayoutShell } from "@/app/onboarding/components/OnboardingLayoutShell";
import { VendorOnboardingSkeleton } from "@/app/onboarding/components/OnboardingSkeleton";

export function VendorOnboardingPageClient() {
  const { accountType, setAccountType } = useSignup();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accountType !== "vendor") {
      setAccountType("vendor");
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [accountType, setAccountType]);

  if (loading) {
    return <VendorOnboardingSkeleton />;
  }

  return (
    <OnboardingLayoutShell activeRole="vendor">
      <VendorOnboardingForm />
    </OnboardingLayoutShell>
  );
}
