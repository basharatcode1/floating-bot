"use client";

import React from "react";

export interface OnboardingSkeletonProps {
  role?: "vendor" | "client";
}

const VENDOR_SKELETON_SECTIONS = [
  { id: "company-details", width: "w-44" },
  { id: "company-contact", width: "w-40" },
  { id: "point-of-contact", width: "w-48" },
  { id: "company-other-details", width: "w-36" },
  { id: "company-summary", width: "w-32" },
  { id: "compliance", width: "w-36" },
  { id: "social-links", width: "w-28" },
  { id: "declaration", width: "w-24" },
];

const CLIENT_SKELETON_SECTIONS = [
  { id: "company-details", width: "w-44" },
  { id: "company-contact", width: "w-40" },
  { id: "point-of-contact", width: "w-48" },
  { id: "company-other-details", width: "w-36" },
  { id: "company-summary", width: "w-32" },
  { id: "social-links", width: "w-28" },
  { id: "declaration", width: "w-24" },
];

/** Shimmer text line */
function ShimmerLine({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`ob-shimmer rounded-md ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/** Shimmer input field placeholder */
function ShimmerField({
  labelWidth = "w-28",
  height = "h-[var(--dash-input-height,42px)]",
  helperWidth,
  className = "",
}: {
  labelWidth?: string;
  height?: string;
  helperWidth?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label with icon placeholder */}
      <div className="flex items-center gap-1.5">
        <ShimmerLine className="w-3.5 h-3.5 rounded-sm !bg-slate-200" />
        <ShimmerLine className={`h-3 ${labelWidth}`} />
      </div>

      {/* Input box */}
      <div
        className={`w-full ${height} rounded-xl border border-slate-200/90 bg-white px-3.5 flex items-center justify-between shadow-xs`}
      >
        <div className="flex items-center gap-2.5 w-full">
          <ShimmerLine className="w-4 h-4 rounded-sm !bg-slate-200/80 shrink-0" />
          <ShimmerLine className="h-3 w-32 !bg-slate-100" />
        </div>
      </div>

      {/* Helper text if needed */}
      {helperWidth && (
        <ShimmerLine className={`h-2.5 ${helperWidth} !bg-slate-100 mt-1`} />
      )}
    </div>
  );
}

/** Form card wrapper matching FormCard.tsx 1:1 */
function SkeletonFormCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        w-full bg-white border border-[#cee1f1]
        rounded-2xl p-6 sm:p-8
        shadow-card text-slate-900
        relative transition-all duration-300
        ${className}
      `}
    >
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-slate-200/60 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}

/** Section heading matching SectionHeading.tsx (no real icons or text) */
function SkeletonSectionHeading({
  titleWidth = "w-48",
  descWidth = "w-72",
}: {
  titleWidth?: string;
  descWidth?: string;
}) {
  return (
    <div className="section-heading">
      <div className="section-heading-main">
        <div className="section-heading-icon">
          <ShimmerLine className="w-6 h-6 rounded-md !bg-slate-300/70 shrink-0" />
        </div>
        <div className="section-heading-text" style={{ gap: 6 }}>
          <ShimmerLine className={`h-4 ${titleWidth} !bg-slate-300/80`} />
          <ShimmerLine className={`h-2.5 ${descWidth} !bg-slate-100/90`} />
        </div>
      </div>
    </div>
  );
}

