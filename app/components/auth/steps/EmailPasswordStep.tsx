"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useFormik } from "formik";
import {
  signupEmailSchema,
  signupWithCompanySchema,
} from "@/app/components/auth/schemas/signup.schema";
import { GoogleAuthButton } from "@/app/components/auth/GoogleAuthButton";
import { signIn } from "next-auth/react";
import { publicApi } from "@/app/lib/axios";
import { ENDPOINTS } from "@/app/lib/endpoints";
import { toast } from "@/app/components/ui/toast";

import { Button } from "@/app/components/ui/button";
import { GlassButton2 } from "@/app/components/ui/glass-button-2";
import { Input } from "@/app/components/ui/input";
import { OtpInput } from "@/app/components/auth/steps/OtpInput";
import { LoadingOverlay } from "@/app/onboarding/components/LoadingOverlay";
import "@/app/components/auth/auth-modal.css";

interface EmailPasswordStepProps {
  accountType: "client" | "vendor";
  onOtpSent: (
    email: string,
    details?: { companyName?: string; companyWebsite?: string },
  ) => void | Promise<void>;
  onGoBack?: () => void;
  onLoginClick?: () => void;
  isDark?: boolean;
  showCompanyFields?: boolean;
}

function validateWithZod(
  values: {
    email: string;
    password: string;
    companyName?: string;
    companyWebsite?: string;
  },
  showCompanyFields = false,
) {
  const schema = showCompanyFields
    ? signupWithCompanySchema
    : signupEmailSchema;
  const result = schema.safeParse(values);
  if (result.success) return {};
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  }
  return errors;
}

function getPasswordStrength(
  pw: string,
  hasError?: boolean,
): {
  score: number;
  label: string;
  color: string;
} {
  const isSchemaValid = signupEmailSchema.shape.password.safeParse(pw).success;
  const hasValidationError = !isSchemaValid || Boolean(hasError);

  if (hasValidationError) {
    return { score: 1, label: "Weak", color: "#f87171" };
  }

  return { score: 2, label: "Strong", color: "var(--accent-success, #198754)" };
}

