import { z } from "zod";

export const jdValidationSchema = z.object({
  // 1. Basic Information
  basicInfo: z.object({
    jobTitle: z.string().min(2, "Job title is required"),
    locationType: z.enum(["Onsite", "Hybrid", "Remote"]),
    location: z.string().min(1, "Location is required"),
    primarySkills: z.array(z.string()).min(1, "At least one primary skill is required"),
    secondarySkills: z.array(z.string()).default([]),
    shift: z.string().min(1, "Shift preference is required"),
    shiftTiming: z.string().optional(),
    shiftStartTime: z.string().optional(),
    shiftEndTime: z.string().optional(),
  }),

  // 2. Hiring Details
  hiringDetails: z.object({
    interviewRounds: z.coerce
      .number()
      .min(1, "At least 1 interview round required")
      .max(8, "Maximum 8 interview rounds allowed"),
    positions: z.coerce
      .number()
      .min(1, "At least 1 position required")
      .max(20, "Maximum 20 positions allowed"),
  }),

  // 3. Engagement Type
  engagementType: z.object({
    jdTitle: z.string().optional(),
    location: z.string().optional(),
    budget: z.string().optional(),
    status: z.enum(["Active", "Draft", "Pending"]).default("Active"),
    engagementModel: z.array(z.string()).min(1, "At least one engagement model is required"),
    postedDate: z.string().optional(),
    positions: z.coerce.number().optional(),
  }),

  // 4. Qualification Requirement
  qualificationRequirement: z.object({
    experience: z.string().min(1, "Experience is required"),
    qualification: z.string().min(1, "Educational qualification is required"),
    domain: z.string().min(1, "Domain/Industry is required"),
    certification: z.array(z.string()).default([]),
  }),

  // 5. Compliance & Insurance
  complianceRequirements: z
    .object({
      complianceStatus: z.enum(["yes", "no", ""]).default(""),
      complianceCertifications: z.array(z.string()).default([]),
      insuranceRequirements: z.array(z.string()).default([]),
      legalRegistrationDocs: z.array(z.string()).default([]),
      companyCertifications: z.array(z.string()).default([]),
    })
    .superRefine((data, ctx) => {
      if (data.complianceStatus === "yes") {
        const docsCount = data.legalRegistrationDocs?.length || 0;
        const insuranceCount = data.insuranceRequirements?.length || 0;
        if (docsCount === 0 && insuranceCount === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select at least one legal registration document or insurance option",
            path: ["legalRegistrationDocs"],
          });
        }
      }
    }),

  // 5. Budget Information
  budgetInfo: z
    .object({
      currency: z.string().min(1, "Currency is required"),
      budgetType: z.enum(["Hourly", "Monthly", "Daywise"]),
      minBudget: z.coerce.number().min(0, "Minimum budget required"),
      maxBudget: z.coerce.number().min(0, "Maximum budget required"),
    })
    .refine((data) => data.maxBudget >= data.minBudget, {
      message: "Maximum budget must be greater than or equal to minimum budget",
      path: ["maxBudget"],
    }),

  // 6. Job Description
  jobDescription: z.object({
    jdSummary: z.string().min(10, "Job description summary must be at least 10 characters"),
  }),

  // 7. Project Timeline
  projectTimeline: z.object({
    startDate: z.string().min(1, "Start date is required"),
    projectDuration: z.string().optional(),
  }),
});

export type JDFormValues = z.infer<typeof jdValidationSchema>;

export const initialJDFormValues: JDFormValues = {
  basicInfo: {
    jobTitle: "",
    locationType: "Remote",
    location: "Remote",
    primarySkills: [],
    secondarySkills: [],
    shift: "UTC+05:30 (IST): India Standard Time",
    shiftTiming: "",
    shiftStartTime: "",
    shiftEndTime: "",
  },
  hiringDetails: {
    interviewRounds: 1,
    positions: 1,
  },
  engagementType: {
    jdTitle: "",
    location: "Remote",
    budget: "$50-$80/hr",
    status: "Active",
    engagementModel: [],
    postedDate: new Date().toISOString().split("T")[0],
    positions: 1,
  },
  qualificationRequirement: {
    experience: "5+ Years",
    qualification: "Bachelor's Degree",
    domain: "IT & Software Product Development",
    certification: [],
  },
  complianceRequirements: {
    complianceStatus: "",
    complianceCertifications: [],
    insuranceRequirements: [],
    legalRegistrationDocs: [],
    companyCertifications: [],
  },
  budgetInfo: {
    currency: "INR (₹)",
    budgetType: "Hourly",
    minBudget: 500,
    maxBudget: 2500,
  },
  jobDescription: {
    jdSummary: "",
  },
  projectTimeline: {
    startDate: new Date().toISOString().split("T")[0],
    projectDuration: "Monthly",
  },
};

export const validateWithZod = (schema: z.ZodSchema) => (values: any) => {
  const result = schema.safeParse(values);
  if (result.success) return {};

  const errors: Record<string, any> = {};
  for (const issue of result.error.issues) {
    let current = errors;
    const path = issue.path;
    for (let i = 0; i < path.length; i++) {
      const key = String(path[i]);
      if (i === path.length - 1) {
        current[key] = issue.message;
      } else {
        if (!current[key]) current[key] = {};
        current = current[key];
      }
    }
  }
  return errors;
};
