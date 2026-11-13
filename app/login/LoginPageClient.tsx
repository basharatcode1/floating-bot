"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthModalProvider } from "@/app/components/auth/AuthModalContext";
import { GlassLoginCard } from "@/app/components/auth/GlassLoginCard";
import { LoginSkeleton } from "./LoginSkeleton";
import "@/app/components/auth/auth-modal.css";

function LoginCardWithAuth() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Bulletproof scrollbar hider for this specific page
    const style = document.createElement("style");
    style.innerHTML = `
      ::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        background: transparent !important;
      }
      * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
    `;
    document.head.appendChild(style);

    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/client/dashboard");
    } else {
      setChecking(false);
    }

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [router]);

  if (checking) {
    return <LoginSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 lg:py-2 flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 my-auto">
      {/* Left Side: Brand Display Heading */}
      <div className="flex-1 flex flex-col justify-center text-left max-w-xl w-full">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight select-none mb-2">
          STAFFSYNC
        </h1>

        <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-300/90 font-normal max-w-md leading-relaxed">
          Find top tech talent. Scale your team on-demand.
        </p>

        <div className="mt-4 flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Pre-vetted talent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Hire in 48 hours</span>
          </div>
        </div>
      </div>

      {/* Right Side: Frosted Glassmorphic Login Card */}
      <div className="flex-1 flex justify-center lg:justify-end w-full">
        <div className="relative w-full max-w-[340px] sm:max-w-[380px] flex justify-center">
          {/* Luminous aurora glow */}
          <div className="absolute -top-16 -left-16 -right-16 -bottom-16 rounded-[48px] blur-[70px] sm:blur-[95px] pointer-events-none opacity-85 -z-10" />

          <GlassLoginCard onOpenSignup={() => router.push("/get-started")} />
        </div>
      </div>
    </div>
  );
}

export function LoginPageClient() {
  return (
    <AuthModalProvider>
      <Suspense fallback={<LoginSkeleton />}>
        <LoginCardWithAuth />
      </Suspense>
    </AuthModalProvider>
  );
}
