"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashPageHeader } from "@/app/components/ui/dash-page-header";
import RequirementsSkeleton from "./components/RequirementsSkeleton";
import JDUploadForm from "./components/JDUploadForm";
import { HiringStudio } from "./components/hiring-studio/HiringStudio";
import { preloadWelcomeMascot } from "./components/hiring-studio/mascot-preload";
import { JDFormValues, initialJDFormValues } from "./schemas/jd.schema";
import {
  Plus,
  Search,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  Pencil,
  Trash,
  ChevronDown,
  Check,
  Users,
  Eye,
  MoreVertical,
  User,
  ClipboardList,
  UserCheck,
  UserSearch,
} from "lucide-react";
import Sidebar from "../dashboard/components/Sidebar";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import { DashButton } from "@/app/components/ui/dash-button";
import { DashSearchInput } from "@/app/components/ui/dash-search-input";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { EmptyState } from "@/app/components/ui/empty-state";
import { SkillBadgeOverflow } from "@/app/components/ui/skill-badge-overflow";
import { CardSkillBadgeOverflow } from "@/app/components/ui/card-skill-badge-overflow";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { useDashboardTheme } from "../dashboard/DashboardThemeContext";
import { CertificatePopover } from "./components/CertificatePopover";
import { ConfirmationDialog } from "@/app/components/ui/confirmation-dialog";
import { JobDescriptionModal } from "@/app/components/JobDescriptionModal";
import { formatRateRange } from "@/app/lib/rate-format";
import { downloadJDPDF } from "@/app/lib/generate-jd-pdf";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from "@/app/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useSidebar } from "@/app/components/SidebarContext";
import { toast } from "@/app/components/ui/toast";
import { RawRequirementJson, parseRawRequirementJson } from "./utils/jdParser";

export type Requirement = {
  id: number;
  title: string;
  location: string;
  type: string;
  date: string;
  timezone: string;
  skills: string[];
  secondarySkills?: string[];
  experience?: string;
  certificates?: string[];
  certificate?: string;
  jdLink?: string;
  budget: string;
  budgetType?: "Hourly" | "Monthly" | "Daywise";
  positions: number;
  openPositions?: number;
  candidates: number;
  status: "Active" | "On Hold" | "Closed";
  interviewRounds?: number;
  education?: string;
  duration?: string;
  industry?: string;
  startDate?: string;
  description?: string;
  complianceRequirements?: {
    complianceStatus: string;
    complianceCertifications: string[];
    legalRegistrationDocs: string[];
    insuranceRequirements: string[];
    companyCertifications: string[];
  };
  // Incoming JSON schema fields
  location_city?: string | null;
  location_state?: string | null;
  location_country?: string | null;
  work_mode?: string | null;
  engagement_type?: string | null;
  primary_skills?: string[];
  secondary_skills?: string[];
  experience_min_years?: number | null;
  experience_max_years?: number | null;
  budget_min?: number | null;
  budget_max?: number | null;
  currency?: string | null;
  budget_type?: string | null;
  shift?: string | null;
  project_duration?: string | null;
  start_date?: string | null;
  qualification?: string | null;
  mandatory_certifications?: string[] | null;
  domain?: string | null;
  jd_summary?: string | null;
  inferred_fields?: string[] | null;
  rawJson?: RawRequirementJson;
};

/**
 * Requirement JSON format matching the backend/AI extractor payload.
 * When some fields are null or missing, static data fallbacks are applied without removing fields.
 */
export const rawJavaBackendRequirementJson: RawRequirementJson = {
  location_state: "Karnataka",
  budget_type: null,
  secondary_skills: [
    "Leadership",
    "Application Programming Interfaces (APIs)",
    "Windows operating system",
  ],
  interview_rounds: null,
  work_mode: null,
  project_duration: "3 to 6 months",
  start_date: null,
  engagement_type: "C-C",
  job_title: "Java Backend Developer",
  location_city: "Bengaluru",
  budget_max: null,
  jd_summary:
    "- Lead and guide the backend development team to implement APIs and microservices.\n- Ensure high-quality code and adherence to architectural standards.\n- Review code and enforce best practices.\n- Collaborate with the solution architect to align implementation with design.\n- Troubleshoot and resolve complex technical issues.\n- Work with the specified technology stack: Java 21, Spring Boot 3.2, JPA, Oracle, CI/CD pipelines, microservices architecture, and high-throughput applications.",
  positions: null,
  qualification: null,
  budget_min: 1700000.0,
  currency: "INR",
  experience_min_years: 5.0,
  shift: "IST",
  mandatory_certifications: null,
  experience_max_years: 8.0,
  domain: "NA",
  primary_skills: [
    "Java 21",
    "Spring Boot 3.2",
    "Java Persistence API (JPA)",
    "Oracle",
    "Continuous Integration and Continuous Deployment (CI/CD) pipelines",
    "High-throughput applications",
  ],
  location_country: "India",
  inferred_fields: ["domain"],
};

/**
 * Normalizes a raw backend JSON requirement into a full Requirement object.
 * If some fields are null or not coming from the JSON, supplies static fallbacks without dropping any fields.
 */
