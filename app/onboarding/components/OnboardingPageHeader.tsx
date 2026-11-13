"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface OnboardingPageHeaderProps {
  role: "client" | "vendor";
  saveStatus?: string;
  showBanner?: boolean;
}

const ROLE_CONFIG = {
  client: {
    title: "Client Registration",
    bannerMessage:
      "We've simulated fetching  your company details and social handles. Please verify, make any adjustments needed, and click submit.",
  },
  vendor: {
    title: "Vendor Registration",
    bannerMessage:
      "We've simulated fetching your company details and social handles. Please verify, make any adjustments needed, and click submit.",
  },
};

export function OnboardingPageHeader({
  role,
  saveStatus,
  showBanner = true,
}: OnboardingPageHeaderProps) {
  const config = ROLE_CONFIG[role];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-3 flex-shrink-0">
      <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-8">
        {/* ── Header Title & Status (aligned with sidebar width) ── */}
        <div className="lg:w-[19.5rem] lg:flex-shrink-0 flex flex-col justify-center">
          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#005A9C] tracking-tight leading-tight">
            {config.title}
          </h1>

          {/* Subtitle Row: Required note on left, save status on right */}
          <div className="page-subtitle flex items-center justify-between">
            <span>Complete your company details to continue.</span>
            {saveStatus && (
              <span className="text-slate-400 text-xs font-normal">
                {saveStatus}
              </span>
            )}
          </div>
        </div>

        {/* ── Auto-Fetched Banner (aligned with form section) ── */}
        {showBanner && (
          <div className="flex-1 min-w-0 flex">
            <OnboardingAutoFetchedBanner role={role} />
          </div>
        )}
      </div>
    </div>
  );
}

export function OnboardingAutoFetchedBanner({
  role,
}: OnboardingPageHeaderProps) {
  const config = ROLE_CONFIG[role];

  return (
    <div className="relative w-full h-full rounded-xl border border-[#DBEAFE] bg-white px-5 py-3.5 flex items-center gap-3.5 shadow-card">
      {/* Icon */}
      <div className="flex-shrink-0">
        <Sparkles className="w-5 h-5 text-[#005A9C]" />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900 leading-snug">
          Profile Details Auto-Fetched
        </p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
          {config.bannerMessage}
        </p>
      </div>
    </div>
  );
}