export function OnboardingSkeleton({
  role = "vendor",
}: OnboardingSkeletonProps) {
  const isVendor = role === "vendor";
  const sections = isVendor
    ? VENDOR_SKELETON_SECTIONS
    : CLIENT_SKELETON_SECTIONS;

  return (
    <div
      aria-busy="true"
      aria-label={`Loading ${isVendor ? "vendor" : "client"} registration form`}
      className="relative z-10 w-full min-h-screen flex flex-col justify-between"
    >
      {/* ── Scoped fluid shimmer keyframes ── */}
      <style>{`
        @keyframes ob-wave-shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .ob-shimmer {
          position: relative;
          overflow: hidden;
          background-color: #f1f5f9;
        }
        .ob-shimmer::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.65) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: ob-wave-shimmer 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          content: "";
        }
      `}</style>

      <main className="w-full flex-1 flex flex-col">
        <div className="w-full flex-1 auth-modal-root flex flex-col relative text-[var(--ob-text)]">
          {/* ── Page Header (Full Width matching OnboardingPageHeader) ── */}
          <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-3 flex-shrink-0">
            <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-8">
              {/* Left: Heading block matching sidebar width */}
              <div className="lg:w-[19.5rem] lg:flex-shrink-0 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <ShimmerLine className="h-7 w-44 !bg-slate-300/80 rounded-lg" />
                </div>
                <div className="flex items-center justify-between mt-2 leading-normal">
                  <ShimmerLine className="h-3 w-52 !bg-slate-200/80" />
                </div>
              </div>

              {/* Right: Auto-Fetched Banner placeholder */}
              <div className="flex-1 min-w-0 flex">
                <div className="relative w-full h-full rounded-xl border border-slate-200/80 bg-white px-5 py-3.5 flex items-center gap-3.5 shadow-card">
                  <ShimmerLine className="w-5 h-5 rounded-md !bg-slate-200 shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <ShimmerLine className="h-3.5 w-44 !bg-slate-300/80" />
                      <ShimmerLine className="w-2 h-2 rounded-full !bg-slate-200" />
                    </div>
                    <ShimmerLine className="h-3 w-4/5 max-w-xl !bg-slate-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Body: Floating Sidebar + Scrollable Form Cards ── */}
          <div className="flex flex-1 relative items-start gap-8 px-4 sm:px-6 lg:px-8 py-2">
            {/* ── Left Sidebar Nav Skeleton (Sticky, 19.5rem) ── */}
            <aside className="hidden lg:block flex-shrink-0 w-[19.5rem] z-20 self-start sticky top-6">
              <nav aria-label="Form sections skeleton" className="w-full">
                <div className="rounded-2xl border border-[#cee1f1] bg-white p-3 shadow-card">
                  {/* Header */}
                  <div className="px-3 pb-2.5 pt-1">
                    <ShimmerLine className="h-3 w-16 !bg-slate-200" />
                  </div>

                  {/* Nav items */}
                  <div className="flex flex-col gap-1">
                    {sections.map((section, idx) => {
                      const isActive = idx === 0;
                      return (
                        <div key={section.id} className="shrink-0">
                          <div
                            className={`
                              w-full flex items-center gap-2.5 rounded-lg px-3 py-2
                              ${isActive ? "bg-slate-100/70" : ""}
                            `}
                          >
                            {/* Step number badge shimmer */}
                            <ShimmerLine
                              className={`
                                size-5 shrink-0 rounded-full
                                ${isActive ? "!bg-slate-300" : "!bg-slate-200"}
                              `}
                            />

                            {/* Section title placeholder */}
                            <ShimmerLine
                              className={`h-3 ${section.width} ${
                                isActive
                                  ? "!bg-slate-300/80"
                                  : "!bg-slate-200/80"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </nav>
            </aside>

            {/* ── Main Form Cards Content ── */}
            <div className="flex-1 min-w-0 w-full space-y-6">
              {/* ═══════ Card 1: Company Registration Details ═══════ */}
              <SkeletonFormCard>
                <SkeletonSectionHeading
                  titleWidth="w-56"
                  descWidth="w-80"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ShimmerField labelWidth="w-24" />
                  <ShimmerField labelWidth="w-20" helperWidth="w-28" />
                  <ShimmerField labelWidth="w-20" helperWidth="w-28" />
                </div>
              </SkeletonFormCard>

              {/* ═══════ Card 2: Company Contact & POC Details (Combined) ═══════ */}
              <SkeletonFormCard>
                {/* Part A: Company Contact Details */}
                <SkeletonSectionHeading
                  titleWidth="w-48"
                  descWidth="w-72"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ShimmerField labelWidth="w-28" />
                  <ShimmerField labelWidth="w-40" />
                  <ShimmerField labelWidth="w-44" />
                  <ShimmerField labelWidth="w-24" />
                </div>

                {/* Section Divider */}
                <div className="border-t border-slate-200 my-8" />

                {/* Part B: Point of Contact (POC) Details */}
                <SkeletonSectionHeading
                  titleWidth="w-56"
                  descWidth="w-80"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ShimmerField labelWidth="w-20" />
                  <ShimmerField labelWidth="w-24" />
                  <ShimmerField labelWidth="w-24" />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <ShimmerLine className="w-3.5 h-3.5 rounded-sm !bg-slate-200" />
                      <ShimmerLine className="h-3 w-36" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full flex-1 h-[var(--dash-input-height,42px)] rounded-xl border border-slate-200/90 bg-white px-3.5 flex items-center shadow-xs">
                        <ShimmerLine className="h-3 w-28 !bg-slate-100" />
                      </div>
                      <ShimmerLine className="h-[var(--dash-input-height,42px)] w-24 rounded-xl !bg-slate-200/80 shrink-0" />
                    </div>
                  </div>
                </div>
              </SkeletonFormCard>

              {/* ═══════ Card 3: Company Other Details & Company Summary ═══════ */}
              {!isVendor ? (
                /* Client: Other Details + Summary */
                <SkeletonFormCard>
                  <SkeletonSectionHeading
                    titleWidth="w-48"
                    descWidth="w-72"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ShimmerField labelWidth="w-24" />
                    <ShimmerField labelWidth="w-20" />
                    <ShimmerField labelWidth="w-24" />
                    <ShimmerField labelWidth="w-24" />

                    {/* Company Certification (Full Width) */}
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <ShimmerLine className="w-3.5 h-3.5 rounded-sm !bg-slate-200" />
                        <ShimmerLine className="h-3 w-36" />
                      </div>
                      <div className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3 flex items-center gap-2">
                        <ShimmerLine className="h-6 w-20 rounded-md !bg-slate-200/80" />
                        <ShimmerLine className="h-6 w-24 rounded-md !bg-slate-200/80" />
                        <ShimmerLine className="h-3 w-28 !bg-slate-100" />
                      </div>
                    </div>
                  </div>

                  {/* Section Divider */}
                  <div className="border-t border-slate-200 my-8" />

                  {/* Company Summary */}
                  <SkeletonSectionHeading
                    titleWidth="w-40"
                    descWidth="w-80"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <ShimmerLine className="h-3 w-28" />
                      <ShimmerLine className="h-2.5 w-16 !bg-slate-100" />
                    </div>
                    <div className="w-full h-32 rounded-xl border border-slate-200/90 bg-slate-50/50 p-3.5 space-y-2.5">
                      <ShimmerLine className="h-3 w-5/6 !bg-slate-200/70" />
                      <ShimmerLine className="h-3 w-4/6 !bg-slate-200/70" />
                      <ShimmerLine className="h-3 w-3/6 !bg-slate-200/60" />
                    </div>
                  </div>
                </SkeletonFormCard>
              ) : (
                /* Vendor: Other Details + Summary + Compliance */
                <>
                  <SkeletonFormCard>
                    <SkeletonSectionHeading
                      titleWidth="w-48"
                      descWidth="w-80"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ShimmerField labelWidth="w-24" />
                      <ShimmerField labelWidth="w-24" />
                      <ShimmerField labelWidth="w-24" />
                      <ShimmerField labelWidth="w-32" />

                      {/* Company Certifications (Full Width) */}
                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <div className="flex items-center gap-1.5">
                          <ShimmerLine className="w-3.5 h-3.5 rounded-sm !bg-slate-200" />
                          <ShimmerLine className="h-3 w-36" />
                        </div>
                        <div className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3 flex items-center gap-2">
                          <ShimmerLine className="h-6 w-20 rounded-md !bg-slate-200/80" />
                          <ShimmerLine className="h-6 w-24 rounded-md !bg-slate-200/80" />
                          <ShimmerLine className="h-3 w-28 !bg-slate-100" />
                        </div>
                      </div>

                      {/* Tech Stack (Full Width) */}
                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <div className="flex items-center gap-1.5">
                          <ShimmerLine className="w-3.5 h-3.5 rounded-sm !bg-slate-200" />
                          <ShimmerLine className="h-3 w-24" />
                        </div>
                        <div className="w-full min-h-[52px] rounded-xl border border-slate-200/90 bg-white p-2.5 flex flex-wrap gap-2">
                          <ShimmerLine className="h-6 w-14 rounded-md !bg-slate-200/80" />
                          <ShimmerLine className="h-6 w-16 rounded-md !bg-slate-200/80" />
                          <ShimmerLine className="h-6 w-16 rounded-md !bg-slate-200/80" />
                          <ShimmerLine className="h-6 w-14 rounded-md !bg-slate-200/80" />
                          <ShimmerLine className="h-6 w-12 rounded-md !bg-slate-200/80" />
                          <ShimmerLine className="h-6 w-24 rounded-md !bg-slate-100" />
                        </div>
                      </div>
                    </div>

                    {/* Section Divider */}
                    <div className="border-t border-slate-200 my-8" />

                    {/* Company Summary */}
                    <SkeletonSectionHeading
                      titleWidth="w-40"
                      descWidth="w-80"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <ShimmerLine className="h-3 w-28" />
                        <ShimmerLine className="h-2.5 w-16 !bg-slate-100" />
                      </div>
                      <div className="w-full h-32 rounded-xl border border-slate-200/90 bg-slate-50/50 p-3.5 space-y-2.5">
                        <ShimmerLine className="h-3 w-5/6 !bg-slate-200/70" />
                        <ShimmerLine className="h-3 w-4/6 !bg-slate-200/70" />
                        <ShimmerLine className="h-3 w-3/6 !bg-slate-200/60" />
                      </div>
                    </div>
                  </SkeletonFormCard>

                  {/* Vendor Card 4: Compliance & Insurance Check */}
                  <SkeletonFormCard>
                    <SkeletonSectionHeading
                      titleWidth="w-48"
                      descWidth="w-80"
                    />
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5">
                        <ShimmerLine className="h-3 w-64" />
                      </div>
                      <div className="flex flex-row gap-3">
                        {/* Option 1 */}
                        <div className="flex-1 h-[var(--dash-input-height,42px)] rounded-lg border border-slate-200 bg-white px-3 flex items-center gap-2.5 shadow-xs">
                          <ShimmerLine className="w-4 h-4 rounded-full !bg-slate-200 shrink-0" />
                          <ShimmerLine className="h-3 w-32 !bg-slate-100" />
                        </div>
                        {/* Option 2 */}
                        <div className="flex-1 h-[var(--dash-input-height,42px)] rounded-lg border border-slate-200 bg-white px-3 flex items-center gap-2.5 shadow-xs">
                          <ShimmerLine className="w-4 h-4 rounded-full !bg-slate-200 shrink-0" />
                          <ShimmerLine className="h-3 w-28 !bg-slate-100" />
                        </div>
                      </div>
                    </div>
                  </SkeletonFormCard>
                </>
              )}

              {/* ═══════ Card: Digital Presence (Social Cards) ═══════ */}
              <SkeletonFormCard>
                <SkeletonSectionHeading
                  titleWidth="w-36"
                  descWidth="w-64"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((cardIdx) => (
                    <div key={cardIdx} className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <ShimmerLine className="w-10 h-10 rounded-lg !bg-slate-200 shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col justify-between h-10">
                          <ShimmerLine className="h-3.5 w-14 rounded-full !bg-slate-200/80" />
                          <div className="pb-1 pt-0.5 border-b-2 border-slate-200">
                            <ShimmerLine className="h-3 w-4/5 !bg-slate-100" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SkeletonFormCard>

              {/* ═══════ Card: Declaration ═══════ */}
              <SkeletonFormCard className="!p-4 sm:!py-3.5 sm:!px-6">
                <div className="flex items-start gap-3">
                  <ShimmerLine className="h-4 w-4 rounded border border-slate-200 !bg-slate-100 shrink-0 mt-0.5" />
                  <div className="space-y-2 flex-1 min-w-0">
                    <ShimmerLine className="h-3.5 w-24 !bg-slate-300/80" />
                    <ShimmerLine className="h-3 w-full !bg-slate-100" />
                    <ShimmerLine className="h-3 w-4/5 !bg-slate-100" />
                  </div>
                </div>
              </SkeletonFormCard>

              {/* ═══════ Sticky Actions Card (matches StickyFooterActions) ═══════ */}
              <div
                className="w-full bg-white border border-[#cee1f1] rounded-2xl p-4 sm:p-5 shadow-card text-slate-900 transition-all duration-300 relative"
                role="navigation"
                aria-label="Form navigation skeleton"
              >
                <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-slate-200/60 to-transparent pointer-events-none" />
                <div className="w-full flex items-center justify-between gap-3 sm:gap-4">
                  {/* Left: Security notice */}
                  <div className="flex items-center gap-2">
                    <ShimmerLine className="w-4 h-4 rounded-full !bg-slate-200 shrink-0" />
                    <ShimmerLine className="h-3 w-48 sm:w-64 !bg-slate-200" />
                  </div>

                  {/* Right: Submit Button placeholder */}
                  <ShimmerLine className="h-[var(--dash-input-height,42px)] w-36 sm:w-44 rounded-xl !bg-slate-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer Skeleton matching OnboardingLayoutShell ── */}
      <footer className="w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <ShimmerLine className="w-4 h-4 rounded-full !bg-slate-200 shrink-0" />
          <ShimmerLine className="h-3 w-64 sm:w-80 !bg-slate-200" />
        </div>
        <ShimmerLine className="h-3 w-44 sm:w-56 !bg-slate-200" />
      </footer>
    </div>
  );
}

export function VendorOnboardingSkeleton() {
  return <OnboardingSkeleton role="vendor" />;
}

export function ClientOnboardingSkeleton() {
  return <OnboardingSkeleton role="client" />;
}
