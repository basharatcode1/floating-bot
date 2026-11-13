"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { useAuthModal } from "./AuthModalContext";
import { SignupProvider, useSignup } from "./SignupContext";
import { AccountTypeStep } from "./steps/AccountTypeStep";
import { EmailPasswordStep } from "./steps/EmailPasswordStep";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/app/lib/utils";

const slideVariants = {
  enter: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? -40 : 40,
    opacity: 0,
  }),
};

type Step = 0 | 1;

function SignupModalContent() {
  const router = useRouter();
  const { activeModal, closeAuth, openLogin, openOnboarding } = useAuthModal();
  const {
    accountType,
    email,
    setAccountType,
    setEmail,
    setEmailVerified,
    reset,
  } = useSignup();

  const [step, setStep] = useState<Step>(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  // Tracks when modal is closed programmatically after email verification,
  // so handleClose skips reset() and accountType is preserved for OnboardingModal.
  const skipResetRef = useRef(false);

  // Reset step to 0 whenever the signup modal is opened
  React.useEffect(() => {
    if (activeModal === "signup") {
      const timer = setTimeout(() => {
        setStep(0);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeModal]);

  const goForward = useCallback((nextStep: Step) => {
    setDirection("forward");
    setStep(nextStep);
  }, []);

  const goBackward = useCallback((prevStep: Step) => {
    setDirection("backward");
    setStep(prevStep);
  }, []);

  const handleAccountTypeSelected = useCallback(
    (type: "client" | "vendor") => {
      setAccountType(type);
      goForward(1);
    },
    [setAccountType, goForward],
  );

  const handleOtpVerified = useCallback(
    (verifiedEmail: string) => {
      setEmail(verifiedEmail);
      setEmailVerified(true);
      skipResetRef.current = true;
      closeAuth();
      openOnboarding();
    },
    [setEmail, setEmailVerified, closeAuth, openOnboarding],
  );

  const handleClose = useCallback(() => {
    if (skipResetRef.current) {
      // Programmatic close after verification — only reset local step state.
      skipResetRef.current = false;
      setTimeout(() => setStep(0), 200);
      return;
    }
    // User-initiated close (X button / Escape) — full reset.
    closeAuth();
    setTimeout(() => {
      setStep(0);
      reset();
    }, 200);
  }, [closeAuth, reset]);

  const handleOpenLogin = useCallback(() => {
    closeAuth();
    router.push("/login");
    reset();
    setStep(0);
  }, [closeAuth, router, reset]);

  return (
    <Dialog
      open={activeModal === "signup"}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className={cn(
          "max-h-[90vh] overflow-y-auto auth-modal-root border border-slate-200 bg-white/95 backdrop-blur-2xl text-slate-900 p-5 sm:p-6 rounded-[20px] shadow-2xl transition-all duration-300",
          step === 0
            ? "sm:max-w-[520px] md:max-w-[520px] !max-w-[520px]"
            : "sm:max-w-[440px] md:max-w-[440px] !max-w-[440px]"
        )}
      >
        <DialogTitle className="sr-only">Sign Up for StaffSync</DialogTitle>
        <DialogDescription className="sr-only">
          Complete registration steps to create your account.
        </DialogDescription>

        {/* Top glow decoration */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden rounded-[20px]">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-indigo-50/50 to-purple-50/50 blur-[60px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-blue-50/50 to-cyan-50/50 blur-[60px]" />
        </div>

        {/* Shimmer line */}
        <div className="signup-card-shimmer z-10" />

        <div className="relative z-10 w-full">
          {/* Framer-inspired segmented progress bar */}
          <div className="signup-progress-bar pr-8 sm:pr-10">
            {[0, 1].map((sIndex) => {
              const isCompleted = sIndex < step;
              const isActive = sIndex === step;
              return (
                <div
                  key={sIndex}
                  className={`signup-pseg ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
                />
              );
            })}
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {step === 0 && (
                <AccountTypeStep onSelect={handleAccountTypeSelected} />
              )}

              {step === 1 && accountType && (
                <EmailPasswordStep
                  accountType={accountType}
                  onOtpSent={handleOtpVerified}
                  onGoBack={() => goBackward(0)}
                  onLoginClick={handleOpenLogin}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SignupModal() {
  return <SignupModalContent />;
}