export function mapRawRequirementJsonToRequirement(
  raw: RawRequirementJson,
  id = 1,
  overrides?: Partial<Requirement>,
): Requirement {
  const jobTitle = raw.job_title || "Java Backend Developer";

  // Location handling with static fallbacks
  const city = raw.location_city || "Bengaluru";
  const state = raw.location_state || "Karnataka";
  const country = raw.location_country || "India";
  const workMode = raw.work_mode || "Hybrid";
  const location = `${workMode} - ${city}${state ? `, ${state}` : ""}`;

  // Primary Skills
  const primarySkills =
    raw.primary_skills && raw.primary_skills.length > 0
      ? raw.primary_skills
      : [
          "Java 21",
          "Spring Boot 3.2",
          "Java Persistence API (JPA)",
          "Oracle",
          "Continuous Integration and Continuous Deployment (CI/CD) pipelines",
          "High-throughput applications",
        ];

  // Secondary Skills
  const secondarySkills =
    raw.secondary_skills && raw.secondary_skills.length > 0
      ? raw.secondary_skills
      : [
          "Leadership",
          "Application Programming Interfaces (APIs)",
          "Windows operating system",
        ];

  // Experience
  const expMin = raw.experience_min_years ?? 5.0;
  const expMax = raw.experience_max_years ?? 8.0;
  const experience = `${expMin}-${expMax} Years`;

  // Budget
  const isINR = (raw.currency || "INR").toUpperCase().includes("INR");
  const currencySymbol = isINR ? "₹" : "$";
  const budgetType: "Hourly" | "Monthly" | "Daywise" =
    (raw.budget_type as "Hourly" | "Monthly" | "Daywise") || "Monthly";

  const budgetMin = raw.budget_min ?? 1700000;
  const budgetMax = raw.budget_max ?? 2200000;

  const formatCompact = (val: number) => {
    if (val >= 100000) {
      const lakhs = val / 100000;
      return `${currencySymbol}${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
    }
    if (val >= 1000) {
      const k = val / 1000;
      return `${currencySymbol}${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
    }
    return `${currencySymbol}${val}`;
  };

  const budget = `${formatCompact(budgetMin)}-${formatCompact(budgetMax)}`;

  // Hiring & Positions
  const positions = raw.positions != null ? Number(raw.positions) : 2;
  const interviewRounds =
    raw.interview_rounds != null ? Number(raw.interview_rounds) : 3;
  const qualification =
    raw.qualification || "Bachelor's Degree in Computer Science / IT";
  const duration = raw.project_duration || "3 to 6 Months";
  const startDate = raw.start_date || "1 May 2026";
  const engagementType = raw.engagement_type || "C-C";
  const timezone = raw.shift || "IST";

  // Certifications
  const certs =
    raw.mandatory_certifications && raw.mandatory_certifications.length > 0
      ? raw.mandatory_certifications
      : [
          "Oracle Certified Professional: Java SE",
          "Spring Certified Professional",
          "AWS Certified Developer",
        ];

  const domainVal =
    raw.domain && raw.domain !== "NA"
      ? raw.domain
      : "IT & Software Product Development";

  const jdSummary =
    raw.jd_summary ||
    "- Lead and guide the backend development team to implement APIs and microservices.\n- Ensure high-quality code and adherence to architectural standards.\n- Review code and enforce best practices.\n- Collaborate with the solution architect to align implementation with design.\n- Troubleshoot and resolve complex technical issues.\n- Work with the specified technology stack: Java 21, Spring Boot 3.2, JPA, Oracle, CI/CD pipelines, microservices architecture, and high-throughput applications.";

  const today = new Date();
  const dateStr =
    overrides?.date ||
    `${today.getDate()} ${today.toLocaleString("default", { month: "long" })} ${today.getFullYear()}`;

  return {
    id,
    title: jobTitle,
    location,
    type: engagementType,
    date: dateStr,
    timezone,
    skills: primarySkills,
    secondarySkills,
    experience,
    certificates: certs,
    certificate: certs[0],
    jdLink: "#",
    budget,
    budgetType,
    positions,
    openPositions: overrides?.openPositions ?? positions,
    candidates: overrides?.candidates ?? 4,
    status: overrides?.status ?? "Active",
    interviewRounds,
    education: qualification,
    duration,
    industry: domainVal,
    startDate,
    description: jdSummary,
    jd_summary: jdSummary,
    complianceRequirements: {
      complianceStatus: "yes",
      complianceCertifications: ["ISO 27001", "SOC 2 Type II"],
      legalRegistrationDocs: ["GST Certificate", "PAN Card"],
      insuranceRequirements: [
        "General Liability Insurance",
        "Professional Indemnity",
      ],
      companyCertifications: ["ISO 9001"],
    },
    // Raw backend fields
    rawJson: raw,
    location_city: raw.location_city ?? city,
    location_state: raw.location_state ?? state,
    location_country: raw.location_country ?? country,
    work_mode: raw.work_mode ?? workMode,
    engagement_type: engagementType,
    primary_skills: primarySkills,
    secondary_skills: secondarySkills,
    experience_min_years: expMin,
    experience_max_years: expMax,
    budget_min: budgetMin,
    budget_max: budgetMax,
    currency: raw.currency ?? "INR",
    budget_type: budgetType,
    shift: timezone,
    project_duration: duration,
    start_date: startDate,
    qualification,
    mandatory_certifications: certs,
    domain: raw.domain ?? "NA",
    inferred_fields: raw.inferred_fields ?? ["domain"],
    ...overrides,
  };
}

const initialRequirements: Requirement[] = [
  mapRawRequirementJsonToRequirement(rawJavaBackendRequirementJson, 1, {
    date: "24 March 2026",
    candidates: 4,
    openPositions: 2,
  }),
  {
    id: 2,
    title: "Senior React Developer",
    industry: "IT & Software",
    startDate: "1 April 2026",
    location: "Bangalore",
    type: "C-C",
    date: "15 March 2026",
    timezone: "IST",
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Redux",
      "Tailwind CSS",
      "JavaScript",
      "GraphQL",
      "REST APIs",
      "Jest",
      "Webpack",
    ],
    secondarySkills: [
      "Node.js",
      "PostgreSQL",
      "Docker",
      "Git",
      "AWS",
      "CI/CD",
      "Storybook",
      "HTML5",
      "CSS3",
      "Figma",
    ],
    experience: "5-7 Years",
    certificates: [
      "AWS Certified Developer",
      "Google Cloud Professional Architect",
      "Certified Kubernetes Administrator (CKA)",
      "Meta Certified Front-End Developer",
    ],
    certificate: "AWS Certified Developer",
    jdLink: "#",
    budget: "₹15-18L",
    budgetType: "Monthly",
    positions: 3,
    openPositions: 2,
    candidates: 5,
    status: "Active",
    education: "Bachelor's in CS / IT",
    duration: "12 Months",
    complianceRequirements: {
      complianceStatus: "yes",
      complianceCertifications: ["ISO 27001", "SOC 2 Type II"],
      legalRegistrationDocs: ["GST Certificate", "PAN Card"],
      insuranceRequirements: [
        "General Liability Insurance",
        "Professional Indemnity",
      ],
      companyCertifications: ["ISO 9001"],
    },
  },
  {
    id: 3,
    title: "Node.js Backend Engineer",
    industry: "IT & Software",
    startDate: "10 April 2026",
    location: "Remote",
    type: "C-C",
    date: "12 March 2026",
    timezone: "UST",
    skills: [
      "Node.js",
      "Express",
      "TypeScript",
      "MongoDB",
      "PostgreSQL",
      "Mongoose",
      "REST APIs",
      "Microservices",
      "GraphQL",
      "Redis",
    ],
    secondarySkills: [
      "Docker",
      "Kubernetes",
      "AWS",
      "Kafka",
      "RabbitMQ",
      "CI/CD",
      "Jest",
      "Git",
      "Prisma",
      "Elasticsearch",
    ],
    experience: "4-6 Years",
    certificates: [
      "Node.js Certified Developer",
      "AWS Certified Solutions Architect",
      "MongoDB Certified Developer",
      "Docker Certified Associate",
    ],
    certificate: "Node.js Certified Developer",
    jdLink: "#",
    budget: "₹12-16L",
    budgetType: "Monthly",
    positions: 2,
    openPositions: 1,
    candidates: 3,
    status: "Active",
    interviewRounds: 2,
    education: "Bachelor's Degree",
    duration: "6 Months",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    industry: "Design & Creative",
    startDate: "15 April 2026",
    location: "Hybrid - Mumbai",
    type: "C-H",
    date: "10 March 2026",
    timezone: "IST",
    skills: [
      "Figma",
      "Adobe XD",
      "UI Design",
      "UX Research",
      "Wireframing",
      "Prototyping",
      "Design Systems",
      "User Flows",
      "Sketch",
    ],
    secondarySkills: [
      "HTML5",
      "CSS3",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Micro-interactions",
      "Usability Testing",
      "After Effects",
      "Information Architecture",
      "Design Thinking",
    ],
    experience: "3+ Years",
    certificates: [
      "Google UX Design Professional",
      "Nielsen Norman Group UX Master",
      "Interaction Design Foundation Specialist",
      "Adobe Certified Professional",
    ],
    certificate: "Google UX Design Professional",
    jdLink: "#",
    budget: "₹10-14L",
    budgetType: "Monthly",
    positions: 1,
    openPositions: 1,
    candidates: 1,
    status: "Active",
    interviewRounds: 3,
    education: "Any Graduate / Design Diploma",
    duration: "Permanent",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    industry: "DevOps & Infrastructure",
    startDate: "20 April 2026",
    location: "Pune",
    type: "C-H",
    date: "5 March 2026",
    timezone: "PST",
    skills: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Ansible",
      "Jenkins",
      "CI/CD Pipelines",
      "Linux",
      "Git",
      "Helm",
    ],
    secondarySkills: [
      "Python",
      "Bash Scripting",
      "Prometheus",
      "Grafana",
      "ArgoCD",
      "ELK Stack",
      "HashiCorp Vault",
      "Networking & Security",
      "GCP",
    ],
    experience: "5+ Years",
    certificates: [
      "AWS Solutions Architect",
      "Certified Kubernetes Administrator (CKA)",
      "HashiCorp Certified Terraform Associate",
      "Red Hat Certified Engineer (RHCE)",
    ],
    certificate: "AWS Solutions Architect",
    jdLink: "#",
    budget: "₹20-25L",
    budgetType: "Monthly",
    positions: 2,
    openPositions: 0,
    candidates: 4,
    status: "Closed",
    interviewRounds: 4,
    education: "B.Tech/M.Tech in CS/EE",
    duration: "6 Months",
  },
  {
    id: 6,
    title: "Data Scientist",
    industry: "Data Science & AI",
    startDate: "1 May 2026",
    location: "Hyderabad",
    type: "C-C",
    date: "3 March 2026",
    timezone: "IST",
    skills: [
      "Python",
      "Machine Learning",
      "TensorFlow",
      "Pandas",
      "NumPy",
      "Keras",
      "Scikit-Learn",
      "PyTorch",
      "Data Analysis",
      "SQL",
    ],
    secondarySkills: [
      "Deep Learning",
      "Data Visualization",
      "Tableau",
      "Apache Spark",
      "MLflow",
      "Docker",
      "BigQuery",
      "Statistical Modeling",
      "Jupyter",
    ],
    experience: "3-5 Years",
    certificates: [
      "TensorFlow Developer Certificate",
      "AWS Certified Machine Learning - Specialty",
      "Google Professional Data Engineer",
      "Deep Learning Specialization - Coursera",
    ],
    certificate: "TensorFlow Developer Certificate",
    jdLink: "#",
    budget: "₹22-28L",
    budgetType: "Monthly",
    positions: 1,
    openPositions: 1,
    candidates: 2,
    status: "Active",
    interviewRounds: 3,
    education: "Master's in CS / Data Science",
    duration: "6 Months",
  },
];

