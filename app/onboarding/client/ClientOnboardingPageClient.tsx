"use client";

import React, { useEffect, useState } from "react";
import { useSignup } from "@/app/components/auth/SignupContext";
import { ClientOnboardingForm } from "@/app/components/auth/onboarding/ClientOnboardingForm";
import { OnboardingLayoutShell } from "@/app/onboarding/components/OnboardingLayoutShell";
import { ClientOnboardingSkeleton } from "@/app/onboarding/components/OnboardingSkeleton";

export function ClientOnboardingPageClient() {
  const { accountType, setAccountType } = useSignup();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accountType !== "client") {
      setAccountType("client");
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [accountType, setAccountType]);

  if (loading) {
    return <ClientOnboardingSkeleton />;
  }

  return (
    <OnboardingLayoutShell activeRole="client">
      <ClientOnboardingForm />
    </OnboardingLayoutShell>
  );
}
