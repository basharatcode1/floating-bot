"use client";

import React, { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

interface OnboardingLayoutShellProps {
  children: ReactNode;
  activeRole: "client" | "vendor";
}

export function OnboardingLayoutShell({
  children,
  activeRole,
}: OnboardingLayoutShellProps) {
  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col justify-between">
      {/* Main Content Container */}
      <main className="w-full flex-1 flex flex-col">
        <div className="w-full flex-1 auth-modal-root flex flex-col relative">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>
            Enterprise Grade Security & ISO 27001 Certified • 100% C-C & C-H
            Compliant
          </span>
        </div>
        <span className="whitespace-nowrap">
          © 2026 StaffSync Technologies Inc. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
