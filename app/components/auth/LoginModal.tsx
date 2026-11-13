"use client";

import React, { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useAuthModal } from "./AuthModalContext";
import { GlassLoginCard } from "./GlassLoginCard";

export function LoginModal() {
  const router = useRouter();
  const { activeModal, closeAuth } = useAuthModal();

  const handleClose = useCallback(() => {
    closeAuth();
  }, [closeAuth]);

  const handleOpenSignup = useCallback(() => {
    closeAuth();
    router.push("/get-started");
  }, [closeAuth, router]);

  return (
    <Dialog
      open={activeModal === "login"}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="p-0 border-none bg-transparent shadow-none !max-w-[460px] w-[calc(100%-32px)] sm:w-full overflow-visible focus:outline-none"
      >
        <DialogTitle className="sr-only">StaffSync Authentication</DialogTitle>
        <DialogDescription className="sr-only">
          Sign in or recover your password for your StaffSync account.
        </DialogDescription>

        {/* Ambient Aurora Glow directly behind the modal card */}
        <div className="absolute -inset-4 sm:-inset-8 pointer-events-none -z-10 overflow-visible">
          {/* Main radiant aurora flare */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full blur-[80px] sm:blur-[110px] opacity-75 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, 
                var(--accent-primary, #6366F1) 0%, 
                var(--gradient-to, #06B6D4) 45%, 
                rgba(25, 135, 84, 0.3) 70%, 
                transparent 85%)`,
            }}
          />
          {/* Diagonal high-luminance beam */}
          <div
            className="absolute top-[20%] left-[-20%] w-[140%] h-[120px] blur-[60px] opacity-60 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, 
                var(--accent-success, #198754) 0%, 
                var(--gradient-to, #06B6D4) 50%, 
                var(--accent-primary, #6366F1) 100%)`,
              transform: "rotate(-15deg)",
            }}
          />
        </div>

        {/* The Glassmorphism Login Card */}
        <GlassLoginCard
          isModal={true}
          onClose={handleClose}
          onOpenSignup={handleOpenSignup}
        />
      </DialogContent>
    </Dialog>
  );
}
