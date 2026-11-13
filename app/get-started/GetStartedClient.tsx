"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthModalProvider } from "@/app/components/auth/AuthModalContext";
import { SignupProvider, useSignup } from "@/app/components/auth/SignupContext";
import { EmailPasswordStep } from "@/app/components/auth/steps/EmailPasswordStep";
import { OtpVerificationStep } from "@/app/components/auth/steps/OtpVerificationStep";
import { OnboardingModal } from "@/app/components/auth/OnboardingModal";
import { LoadingOverlay } from "@/app/onboarding/components/LoadingOverlay";
import "@/app/components/auth/auth-modal.css";

const ROLE_DETAILS = {
  client: {
    headlineMain: "Direct Access to",
    headlineAccent: "Verified Tech Talent.",
    description:
      "StaffSync connects pre-vetted engineering suppliers with growing enterprises. Built for C-C (Contract-to-Contract) and C-H (Contract-to-Hire) staffing, with zero intermediaries.",
    features: [
      {
        icon: Zap,
        iconColor: "text-[#005A9C]",
        title: "48-Hour Talent Delivery",
        desc: "Get qualified candidates for critical roles within 48 hours.",
      },
      {
        icon: ShieldCheck,
        iconColor: "text-[#005A9C]",
        title: "100% C-C & C-H Compliant",
        desc: "Pre-vetted agencies, streamlined agreements, and standardized compliance controls.",
      },
    ],
    stats: [
      { value: "48 hrs", label: "Average Match Time", color: "text-[#005A9C]" },
      { value: "500+", label: "Vetted Agencies", color: "text-[#005A9C]" },
      { value: "100%", label: "C-C / C-H Compliant", color: "text-[#005A9C]" },
    ],
    accentGlow:
      "radial-gradient(ellipse 90% 70% at 65% 25%, rgba(0, 90, 156, 0.45) 0%, rgba(6, 182, 212, 0.35) 45%, transparent 90%)",
  },
  vendor: {
    headlineMain: "Monetize Bench Talent.",
    headlineAccent: "Direct Enterprise Access.",
    description:
      "Deploy your bench consultants into verified enterprise contract openings with transparent tracking, zero middleman markups, and fast payouts.",
    features: [
      {
        icon: Briefcase,
        iconColor: "text-[#005A9C]",
        title: "Direct Client Pipeline",
        desc: "Access verified enterprise client requirements for C-C and C-H roles instantly.",
      },
      {
        icon: DollarSign,
        iconColor: "text-[#005A9C]",
        title: "Fast & Transparent Payouts",
        desc: "Zero hidden margins, standardized payment terms, and guaranteed fast invoicing.",
      },
    ],
    stats: [
      { value: "500+", label: "Enterprise Clients", color: "text-[#005A9C]" },
      { value: "100%", label: "Direct Contracts", color: "text-[#005A9C]" },
      { value: "Fast", label: "Guaranteed Payouts", color: "text-[#005A9C]" },
    ],
    accentGlow:
      "radial-gradient(ellipse 90% 70% at 65% 25%, rgba(0, 90, 156, 0.45) 0%, rgba(6, 182, 212, 0.35) 45%, transparent 90%)",
  },
};

