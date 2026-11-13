"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  MailCheck,
  ArrowRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { OtpInput } from "./OtpInput";
import { LoadingOverlay } from "@/app/onboarding/components/LoadingOverlay";
import { publicApi } from "@/app/lib/axios";
import { ENDPOINTS } from "@/app/lib/endpoints";
import { toast } from "@/app/components/ui/toast";

interface OtpVerificationStepProps {
  email: string;
  onVerified: () => void;
  onGoBack: () => void;
  isDark?: boolean;
}

const RESEND_COOLDOWN = 30; // seconds

export function OtpVerificationStep({
  email,
  onVerified,
  onGoBack,
  isDark = false,
}: OtpVerificationStepProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  const handleVerify = useCallback(async () => {
    if (otp.length === 0) {
      setError("OTP is required.");
      return;
    }
    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP.");
      return;
    }
    setIsVerifying(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
      setIsVerified(true);
      setShowLoader(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      onVerified();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP. Please check and try again.");
      setOtp("");
    } finally {
      setIsVerifying(false);
      setShowLoader(false);
    }
  }, [otp, email]);

  /* Cooldown timer */
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);




  const handleResend = useCallback(async () => {
    setIsResending(true);
    setError(null);
    setOtp("");

    try {
      // In a real scenario, this might need an endpoint to resend OTP using email.
      // E.g., await publicApi.post('/auth/resend-otp', { email });
      toast.info("Resend OTP initiated.");
      setCooldown(RESEND_COOLDOWN);
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  }, [email]);

  /* ── Verified State ── */
  if (isVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full text-center py-4"
      >
        {/* Success animation */}
        <div className="relative inline-flex items-center justify-center mb-4">
          <div className="absolute w-20 h-20 rounded-full bg-indigo-500/10 animate-ping" />
          <div className="absolute w-16 h-16 rounded-full bg-indigo-500/15" />
          <div className="relative w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>

        <h2 className={`text-base sm:text-lg font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
          Email Verified!
        </h2>
        <p className={`text-[10px] mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Your email <strong className={isDark ? "text-white" : "text-slate-900"}>{email}</strong> has been successfully verified.
        </p>

        <button
          type="button"
          onClick={onVerified}
          className={isDark ? "glass-pill-btn-primary w-full" : "signup-btn-main w-full"}
        >
          Continue to Registration
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  /* ── OTP Entry State ── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full text-center"
    >
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/15 mb-3">
        <MailCheck className="w-5 h-5 text-indigo-400" />
      </div>

      <h2 className={`text-base sm:text-lg font-bold mb-0.5 ${isDark ? "text-white" : "text-slate-900"}`}>
        Check Your Email
      </h2>
      <p className={`text-[10px] mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        We&apos;ve sent a 4-digit verification code to{" "}
        <strong className={isDark ? "text-white" : "text-slate-900"}>{email}</strong>
      </p>

      <div className={`${isDark ? "" : "signup-fields-card"} max-w-lg mx-auto space-y-3`}>
        {/* OTP Input */}
        <div className="flex justify-center">
          <OtpInput
            length={4}
            value={otp}
            onChange={setOtp}
            disabled={isVerifying}
            error={!!error}
          />
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] text-red-500 mb-2"
          >
            {error}
          </motion.p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onGoBack}
            className={isDark ? "glass-pill-btn-google px-5" : "signup-btn-back"}
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying}
            className={isDark ? "glass-pill-btn-primary flex-1" : "signup-btn-main"}
            style={isDark ? { background: "linear-gradient(135deg, #6366F1, #3B82F6, #06B6D4)" } : undefined}
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </div>
      </div>

      {/* Resend */}
      <div className={`flex items-center justify-center gap-2 text-[10px] mt-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        {cooldown > 0 ? (
          <span>
            Resend OTP in{" "}
            <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
              {cooldown}s
            </span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-1.5 text-indigo-400 font-semibold hover:underline disabled:opacity-50 bg-transparent border-none p-0 cursor-pointer"
          >
            {isResending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            Resend OTP
          </button>
        )}
      </div>

      <AnimatePresence>
        {showLoader && (
          <LoadingOverlay
            loaderText="PREPARING"
            message="Email verified! Preparing your onboarding..."
            hideBorder={true}
            variant={isDark ? "default" : "light"}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