const requirementToJDFormValues = (req: Requirement): JDFormValues => {
  const isINR =
    req.currency === "INR" ||
    req.budget.includes("₹") ||
    req.budget.includes("INR");
  const isLakh = req.budget.includes("L");
  const isK = req.budget.includes("k") || req.budget.includes("K");

  let min = req.budget_min ?? 0;
  let max = req.budget_max ?? min;

  if (min === 0 && max === 0) {
    const nums = req.budget.match(/\d+(\.\d+)?/g);
    if (nums && nums.length >= 1) {
      min = Number(nums[0]);
      max = nums.length >= 2 ? Number(nums[1]) : min;

      if (isLakh) {
        min *= 100000;
        max *= 100000;
      } else if (isK) {
        min *= 1000;
        max *= 1000;
      }
    }
  }

  const shiftMap: Record<string, JDFormValues["basicInfo"]["shift"]> = {
    IST: "Indian Shift",
    UST: "US Shift",
    PST: "US Shift",
    BST: "UK Shift",
    any: "Any Shift",
  };
  const shiftVal: JDFormValues["basicInfo"]["shift"] =
    shiftMap[req.timezone] ||
    (req.shift ? shiftMap[req.shift] : undefined) ||
    "Indian Shift";
  const locType = req.work_mode
    ? req.work_mode === "Remote" ||
      req.work_mode === "Hybrid" ||
      req.work_mode === "Onsite"
      ? req.work_mode
      : "Hybrid"
    : req.location.toLowerCase().includes("remote")
      ? "Remote"
      : req.location.toLowerCase().includes("hybrid")
        ? "Hybrid"
        : "Onsite";
  const budgetTypeVal =
    (req.budgetType as "Hourly" | "Monthly" | "Daywise") || "Monthly";

  const expVal =
    req.experience ||
    (req.experience_min_years != null && req.experience_max_years != null
      ? `${req.experience_min_years}-${req.experience_max_years} Years`
      : "5+ Years");

  const qualVal = req.education || req.qualification || "Bachelor's Degree";
  const domainVal =
    req.industry ||
    (req.domain && req.domain !== "NA"
      ? req.domain
      : "IT & Software Product Development");

  const certsVal =
    req.certificates && req.certificates.length > 0
      ? req.certificates
      : req.mandatory_certifications && req.mandatory_certifications.length > 0
        ? req.mandatory_certifications
        : req.certificate
          ? [req.certificate]
          : [];

  const jdSummaryVal =
    req.jd_summary || req.description || `Job description for ${req.title}.`;

  const durationVal = req.duration || req.project_duration || "Monthly";

  return {
    basicInfo: {
      jobTitle: req.title,
      locationType: locType,
      location: req.location,
      primarySkills: req.skills || req.primary_skills || [],
      secondarySkills: req.secondarySkills || req.secondary_skills || [],
      shift: shiftVal,
    },
    hiringDetails: {
      interviewRounds: req.interviewRounds ?? 1,
      positions: req.positions || 1,
    },
    engagementType: {
      jdTitle: req.title,
      location: req.location,
      budget: req.budget,
      status:
        req.status === "Active"
          ? "Active"
          : req.status === "On Hold"
            ? "Draft"
            : "Pending",
      engagementModel: req.type
        .split(",")
        .flatMap((t) => {
          const trimmed = t.trim();
          if (trimmed.toLowerCase() === "both")
            return ["Contract to Contract", "Contract to Hire"];
          if (trimmed === "C-C") return ["Contract to Contract"];
          if (trimmed === "C-H") return ["Contract to Hire"];
          return [trimmed];
        })
        .filter(Boolean),
      postedDate: new Date().toISOString().split("T")[0],
      positions: req.positions,
    },
    qualificationRequirement: {
      experience: expVal,
      qualification: qualVal,
      domain: domainVal,
      certification: certsVal,
    },
    complianceRequirements: {
      complianceStatus: (req.complianceRequirements?.complianceStatus || "") as
        | ""
        | "yes"
        | "no",
      complianceCertifications:
        req.complianceRequirements?.complianceCertifications || [],
      insuranceRequirements:
        req.complianceRequirements?.insuranceRequirements || [],
      legalRegistrationDocs:
        req.complianceRequirements?.legalRegistrationDocs || [],
      companyCertifications:
        req.complianceRequirements?.companyCertifications || [],
    },
    budgetInfo: {
      currency: isINR ? "INR (₹)" : "USD ($)",
      budgetType: budgetTypeVal,
      minBudget: min || 0,
      maxBudget: max || min || 0,
    },
    jobDescription: {
      jdSummary: jdSummaryVal,
    },
    projectTimeline: {
      startDate:
        req.startDate ||
        req.start_date ||
        new Date().toISOString().split("T")[0],
      projectDuration: durationVal,
    },
  };
};

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
} as const;

