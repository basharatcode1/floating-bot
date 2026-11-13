"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  X,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { GlassButton2 } from "@/app/components/ui/glass-button-2";
import { Input } from "@/app/components/ui/input";
import { loginSchema, LoginData } from "./schemas/login.schema";
import { signIn } from "next-auth/react";
import { publicApi } from "@/app/lib/axios";
import { ENDPOINTS } from "@/app/lib/endpoints";
import { toast } from "@/app/components/ui/toast";
import { OtpInput } from "./steps/OtpInput";
import { generateOtp, verifyOtp } from "@/app/lib/mockAuth";
import {
  forgotEmailSchema,
  forgotResetSchema,
  type ForgotEmailData,
  type ForgotResetData,
} from "./schemas/forgot-password.schema";
import { useRouter } from "next/navigation";
import "@/app/components/auth/auth-modal.css";

const validateWithZod = (schema: any) => (values: any) => {
  const result = schema.safeParse(values);
  if (result.success) return {};
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  }
  return errors;
};

const fadeVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

interface GlassLoginCardProps {
  isModal?: boolean;
  onClose?: () => void;
  onOpenSignup?: () => void;
}

export function GlassLoginCard({
  isModal = false,
  onClose,
  onOpenSignup,
}: GlassLoginCardProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [stage, setStage] = useState<
    "login" | "forgot-email" | "forgot-otp" | "forgot-reset" | "forgot-success"
  >("login");
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const handlePageShow = () => {
      setIsLoading(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  /* Cooldown timer for OTP resend */
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const formik = useFormik<LoginData>({
    initialValues: { email: "", password: "" },
    validate: validateWithZod(loginSchema),
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
        toast.success("Successfully logged in (API bypassed)");

        // Use email content to determine role for now
        if (values.email.toLowerCase().includes("vendor")) {
          router.push("/vendor/dashboard");
        } else {
          router.push("/client/dashboard");
        }
      } catch (err: any) {
        console.error("Login Error:", err);
        toast.error("Invalid email or password. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const forgotEmailFormik = useFormik<ForgotEmailData>({
    initialValues: { email: "" },
    validate: validateWithZod(forgotEmailSchema),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await generateOtp(values.email, "email");
        setEmailForOtp(values.email);
        setOtp("");
        setOtpError(null);
        setCooldown(30);
        setStage("forgot-otp");
        toast.success("OTP sent to your email");
      } catch (err) {
        toast.error("Failed to send OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const forgotResetFormik = useFormik<ForgotResetData>({
    initialValues: { password: "", confirmPassword: "" },
    validate: validateWithZod(forgotResetSchema),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setStage("forgot-success");
        toast.success("Password reset successfully");
      } catch (err) {
        toast.error("Failed to reset password. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleVerifyOtp = async () => {
    if (otp.length === 0) {
      setOtpError("OTP is required.");
      return;
    }
    if (otp.length !== 4) {
      setOtpError("Please enter a valid 4-digit OTP.");
      return;
    }
    setIsVerifyingOtp(true);
    setOtpError(null);
    try {
      const valid = await verifyOtp(emailForOtp, otp, "email");
      if (valid) {
        setStage("forgot-reset");
        forgotResetFormik.resetForm();
      } else {
        setOtpError("Invalid OTP. Please check and try again.");
        setOtp("");
      }
    } catch {
      setOtpError("Verification failed. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setOtpError(null);
    setOtp("");
    try {
      await generateOtp(emailForOtp, "email");
      setCooldown(30);
    } catch {
      setOtpError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/client/dashboard" });
    } catch {
      toast.error("Google authentication failed. Please try again.");
      setIsLoading(false);
    }
  };
  return (
    <div className="glass-auth-card w-full max-w-[340px] sm:max-w-[380px] p-3 sm:p-4 text-white">
      {/* Top subtle close button if used inside modal */}
      {isModal && onClose && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      <AnimatePresence mode="wait">
        {/* ===== STAGE 1: SIGN IN ===== */}
        {stage === "login" && (
          <motion.div
            key="login"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22 }}
          >
            <form onSubmit={formik.handleSubmit} className="space-y-3">
              {/* Email Field */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 capitalize mb-1">
                  Email
                </label>
                <div
                  className={`glass-input-wrapper ${
                    formik.touched.email && formik.errors.email ? "err" : ""
                  }`}
                >
                  <Input
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    className="glass-minimal-input text-xs !h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-1.5 !shadow-none !ring-0 focus-visible:!ring-0"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 capitalize mb-1">
                  Password
                </label>
                <div
                  className={`glass-input-wrapper relative flex items-center ${
                    formik.touched.password && formik.errors.password
                      ? "err"
                      : ""
                  }`}
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    className="glass-minimal-input text-xs !h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-1.5 !shadow-none !ring-0 focus-visible:!ring-0 pr-8 tracking-[0.2em]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 text-slate-400 hover:text-white hover:bg-transparent h-7 w-7 p-0"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {formik.errors.password}
                  </p>
                )}

                {/* Forgot Password Link - Exactly like reference image */}
                <div className="flex justify-end mt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      if (formik.values.email) {
                        forgotEmailFormik.setFieldValue(
                          "email",
                          formik.values.email,
                        );
                      }
                      setStage("forgot-email");
                    }}
                    className="text-[11px] text-slate-400 hover:text-white hover:bg-transparent p-0 h-auto font-normal transition-colors"
                  >
                    Forgot password?
                  </Button>
                </div>
              </div>

              {/* Primary Sign In Button */}
              {/* =========================================================================
                  PRESERVED ORIGINAL SIGNIN BUTTON CODE (Preserved as requested - do not remove)
                 ========================================================================= */}
              {/*
              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="signup-button !h-9 !text-xs w-full"
                  style={{ fontSize: "12px" }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs">Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs">Sign In</span>
                      <span className="arrow">→</span>
                    </>
                  )}
                </Button>
              </div>
              */}

              {/* REUSABLE GlassButton2 COMPONENT */}
              <div className="pt-1">
                <GlassButton2
                  type="submit"
                  size="form"
                  disabled={isLoading}
                  isLoading={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </GlassButton2>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2.5">
                <div className="flex-1 h-[1px] bg-white/[0.12]" />
                <span className="text-xs text-slate-400 font-normal">or</span>
                <div className="flex-1 h-[1px] bg-white/[0.12]" />
              </div>

              {/* Google Auth Button */}
              <div>
                <Button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  variant="outline"
                  className="glass-pill-btn-google !h-9 !text-xs w-full"
                  style={{ fontSize: "12px" }}
                >
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
                  <span className="text-xs">Continue with Google</span>
                </Button>
              </div>

              {/* Bottom Notice & Links */}
              <div className="pt-2 text-center text-[11px] text-slate-400 space-y-1">
                <p>Accounts are provisioned by your admin.</p>
                <p>
                  Need access? or{" "}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      if (onOpenSignup) {
                        onOpenSignup();
                      } else {
                        router.push("/get-started");
                      }
                    }}
                    className="text-white hover:underline hover:bg-transparent p-0 h-auto font-medium text-[11px]"
                    style={{ fontSize: "11px" }}
                  >
                    create account
                  </Button>
                  .
                </p>
              </div>
            </form>
          </motion.div>
        )}

        {/* ===== STAGE 2: FORGOT PASSWORD - EMAIL ===== */}
        {stage === "forgot-email" && (
          <motion.div
            key="forgot-email"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22 }}
          >
            <div className="mb-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setStage("login");
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white hover:bg-transparent p-0 h-auto mb-4 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Button>
              <h3 className="text-xl font-bold tracking-tight text-white mb-1.5">
                Reset Password
              </h3>
              <p className="text-xs text-slate-400">
                Enter your work email address to receive a 4-digit verification
                code.
              </p>
            </div>

            <form
              onSubmit={forgotEmailFormik.handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-400 capitalize mb-1">
                  Email Address
                </label>
                <div
                  className={`glass-input-wrapper ${
                    forgotEmailFormik.touched.email &&
                    forgotEmailFormik.errors.email
                      ? "err"
                      : ""
                  }`}
                >
                  <Input
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={forgotEmailFormik.values.email}
                    onChange={forgotEmailFormik.handleChange}
                    onBlur={forgotEmailFormik.handleBlur}
                    disabled={isLoading}
                    className="glass-minimal-input !h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-1.5 !shadow-none !ring-0 focus-visible:!ring-0"
                  />
                </div>
                {forgotEmailFormik.touched.email &&
                  forgotEmailFormik.errors.email && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {forgotEmailFormik.errors.email}
                    </p>
                  )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="signup-button w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Code</span>
                    <span className="arrow">→</span>
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        )}

        {/* ===== STAGE 3: FORGOT PASSWORD - OTP VERIFICATION ===== */}
        {stage === "forgot-otp" && (
          <motion.div
            key="forgot-otp"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22 }}
          >
            <div className="mb-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setStage("forgot-email");
                  setOtpError(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white hover:bg-transparent p-0 h-auto mb-4 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Button>
              <h3 className="text-xl font-bold tracking-tight text-white mb-1.5">
                Enter Code
              </h3>
              <p className="text-xs text-slate-400">
                We sent a 4-digit code to{" "}
                <span className="text-white font-medium">{emailForOtp}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center py-2">
                <OtpInput
                  length={4}
                  value={otp}
                  onChange={setOtp}
                  disabled={isVerifyingOtp}
                  error={!!otpError}
                />
              </div>

              {otpError && (
                <p className="text-xs text-red-400 text-center">{otpError}</p>
              )}

              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp}
                className="signup-button w-full"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <span className="arrow">→</span>
                  </>
                )}
              </Button>

              {/* Resend Code Timer */}
              <div className="text-center text-xs text-slate-400">
                {cooldown > 0 ? (
                  <span>
                    Resend code in{" "}
                    <span className="text-white font-medium">{cooldown}s</span>
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-transparent p-0 h-auto text-xs"
                  >
                    {isResending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Resend code
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== STAGE 4: FORGOT PASSWORD - NEW PASSWORD ===== */}
        {stage === "forgot-reset" && (
          <motion.div
            key="forgot-reset"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22 }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold tracking-tight text-white mb-1.5">
                Set New Password
              </h3>
              <p className="text-xs text-slate-400">
                Choose a strong password with at least 8 characters.
              </p>
            </div>

            <form
              onSubmit={forgotResetFormik.handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-400 capitalize mb-1">
                  New Password
                </label>
                <div
                  className={`glass-input-wrapper relative flex items-center ${
                    forgotResetFormik.touched.password &&
                    forgotResetFormik.errors.password
                      ? "err"
                      : ""
                  }`}
                >
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={forgotResetFormik.values.password}
                    onChange={forgotResetFormik.handleChange}
                    onBlur={forgotResetFormik.handleBlur}
                    disabled={isLoading}
                    className="glass-minimal-input !h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-1.5 !shadow-none !ring-0 focus-visible:!ring-0 pr-8 tracking-[0.2em]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-0 text-slate-400 hover:text-white hover:bg-transparent h-7 w-7 p-0"
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
                {forgotResetFormik.touched.password &&
                  forgotResetFormik.errors.password && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {forgotResetFormik.errors.password}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 capitalize mb-1">
                  Confirm Password
                </label>
                <div
                  className={`glass-input-wrapper relative flex items-center ${
                    forgotResetFormik.touched.confirmPassword &&
                    forgotResetFormik.errors.confirmPassword
                      ? "err"
                      : ""
                  }`}
                >
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={forgotResetFormik.values.confirmPassword}
                    onChange={forgotResetFormik.handleChange}
                    onBlur={forgotResetFormik.handleBlur}
                    disabled={isLoading}
                    className="glass-minimal-input !h-auto !rounded-none !border-0 !bg-transparent !px-0 !py-1.5 !shadow-none !ring-0 focus-visible:!ring-0 pr-8 tracking-[0.2em]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 text-slate-400 hover:text-white hover:bg-transparent h-7 w-7 p-0"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {forgotResetFormik.touched.confirmPassword &&
                  forgotResetFormik.errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {forgotResetFormik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="signup-button w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Updating password...</span>
                  </>
                ) : (
                  <>
                    <span>Update Password</span>
                    <span className="arrow">→</span>
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        )}

        {/* ===== STAGE 5: FORGOT PASSWORD - SUCCESS ===== */}
        {stage === "forgot-success" && (
          <motion.div
            key="forgot-success"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22 }}
            className="text-center py-4"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white mb-2">
              Password Reset!
            </h3>
            <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto">
              Your password has been securely updated. You can now sign in with
              your new credentials.
            </p>
            <Button
              type="button"
              onClick={() => {
                setStage("login");
                formik.resetForm();
              }}
              className="signup-button w-full"
            >
              <span>Back to Sign In</span>
              <span className="arrow">→</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
