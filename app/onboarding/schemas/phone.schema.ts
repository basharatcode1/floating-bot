import { z } from "zod";
import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js";

export const phoneFieldSchema = z.object({
  mobileNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (val) => {
        if (!val) return false;
        try {
          return isValidPhoneNumber(val);
        } catch {
          return false;
        }
      },
      "Please enter a valid phone number"
    ),
  phoneCountry: z
    .string()
    .length(2, "Country code is required")
    .default("IN"),
});

export type PhoneSchemaType = z.infer<typeof phoneFieldSchema>;

/**
 * Creates a customizable phone Zod schema helper.
 */
export function createPhoneSchema(options?: {
  requiredMessage?: string;
  invalidMessage?: string;
  defaultCountry?: CountryCode;
}) {
  const reqMsg = options?.requiredMessage || "Phone number is required";
  const invMsg = options?.invalidMessage || "Please enter a valid phone number";

  return z.object({
    mobileNumber: z
      .string()
      .min(1, reqMsg)
      .refine((val) => {
        if (!val) return false;
        try {
          return isValidPhoneNumber(val);
        } catch {
          return false;
        }
      }, invMsg),
    phoneCountry: z
      .string()
      .length(2, "Country code is required")
      .default(options?.defaultCountry || "IN"),
  });
}

/**
 * Validates an optional phone number.
 * Returns true if empty/cleared/calling-code-only, or if a valid phone number according to country format.
 */
export function isOptionalPhoneValid(
  val?: string | null,
  defaultCountry: CountryCode = "IN"
): boolean {
  if (!val || typeof val !== "string") return true;
  const trimmed = val.trim();
  if (!trimmed || trimmed === "+") return true;
  // If only a country calling code (e.g. "+91" or "+1") without national digits, consider empty
  if (/^\+\d{1,4}$/.test(trimmed)) return true;

  try {
    return isValidPhoneNumber(trimmed, defaultCountry);
  } catch {
    return false;
  }
}

export const optionalPhoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => isOptionalPhoneValid(val),
    "Please enter a valid phone number or leave this field empty"
  );

export const requiredPhoneSchema = (
  requiredMsg = "Phone number is required",
  invalidMsg = "Please enter a valid phone number"
) =>
  z.string().superRefine((val, ctx) => {
    if (!val || typeof val !== "string") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: requiredMsg,
      });
      return;
    }
    const trimmed = val.trim();
    if (!trimmed || trimmed === "+" || /^\+\d{1,4}$/.test(trimmed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: requiredMsg,
      });
      return;
    }
    try {
      if (!isValidPhoneNumber(trimmed, "IN")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: invalidMsg,
        });
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: invalidMsg,
      });
    }
  });

