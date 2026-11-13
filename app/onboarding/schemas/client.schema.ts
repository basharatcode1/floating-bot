import { z } from "zod";
import { optionalPhoneSchema, requiredPhoneSchema } from "./phone.schema";

/* ═══════ Step 1: Company Information ═══════ */
export const clientCompanyInfoSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(120, "Company name must be under 120 characters"),
  gstNumber: z
    .string()
    .min(1, "GST Number is required")
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Enter a valid 15-character GST number (e.g. 22AAAAA0000A1Z5)"
    ),
  cin: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^[UL][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(val),
      "Enter a valid 21-character CIN"
    ),
  websiteUrl: z
    .string()
    .min(1, "Website URL is required")
    .refine((val) => {
      // 1. If it contains "://", the protocol must be http or https
      if (val.includes("://") && !/^https?:\/\//i.test(val)) {
        return false;
      }
      // 2. Reject obvious protocol typos starting with 'h' but missing proper format
      const cleanVal = val.toLowerCase();
      if (cleanVal.startsWith("h")) {
        if (
          (cleanVal.includes("www") && !cleanVal.startsWith("http://www") && !cleanVal.startsWith("https://www")) ||
          (cleanVal.startsWith("http") && !cleanVal.startsWith("http://") && !cleanVal.startsWith("https://"))
        ) {
          return false;
        }
      }
      try {
        const urlToCheck = /^https?:\/\//i.test(val) ? val : `https://${val}`;
        const parsed = new URL(urlToCheck);
        return parsed.hostname.includes(".") && parsed.hostname.split(".").every(part => part.length > 0);
      } catch {
        return false;
      }
    }, "Enter a valid URL (e.g. https://example.com)"),
  companyEmail: z
    .string()
    .min(1, "Company official email is required")
    .email("Enter a valid email address"),
  companyPhone: requiredPhoneSchema("Company contact number is required"),
  companyPhoneCountry: z.string().optional(),
  alternativePhone: optionalPhoneSchema,
  alternativePhoneCountry: z.string().optional(),
  /* Auto-filled by verification — editable */
  verifiedCompanyName: z.string().optional(),
  headquartersVerified: z.string().optional(),
  foundedYearVerified: z.string().optional(),
  aboutCompanyVerified: z.string().optional(),
  isVerified: z.boolean().optional(),
});

import { isValidPhoneNumber } from "libphonenumber-js";

/* ═══════ Step 2: Point of Contact ═══════ */
export const clientContactSchema = z.object({
  contactName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be under 80 characters"),
  designation: z
    .string()
    .min(1, "Designation is required")
    .max(80, "Designation must be under 80 characters"),
  mobileNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => {
      if (!val) return false;
      try {
        return isValidPhoneNumber(val);
      } catch {
        return false;
      }
    }, "Please enter a valid phone number"),
  phoneCountry: z.string().length(2, "Country code is required").default("IN"),
  contactEmail: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

/* ═══════ Step 3: Company Profile ═══════ */
export const clientProfileSchema = z.object({
  domain: z.string({ message: "Domain is required" }).min(1, "Domain is required"),
  headquarters: z.string().min(1, "Headquarters is required"),
  headquartersCoordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
    provider: z.enum(["google", "photon"]),
  }).optional(),
  companySize: z.string().optional(),
  foundedYear: z.string().min(1, "Founded Year is required"),
  certifications: z.array(z.string()).optional(),
  aboutCompany: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim().length === 0) return true;
      const words = val.trim().split(/\s+/).filter(Boolean);
      return words.length >= 100 && words.length <= 150;
    }, "Company summary must be between 100 and 150 words"),
});

/* ═══════ Step 4: Social Links ═══════ */
export const clientSocialSchema = z.object({
  linkedinUrl: z
    .string({ message: "LinkedIn URL is required" })
    .min(1, "LinkedIn URL is required")
    .refine(
      (val) => /^https?:\/\/(www\.)?linkedin\.com\//.test(val),
      "Enter a valid LinkedIn URL"
    ),
  twitterUrl: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//.test(val),
      "Enter a valid Twitter/X URL"
    ),
  instagramUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/(www\.)?instagram\.com\//.test(val),
      "Enter a valid Instagram URL"
    ),
});

export const clientDeclarationSchema = z.object({
  declarationAccepted: z.boolean().optional(),
});

/* ═══════ Full Client Schema ═══════ */
export const clientFormSchema = clientCompanyInfoSchema
  .merge(clientContactSchema)
  .merge(clientProfileSchema)
  .merge(clientSocialSchema)
  .merge(clientDeclarationSchema)
  .superRefine((data, ctx) => {
    if (
      data.companyEmail &&
      data.contactEmail &&
      data.companyEmail.trim().toLowerCase() === data.contactEmail.trim().toLowerCase()
    ) {
      const message = "Company Official Email and Point of Contact Email cannot be the same";
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["companyEmail"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["contactEmail"],
      });
    }
    if (!data.declarationAccepted) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You must accept the declaration to submit your onboarding profile",
        path: ["declarationAccepted"],
      });
    }
  });

export type ClientFormData = z.infer<typeof clientFormSchema>;

/* Step schemas array for validation gating */
export const clientStep1Schema = clientCompanyInfoSchema
  .merge(clientContactSchema)
  .superRefine((data, ctx) => {
    if (
      data.companyEmail &&
      data.contactEmail &&
      data.companyEmail.trim().toLowerCase() === data.contactEmail.trim().toLowerCase()
    ) {
      const message = "Company Official Email and Point of Contact Email cannot be the same";
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["companyEmail"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["contactEmail"],
      });
    }
  });
export const clientStep2Schema = clientProfileSchema
  .merge(clientSocialSchema)
  .merge(clientDeclarationSchema);

export const clientStepSchemas = [
  clientStep1Schema,
  clientStep2Schema,
] as const;

