"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AuthModalProvider } from "@/app/components/auth/AuthModalContext";
import { GlassLoginCard } from "@/app/components/auth/GlassLoginCard";
import "@/app/components/auth/auth-modal.css";

function LoginCardWithAuth() {
  const router = useRouter();
  return <GlassLoginCard onOpenSignup={() => router.push("/get-started")} />;
}

export function LoginPageClient() {
  return (
    <AuthModalProvider>
      <div className="relative w-full max-w-[390px] sm:max-w-[410px] flex justify-center">
        {/* Luminous aurora glow positioned directly behind the glass card for the authentic frosted refraction */}
        <div className="absolute -top-16 -left-16 -right-16 -bottom-16 rounded-[48px] blur-[70px] sm:blur-[95px] pointer-events-none opacity-85 -z-10" />

        {/* Gradient shadow/border overlay around card */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[28px] sm:rounded-[32px]"
          style={{
            boxShadow:
              "30px 0 90px -5px color-mix(in srgb, var(--accent-primary) 35%, transparent)",
            clipPath: "inset(-100px)",
            WebkitClipPath: "inset(-100px)",
          }}
        />

        <LoginCardWithAuth />
      </div>
    </AuthModalProvider>
  );
}
