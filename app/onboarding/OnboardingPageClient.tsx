"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignup } from "@/app/components/auth/SignupContext";
import { OnboardingSkeleton } from "./components/OnboardingSkeleton";

export function OnboardingPageClient() {
  const router = useRouter();
  const { accountType } = useSignup();

  useEffect(() => {
    if (accountType === "vendor") {
      router.replace("/onboarding/vendor");
    } else {
      router.replace("/onboarding/client");
    }
  }, [accountType, router]);

  return <OnboardingSkeleton />;
}