export function EmailPasswordStep({
  accountType,
  onOtpSent,
  onGoBack,
  onLoginClick,
  isDark = true,
  showCompanyFields = false,
}: EmailPasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [stage, setStage] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionIdLocal] = useState("");

  useEffect(() => {
    const handlePageShow = () => {
      setIsGoogleLoading(false);
      setIsOtpLoading(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", {
        callbackUrl:
          accountType === "client" ? "/client/dashboard" : "/vendor/dashboard",
      });
    } catch {
      toast.error("Google authentication failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      companyName: "",
      companyWebsite: "",
      email: "",
      password: "",
    },
    validate: (values) => validateWithZod(values, showCompanyFields),
    onSubmit: async (values) => {
      setIsOtpLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
        toast.success("OTP has been sent to your email");
        setStage("otp");
      } catch (error: any) {
        toast.error("Failed to send OTP. Please try again.");
      } finally {
        setIsOtpLoading(false);
      }
    },
  });

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP.");
      return;
    }
    setIsOtpLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
      toast.success("Email verified successfully!");
      await onOtpSent(formik.values.email, {
        companyName: formik.values.companyName,
        companyWebsite: formik.values.companyWebsite,
      });
    } catch (error: any) {
      toast.error("Invalid OTP.");
    } finally {
      setIsOtpLoading(false);
    }
  };

  const isLoading = isGoogleLoading || isOtpLoading;

  const isFormValid = useMemo(() => {
    if (!formik.values.email || !formik.values.password) return false;
    if (showCompanyFields) {
      if (
        !formik.values.companyName ||
        !formik.values.companyName.trim() ||
        !formik.values.companyWebsite ||
        !formik.values.companyWebsite.trim()
      ) {
        return false;
      }
    }
    return true;
  }, [formik.values, showCompanyFields]);

  const strength = useMemo(
    () =>
      getPasswordStrength(
        formik.values.password,
        Boolean(formik.errors.password),
      ),
    [formik.values.password, formik.errors.password],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-base font-bold tracking-tight text-white">
          Create Your Account
        </h2>
      </div>

      {/* Form Fields */}
      <form
        onSubmit={
          stage === "form"
            ? formik.handleSubmit
            : (e) => {
                e.preventDefault();
                handleVerifyOtp();
              }
        }
        className="space-y-2"
      >
        {/* Email Field */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 capitalize mb-0.5">
            Email <span className="text-red-400">*</span>
          </label>
          <div
            className={`glass-input-wrapper ${
              formik.touched.email && formik.errors.email ? "err" : ""
            } ${stage === "otp" ? "opacity-60" : ""}`}
          >
            <Input
              type="email"
              name="email"
              placeholder="you@company.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading || stage === "otp"}
              className="glass-minimal-input text-xs !h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-1 !shadow-none !ring-0 focus-visible:!ring-0"
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="mt-1 text-[11px] text-red-400">{formik.errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 capitalize mb-0.5">
            Password <span className="text-red-400">*</span>
          </label>
          <div
            className={`glass-input-wrapper relative flex items-center ${
              formik.touched.password &&
              formik.errors.password &&
              formik.values.password.length === 0
                ? "err"
                : ""
            } ${formik.values.password.length > 0 ? "has-strength" : ""} ${
              stage === "otp" ? "opacity-60" : ""
            }`}
            style={
              formik.values.password.length > 0
                ? ({
                    "--strength-color": strength.color,
                    borderBottomColor: strength.color,
                  } as React.CSSProperties)
                : undefined
            }
          >
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading || stage === "otp"}
              className="glass-minimal-input text-xs !h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-1 !shadow-none !ring-0 focus-visible:!ring-0 pr-8 tracking-[0.2em]"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 text-slate-400 hover:text-white hover:bg-transparent h-6 w-6 p-0"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>

          {formik.values.password.length > 0 && (
            <p
              className="text-[11px] mt-1 font-medium"
              style={{ color: strength.color }}
            >
              {strength.label}
            </p>
          )}

          {formik.touched.password && formik.errors.password && (
            <p className="mt-1 text-[11px] text-red-400">
              {formik.errors.password}
            </p>
          )}
        </div>
        {/* Company Name Field */}
        {showCompanyFields && (
          <div>
            <label className="block text-[10px] font-bold text-slate-400 capitalize mb-0.5">
              Company Name <span className="text-red-400">*</span>
            </label>
            <div
              className={`glass-input-wrapper ${
                formik.touched.companyName && formik.errors.companyName
                  ? "err"
                  : ""
              } ${stage === "otp" ? "opacity-60" : ""}`}
            >
              <Input
                type="text"
                name="companyName"
                placeholder="Example Corp Pvt Ltd."
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading || stage === "otp"}
                className="glass-minimal-input text-xs !h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-1 !shadow-none !ring-0 focus-visible:!ring-0"
              />
            </div>
            {formik.touched.companyName && formik.errors.companyName && (
              <p className="mt-1 text-[11px] text-red-400">
                {formik.errors.companyName}
              </p>
            )}
          </div>
        )}

        {/* Company Website Field */}
        {showCompanyFields && (
          <div>
            <label className="block text-[10px] font-bold text-slate-400 capitalize mb-0.5">
              Company Website <span className="text-red-400">*</span>
            </label>
            <div
              className={`glass-input-wrapper ${
                formik.touched.companyWebsite && formik.errors.companyWebsite
                  ? "err"
                  : ""
              } ${stage === "otp" ? "opacity-60" : ""}`}
            >
              <Input
                type="text"
                name="companyWebsite"
                placeholder="https://example.com"
                value={formik.values.companyWebsite}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading || stage === "otp"}
                className="glass-minimal-input text-xs !h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-1 !shadow-none !ring-0 focus-visible:!ring-0"
              />
            </div>
            {formik.touched.companyWebsite && formik.errors.companyWebsite && (
              <p className="mt-1 text-[11px] text-red-400">
                {formik.errors.companyWebsite}
              </p>
            )}
          </div>
        )}

        {/* Action Row / OTP Section */}
        {stage === "form" ? (
          <div className="pt-1.5 flex gap-3">
            {onGoBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onGoBack}
                className="glass-pill-btn-google !w-auto px-4 !h-9 !text-xs"
                style={{ fontSize: "12px" }}
              >
                Back
              </Button>
            )}
            {/* =========================================================================
                PRESERVED ORIGINAL SIGNUP BUTTON CODE (Preserved as requested - do not remove)
               ========================================================================= */}
            {/*
            <Button
              type="submit"
              disabled={
                isLoading || !formik.values.email || !formik.values.password
              }
              className="signup-button flex-1"
            >
              {isOtpLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing up...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <span className="arrow">→</span>
                </>
              )}
            </Button>
            */}

            {/* REUSABLE GlassButton2 COMPONENT */}
            <GlassButton2
              type="submit"
              size="form"
              disabled={isLoading || !isFormValid}
              isLoading={isOtpLoading}
              className="flex-1"
            >
              {isOtpLoading ? "Signing up..." : "Sign Up"}
            </GlassButton2>
          </div>
        ) : (
          <div className="pt-4 border-t border-white/[0.08]">
            <label className="block text-[10px] font-bold text-slate-400 capitalize mb-3">
              Enter OTP sent to your email
            </label>
            <div className="flex gap-4 items-center">
              <OtpInput
                length={4}
                value={otp}
                onChange={setOtp}
                disabled={isOtpLoading}
                isDark={true}
              />
              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otp.length !== 4 || isOtpLoading}
                className="cursor-pointer rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 glass-pill-btn-primary !w-auto px-4 !h-9 !text-xs flex items-center justify-center gap-1.5 shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #4F46E5 0%, #2563EB 50%, #0891B2 100%)",
                  fontSize: "12px",
                }}
              >
                {isOtpLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span className="text-xs">Verifying...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs">Verify OTP</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-1.5">
        <div className="flex-1 h-[1px] bg-white/[0.12]" />
        <span className="text-[11px] text-slate-400 font-normal">or</span>
        <div className="flex-1 h-[1px] bg-white/[0.12]" />
      </div>

      {/* Google Auth Button (Now below Get OTP) */}
      <div>
        <Button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          variant="outline"
          className="glass-pill-btn-google !h-8 !text-xs"
          style={{ fontSize: "12px" }}
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span className="text-xs">Continue with Google</span>
        </Button>
      </div>

      {/* Footer links */}
      <div className="pt-1.5 text-center text-[11px] text-slate-400">
        Already have an account?{" "}
        <Button
          type="button"
          variant="ghost"
          onClick={onLoginClick}
          className="text-white hover:underline hover:bg-transparent p-0 h-auto font-medium text-[11px]"
        >
          Login
        </Button>
      </div>
    </motion.div>
  );
}
