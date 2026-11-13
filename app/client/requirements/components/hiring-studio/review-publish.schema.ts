import { z } from "zod";
import type { ReviewPublishFormData } from "./review-publish.types";

export const reviewPublishSchema = z.object({
  basicDetails: z.object({
    jobTitle: z
      .string({ message: "Job Title is required" })
      .trim()
      .min(2, "Job Title must be at least 2 characters")
      .max(120, "Job Title must be under 120 characters"),
    experience: z
      .string({ message: "Experience is required" })
      .trim()
      .min(1, "Please select an experience level"),
    primarySkills: z
      .array(z.string())
      .min(1, "At least one Primary Skill is required"),
    secondarySkills: z
      .array(z.string())
      .min(1, "At least one Secondary Skill is required"),
    industryDomain: z.string().optional().default("Information Technology"),
  }),
  qualification: z.object({
    minimumEducation: z
      .string({ message: "Minimum Education is required" })
      .trim()
      .min(1, "Please select minimum educational qualification"),
    preferredEducation: z.string().optional().default(""),
    mandatoryCertifications: z.array(z.string()).optional().default([]),
  }),
  engagement: z.object({
    engagementType: z.enum(
      [
        "Contract to Contract (C-C)",
        "Contract to Hire (C-H)",
        "Both (C-C / C-H)",
      ] as const,
      { message: "Please select an engagement type" }
    ),
    expectedStartDate: z.string().optional().default(""),
    projectDuration: z.string().optional().default(""),
  }),
  hiringProcess: z.object({
    positions: z.coerce
      .number({ message: "Number of positions must be a number" })
      .min(1, "Number of positions must be at least 1")
      .max(20, "Number of positions cannot exceed 20"),
    interviewRounds: z.coerce
      .number({ message: "Interview rounds must be a number" })
      .min(1, "Interview rounds must be at least 1")
      .max(8, "Interview rounds cannot exceed 8"),
  }),
  workSchedule: z
    .object({
      workMode: z.enum(["Onsite", "Hybrid", "Remote"] as const, {
        message: "Please select a work mode",
      }),
      location: z.string().optional().default(""),
      shiftPreference: z
        .string({ message: "Shift Preference is required" })
        .trim()
        .min(1, "Please select a shift preference"),
      startTime: z.string().optional().default("09:00"),
      endTime: z.string().optional().default("18:00"),
    })
    .refine(
      (data) => {
        if (data.workMode === "Onsite" || data.workMode === "Hybrid") {
          return Boolean(data.location && data.location.trim().length > 0);
        }
        return true;
      },
      {
        message: "Location is required for Onsite/Hybrid work mode",
        path: ["location"],
      }
    ),
  budget: z
    .object({
      currency: z
        .string({ message: "Currency is required" })
        .trim()
        .min(1, "Please select a currency"),
      currencySymbol: z.string().optional().default("₹"),
      budgetType: z.enum(["Hourly", "Per Day", "Monthly"] as const, {
        message: "Please select a budget type",
      }),
      minBudget: z
        .union([z.string(), z.number()])
        .refine(
          (val) => String(val).trim().length > 0,
          "Minimum budget is required"
        )
        .refine(
          (val) => !isNaN(Number(val)) && Number(val) > 0,
          "Minimum budget must be a positive number"
        ),
      maxBudget: z
        .union([z.string(), z.number()])
        .refine(
          (val) => String(val).trim().length > 0,
          "Maximum budget is required"
        )
        .refine(
          (val) => !isNaN(Number(val)) && Number(val) > 0,
          "Maximum budget must be a positive number"
        ),
    })
    .refine(
      (data) => {
        const min = Number(data.minBudget);
        const max = Number(data.maxBudget);
        if (!isNaN(min) && !isNaN(max) && min > 0 && max > 0) {
          return max >= min;
        }
        return true;
      },
      {
        message: "Maximum budget must be greater than or equal to minimum budget",
        path: ["maxBudget"],
      }
    ),
  jobDescription: z.object({
    description: z.string().optional().default(""),
  }),
  compliance: z.object({
    legalRegistrationDocs: z.array(z.string()).optional().default([]),
    insuranceRequirements: z.array(z.string()).optional().default([]),
    companyCertifications: z.array(z.string()).optional().default([]),
  }),
  declarationAccepted: z.literal(true, {
    message: "Please review and accept the declaration before publishing",
  }),
});

export type ReviewPublishSchemaInput = z.infer<typeof reviewPublishSchema>;

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  firstError?: {
    field: string;
    message: string;
    sectionId: string;
    elementId: string;
  };
}

// Map field path to DOM container/section for auto-scrolling
export const FIELD_DOM_TARGETS: Record<
  string,
  { sectionId: string; elementId: string }
> = {
  "basicDetails.jobTitle": {
    sectionId: "basic-details",
    elementId: "field-jobTitle",
  },
  "basicDetails.experience": {
    sectionId: "basic-details",
    elementId: "field-experience",
  },
  "basicDetails.primarySkills": {
    sectionId: "basic-details",
    elementId: "container-primarySkills",
  },
  "basicDetails.secondarySkills": {
    sectionId: "basic-details",
    elementId: "container-secondarySkills",
  },
  "qualification.minimumEducation": {
    sectionId: "qualification-certifications",
    elementId: "field-minimumEducation",
  },
  "engagement.engagementType": {
    sectionId: "engagement-timeline",
    elementId: "field-engagementType",
  },
  "hiringProcess.positions": {
    sectionId: "hiring-process",
    elementId: "field-positions",
  },
  "hiringProcess.interviewRounds": {
    sectionId: "hiring-process",
    elementId: "field-interviewRounds",
  },
  "workSchedule.workMode": {
    sectionId: "work-schedule",
    elementId: "field-workMode",
  },
  "workSchedule.location": {
    sectionId: "work-schedule",
    elementId: "field-location",
  },
  "workSchedule.shiftPreference": {
    sectionId: "work-schedule",
    elementId: "field-shiftPreference",
  },
  "budget.currency": {
    sectionId: "budget",
    elementId: "field-currency",
  },
  "budget.budgetType": {
    sectionId: "budget",
    elementId: "field-budgetType",
  },
  "budget.minBudget": {
    sectionId: "budget",
    elementId: "field-minBudget",
  },
  "budget.maxBudget": {
    sectionId: "budget",
    elementId: "field-maxBudget",
  },
  declarationAccepted: {
    sectionId: "declaration",
    elementId: "field-declarationAccepted",
  },
};

export function validateReviewPublishForm(
  formData: ReviewPublishFormData,
  declarationAccepted: boolean
): ValidationResult {
  const result = reviewPublishSchema.safeParse({
    ...formData,
    declarationAccepted,
  });

  if (result.success) {
    return {
      isValid: true,
      errors: {},
    };
  }

  const errors: Record<string, string> = {};
  let firstError: ValidationResult["firstError"] = undefined;

  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
      if (!firstError) {
        const target = FIELD_DOM_TARGETS[path] || {
          sectionId: "basic-details",
          elementId: `field-${path}`,
        };
        firstError = {
          field: path,
          message: issue.message,
          sectionId: target.sectionId,
          elementId: target.elementId,
        };
      }
    }
  }

  return {
    isValid: false,
    errors,
    firstError,
  };
}
