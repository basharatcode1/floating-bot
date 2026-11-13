import React from "react";
import { AuthModalProvider } from "@/app/components/auth/AuthModalContext";
import { SignupProvider } from "@/app/components/auth/SignupContext";
import "@/app/components/auth/auth-modal.css";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthModalProvider>
      <SignupProvider>
        <div className="min-h-screen w-full bg-ambient text-slate-900 relative flex flex-col justify-between overflow-x-clip">
          {children}
        </div>
      </SignupProvider>
    </AuthModalProvider>
  );
}
