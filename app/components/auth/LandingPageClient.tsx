"use client";

import { type ReactNode } from "react";
import { AuthModalProvider } from "./AuthModalContext";
import { SignupModal } from "./SignupModal";
import { OnboardingModal } from "./OnboardingModal";
import "./auth-modal.css";

export function LandingPageClient({ children }: { children: ReactNode }) {
  return (
    <AuthModalProvider>
      {children}
      <SignupModal />
      <OnboardingModal />
    </AuthModalProvider>
  );
}
