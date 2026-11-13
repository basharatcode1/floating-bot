import type { Answers, JDDraft } from "./types";
import {
  LEGAL_REGISTRATION_DOCS,
  INSURANCE_OPTIONS,
  CERTIFICATION_OPTIONS,
} from "@/app/onboarding/data/constants";

export {
  LEGAL_REGISTRATION_DOCS,
  INSURANCE_OPTIONS,
  CERTIFICATION_OPTIONS,
};

export interface ReviewPublishFormData {
  basicDetails: {
    jobTitle: string;
    experience: string;
    primarySkills: string[];
    secondarySkills: string[];
    industryDomain: string;
  };
  qualification: {
    minimumEducation: string;
    preferredEducation: string;
    mandatoryCertifications: string[];
  };
  engagement: {
    engagementType: "Contract to Contract (C-C)" | "Contract to Hire (C-H)" | "Both (C-C / C-H)";
    expectedStartDate: string;
    projectDuration: string;
  };
  hiringProcess: {
    positions: number;
    interviewRounds: number;
  };
  workSchedule: {
    workMode: "Onsite" | "Hybrid" | "Remote";
    location?: string;
    shiftPreference: string;
    startTime: string;
    endTime: string;
  };
  budget: {
    currency: string;
    currencySymbol: string;
    budgetType: "Hourly" | "Per Day" | "Monthly";
    minBudget: string;
    maxBudget: string;
  };
  jobDescription: {
    description: string;
  };
  compliance: {
    legalRegistrationDocs: string[];
    insuranceRequirements: string[];
    companyCertifications: string[];
  };
}

export const EXPERIENCE_OPTIONS = [
  "0-1 Years",
  "1-3 Years",
  "3-5 Years",
  "5-8 Years",
  "8-10 Years",
  "10+ Years",
];

export const INDUSTRY_OPTIONS = [
  "Information Technology",
  "Financial Services & Fintech",
  "Healthcare & Life Sciences",
  "E-Commerce & Retail",
  "SaaS & Enterprise Cloud",
  "Banking & Insurance",
  "Telecom & Networking",
  "Manufacturing & AutoTech",
];

export const EDUCATION_OPTIONS = [
  "Bachelor's Degree (B.Tech / B.E / B.Sc / BCA)",
  "Master's Degree (M.Tech / MCA / M.Sc)",
  "Diploma in Engineering / IT",
  "Doctorate / Ph.D.",
  "Any Graduate / Equivalent",
];

export const PREFERRED_EDUCATION_OPTIONS = [
  "Master's in Computer Science / IT",
  "B.Tech in CSE / IT / ECE",
  "B.Sc / BCA in Computer Science",
  "Any Post Graduate",
  "Industry Equivalent Certifications",
];

export const CERTIFICATION_SUGGESTIONS = [
  "AWS Certified Solutions Architect",
  "CKA - Certified Kubernetes Administrator",
  "Microsoft Certified: Azure Solutions Architect",
  "Google Professional Cloud Architect",
  "PMP - Project Management Professional",
  "Certified Scrum Master (CSM)",
  "CISSP - Information Systems Security",
];

export const DURATION_OPTIONS = [
  "3 Months",
  "6 Months",
  "9 Months",
  "12 Months",
  "Long Term (12+ Months)",
];

export const START_DATE_OPTIONS = [
  "Immediate (Within 7 Days)",
  "Within 15 Days",
  "Within 30 Days",
  "Within 45 Days",
  "Flexible / To be discussed",
];

export const WORK_MODE_OPTIONS = ["Onsite", "Hybrid", "Remote"] as const;

export const SHIFT_OPTIONS = [
  "UTC−05:00 (EST): Eastern Standard Time",
  "UTC−06:00 (CST): Central Standard Time",
  "UTC−08:00 (PST): Pacific Standard Time",
  "UTC+01:00 (CET): Central European Time",
  "UTC+05:30 (IST): India Standard Time",
  "UTC+08:00 (CST/SGT): China Standard / Singapore Time",
  "UTC +10 (AEST): Australian Eastern Standard Time",
  "Rotational Shift",
];

export const BUDGET_TYPE_OPTIONS = ["Hourly", "Per Day", "Monthly"] as const;

export const CURRENCY_OPTIONS = [
  { label: "INR (₹)", symbol: "₹", value: "INR" },
  { label: "USD ($)", symbol: "$", value: "USD" },
  { label: "EUR (€)", symbol: "€", value: "EUR" },
  { label: "GBP (£)", symbol: "£", value: "GBP" },
];

export const TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

