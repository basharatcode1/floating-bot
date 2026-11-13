"use client";

import { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { useAuthModal } from "./AuthModalContext";
import { useSignup } from "./SignupContext";
import { ClientOnboardingForm } from "./onboarding/ClientOnboardingForm";
import { VendorOnboardingForm } from "./onboarding/VendorOnboardingForm";

export function OnboardingModal() {
  const { activeModal, closeAuth } = useAuthModal();
  const { accountType } = useSignup();

  const handleClose = useCallback(() => {
    closeAuth();
  }, [closeAuth]);

  return (
    <Dialog
      open={activeModal === "onboarding"}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-5xl md:max-w-6xl !max-w-[1100px] w-full h-[90vh] max-h-[90vh] overflow-hidden flex flex-col p-0 border border-[var(--ob-card-border)] bg-[var(--ob-card-bg)] auth-modal-root rounded-[20px] shadow-2xl"
      >
        <DialogTitle className="sr-only">
          Company Onboarding — StaffSync
        </DialogTitle>
        <DialogDescription className="sr-only">
          Please complete the onboarding steps to set up your corporate account.
        </DialogDescription>

        {accountType === "client" && <ClientOnboardingForm />}

        {accountType === "vendor" && <VendorOnboardingForm />}

        {!accountType && (
          <div className="flex items-center justify-center p-12 text-[var(--ob-text-muted)]">
            <p>Loading onboarding form…</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