export function GetStartedSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 animate-pulse">
      {/* Left Side Skeleton */}
      <div className="flex-1 flex flex-col justify-center text-left w-full max-w-xl lg:max-w-2xl">
        {/* Pill Badge */}
        <div className="h-6 bg-slate-700/30 rounded-full w-56 mb-4"></div>

        {/* Title */}
        <div className="h-8 sm:h-10 lg:h-12 bg-slate-700/30 rounded-xl w-3/4 mb-3"></div>
        <div className="h-8 sm:h-10 lg:h-12 bg-slate-700/30 rounded-xl w-2/4 mb-4"></div>

        {/* Description */}
        <div className="h-3 bg-slate-700/30 rounded-md w-full mb-2"></div>
        <div className="h-3 bg-slate-700/30 rounded-md w-5/6 mb-5"></div>

        {/* Feature Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-slate-700/30 shrink-0 mt-0.5"></div>
            <div className="flex-1">
              <div className="h-3.5 bg-slate-700/30 rounded w-28 mb-1.5"></div>
              <div className="h-2.5 bg-slate-700/30 rounded w-full mb-1"></div>
              <div className="h-2.5 bg-slate-700/30 rounded w-4/5"></div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-slate-700/30 shrink-0 mt-0.5"></div>
            <div className="flex-1">
              <div className="h-3.5 bg-slate-700/30 rounded w-28 mb-1.5"></div>
              <div className="h-2.5 bg-slate-700/30 rounded w-full mb-1"></div>
              <div className="h-2.5 bg-slate-700/30 rounded w-4/5"></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-3 border-t border-white/[0.08] mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-6 sm:h-7 lg:h-8 bg-slate-700/30 rounded-md w-12 sm:w-16 mb-1"></div>
              <div className="h-2 bg-slate-700/30 rounded-md w-16"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side Skeleton */}
      <div className="flex-1 flex justify-center lg:justify-end w-full max-w-[340px] sm:max-w-[400px] relative">
        <div className="relative w-full rounded-[24px] glass-auth-card p-3 sm:p-4 shadow-2xl overflow-hidden bg-white/[0.02] border border-white/[0.05]">
          {/* Tabs */}
          <div className="flex mb-4 w-full border-b border-white/[0.08] h-10">
            <div className="flex-1 bg-slate-700/30 rounded-t-lg mx-1"></div>
            <div className="flex-1 bg-transparent rounded-t-lg mx-1"></div>
          </div>

          {/* Form Content */}
          <div className="h-4 bg-slate-700/30 rounded-md w-40 mx-auto mb-2"></div>
          <div className="h-2.5 bg-slate-700/30 rounded-md w-full mb-1"></div>
          <div className="h-2.5 bg-slate-700/30 rounded-md w-5/6 mx-auto mb-6"></div>

          <div className="mb-3">
            <div className="h-2.5 bg-slate-700/30 rounded w-24 mb-1.5"></div>
            <div className="h-9 bg-slate-700/30 rounded-lg w-full"></div>
          </div>
          <div className="mb-3">
            <div className="h-2.5 bg-slate-700/30 rounded w-28 mb-1.5"></div>
            <div className="h-9 bg-slate-700/30 rounded-lg w-full"></div>
          </div>
          <div className="mb-3">
            <div className="h-2.5 bg-slate-700/30 rounded w-20 mb-1.5"></div>
            <div className="h-9 bg-slate-700/30 rounded-lg w-full"></div>
          </div>
          <div className="mb-4">
            <div className="h-2.5 bg-slate-700/30 rounded w-20 mb-1.5"></div>
            <div className="h-9 bg-slate-700/30 rounded-lg w-full"></div>
          </div>

          <div className="pt-2 flex gap-3 mb-6">
            <div className="h-9 bg-slate-700/30 rounded-full flex-1"></div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2.5">
            <div className="flex-1 h-[1px] bg-slate-700/30" />
            <div className="h-2 w-4 bg-slate-700/30 rounded"></div>
            <div className="flex-1 h-[1px] bg-slate-700/30" />
          </div>

          {/* Google Button */}
          <div className="h-9 bg-slate-700/30 rounded-full w-full mb-3"></div>

          {/* Footer Link */}
          <div className="h-2.5 bg-slate-700/30 rounded w-32 mx-auto mt-4"></div>
        </div>
      </div>
    </div>
  );
}

function GetStartedInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get("role");

  const [selectedRole, setSelectedRole] = useState<"client" | "vendor">(
    initialRoleParam === "vendor" ? "vendor" : "client",
  );

  const {
    setAccountType,
    setEmail,
    setEmailVerified,
    setCompanyName,
    setCompanyWebsite,
  } = useSignup();

  const [checking, setChecking] = useState(true);
  const [isVerifyingSuccess, setIsVerifyingSuccess] = useState(false);

  useEffect(() => {
    if (initialRoleParam === "vendor" || initialRoleParam === "client") {
      setSelectedRole(initialRoleParam);
    }
  }, [initialRoleParam]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/client/dashboard");
    } else {
      setChecking(false);
    }
  }, [router]);

  const handleRoleSelect = (role: "client" | "vendor") => {
    setSelectedRole(role);
    setAccountType(role);
  };

  const handleOtpVerified = useCallback(
    async (
      verifiedEmail: string,
      details?: { companyName?: string; companyWebsite?: string },
    ) => {
      setEmail(verifiedEmail);
      setEmailVerified(true);
      setAccountType(selectedRole);
      if (details?.companyName) {
        setCompanyName(details.companyName);
      }
      if (details?.companyWebsite) {
        setCompanyWebsite(details.companyWebsite);
      }
      setIsVerifyingSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      router.push(`/onboarding/${selectedRole}`);
    },
    [
      setEmail,
      setEmailVerified,
      setAccountType,
      setCompanyName,
      setCompanyWebsite,
      selectedRole,
      router,
    ],
  );

  if (checking) {
    return <GetStartedSkeleton />;
  }

  const roleData = ROLE_DETAILS[selectedRole];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 my-auto">
      {/* ================= LEFT SIDE: DYNAMIC VALUE PROPOSITION ================= */}
      <div className="flex-1 flex flex-col justify-center text-left w-full max-w-xl lg:max-w-2xl">
        {/* Dynamic Content Block */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRole}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[56px] font-extrabold tracking-[-0.03em] leading-[1.08] mb-4">
              <span className="text-white block">{roleData.headlineMain}</span>
              <span className="text-gradient-heading block">
                {roleData.headlineAccent}
              </span>
            </h1>

            <p className="text-xs sm:text-[13px] lg:text-sm text-slate-300/90 leading-relaxed mb-6 font-normal max-w-lg">
              {roleData.description}
            </p>

            {/* Feature Matrix - Clean unboxed list with glowing icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {roleData.features.map((feat) => (
                <div key={feat.title} className="flex items-start gap-3">
                  <feat.icon
                    className={`w-6 h-6 sm:w-7 sm:h-7 shrink-0 mt-0.5 ${feat.iconColor}`}
                    strokeWidth={2.2}
                    style={{
                      filter:
                        "drop-shadow(0 0 6px rgba(0, 90, 156, 0.9)) drop-shadow(0 0 16px rgba(0, 90, 156, 0.5))",
                    }}
                  />
                  <div>
                    <h4 className="text-[12px] sm:text-[13px] font-semibold text-white tracking-tight mb-1">
                      {feat.title}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed font-normal">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Platform Trust Highlights */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 border-t border-white/[0.08] mb-4">
              {roleData.stats.map((st) => (
                <div key={st.label}>
                  <div
                    className={`text-lg sm:text-xl lg:text-[22px] font-semibold tracking-tight ${st.color}`}
                  >
                    {st.value}
                  </div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 mt-1 font-normal">
                    {st.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ================= RIGHT SIDE: DIRECT REGISTRATION FORM WITH TABS ================= */}
      <div className="flex-1 flex justify-center lg:justify-end w-full max-w-[340px] sm:max-w-[380px] relative">
        {/* Dynamic Luminous Glow */}
        <div className="absolute -top-10 -left-10 -right-10 -bottom-10 rounded-[48px] blur-[70px] sm:blur-[90px] pointer-events-none opacity-80 -z-10 transition-all duration-500" />

        <div className="relative w-full rounded-[20px] sm:rounded-[24px] glass-auth-card p-2.5 sm:p-3 text-white shadow-2xl overflow-hidden auth-modal-root dark-theme">
          <div className="relative z-10 w-full">
            {/* Role Tab Switcher inside Card Header */}
            <div className="flex mb-2.5 w-full border-b border-white/[0.08]">
              <button
                type="button"
                onClick={() => handleRoleSelect("client")}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 text-[13px] font-semibold transition-all duration-300 cursor-pointer ${
                  selectedRole === "client"
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Building2
                  className={`w-3.5 h-3.5 transition-colors ${
                    selectedRole === "client"
                      ? "text-[#005A9C]"
                      : "text-slate-400"
                  }`}
                />
                <span
                  className={
                    selectedRole === "client"
                      ? "text-gradient-brand font-semibold"
                      : undefined
                  }
                >
                  I&apos;m a Client
                </span>
                {selectedRole === "client" && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gradient-brand" />
                )}
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("vendor")}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 text-[13px] font-semibold transition-all duration-300 cursor-pointer ${
                  selectedRole === "vendor"
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Briefcase
                  className={`w-3.5 h-3.5 transition-colors ${
                    selectedRole === "vendor"
                      ? "text-[#005A9C]"
                      : "text-slate-400"
                  }`}
                />
                <span
                  className={
                    selectedRole === "vendor"
                      ? "text-gradient-brand font-semibold"
                      : undefined
                  }
                >
                  I&apos;m a Vendor
                </span>
                {selectedRole === "vendor" && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gradient-brand" />
                )}
              </button>
            </div>

            <EmailPasswordStep
              accountType={selectedRole}
              onOtpSent={handleOtpVerified}
              onLoginClick={() => router.push("/login")}
              isDark={true}
              showCompanyFields={true}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isVerifyingSuccess && (
          <LoadingOverlay
            loaderText="PREPARING"
            message="Email verified! Preparing your onboarding..."
            hideBorder={true}
            variant="default"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export function GetStartedClient() {
  return (
    <AuthModalProvider>
      <SignupProvider>
        <Suspense fallback={<GetStartedSkeleton />}>
          <GetStartedInner />
        </Suspense>
        {/* Onboarding modal displays after OTP verification */}
        <OnboardingModal />
      </SignupProvider>
    </AuthModalProvider>
  );
}
