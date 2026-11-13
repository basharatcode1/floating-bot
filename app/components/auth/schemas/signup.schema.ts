import { z } from "zod";

/* ═══════ Company Fields Schema ═══════ */
export const companyFieldsSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(120, "Company name must be under 120 characters"),
  companyWebsite: z
    .string()
    .min(1, "Company website is required")
    .refine((val) => {
      // 1. If it contains "://", the protocol must be http or https
      if (val.includes("://") && !/^https?:\/\//i.test(val)) {
        return false;
      }
      // 2. Reject obvious protocol typos starting with 'h' but missing proper format
      const cleanVal = val.toLowerCase();
      if (cleanVal.startsWith("h")) {
        if (
          (cleanVal.includes("www") &&
            !cleanVal.startsWith("http://www") &&
            !cleanVal.startsWith("https://")) ||
          (cleanVal.startsWith("http") &&
            !cleanVal.startsWith("http://") &&
            !cleanVal.startsWith("https://"))
        ) {
          return false;
        }
      }
      try {
        const urlToCheck = /^https?:\/\//i.test(val) ? val : `https://${val}`;
        const parsed = new URL(urlToCheck);
        return (
          parsed.hostname.includes(".") &&
          parsed.hostname.split(".").every((part) => part.length > 0)
        );
      } catch {
        return false;
      }
    }, "Enter a valid website URL (e.g. example.com or https://example.com)"),
});

/* ═══════ Email & Password Schema ═══════ */
export const signupEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Must contain at least one special character (!@#$%^&*)",
    ),
});

export type SignupEmailData = z.infer<typeof signupEmailSchema>;

/* ═══════ Full Signup Schema (Email, Password + Company Fields) ═══════ */
export const signupWithCompanySchema = signupEmailSchema.merge(companyFieldsSchema);

export type SignupWithCompanyData = z.infer<typeof signupWithCompanySchema>;

/* ═══════ OTP Schema ═══════ */
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});

export type OtpData = z.infer<typeof otpSchema>;
