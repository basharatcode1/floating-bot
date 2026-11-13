import { z } from "zod";

const optionalUrlSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      try {
        const toTest =
          val.startsWith("http://") || val.startsWith("https://")
            ? val
            : `https://${val}`;
        const url = new URL(toTest);
        return Boolean(url.hostname && url.hostname.includes("."));
      } catch {
        return false;
      }
    },
    { message: "Must be a valid URL" }
  )
  .optional()
  .or(z.literal(""));

export const candidateValidationSchema = z.object({
  // 1. Basic Information
  basicInfo: z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    gender: z.enum(["Male", "Female", "Other"], {
      error: "Gender is required",
    }),
    designation: z.string().min(2, "Designation is required"),
    totalExperience: z.string().min(1, "Total experience is required"),
  }),

  // 2. Work Preferences
  workPreferences: z.object({
    deploymentType: z.enum(["Onsite", "Hybrid", "Remote"]),
    availability: z.enum(["Immediate Joiner", "Notice Period"]),
    engagementType: z.enum(["C-C", "C-H", "Both"]),
  }),

  // 3. Skills
  skills: z.object({
    primarySkills: z.array(z.string()).min(1, "At least one primary skill is required"),
    secondarySkills: z.array(z.string()).default([]),
  }),

  // 4. Location
  location: z.object({
    location: z.string().min(1, "Location is required"),
  }),

  // 5. Certifications
  certifications: z.object({
    certifications: z.array(z.string()).default([]),
  }),

  // 6. Work Experience
  workExperience: z.array(
    z.object({
      companyName: z.string().min(1, "Company name is required"),
      role: z.string().min(1, "Role is required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().min(1, "End date is required (or Present)"),
      projects: z.array(
        z.object({
          projectTitle: z.string().min(1, "Project title is required"),
          role: z.string().min(1, "Role is required"),
          startDate: z.string().min(1, "Start date is required"),
          endDate: z.string().min(1, "End date is required"),
          domain: z.string().min(1, "Domain is required"),
          projectDetails: z.string().optional(),
        })
      ).default([]),
    })
  ).default([]),

  // 7. Personal Projects (Optional)
  personalProjects: z
    .array(
      z.object({
        projectTitle: z.string().min(1, "Project title is required"),
        role: z.string().optional().default(""),
        domain: z.string().optional().default(""),
        technologies: z.array(z.string()).default([]),
        projectUrl: optionalUrlSchema,
        liveUrl: optionalUrlSchema,
        startDate: z.string().optional().default(""),
        endDate: z.string().optional().default(""),
        projectDetails: z.string().optional().default(""),
      })
    )
    .default([]),

  // 8. Education
  education: z.object({
    degree: z.string().min(1, "Degree is required"),
    institute: z.string().min(1, "Institute is required"),
    passingYear: z.string().min(1, "Passing year is required"),
    cgpaOrPercentage: z.string().optional(),
  }),

  // 9. Links
  links: z.object({
    linkedIn: z.string().url("Must be a valid URL").min(1, "LinkedIn URL is required"),
    github: optionalUrlSchema,
  }),

  // 10. Rate Details
  rateDetails: z
    .object({
      currency: z.string().min(1, "Currency is required"),
      rateType: z.enum(["Hourly", "Monthly", "Daywise"]),
      rateMin: z.coerce.number().min(0, "Minimum rate required"),
      rateMax: z.coerce.number().min(0, "Maximum rate required"),
    })
    .refine((data) => data.rateMax >= data.rateMin, {
      message: "Maximum rate must be greater than or equal to minimum rate",
      path: ["rateMax"],
    }),

  // 11. Achievements
  achievements: z.array(z.string()).default([]),
});

export type CandidateFormValues = z.infer<typeof candidateValidationSchema>;

export const initialCandidateFormValues: CandidateFormValues = {
  basicInfo: {
    firstName: "",
    lastName: "",
    gender: "Male",
    designation: "",
    totalExperience: "5 yrs",
  },
  workPreferences: {
    deploymentType: "Remote",
    availability: "Immediate Joiner",
    engagementType: "C-C",
  },
  skills: {
    primarySkills: [],
    secondarySkills: [],
  },
  location: {
    location: "",
  },
  certifications: {
    certifications: [],
  },
  workExperience: [],
  personalProjects: [],
  education: {
    degree: "",
    institute: "",
    passingYear: "",
    cgpaOrPercentage: "",
  },
  links: {
    linkedIn: "",
    github: "",
  },
  rateDetails: {
    currency: "INR (₹)",
    rateType: "Monthly",
    rateMin: 50000,
    rateMax: 150000,
  },
  achievements: [],
};

export const validateWithZod =
  (schema: z.ZodSchema) => (values: any) => {
    const result = schema.safeParse(values);
    if (result.success) return {};

    const errors: any = {};
    for (const issue of result.error.issues) {
      let current = errors;
      const path = issue.path;
      for (let i = 0; i < path.length; i++) {
        const key = path[i];
        if (i === path.length - 1) {
          current[key] = issue.message;
        } else {
          if (!current[key]) {
            current[key] = typeof path[i + 1] === "number" ? [] : {};
          }
          current = current[key];
        }
      }
    }
    return errors;
  };
