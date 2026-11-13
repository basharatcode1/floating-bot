"use client";

import { useState, useEffect, useCallback, cloneElement, isValidElement } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Phone,
  RefreshCw,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { OtpInput } from "@/app/components/auth/steps/OtpInput";
import { verifyOtp, generateOtp } from "@/app/lib/mockAuth";
import { isValidPhoneNumber } from "libphonenumber-js";


interface PhoneOtpVerificationProps {
  phoneNumber: string;
  isVerified: boolean;
  onVerified: () => void;
  onOtpSentChange?: (sent: boolean) => void;
  children?: React.ReactNode;
  inline?: boolean;
  hasLabel?: boolean;
}

const RESEND_COOLDOWN = 30;

export function PhoneOtpVerification({
  phoneNumber,
  isVerified: externalVerified,
  onVerified,
  onOtpSentChange,
  children,
  inline = true,
  hasLabel = true,
}: PhoneOtpVerificationProps) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(externalVerified);
  const [cooldown, setCooldown] = useState(0);

  const handleVerify = useCallback(async () => {
    if (otp.length !== 4) return;
    setIsVerifying(true);
    setError(null);

    try {
      const valid = await verifyOtp(phoneNumber, otp, "phone");
      if (valid) {
        setIsVerified(true);
        onVerified();
      } else {
        setError("Invalid OTP. Please check and try again.");
        setOtp("");
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }, [otp, phoneNumber, onVerified]);

  /* Sync external verified state */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVerified(externalVerified);
    }, 0);
    return () => clearTimeout(timer);
  }, [externalVerified]);

  /* Cooldown timer */
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOtp = useCallback(async () => {
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) return;
    setIsSending(true);
    setError(null);

    try {
      await generateOtp(phoneNumber, "phone");
      setOtpSent(true);
      onOtpSentChange?.(true);
      setCooldown(RESEND_COOLDOWN);
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsSending(false);
    }
  }, [phoneNumber, onOtpSentChange]);

  const handleResend = useCallback(async () => {
    setIsResending(true);
    setError(null);
    setOtp("");

    try {
      await generateOtp(phoneNumber, "phone");
      setCooldown(RESEND_COOLDOWN);
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  }, [phoneNumber]);

  /* ── Inline Rendering (Wrapped around input) ── */
  if (inline && children) {
    const actionElement = (
      <>
        {isVerified ? (
          <div className="h-[var(--dash-input-height)] px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-sm shadow-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            Verified
          </div>
        ) : !otpSent ? (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={
              isSending || !phoneNumber || !isValidPhoneNumber(phoneNumber)
            }
            className="h-[var(--dash-input-height)] px-5 rounded-xl bg-gradient-to-r from-[#005A9C] to-cyan-400 hover:from-[#004A82] hover:to-cyan-500 text-white text-xs font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-[#005A9C]/25 cursor-pointer"
          >
            {isSending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Phone className="w-3.5 h-3.5" />
                Get OTP
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setOtpSent(false);
              onOtpSentChange?.(false);
              setOtp("");
            }}
            className="h-[var(--dash-input-height)] px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 shrink-0 flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            Change
          </button>
        )}
      </>
    );

    return (
      <div className="space-y-3 w-full">
        {isValidElement(children) ? (
          cloneElement(children as React.ReactElement<any>, {
            action: actionElement,
          })
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">{children}</div>
            {actionElement}
          </div>
        )}

        {/* OTP digit entry drawer when otpSent & !isVerified */}
        {otpSent && !isVerified && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 backdrop-blur-md flex items-center justify-between gap-4 shadow-sm"
          >
            {/* Left side: w-fit text container with OTP boxes centered under text */}
            <div className="flex flex-col items-center gap-2 w-fit">
              <span className="text-xs font-medium text-slate-600 text-center whitespace-nowrap">
                Enter 4-digit code sent to{" "}
                <strong className="text-slate-900 font-bold">{phoneNumber}</strong>
              </span>

              <OtpInput
                length={4}
                value={otp}
                onChange={setOtp}
                disabled={isVerifying}
                error={!!error}
                className="justify-center"
              />

              {error && (
                <p className="text-xs text-rose-400 font-medium">{error}</p>
              )}
            </div>

            {/* Right side: Resend OTP top, Verify button bottom */}
            <div className="flex flex-col items-end justify-between gap-2.5 shrink-0">
              <div className="shrink-0 text-xs">
                {cooldown > 0 ? (
                  <span className="text-slate-500">
                    Resend in <strong className="text-slate-900 font-bold">{cooldown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold hover:underline disabled:opacity-50"
                  >
                    {isResending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={otp.length !== 4 || isVerifying}
                className="h-[var(--dash-input-height)] px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 text-white text-xs font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 shadow-md shadow-indigo-500/25"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Verifying
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verify
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  /* ── Already Verified (Standalone) ── */
  if (isVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 p-4 rounded-xl bg-[var(--ob-success-light)] border border-[var(--ob-success)]/20"
      >
        <ShieldCheck className="w-5 h-5 text-[var(--ob-success)] flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-[var(--ob-success)]">
            Phone Verified
          </p>
          <p className="text-xs text-[var(--ob-text-muted)]">
            {phoneNumber} has been successfully verified.
          </p>
        </div>
      </motion.div>
    );
  }

  /* ── Not Yet Sent (Standalone) ── */
  if (!otpSent) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={
            isSending || !phoneNumber || !isValidPhoneNumber(phoneNumber)
          }
          className="
            inline-flex items-center gap-2
            py-2.5 px-5 rounded-xl
            bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-sm font-semibold
            hover:from-indigo-600 hover:to-cyan-500 transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-sm hover:shadow-md
          "
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Phone className="w-4 h-4" />
              Get OTP
            </>
          )}
        </button>
        <p className="text-xs text-[var(--ob-text-muted)]">
          We&apos;ll send a verification code to your phone number.
        </p>
      </div>
    );
  }

  /* ── OTP Entry (Standalone) ── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 p-5 rounded-xl border border-[var(--ob-card-border)] bg-[var(--ob-bg-alt)]"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--ob-text)]">
        <Phone className="w-4 h-4 text-[var(--ob-primary)]" />
        Enter verification code
      </div>

      <p className="text-xs text-[var(--ob-text-muted)] flex items-center justify-between">
        <span>
          A 4-digit code was sent to{" "}
          <strong className="text-[var(--ob-text)]">{phoneNumber}</strong>
        </span>
        <button
          type="button"
          onClick={() => {
            setOtpSent(false);
            onOtpSentChange?.(false);
            setOtp("");
          }}
          className="text-xs text-[var(--ob-primary)] hover:underline ml-2"
        >
          Change number
        </button>
      </p>

      <OtpInput
        length={4}
        value={otp}
        onChange={setOtp}
        disabled={isVerifying}
        error={!!error}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-[var(--ob-error)]"
        >
          {error}
        </motion.p>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleVerify}
          disabled={otp.length !== 4 || isVerifying}
          className="
            inline-flex items-center gap-2
            py-2 px-5 rounded-lg
            bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-sm font-semibold
            hover:from-indigo-600 hover:to-cyan-500 transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Verifying
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              Verify
            </>
          )}
        </button>

        {cooldown > 0 ? (
          <span className="text-xs text-[var(--ob-text-muted)]">
            Resend in{" "}
            <span className="font-semibold text-[var(--ob-text)]">
              {cooldown}s
            </span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-1 text-xs text-[var(--ob-primary)] font-semibold hover:underline disabled:opacity-50"
          >
            {isResending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            Resend
          </button>
        )}
      </div>
    </motion.div>
  );
}