function RequirementsContent() {
  const {
    collapsed: sidebarCollapsed,
    toggleCollapse,
    mobileOpen,
    setMobileOpen,
    toggleMobile,
  } = useSidebar();
  const [loading, setLoading] = useState(true);
  const { mode } = useDashboardTheme();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  useEffect(() => {
    if (openPopoverId === null) return;

    const handleScroll = () => {
      setOpenPopoverId(null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, {
      capture: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [openPopoverId]);

  // State
  const [requirements, setRequirements] =
    useState<Requirement[]>(initialRequirements);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [engagementFilter, setEngagementFilter] = useState("All Engagements");
  const [expandedCardIds, setExpandedCardIds] = useState<
    Record<number, boolean>
  >({});
  const [expandedSkills, setExpandedSkills] = useState<Record<number, boolean>>(
    {},
  );
  const [expandedSecSkills, setExpandedSecSkills] = useState<
    Record<number, boolean>
  >({});

  // Dropdown states for each card action menu
  const [activeActionMenuId, setActiveActionMenuId] = useState<number | null>(
    null,
  );

  // Dropdown states for each card status menu
  const [activeStatusMenuId, setActiveStatusMenuId] = useState<number | null>(
    null,
  );

  // Modal dialog states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJDUploadModalOpen, setIsJDUploadModalOpen] = useState(false);
  const [hiringStudioStep, setHiringStudioStep] = useState<1 | 2>(1);

  // Dummy JD modal state
  const [isJDDummyModalOpen, setIsJDDummyModalOpen] = useState(false);
  const [dummyJDRequirement, setDummyJDRequirement] =
    useState<Requirement | null>(null);

  // New Edit JD Modal State
  const [editJDRequirement, setEditJDRequirement] =
    useState<Requirement | null>(null);
  const [isJDEditModalOpen, setIsJDEditModalOpen] = useState(false);

  // Delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [requirementToDelete, setRequirementToDelete] = useState<number | null>(
    null,
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    preloadWelcomeMascot();
  }, []);

  useEffect(() => {
    let shouldUpdateUrl = false;
    const newParams = new URLSearchParams(searchParams.toString());

    if (searchParams.get("openJD") === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsJDUploadModalOpen(true);
      newParams.delete("openJD");
      shouldUpdateUrl = true;
    }
    const searchVal = searchParams.get("search");
    if (searchVal) {
      setSearchQuery(searchVal);
    }
    const openJDId = searchParams.get("openJDId");
    if (openJDId) {
      const idNum = Number(openJDId);
      const found = requirements.find((r) => r.id === idNum);
      if (found) {
        setDummyJDRequirement(found);
        setIsJDDummyModalOpen(true);
        newParams.delete("openJDId");
        shouldUpdateUrl = true;
      }
    }

    if (shouldUpdateUrl) {
      const newUrl = `${pathname}${newParams.toString() ? `?${newParams.toString()}` : ""}`;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, requirements, pathname, router]);

  // Form states for Add Requirement only
  const [formTitle, setFormTitle] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formType, setFormType] = useState("C-C");
  const [formTimezone, setFormTimezone] = useState("IST");
  const [formSkills, setFormSkills] = useState("");
  const [formSecondarySkills, setFormSecondarySkills] = useState("");
  const [formBudget, setFormBudget] = useState("");
  const [formBudgetType, setFormBudgetType] = useState<
    "Hourly" | "Monthly" | "Daywise"
  >("Monthly");
  const [formPositions, setFormPositions] = useState(1);
  const [formCandidates, setFormCandidates] = useState(0);
  const [formStatus, setFormStatus] = useState<"Active" | "On Hold" | "Closed">(
    "Active",
  );

  const handleOpenEditModal = (req: Requirement) => {
    setEditJDRequirement(req);
    setIsJDEditModalOpen(true);
  };

  // Add/Edit Actions
  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    const today = new Date();
    const formattedDate = `${today.getDate()} ${today.toLocaleString("default", { month: "long" })} ${today.getFullYear()}`;

    const newReq: Requirement = {
      id: Math.max(...requirements.map((r) => r.id), 0) + 1,
      title: formTitle,
      location: formLocation || "Remote",
      type: formType,
      date: formattedDate,
      timezone: formTimezone,
      skills: formSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      secondarySkills: formSecondarySkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      budget: formBudget || "N/A",
      budgetType: formBudgetType,
      positions: Number(formPositions) || 1,
      candidates: Number(formCandidates) || 0,
      status: formStatus,
    };

    setRequirements([newReq, ...requirements]);
    setIsAddModalOpen(false);
    toast.success("Requirement submitted successfully!");
  };

  // Status toggle from card
  const handleUpdateStatus = (
    id: number,
    newStatus: "Active" | "On Hold" | "Closed",
  ) => {
    setRequirements((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
    setActiveStatusMenuId(null);
  };

  // Delete Action
  const triggerDelete = (id: number) => {
    setRequirementToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (requirementToDelete !== null) {
      setRequirements((prev) =>
        prev.filter((r) => r.id !== requirementToDelete),
      );
      setRequirementToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };

  // Filter requirements
  const filteredRequirements = requirements.filter((req) => {
    const formattedId = `REQ-${String(req.id).padStart(4, "0")}`;
    const searchTerms = searchQuery
      .toLowerCase()
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const matchesSearch =
      searchTerms.length === 0 ||
      searchTerms.every(
        (term) =>
          req.title.toLowerCase().includes(term) ||
          formattedId.toLowerCase().includes(term) ||
          req.skills.some((skill) => skill.toLowerCase().includes(term)) ||
          req.location.toLowerCase().includes(term) ||
          (req.secondarySkills &&
            req.secondarySkills.some((s) => s.toLowerCase().includes(term))) ||
          (req.location_city &&
            req.location_city.toLowerCase().includes(term)) ||
          (req.location_state &&
            req.location_state.toLowerCase().includes(term)) ||
          (req.domain && req.domain.toLowerCase().includes(term)),
      );

    const matchesStatus =
      statusFilter === "All Status" ||
      (statusFilter === "Active" && req.status === "Active") ||
      (statusFilter === "On Hold" && req.status === "On Hold") ||
      (statusFilter === "Closed" && req.status === "Closed");

    const matchesType =
      typeFilter === "All Types" ||
      (typeFilter === "Remote" &&
        (req.location.toLowerCase().includes("remote") ||
          req.work_mode?.toLowerCase() === "remote")) ||
      (typeFilter === "Hybrid" &&
        (req.location.toLowerCase().includes("hybrid") ||
          req.work_mode?.toLowerCase() === "hybrid")) ||
      (typeFilter === "Onsite" &&
        ((!req.location.toLowerCase().includes("remote") &&
          !req.location.toLowerCase().includes("hybrid")) ||
          req.work_mode?.toLowerCase() === "onsite"));

    const matchesEngagement =
      engagementFilter === "All Engagements" ||
      req.type.toLowerCase() === engagementFilter.toLowerCase() ||
      (req.engagement_type &&
        req.engagement_type.toLowerCase() === engagementFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesType && matchesEngagement;
  });

  return (
    <>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        loading={loading}
      />

      <main
        className={`dash-main ${sidebarCollapsed ? "dash-main-collapsed" : ""}`}
      >
        <DashboardHeader onMobileToggle={() => toggleMobile()} />

        <div className="dash-content px-4 sm:px-8">
          {loading ? (
            <RequirementsSkeleton />
          ) : (
            <>
              <div
                className={
                  isJDUploadModalOpen && hiringStudioStep === 2
                    ? "hidden"
                    : "sk-page-content-enter"
                }
              >
              {/* Header */}
              <DashPageHeader
                title="My Requirements"
                subtitle="Manage your job descriptions and hiring needs."
              >
                <DashButton
                  variant="primary"
                  className="gap-2"
                  onClick={() => setIsJDUploadModalOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Post Requirement
                </DashButton>
              </DashPageHeader>

              {/* Stats Overview Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-1.5 px-1.5 mb-5 bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl divide-y md:divide-y-0 md:divide-x divide-[var(--dash-divider)]">
                {/* Stat 1: Total Requirements */}
                <div className="flex-1 flex items-center justify-between py-1 px-1.5 md:py-0.5 md:px-2">
                  <div className="flex items-center gap-2">
                    <div className="text-blue-500 flex-shrink-0">
                      <Briefcase className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--dash-text-muted)] tracking-wider whitespace-nowrap">
                      Total Requirements
                    </span>
                  </div>
                  <span className="text-base font-bold text-blue-500 pr-0.5">
                    {requirements.length}
                  </span>
                </div>

                {/* Stat 2: Total Positions */}
                <div className="flex-1 flex items-center justify-between py-1 px-1.5 md:py-0.5 md:pl-3 md:pr-2">
                  <div className="flex items-center gap-2">
                    <div className="text-purple-500 flex-shrink-0">
                      <User className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--dash-text-muted)] tracking-wider whitespace-nowrap">
                      Total Positions
                    </span>
                  </div>
                  <span className="text-base font-bold text-purple-500 pr-0.5">
                    {requirements.reduce(
                      (sum, r) => sum + (r.positions || 0),
                      0,
                    )}
                  </span>
                </div>

                {/* Stat 3: Total Candidates */}
                <div className="flex-1 flex items-center justify-between py-1 px-1.5 md:py-0.5 md:pl-3 md:pr-2">
                  <div className="flex items-center gap-2">
                    <div className="text-emerald-500 flex-shrink-0">
                      <ClipboardList className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--dash-text-muted)] tracking-wider whitespace-nowrap">
                      Total Candidates
                    </span>
                  </div>
                  <span className="text-base font-bold text-emerald-500 pr-0.5">
                    {requirements.reduce(
                      (sum, r) => sum + (r.candidates || 0),
                      0,
                    )}
                  </span>
                </div>

                {/* Stat 4: Active Requirements */}
                <div className="flex-1 flex items-center justify-between py-1 px-1.5 md:py-0.5 md:pl-3 md:pr-2">
                  <div className="flex items-center gap-2">
                    <div className="text-orange-500 flex-shrink-0">
                      <UserCheck className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--dash-text-muted)] tracking-wider whitespace-nowrap">
                      Active Requirements
                    </span>
                  </div>
                  <span className="text-base font-bold text-orange-500 pr-0.5">
                    {requirements.filter((r) => r.status === "Active").length}
                  </span>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center">
                {/* Search Input */}
                <DashSearchInput
                  placeholder="Search by name, ID, skills..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />

                {/* Dropdown Filters */}
                <div className="flex w-full md:w-auto gap-2.5 sm:gap-4 items-center">
                  {/* Status Select */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="flex-1 md:w-[140px] md:flex-none h-8 px-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                      <SelectItem value="All Status">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Type Select */}
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="flex-1 md:w-[140px] md:flex-none h-8 px-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                      <SelectItem value="All Types">All Types</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Onsite">Onsite</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Engagement Select */}
                  <Select
                    value={engagementFilter}
                    onValueChange={setEngagementFilter}
                  >
                    <SelectTrigger className="flex-1 md:w-[170px] md:flex-none h-8 px-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)]">
                      <SelectValue placeholder="All Engagements" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                      <SelectItem value="All Engagements">
                        All Engagements
                      </SelectItem>
                      <SelectItem value="C-C">C-C</SelectItem>
                      <SelectItem value="C-H">C-H</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Clear Filters Button */}
                  {(searchQuery !== "" ||
                    statusFilter !== "All Status" ||
                    typeFilter !== "All Types" ||
                    engagementFilter !== "All Engagements") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("All Status");
                        setTypeFilter("All Types");
                        setEngagementFilter("All Engagements");
                      }}
                      className="h-8 px-2 text-xs font-semibold text-[var(--dash-danger-text)] hover:bg-[var(--dash-danger-bg)]/10 rounded-lg whitespace-nowrap flex items-center justify-center transition-all duration-300 flex-shrink-0 cursor-pointer -ml-1.5 sm:-ml-2.5"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Cards List */}
              <div className="flex flex-col gap-4">
                {filteredRequirements.length === 0 ? (
                  <EmptyState
                    icon={Search}
                    title="No requirements match your filters"
                    description="Try adjusting your search query, status filter, work types, or engagement model, or clear all filters to see all available requirements."
                    actionText="Reset All Filters"
                    onAction={() => {
                      setSearchQuery("");
                      setStatusFilter("All Status");
                      setTypeFilter("All Types");
                      setEngagementFilter("All Engagements");
                    }}
                  />
                ) : (
                  filteredRequirements.map((req) => (
                    <Card
                      key={req.id}
                      className="req-card p-3 bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl hover:border-[rgba(129,140,248,0.22)] transition-all duration-300 relative group overflow-visible"
                    >
                      {/* Card Content Grid */}
                      <div className="req-card-grid grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
                        {/* Title & Meta Details */}
                        <div className="req-card-col lg:col-span-3 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col   gap-1.5 py-0.5 min-w-0">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-semibold text-[var(--req-card-badge-purple-text)] capitalize tracking-wider bg-[var(--req-card-badge-purple-bg)] border border-[var(--req-card-badge-purple-border)] w-fit px-2 py-0.5 rounded-md">
                              REQ-{String(req.id).padStart(4, "0")}
                            </span>
                            <h2 className="req-card-title">{req.title}</h2>
                          </div>

                          {/* Experience */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold tracking-wider text-[var(--req-card-label-color)]">
                              Experience :
                            </span>
                            <span className="text-xs font-semibold text-[var(--dash-text-primary)] truncate">
                              {req.experience || "Not Specified"}
                            </span>
                          </div>

                          {/* Meta Details Grid */}
                          <div className="grid grid-cols-2 items-start gap-x-2 gap-y-2 text-[10px] text-[var(--dash-text-secondary)]">
                            <span className="flex items-start gap-1.5 min-w-0">
                              <Calendar className="w-3.5 h-3.5 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                              <span className="break-words leading-[14px]">
                                {req.date}
                              </span>
                            </span>
                            <span className="flex items-start gap-1.5 min-w-0">
                              <Briefcase className="w-3.5 h-3.5 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                              <span className="break-words leading-[14px]">
                                {req.type}
                              </span>
                            </span>
                            <span className="flex items-start gap-1.5 min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                              <span className="break-words leading-[14px]">
                                {req.location}
                              </span>
                            </span>
                            <span className="flex items-start gap-1.5 min-w-0">
                              <Clock className="w-3.5 h-3.5 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                              <span className="break-words leading-[14px]">
                                {req.timezone}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Primary & Secondary Skills Stacked */}
                        <div className="req-card-col lg:col-span-4 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-start gap-2.5 py-0.5 min-w-0">
                          {/* Primary Skills */}
                          <div className="flex flex-col gap-1">
                            <span className="req-card-label">
                              Primary Skills
                            </span>
                            <CardSkillBadgeOverflow
                              skills={req.skills}
                              visibleCount={5}
                              title="All Primary Skills"
                              variant="primary"
                            />
                          </div>

                          {/* Secondary Skills */}
                          <div className="flex flex-col gap-1">
                            <span className="req-card-label">
                              Secondary Skills
                            </span>
                            {req.secondarySkills &&
                            req.secondarySkills.length > 0 ? (
                              <CardSkillBadgeOverflow
                                skills={req.secondarySkills}
                                visibleCount={5}
                                title="All Secondary Skills"
                                variant="secondary"
                              />
                            ) : (
                              <span className="text-xs text-[var(--dash-text-muted)]">
                                None
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Column 3: Salary, Certificate */}
                        <div className="req-card-col lg:col-span-3 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-start py-0.5 min-w-0 gap-2.5">
                          {/* Salary (Budget) */}
                          <div className="flex flex-col gap-1">
                            <span className="req-card-label">Salary</span>
                            <div className="flex items-center gap-1 req-card-value">
                              <span className="truncate">
                                {formatRateRange({
                                  amount: req.budget,
                                  period: req.budgetType,
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Certificate */}
                          <div className="flex flex-col gap-1">
                            <span className="req-card-label">Certificate</span>
                            <CertificatePopover
                              certificates={req.certificates}
                              singleCertificate={req.certificate}
                              maxVisible={4}
                            />
                          </div>
                        </div>

                        {/* Column 4: Status, Actions & Stats */}
                        <div className="req-card-col lg:col-span-2 flex flex-col gap-2 py-0.5 min-w-0 h-full">
                          {/* Status and Action Menu row */}
                          <div className="flex items-center justify-between gap-2">
                            {/* Status dropdown selector */}
                            <div className="relative overflow-visible">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveStatusMenuId(
                                    activeStatusMenuId === req.id
                                      ? null
                                      : req.id,
                                  );
                                }}
                                className={`dash-status ${
                                  req.status === "Active"
                                    ? "dash-status-active border-[rgba(16,185,129,0.2)]"
                                    : req.status === "On Hold"
                                      ? "dash-status-hold border-[rgba(245,158,11,0.2)]"
                                      : "dash-status-closed border-[rgba(239,68,68,0.2)]"
                                } flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium rounded-full border transition-all h-auto cursor-pointer`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    req.status === "Active"
                                      ? "bg-emerald-500"
                                      : req.status === "On Hold"
                                        ? "bg-amber-500"
                                        : "bg-red-500"
                                  }`}
                                />
                                <span>{req.status}</span>
                                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                              </button>

                              {activeStatusMenuId === req.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveStatusMenuId(null);
                                    }}
                                  />
                                  <div className="absolute left-0 mt-1.5 w-32 bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in-50 slide-in-from-top-1">
                                    {(
                                      ["Active", "On Hold", "Closed"] as const
                                    ).map((status) => (
                                      <button
                                        key={status}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateStatus(req.id, status);
                                        }}
                                        className="w-full text-left justify-between h-auto py-1.5 px-4 text-xs hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-primary)] flex items-center rounded-none font-normal gap-2"
                                      >
                                        <span>{status}</span>
                                        {req.status === status && (
                                          <Check className="w-3 h-3 text-[var(--accent-primary)]" />
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Action menu button */}
                            <div className="relative overflow-visible">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveActionMenuId(
                                    activeActionMenuId === req.id
                                      ? null
                                      : req.id,
                                  );
                                }}
                                className="h-8 w-8 rounded-lg text-[var(--dash-text-secondary)] hover:bg-[var(--dash-card-hover)] hover:text-[var(--dash-text-primary)] flex items-center justify-center transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {activeActionMenuId === req.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveActionMenuId(null);
                                    }}
                                  />
                                  <div className="absolute right-0 mt-1.5 w-44 bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in-50 slide-in-from-top-1 flex flex-col gap-0.5">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveActionMenuId(null);
                                        setDummyJDRequirement(req);
                                        setIsJDDummyModalOpen(true);
                                      }}
                                      className="w-full text-left h-auto py-2 px-4 text-xs hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-primary)] flex items-center gap-2 rounded-none font-normal"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-[var(--dash-text-secondary)]" />
                                      <span>View Requirement</span>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveActionMenuId(null);
                                        handleOpenEditModal(req);
                                      }}
                                      className="w-full text-left h-auto py-2 px-4 text-xs hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-primary)] flex items-center gap-2 rounded-none font-normal"
                                    >
                                      <Pencil className="w-3.5 h-3.5 text-[var(--dash-text-secondary)]" />
                                      <span>Edit Requirement</span>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveActionMenuId(null);
                                        triggerDelete(req.id);
                                      }}
                                      className="w-full text-left h-auto py-2 px-4 text-xs hover:bg-[var(--dash-card-hover)] text-[var(--dash-danger-text)] flex items-center gap-2 rounded-none font-normal"
                                    >
                                      <Trash className="w-3.5 h-3.5 text-[var(--dash-danger-text)]" />
                                      <span>Delete Requirement</span>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Stats Panel: Total Position, Open Position & Candidates */}
                          <div className="req-stats-panel">
                            {/* Total Position stat */}
                            <div className="req-stat-row">
                              <div className="flex items-center gap-2">
                                <div className="text-blue-500 flex items-center justify-center">
                                  <Users className="w-3 h-3" />
                                </div>
                                <span>Total Position</span>
                              </div>
                              <span className="font-bold">{req.positions}</span>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-[var(--dash-divider)] my-0.5" />

                            {/* Open Position stat */}
                            <div className="req-stat-row">
                              <div className="flex items-center gap-2">
                                <div className="text-emerald-500 flex items-center justify-center">
                                  <UserCheck className="w-3 h-3" />
                                </div>
                                <span>Open Position</span>
                              </div>
                              <span className="font-bold">
                                {req.openPositions !== undefined
                                  ? req.openPositions
                                  : req.status === "Closed"
                                    ? 0
                                    : req.positions}
                              </span>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-[var(--dash-divider)] my-0.5" />

                            {/* Candidates stat */}
                            <Link
                              href={`/client/submissions?requirementId=${req.id}`}
                              className="req-stat-row group cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center gap-2">
                                <div className="text-violet-500 flex items-center justify-center group-hover:text-blue-500 transition-colors">
                                  <UserSearch className="w-3 h-3" />
                                </div>
                                <span>Candidates</span>
                              </div>
                              <span className="font-bold group-hover:text-blue-500 transition-colors">
                                {req.candidates}
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Add Requirement Dialog */}
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent
                  data-dashboard-theme={mode}
                  data-lenis-prevent
                  className="max-h-[90vh] overflow-y-auto max-w-xl p-6 border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-[var(--dash-text-primary)]"
                >
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Add Requirement
                    </DialogTitle>
                    <DialogDescription className="text-sm text-[var(--dash-text-secondary)]">
                      Create a new job requirement and hiring need.
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={handleAddRequirement}
                    className="flex flex-col gap-4 mt-4"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[var(--dash-text-secondary)]">
                        Job Title *
                      </label>
                      <Input
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Senior React Developer"
                        className="bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] placeholder-[var(--dash-text-muted)]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[var(--dash-text-secondary)]">
                          Location
                        </label>
                        <Input
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          placeholder="e.g. Bangalore, Remote"
                          className="bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[var(--dash-text-secondary)]">
                          Job Type
                        </label>
                        <Select value={formType} onValueChange={setFormType}>
                          <SelectTrigger className="w-full h-8 rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)]">
                            <SelectValue placeholder="C-C" />
                          </SelectTrigger>
                          <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                            <SelectItem value="Remote">Remote</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                            <SelectItem value="C-C">C-C</SelectItem>
                            <SelectItem value="C-H">C-H</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[var(--dash-text-secondary)]">
                          Timezone
                        </label>
                        <Input
                          value={formTimezone}
                          onChange={(e) => setFormTimezone(e.target.value)}
                          placeholder="e.g. IST, BST, UST"
                          className="bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[var(--dash-text-secondary)]">
                          Budget
                        </label>
                        <Input
                          value={formBudget}
                          onChange={(e) => setFormBudget(e.target.value)}
                          placeholder="e.g. ₹15-18L"
                          className="bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[var(--dash-text-secondary)]">
                          Budget Type
                        </label>
                        <Select
                          value={formBudgetType}
                          onValueChange={(val: any) => setFormBudgetType(val)}
                        >
                          <SelectTrigger className="w-full h-8 rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)]">
                            <SelectValue placeholder="Monthly" />
                          </SelectTrigger>
                          <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                            <SelectItem value="Hourly">Hourly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Daywise">Per Day</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[var(--dash-text-secondary)]">
                          Positions
                        </label>
                        <Input
                          type="number"
                          min={1}
                          value={formPositions}
                          onChange={(e) =>
                            setFormPositions(Number(e.target.value))
                          }
                          className="bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[var(--dash-text-secondary)]">
                          Status
                        </label>
                        <Select
                          value={formStatus}
                          onValueChange={(val: any) => setFormStatus(val)}
                        >
                          <SelectTrigger className="w-full h-8 rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)]">
                            <SelectValue placeholder="Active" />
                          </SelectTrigger>
                          <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[var(--dash-text-secondary)]">
                        Primary Skills (comma-separated)
                      </label>
                      <Textarea
                        value={formSkills}
                        onChange={(e) => setFormSkills(e.target.value)}
                        placeholder="e.g. React, TypeScript, Node.js"
                        rows={2}
                        className="bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)]"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[var(--dash-text-secondary)]">
                        Secondary Skills (comma-separated)
                      </label>
                      <Textarea
                        value={formSecondarySkills}
                        onChange={(e) => setFormSecondarySkills(e.target.value)}
                        placeholder="e.g. Next.js, PostgreSQL"
                        rows={2}
                        className="bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)]"
                      />
                    </div>

                    <DialogFooter className="mt-4 flex flex-row gap-2 justify-end">
                      <DashButton
                        type="button"
                        variant="ghost"
                        onClick={() => setIsAddModalOpen(false)}
                      >
                        Cancel
                      </DashButton>
                      <DashButton type="submit" variant="primary">
                        Submit
                      </DashButton>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Edit JD Requirement Dialog */}
              <Dialog
                open={isJDEditModalOpen}
                onOpenChange={setIsJDEditModalOpen}
              >
                <DialogContent className="sm:max-w-[800px] p-0 bg-transparent border-none shadow-none overflow-hidden">
                  {editJDRequirement && (
                    <JDUploadForm
                      mode="edit"
                      onClose={() => {
                        setIsJDEditModalOpen(false);
                        setEditJDRequirement(null);
                      }}
                      initialValues={requirementToJDFormValues(
                        editJDRequirement,
                      )}
                      onSuccess={(values) => {
                        if (values && editJDRequirement) {
                          const updated = requirements.map((r) => {
                            if (r.id === editJDRequirement.id) {
                              return {
                                ...r,
                                title: values.basicInfo.jobTitle,
                                location: values.basicInfo.location,
                                type: values.engagementType.engagementModel
                                  .map((m) =>
                                    m === "Contract to Contract"
                                      ? "C-C"
                                      : m === "Contract to Hire"
                                        ? "C-H"
                                        : m,
                                  )
                                  .join("/"),
                                timezone: values.basicInfo.shift,
                                skills: values.basicInfo.primarySkills,
                                secondarySkills:
                                  values.basicInfo.secondarySkills,
                                budget:
                                  values.engagementType.budget || r.budget,
                                budgetType: values.budgetInfo.budgetType,
                                positions: values.hiringDetails.positions,
                                status: (values.engagementType.status ===
                                "Active"
                                  ? "Active"
                                  : values.engagementType.status === "Draft"
                                    ? "On Hold"
                                    : "Closed") as
                                  | "Active"
                                  | "On Hold"
                                  | "Closed",
                                experience:
                                  values.qualificationRequirement.experience,
                                certificates:
                                  values.qualificationRequirement.certification,
                                certificate:
                                  values.qualificationRequirement
                                    .certification[0],
                                interviewRounds:
                                  values.hiringDetails.interviewRounds,
                                education:
                                  values.qualificationRequirement.qualification,
                                duration:
                                  values.projectTimeline.projectDuration,
                                industry:
                                  values.qualificationRequirement.domain,
                                startDate: values.projectTimeline.startDate,
                                complianceRequirements:
                                  values.complianceRequirements,
                                description: values.jobDescription.jdSummary,
                                jd_summary: values.jobDescription.jdSummary,
                                budget_min: values.budgetInfo.minBudget,
                                budget_max: values.budgetInfo.maxBudget,
                              };
                            }
                            return r;
                          });
                          setRequirements(updated);
                        }
                        setIsJDEditModalOpen(false);
                        setEditJDRequirement(null);
                      }}
                    />
                  )}
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation Dialog */}
              <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete Requirement"
                description="Are you sure you want to delete this requirement? This action cannot be undone."
                confirmText="Delete"
                variant="destructive"
                onConfirm={confirmDelete}
              />

              {/* Dummy JD View Modal */}
              <JobDescriptionModal
                open={isJDDummyModalOpen}
                onOpenChange={setIsJDDummyModalOpen}
                requirement={dummyJDRequirement}
                themeMode={mode}
                onDownloadPDF={downloadJDPDF}
              />
            </div>

            {/* Hiring Studio (Step 1 in Modal, Step 2 in Full Page) */}
            {isJDUploadModalOpen && (
              <HiringStudio
                onClose={() => {
                  setIsJDUploadModalOpen(false);
                  setHiringStudioStep(1);
                }}
                onStepChange={setHiringStudioStep}
                onSuccess={(newReq) => {
                  setIsJDUploadModalOpen(false);
                  setHiringStudioStep(1);
                  if (newReq) {
                    setRequirements([newReq, ...requirements]);
                  }
                }}
              />
            )}
          </>
        )}
        </div>
      </main>
    </>
  );
}

function RequirementsFallback() {
  const {
    collapsed: sidebarCollapsed,
    toggleCollapse,
    mobileOpen,
    setMobileOpen,
  } = useSidebar();

  return (
    <>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        loading={true}
      />
      <main
        className={`dash-main ${sidebarCollapsed ? "dash-main-collapsed" : ""}`}
      >
        <DashboardHeader onMobileToggle={() => {}} />
        <div className="dash-content px-4 sm:px-8">
          <RequirementsSkeleton />
        </div>
      </main>
    </>
  );
}

export default function RequirementsPage() {
  return (
    <Suspense fallback={<RequirementsFallback />}>
      <RequirementsContent />
    </Suspense>
  );
}