export function buildInitialFormData(
  answers?: Answers,
  draft?: JDDraft
): ReviewPublishFormData {
  // Extract primary skills
  const primaryFromAnswers = answers?.mandatory
    ? answers.mandatory
        .split(/[,\n]+/)
        .map((s) => s.trim().replace(/^•\s*/, ""))
        .filter(Boolean)
    : [];

  const primaryFromDraft = draft?.required?.content
    ? draft.required.content
        .split(/[,\n]+/)
        .map((s) => s.trim().replace(/^•\s*/, ""))
        .filter(Boolean)
    : [];

  const primarySkills =
    primaryFromAnswers.length > 0
      ? primaryFromAnswers
      : primaryFromDraft.length > 0
        ? primaryFromDraft
        : ["React", "TypeScript", "Node.js"];

  // Extract secondary skills
  const secondaryFromAnswers = answers?.preferred
    ? answers.preferred
        .split(/[,\n]+/)
        .map((s) => s.trim().replace(/^•\s*/, ""))
        .filter(Boolean)
    : [];

  const secondaryFromDraft = draft?.preferred?.content
    ? draft.preferred.content
        .split(/[,\n]+/)
        .map((s) => s.trim().replace(/^•\s*/, ""))
        .filter(Boolean)
    : [];

  const secondarySkills =
    secondaryFromAnswers.length > 0
      ? secondaryFromAnswers
      : secondaryFromDraft.length > 0
        ? secondaryFromDraft
        : ["Docker", "AWS", "GraphQL"];

  // Determine work mode
  const workModeRaw =
    answers?.workMode ||
    (draft?.location?.content.includes("Hybrid")
      ? "Hybrid"
      : draft?.location?.content.includes("Onsite") ||
          draft?.location?.content.includes("On-site")
        ? "Onsite"
        : "Remote");

  const workMode: "Onsite" | "Hybrid" | "Remote" =
    workModeRaw === "Onsite" || workModeRaw === "Hybrid" || workModeRaw === "Remote"
      ? workModeRaw
      : "Remote";

  // Determine engagement type
  const isCH =
    answers?.employment?.includes("C-H") ||
    draft?.employment?.content.includes("C-H");
  const isCC =
    answers?.employment?.includes("C-C") ||
    draft?.employment?.content.includes("C-C");

  const engagementType:
    | "Contract to Contract (C-C)"
    | "Contract to Hire (C-H)"
    | "Both (C-C / C-H)" =
    isCH && isCC
      ? "Both (C-C / C-H)"
      : isCH
        ? "Contract to Hire (C-H)"
        : "Contract to Contract (C-C)";

  // Assemble comprehensive JD description
  const jdParts: string[] = [];
  if (draft?.overview?.content.trim()) {
    jdParts.push(`### Role Overview\n${draft.overview.content.trim()}`);
  }
  if (draft?.responsibilities?.content.trim()) {
    jdParts.push(`### Key Responsibilities\n${draft.responsibilities.content.trim()}`);
  }
  if (draft?.required?.content.trim()) {
    jdParts.push(`### Required Skills & Experience\n${draft.required.content.trim()}`);
  }
  if (draft?.preferred?.content.trim()) {
    jdParts.push(`### Preferred Qualifications\n${draft.preferred.content.trim()}`);
  }
  if (draft?.additional?.content.trim()) {
    jdParts.push(`### Additional Details\n${draft.additional.content.trim()}`);
  }

  const defaultDescription =
    jdParts.length > 0
      ? jdParts.join("\n\n")
      : "We are looking for an experienced Senior Software Engineer to build and optimize enterprise-grade client-facing cloud applications. You will collaborate closely with engineering, architecture, and product stakeholders to deliver high-quality, scalable solutions.";

  const initialLocation =
    answers?.location ||
    (draft?.location?.content &&
    !draft.location.content.toLowerCase().includes("remote")
      ? draft.location.content.split("·")[0]?.trim()
      : "Bengaluru, Karnataka, India");

  return {
    basicDetails: {
      jobTitle: answers?.title || "Senior Full Stack Engineer",
      experience: answers?.experience || "3-5 Years",
      primarySkills,
      secondarySkills,
      industryDomain: "Information Technology",
    },
    qualification: {
      minimumEducation: "Bachelor's Degree (B.Tech / B.E / B.Sc / BCA)",
      preferredEducation: "Master's in Computer Science / IT",
      mandatoryCertifications: [],
    },
    engagement: {
      engagementType,
      expectedStartDate: (() => {
        const d = new Date();
        if (answers?.urgency?.includes("Immediate")) {
          d.setDate(d.getDate() + 7);
        } else {
          d.setDate(d.getDate() + 30);
        }
        return d.toISOString().split("T")[0];
      })(),
      projectDuration: "3 to 6 months",
    },
    hiringProcess: {
      positions: parseInt(answers?.openings || "1") || 1,
      interviewRounds: parseInt(answers?.interviewRounds || "2") || 2,
    },
    workSchedule: {
      workMode,
      location: workMode === "Remote" ? "" : initialLocation,
      shiftPreference: "UTC+05:30 (IST): India Standard Time",
      startTime: "09:00",
      endTime: "18:00",
    },
    budget: {
      currency: "INR",
      currencySymbol: "₹",
      budgetType: "Monthly",
      minBudget: "80000",
      maxBudget: "120000",
    },
    jobDescription: {
      description: defaultDescription,
    },
    compliance: {
      legalRegistrationDocs: [],
      insuranceRequirements: [],
      companyCertifications: ["ISO 27001", "SOC2 Type II"],
    },
  };
}

