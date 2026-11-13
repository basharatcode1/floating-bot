"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Briefcase,
  MapPin,
  MoreVertical,
  Trash2,
  ExternalLink,
  ChevronDown,
  Check,
  Clock,
  GraduationCap,
  Building2,
  Layers,
  Compass,
  FolderGit2,
} from "lucide-react";
import VendorSidebar from "../dashboard/components/VendorSidebar";
import VendorDashboardHeader from "../dashboard/components/VendorDashboardHeader";
import { DashButton } from "@/app/components/ui/dash-button";
import { DashSearchInput } from "@/app/components/ui/dash-search-input";
import { Card } from "@/app/components/ui/card";
import { CertificatePopover } from "@/app/client/requirements/components/CertificatePopover";
import { SkillBadgeOverflow } from "@/app/components/ui/skill-badge-overflow";
import { CardSkillBadgeOverflow } from "@/app/components/ui/card-skill-badge-overflow";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import AddCandidateForm from "./components/AddCandidateForm";
import VendorBenchSkeleton from "./components/VendorBenchSkeleton";
import { ConfirmationDialog } from "@/app/components/ui/confirmation-dialog";
import { CandidateFormValues } from "./schemas/candidate.schema";
import {
  formatCompactRateAmount,
  formatRateRange,
} from "@/app/lib/rate-format";
import { useSidebar } from "@/app/components/SidebarContext";

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
} as const;

const formatLocationCityStateCountry = (locStr: string) => {
  if (!locStr) return "";
  const parts = locStr
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 3) return parts.join(", ");
  if (parts.length === 2) {
    const knownStates: Record<string, string> = {
      mumbai: "Maharashtra",
      pune: "Maharashtra",
      nagpur: "Maharashtra",
      nashik: "Maharashtra",
      bangalore: "Karnataka",
      bengaluru: "Karnataka",
      delhi: "Delhi",
      "new delhi": "Delhi",
      hyderabad: "Telangana",
      chennai: "Tamil Nadu",
      kolkata: "West Bengal",
      ahmedabad: "Gujarat",
      surat: "Gujarat",
      jaipur: "Rajasthan",
      gurgaon: "Haryana",
      gurugram: "Haryana",
      noida: "Uttar Pradesh",
      chandigarh: "Punjab",
      kochi: "Kerala",
      trivandrum: "Kerala",
      thiruvananthapuram: "Kerala",
      indore: "Madhya Pradesh",
      bhopal: "Madhya Pradesh",
      lucknow: "Uttar Pradesh",
    };
    const cityLower = parts[0].toLowerCase();
    const state = knownStates[cityLower];
    if (state) {
      return `${parts[0]}, ${state}, ${parts[1]}`;
    }
  }
  return locStr;
};

const benchData = [
  {
    id: "1042",
    firstName: "Rahul",
    lastName: "Verma",
    gender: "Male",
    designation: "Senior Frontend Engineer",
    role: "React Developer",
    experience: "5 yrs",
    engagementType: "C-C",
    availability: "Immediate Joiner",
    deploymentType: "Remote",
    primarySkills: [
      "React",
      "TypeScript",
      "Node.js",
      "Java",
      "Python",
      "C++",
      "C#",
      "Java",
      "Python",
      "C++",
      "C#",
      "React",
      "TypeScript",
      "Node.js",
      "Java",
      "Python",
      "C++",
      "C#",
    ],
    status: "Active",
    currency: "INR",
    rateType: "Monthly",
    rateMin: "₹12L",
    rateMax: "₹15L",
    // Expanded Data
    secondarySkills: [
      "Next.js",
      "PostgreSQL",
      "Tailwind CSS",
      "GraphQL",
      "Redis",
    ],
    location: "Mumbai, Maharashtra, India",
    certificates: ["AWS Cloud Practitioner", "Scrum Master"],
    workExperience: "3 yrs at TechCorp, 2 yrs at DevStudio",
    education: "B.Tech in Computer Science",
  },
  {
    id: "1043",
    firstName: "Sneha",
    lastName: "Iyer",
    gender: "Female",
    designation: "Backend Specialist",
    role: "Java Backend",
    experience: "7 yrs",
    engagementType: "C-C",
    availability: "Notice Period",
    deploymentType: "Onsite",
    primarySkills: ["Java", "Spring Boot", "AWS"],
    status: "Active",
    currency: "INR",
    rateType: "Monthly",
    rateMin: "₹18L",
    rateMax: "₹20L",
    // Expanded Data
    secondarySkills: ["Docker", "Kubernetes", "PostgreSQL"],
    location: "Bangalore, Karnataka, India",
    certificates: ["Oracle Certified Professional Java SE 17"],
    workExperience: "4 yrs at FinSolutions, 3 yrs at AppMinds",
    education: "M.C.A",
  },
  {
    id: "1044",
    firstName: "Amit",
    lastName: "Joshi",
    gender: "Male",
    designation: "Platform Engineer",
    role: "DevOps Engineer",
    experience: "4 yrs",
    engagementType: "C-H",
    availability: "Immediate Joiner",
    deploymentType: "Hybrid",
    primarySkills: ["Docker", "Kubernetes", "Terraform"],
    status: "Not Active",
    currency: "INR",
    rateType: "Monthly",
    rateMin: "₹15L",
    rateMax: "₹18L",
    // Expanded Data
    secondarySkills: ["AWS", "GitHub Actions", "Python"],
    location: "Pune, Maharashtra, India",
    certificates: ["HashiCorp Certified Terraform Associate"],
    workExperience: "2 yrs at CloudOps, 2 yrs at NetWeb",
    education: "B.E. in Information Technology",
  },
  {
    id: "1045",
    firstName: "Neha",
    lastName: "Gupta",
    gender: "Female",
    designation: "Product Designer",
    role: "UI/UX Designer",
    experience: "3 yrs",
    engagementType: "C-H",
    availability: "Notice Period",
    deploymentType: "Remote",
    primarySkills: ["Figma", "Adobe XD", "CSS"],
    status: "Active",
    currency: "INR",
    rateType: "Monthly",
    rateMin: "₹40K",
    rateMax: "₹50K",
    // Expanded Data
    secondarySkills: ["Illustrator", "Prototyping", "User Research"],
    location: "Delhi, Delhi, India",
    certificates: ["Google UX Design Professional Certificate"],
    workExperience: "3 yrs Freelance & Agency Projects",
    education: "B.Des in Communication Design",
  },
];

const mapCandidateToFormValues = (candidate: any): CandidateFormValues => {
  if (candidate.rawFormValues) {
    return candidate.rawFormValues;
  }

  const parseRateString = (rateStr: string) => {
    if (!rateStr) return 0;
    const cleanStr = rateStr.replace(/[^\d.kKlL]/g, "");
    if (cleanStr.toLowerCase().includes("l")) {
      return parseFloat(cleanStr) * 100000;
    }
    if (cleanStr.toLowerCase().includes("k")) {
      return parseFloat(cleanStr) * 1000;
    }
    return parseFloat(cleanStr) || 0;
  };

  const rateMinVal = parseRateString(candidate.rateMin);
  const rateMaxVal = parseRateString(candidate.rateMax);

  const experiences: any[] = [];
  if (candidate.workExperience) {
    const parts = candidate.workExperience.split(", ");
    parts.forEach((part: string) => {
      const match = part.match(/(\d+)\s*yrs?\s*at\s*(.*)/i);
      if (match) {
        const years = match[1];
        const companyName = match[2];
        experiences.push({
          companyName: companyName,
          role: candidate.designation || "Software Engineer",
          startDate: String(new Date().getFullYear() - parseInt(years)),
          endDate: "Present",
          projects: [
            {
              projectTitle: `Enterprise Portal Upgrade for ${companyName}`,
              role: candidate.designation || "Lead Developer",
              startDate: String(new Date().getFullYear() - parseInt(years)),
              endDate: "Present",
              domain: "FinTech / SaaS",
              projectDetails:
                "Led the migration of legacy system into next-gen React app, improving performance by 40%.",
            },
            {
              projectTitle: "Centralized Design System implementation",
              role: "UI Engineer",
              startDate: String(new Date().getFullYear() - parseInt(years)),
              endDate: "Present",
              domain: "E-Commerce",
              projectDetails:
                "Collaborated with design teams to build a reusable component library built on top of Radix UI and Tailwind CSS.",
            },
          ],
        });
      } else {
        experiences.push({
          companyName: part || "Company",
          role: candidate.designation || "Software Engineer",
          startDate: "2023",
          endDate: "Present",
          projects: [
            {
              projectTitle: "Cloud Infrastructure Automation",
              role: "DevOps Specialist",
              startDate: "2023",
              endDate: "Present",
              domain: "Cloud Operations",
              projectDetails:
                "Migrated server workloads to containerized deployments using Kubernetes and Docker.",
            },
          ],
        });
      }
    });
  }

  let degree = "B.Tech";
  let institute = "Unknown Institute";
  if (candidate.education) {
    const eduParts = candidate.education.split(" at ");
    degree = eduParts[0] || "B.Tech";
    if (eduParts[1]) {
      institute = eduParts[1];
    }
  }

  return {
    basicInfo: {
      firstName: candidate.firstName || "",
      lastName: candidate.lastName || "",
      gender:
        candidate.gender === "Male" ||
        candidate.gender === "Female" ||
        candidate.gender === "Other"
          ? candidate.gender
          : "Male",
      designation: candidate.designation || "",
      totalExperience: candidate.experience || "3 yrs",
    },
    workPreferences: {
      deploymentType:
        candidate.deploymentType === "Onsite" ||
        candidate.deploymentType === "Hybrid" ||
        candidate.deploymentType === "Remote"
          ? candidate.deploymentType
          : "Remote",
      availability:
        candidate.availability === "Immediate Joiner" ||
        candidate.availability === "Notice Period"
          ? candidate.availability
          : "Immediate Joiner",
      engagementType:
        candidate.engagementType === "C-H"
          ? "C-H"
          : candidate.engagementType === "Both" ||
              candidate.engagementType === "Both (C-C & C-H)" ||
              candidate.engagementType === "C-C, C-H"
            ? "Both"
            : "C-C",
    },
    skills: {
      primarySkills: candidate.primarySkills || [],
      secondarySkills: candidate.secondarySkills || [],
    },
    location: {
      location: candidate.location || "",
    },
    certifications: {
      certifications: candidate.certificates || [],
    },
    workExperience:
      experiences.length > 0
        ? experiences
        : [
            {
              companyName: "TechCorp",
              role: candidate.designation || "Software Engineer",
              startDate: "2023",
              endDate: "Present",
              projects: [],
            },
          ],
    personalProjects:
      candidate.rawFormValues?.personalProjects ||
      candidate.personalProjects ||
      [],
    education: {
      degree: degree,
      institute: institute,
      passingYear: "2022",
      cgpaOrPercentage:
        (candidate as any).cgpaOrPercentage ||
        (candidate as any).rawFormValues?.education?.cgpaOrPercentage ||
        "",
    },
    links: {
      linkedIn: "https://linkedin.com/in/candidate",
      github: "https://github.com/candidate",
    },
    rateDetails: {
      currency: candidate.currency === "INR" ? "INR (₹)" : "USD ($)",
      rateType:
        candidate.rateType === "Hourly" ||
        candidate.rateType === "Monthly" ||
        candidate.rateType === "Daywise"
          ? candidate.rateType
          : "Monthly",
      rateMin: rateMinVal || 50000,
      rateMax: rateMaxVal || 150000,
    },
    achievements:
      (candidate as any).rawFormValues?.achievements ||
      (candidate as any).achievements ||
      [],
  };
};

const mapFormValuesToCandidate = (
  values: CandidateFormValues,
  id: string,
  existingStatus?: string,
) => {
  const isINR = values.rateDetails.currency.includes("INR");
  const currencyCode = isINR ? "INR" : "USD";
  const formatRate = (val: number, rateType: string) =>
    formatCompactRateAmount(val, values.rateDetails.currency, rateType);

  const workExperienceStr =
    values.workExperience && values.workExperience.length > 0
      ? values.workExperience
          .map((exp: any) => {
            let yearsStr = "2 yrs";
            if (exp.startDate && exp.endDate) {
              const startYear = parseInt(exp.startDate);
              const endYear =
                exp.endDate.toLowerCase() === "present"
                  ? new Date().getFullYear()
                  : parseInt(exp.endDate);
              if (!isNaN(startYear) && !isNaN(endYear)) {
                const diff = endYear - startYear;
                yearsStr = `${diff > 0 ? diff : 1} yrs`;
              }
            }
            return `${yearsStr} at ${exp.companyName}`;
          })
          .join(", ")
      : "3 yrs at TechCorp";

  return {
    id: id,
    firstName: values.basicInfo.firstName,
    lastName: values.basicInfo.lastName,
    gender: values.basicInfo.gender,
    designation: values.basicInfo.designation,
    role: values.basicInfo.designation,
    experience: values.basicInfo.totalExperience,
    engagementType: values.workPreferences.engagementType,
    availability: values.workPreferences.availability,
    deploymentType: values.workPreferences.deploymentType,
    primarySkills: values.skills.primarySkills,
    status: existingStatus || "Active",
    currency: currencyCode,
    rateType: values.rateDetails.rateType,
    rateMin: formatRate(
      values.rateDetails.rateMin,
      values.rateDetails.rateType,
    ),
    rateMax: formatRate(
      values.rateDetails.rateMax,
      values.rateDetails.rateType,
    ),
    secondarySkills: values.skills.secondarySkills,
    location: values.location.location,
    certificates: values.certifications.certifications,
    workExperience: workExperienceStr,
    education:
      values.education.degree +
      (values.education.institute ? ` at ${values.education.institute}` : ""),
    rawFormValues: values,
  };
};

export default function VendorBenchPage() {
  const {
    collapsed: sidebarCollapsed,
    toggleCollapse,
    mobileOpen,
    setMobileOpen,
    toggleMobile,
  } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(
    null,
  );
  const [activeStatusMenuId, setActiveStatusMenuId] = useState<string | null>(
    null,
  );
  const [activeAvailabilityMenuId, setActiveAvailabilityMenuId] = useState<
    string | null
  >(null);
  const [expandedCardIds, setExpandedCardIds] = useState<
    Record<string, boolean>
  >({});
  const [candidateStatuses, setCandidateStatuses] = useState<
    Record<string, string>
  >({});
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
  const [selectedCandidateForDetails, setSelectedCandidateForDetails] =
    useState<(typeof benchData)[0] | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<any | null>(null);
  const [deletingCandidateId, setDeletingCandidateId] = useState<string | null>(
    null,
  );

  const [candidateAvailabilities, setCandidateAvailabilities] = useState<
    Record<string, string>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] =
    useState("all-availability");
  const [engagementFilter, setEngagementFilter] = useState("all-engagement");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [expandedSkills, setExpandedSkills] = useState<Record<string, boolean>>(
    {},
  );
  const [expandedSecSkills, setExpandedSecSkills] = useState<
    Record<string, boolean>
  >({});
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

  const [candidates, setCandidates] = useState<typeof benchData>([]);

  useEffect(() => {
    const stored = localStorage.getItem("bench_candidates");
    let currentData = benchData;
    if (stored) {
      try {
        currentData = JSON.parse(stored);
        // Migration: Update IDs from "1", "2", "3", "4" to "1042", "1043", "1044", "1045"
        let migrated = false;
        currentData = currentData.map((c: any) => {
          if (c.id === "1") {
            migrated = true;
            return { ...c, id: "1042" };
          }
          if (c.id === "2") {
            migrated = true;
            return { ...c, id: "1043" };
          }
          if (c.id === "3") {
            migrated = true;
            return { ...c, id: "1044" };
          }
          if (c.id === "4") {
            migrated = true;
            return { ...c, id: "1045" };
          }
          return c;
        });

        // Force update Rahul Verma's primary skills if they are outdated to show the overflow badge
        const rahul = currentData.find(
          (c: any) =>
            c.id === "1042" ||
            (c.firstName === "Rahul" && c.lastName === "Verma"),
        );
        if (
          rahul &&
          (!rahul.primarySkills || rahul.primarySkills.length <= 3)
        ) {
          rahul.primarySkills = [
            "React",
            "TypeScript",
            "Node.js",
            "Next.js",
            "Tailwind CSS",
            "Redux",
            "GraphQL",
            "Jest",
          ];
          migrated = true;
        }

        if (migrated) {
          localStorage.setItem("bench_candidates", JSON.stringify(currentData));
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem("bench_candidates", JSON.stringify(benchData));
    }
    setCandidates(currentData);

    const timer = setTimeout(() => setLoading(false), 500);
    const initialStatuses: Record<string, string> = {};
    const initialAvailabilities: Record<string, string> = {};
    currentData.forEach((c) => {
      initialStatuses[c.id] = c.status;
      initialAvailabilities[c.id] = c.availability;
    });
    setCandidateStatuses(initialStatuses);
    setCandidateAvailabilities(initialAvailabilities);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get("search");
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    }
  }, []);

  const filteredCandidates = candidates.filter((candidate) => {
    const rawId = String(candidate.id || "").toLowerCase();
    const formattedId = rawId.startsWith("can-")
      ? rawId
      : `can-${rawId.padStart(4, "0")}`;
    const cleanId = formattedId.replace(/[^a-z0-9]/g, "");

    const nameStr =
      `${candidate.firstName} ${candidate.lastName}`.toLowerCase();
    const designationStr = (candidate.designation || "").toLowerCase();
    const primarySkillsStr = (candidate.primarySkills || [])
      .join(" ")
      .toLowerCase();
    const secondarySkillsStr = (candidate.secondarySkills || [])
      .join(" ")
      .toLowerCase();

    const searchTerms = searchQuery
      .toLowerCase()
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const matchesSearch =
      searchTerms.length === 0 ||
      searchTerms.every((term) => {
        const cleanTerm = term.replace(/[^a-z0-9]/g, "");
        const candNumberMatch = term.match(/^(?:can|cand)[-\s]*(\d+)$/i);
        const paddedTerm = candNumberMatch
          ? `can-${candNumberMatch[1].padStart(4, "0")}`
          : null;

        const matchesId =
          formattedId.includes(term) ||
          rawId.includes(term) ||
          (cleanTerm.length > 0 && cleanId.includes(cleanTerm)) ||
          (paddedTerm !== null && formattedId.includes(paddedTerm));

        return (
          matchesId ||
          nameStr.includes(term) ||
          designationStr.includes(term) ||
          primarySkillsStr.includes(term) ||
          secondarySkillsStr.includes(term)
        );
      });

    const currentAvailability =
      candidateAvailabilities[candidate.id] || candidate.availability;
    const matchesAvailability =
      availabilityFilter === "all-availability" ||
      currentAvailability === availabilityFilter;

    const candEngagement = (candidate.engagementType || "").toLowerCase();
    const filterEngagement = engagementFilter.toLowerCase();
    const matchesEngagement =
      filterEngagement === "all-engagement" ||
      candEngagement === filterEngagement ||
      (candEngagement.includes("both") &&
        (filterEngagement === "c-c" || filterEngagement === "c-h")) ||
      (filterEngagement === "both" && candEngagement.includes("both"));

    const currentStatus = candidateStatuses[candidate.id] || candidate.status;
    const matchesStatus =
      statusFilter === "all-status" || currentStatus === statusFilter;

    return (
      matchesSearch && matchesAvailability && matchesEngagement && matchesStatus
    );
  });

  return (
    <>
      <VendorSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        loading={loading}
      />

      <main
        className={`dash-main ${sidebarCollapsed ? "dash-main-collapsed" : ""}`}
      >
        <VendorDashboardHeader onMobileToggle={() => toggleMobile()} />

        <div className="dash-content">
          {loading ? (
            <VendorBenchSkeleton />
          ) : (
            <div className="sk-page-content-enter">
              {/* Page Header */}
              <div className="dash-page-header">
                <div>
                  <h1 className="dash-page-title">My Bench</h1>
                  <p className="dash-page-subtitle">
                    Manage your available candidates. Add, edit, and track
                    availability.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <DashButton
                    variant="primary"
                    className="gap-2"
                    onClick={() => {
                      setEditingCandidate(null);
                      setIsAddCandidateOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Candidate
                  </DashButton>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center">
                {/* Search Input */}
                <DashSearchInput
                  placeholder="Search candidate ID, name, title, skills..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />

                {/* Dropdown Filters */}
                <div className="flex w-full md:w-auto gap-2.5 sm:gap-4 items-center">
                  <Select
                    value={availabilityFilter}
                    onValueChange={setAvailabilityFilter}
                  >
                    <SelectTrigger className="flex-1 md:w-[140px] md:flex-none h-8 px-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)]">
                      <SelectValue placeholder="All Availability" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                      <SelectItem value="all-availability">
                        All Availability
                      </SelectItem>
                      <SelectItem value="Immediate Joiner">
                        Immediate Joiner
                      </SelectItem>
                      <SelectItem value="Notice Period">
                        Notice Period
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={engagementFilter}
                    onValueChange={setEngagementFilter}
                  >
                    <SelectTrigger className="flex-1 md:w-[140px] md:flex-none h-8 px-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)]">
                      <SelectValue placeholder="All Engagement" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                      <SelectItem value="all-engagement">
                        All Engagement
                      </SelectItem>
                      <SelectItem value="c-c">C-C</SelectItem>
                      <SelectItem value="c-h">C-H</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="flex-1 md:w-[120px] md:flex-none h-8 px-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                      <SelectItem value="all-status">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Not Active">Not Active</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Clear Filters Button */}
                  {(searchQuery !== "" ||
                    availabilityFilter !== "all-availability" ||
                    engagementFilter !== "all-engagement" ||
                    statusFilter !== "all-status") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setAvailabilityFilter("all-availability");
                        setEngagementFilter("all-engagement");
                        setStatusFilter("all-status");
                      }}
                      className="h-8 px-2 text-xs font-semibold text-[var(--dash-danger-text)] hover:bg-[var(--dash-danger-bg)]/10 rounded-lg whitespace-nowrap flex items-center justify-center transition-all duration-300 flex-shrink-0 cursor-pointer -ml-1.5 sm:-ml-2.5"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Candidate Cards List */}
              <div className="flex flex-col gap-4">
                {filteredCandidates.length === 0 ? (
                  <div className="text-center py-12 bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl">
                    <p className="text-[var(--dash-text-muted)] text-sm">
                      No candidates found matching your search and filter
                      criteria.
                    </p>
                  </div>
                ) : (
                  filteredCandidates.map((candidate) => {
                    const currentStatus =
                      candidateStatuses[candidate.id] ||
                      candidate.status ||
                      "Active";
                    const currentAvailability =
                      candidateAvailabilities[candidate.id] ||
                      candidate.availability ||
                      "Immediate Joiner";

                    return (
                      <Card
                        key={candidate.id}
                        className="req-card p-3 bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl hover:border-[rgba(129,140,248,0.22)] transition-all duration-300 relative group overflow-visible"
                      >
                        {/* Card Content Grid */}
                        <div className="req-card-grid grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
                          {/* Column 1: Candidate Meta & Rate */}
                          <div className="req-card-col lg:col-span-3 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-between gap-2.5 py-0.5 min-w-0">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-[var(--req-card-badge-purple-text)] capitalize tracking-wider bg-[var(--req-card-badge-purple-bg)] border border-[var(--req-card-badge-purple-border)] w-fit px-2 py-0.5 rounded-md">
                                  {String(candidate.id)
                                    .toUpperCase()
                                    .startsWith("CAN-")
                                    ? candidate.id
                                    : `CAN-${String(candidate.id).padStart(4, "0")}`}
                                </span>
                                <span className="text-xs text-[var(--dash-text-muted)] font-medium">
                                  ({candidate.gender})
                                </span>
                              </div>
                              <h2 className="req-card-title">
                                {candidate.firstName} {candidate.lastName}
                              </h2>
                              <p className="text-xs font-semibold text-[var(--dash-text-secondary)]">
                                {candidate.designation}
                              </p>
                            </div>

                            {/* Meta Details Grid */}
                            <div className="grid grid-cols-2 items-start gap-x-2 gap-y-2 text-[10px] text-[var(--dash-text-secondary)]">
                              <span className="flex items-start gap-1.5 min-w-0">
                                <Briefcase className="w-3.5 h-3.5 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                                <span className="break-words leading-[14px]">{candidate.experience}</span>
                              </span>
                              <span className="flex items-start gap-1.5 min-w-0">
                                <Layers className="w-3.5 h-3.5 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                                <span className="break-words leading-[14px]">{candidate.engagementType}</span>
                              </span>
                              <span className="flex items-start gap-1.5 min-w-0">
                                <Compass className="w-3.5 h-3.5 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                                <span className="break-words leading-[14px]">{candidate.deploymentType}</span>
                              </span>
                              <span className="flex items-start gap-1.5 min-w-0">
                                <MapPin className="w-3.5 h-3.5 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                                <span className="break-words leading-[14px]">{candidate.location}</span>
                              </span>
                            </div>

                            {/* Rate Details */}
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg w-fit">
                              <span>
                                {formatRateRange({
                                  amount: `${candidate.rateMin}-${candidate.rateMax}`,
                                  period: candidate.rateType,
                                  currency: candidate.currency,
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Column 2: Primary & Secondary Skills */}
                          <div className="req-card-col lg:col-span-4 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col  py-0.5 min-w-0">
                            {/* Primary Skills */}
                            <div className="flex flex-col gap-1">
                              <span className="req-card-label">
                                Primary Skills
                              </span>
                              {candidate.primarySkills &&
                              candidate.primarySkills.length > 0 ? (
                                <CardSkillBadgeOverflow
                                  skills={candidate.primarySkills}
                                  visibleCount={5}
                                  title="All Primary Skills"
                                  variant="primary"
                                />
                              ) : (
                                <span className="text-xs text-[var(--dash-text-muted)]">
                                  None
                                </span>
                              )}
                            </div>

                            {/* Secondary Skills */}
                            <div className="flex flex-col gap-1">
                              <span className="req-card-label">
                                Secondary Skills
                              </span>
                              {candidate.secondarySkills &&
                              candidate.secondarySkills.length > 0 ? (
                                <CardSkillBadgeOverflow
                                  skills={candidate.secondarySkills}
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

                          {/* Column 3: Experience, Education, Certifications */}
                          <div className="req-card-col lg:col-span-3 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-between py-0.5 min-w-0 gap-2.5">
                            {/* Education */}
                            <div className="flex flex-col gap-1">
                              <span className="req-card-label">Education</span>
                              <div className="flex items-center gap-1.5 req-card-value">
                                <GraduationCap className="w-4 h-4 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                                <span
                                  className="truncate"
                                  title={candidate.education}
                                >
                                  {candidate.education}
                                </span>
                              </div>
                            </div>

                            {/* Work Experience */}
                            <div className="flex flex-col gap-1">
                              <span className="req-card-label">
                                Work Experience
                              </span>
                              {(() => {
                                const expList = candidate.workExperience
                                  ? candidate.workExperience.split(", ")
                                  : [];
                                const firstExp = expList[0] || "N/A";
                                const extraExp = expList.slice(1);

                                return (
                                  <div className="flex items-center gap-1.5 req-card-value min-w-0">
                                    <Building2 className="w-4 h-4 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                                    <span className="truncate" title={firstExp}>
                                      {firstExp}
                                    </span>
                                    {extraExp.length > 0 && (
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <button
                                            onClick={(e) => e.stopPropagation()}
                                            className="req-meta-badge"
                                          >
                                            +{extraExp.length} more
                                          </button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                          align="start"
                                          side="top"
                                          onClick={(e) => e.stopPropagation()}
                                          className="w-64 p-3 border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-[var(--dash-text-primary)] shadow-xl rounded-xl z-50"
                                        >
                                          <div className="flex flex-col gap-2">
                                            <span className="text-[11px] font-semibold text-[var(--dash-text-muted)] tracking-wider">
                                              Work Experience
                                            </span>
                                            <div className="flex flex-col gap-1.5 mt-0.5 text-xs">
                                              {expList.map(
                                                (exp: string, idx: number) => (
                                                  <div
                                                    key={idx}
                                                    className="flex items-start gap-2 text-[var(--dash-text-primary)] font-medium"
                                                  >
                                                    <Building2 className="w-3.5 h-3.5 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0 mt-0.5" />
                                                    <span>{exp}</span>
                                                  </div>
                                                ),
                                              )}
                                            </div>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Certifications */}
                            <div className="flex flex-col gap-1">
                              <span className="req-card-label">
                                Certifications
                              </span>
                              <CertificatePopover
                                certificates={candidate.certificates}
                              />
                            </div>
                          </div>

                          {/* Column 4: Status, Actions & Availability */}
                          <div className="req-card-col lg:col-span-2 flex flex-col justify-center gap-1.5 py-0.5 min-w-0 h-full">
                            {/* Row 1: Status pill + 3-dot menu */}
                            <div className="flex items-center justify-between">
                              {/* Status Dropdown */}
                              <div className="relative overflow-visible">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveStatusMenuId(
                                      activeStatusMenuId === candidate.id
                                        ? null
                                        : candidate.id,
                                    );
                                  }}
                                  className={`dash-status ${
                                    currentStatus === "Active"
                                      ? "dash-status-active border-[rgba(16,185,129,0.2)]"
                                      : "dash-status-closed border-[rgba(239,68,68,0.2)]"
                                  } flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all h-auto cursor-pointer`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      currentStatus === "Active"
                                        ? "bg-emerald-500"
                                        : "bg-red-500"
                                    }`}
                                  />
                                  <span>{currentStatus}</span>
                                  <ChevronDown className="w-3 h-3 opacity-60" />
                                </button>

                                {activeStatusMenuId === candidate.id && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-40"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveStatusMenuId(null);
                                      }}
                                    />
                                    <div className="absolute left-0 mt-1.5 w-32 bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in-50 slide-in-from-top-1">
                                      {(["Active", "Not Active"] as const).map(
                                        (status) => (
                                          <button
                                            key={status}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setCandidateStatuses((prev) => ({
                                                ...prev,
                                                [candidate.id]: status,
                                              }));
                                              setActiveStatusMenuId(null);
                                            }}
                                            className="w-full text-left justify-between h-auto py-1.5 px-4 text-xs hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-primary)] flex items-center rounded-none font-normal gap-2"
                                          >
                                            <span>{status}</span>
                                            {currentStatus === status && (
                                              <Check className="w-3 h-3 text-[var(--dash-badge-text)]" />
                                            )}
                                          </button>
                                        ),
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* 3-dot Action Menu */}
                              <div className="relative overflow-visible">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveActionMenuId(
                                      activeActionMenuId === candidate.id
                                        ? null
                                        : candidate.id,
                                    );
                                  }}
                                  className="h-7 w-7 rounded-lg text-[var(--dash-text-secondary)] hover:bg-[var(--dash-card-hover)] hover:text-[var(--dash-text-primary)] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                                  title="Actions"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {activeActionMenuId === candidate.id && (
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
                                          setSelectedCandidateForDetails(
                                            candidate,
                                          );
                                        }}
                                        className="w-full text-left py-2 px-4 text-xs hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-primary)] flex items-center gap-2 transition-colors cursor-pointer"
                                      >
                                        <Eye className="w-3.5 h-3.5 text-[var(--dash-text-secondary)]" />
                                        <span>Candidate Details</span>
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveActionMenuId(null);
                                          setEditingCandidate(candidate);
                                          setIsAddCandidateOpen(true);
                                        }}
                                        className="w-full text-left py-2 px-4 text-xs hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-primary)] flex items-center gap-2 transition-colors cursor-pointer"
                                      >
                                        <Pencil className="w-3.5 h-3.5 text-[var(--dash-text-secondary)]" />
                                        <span>Edit Candidate</span>
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveActionMenuId(null);
                                          setDeletingCandidateId(candidate.id);
                                        }}
                                        className="w-full text-left py-2 px-4 text-xs hover:bg-[var(--dash-card-hover)] text-[var(--dash-danger-text)] flex items-center gap-2 transition-colors cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-[var(--dash-danger-text)]" />
                                        <span>Delete Candidate</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Row 2: Candidate Details CTA */}
                            <DashButton
                              variant="primary"
                              className="w-full text-xs font-semibold py-2 h-auto flex items-center justify-center gap-1.5 shadow-sm rounded-xl"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCandidateForDetails(candidate);
                              }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Candidate Details
                            </DashButton>

                            {/* Row 3: Availability Selector */}
                            <div className="relative overflow-visible">
                              {currentStatus === "Active" ? (
                                <div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveAvailabilityMenuId(
                                        activeAvailabilityMenuId ===
                                          candidate.id
                                          ? null
                                          : candidate.id,
                                      );
                                    }}
                                    className="w-full flex items-center justify-between gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[var(--req-card-badge-blue-bg)] text-[var(--req-card-badge-blue-text)] border border-[var(--req-card-badge-blue-border)] hover:opacity-90 transition-all cursor-pointer"
                                  >
                                    <div className="flex items-center gap-1.5 truncate">
                                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                      <span className="truncate">
                                        {currentAvailability}
                                      </span>
                                    </div>
                                    <ChevronDown className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                                  </button>

                                  {activeAvailabilityMenuId ===
                                    candidate.id && (
                                    <>
                                      <div
                                        className="fixed inset-0 z-40"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveAvailabilityMenuId(null);
                                        }}
                                      />
                                      <div className="absolute left-0 mt-1.5 w-full bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in-50 slide-in-from-top-1">
                                        {(
                                          [
                                            "Immediate Joiner",
                                            "Notice Period",
                                          ] as const
                                        ).map((avail) => (
                                          <button
                                            key={avail}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setCandidateAvailabilities(
                                                (prev) => ({
                                                  ...prev,
                                                  [candidate.id]: avail,
                                                }),
                                              );
                                              setActiveAvailabilityMenuId(null);
                                            }}
                                            className="w-full text-left justify-between h-auto py-1.5 px-3 text-xs hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-primary)] flex items-center font-normal gap-2"
                                          >
                                            <span>{avail}</span>
                                            {currentAvailability === avail && (
                                              <Check className="w-3 h-3 text-[var(--dash-badge-text)]" />
                                            )}
                                          </button>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <div className="px-3 py-1.5 rounded-xl bg-[var(--dash-input-bg)] border border-[var(--dash-card-border)] text-xs text-[var(--dash-text-muted)] text-center font-medium">
                                  Unavailable
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Dialog
        open={isAddCandidateOpen}
        onOpenChange={(open) => {
          setIsAddCandidateOpen(open);
          if (!open) setEditingCandidate(null);
        }}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)]">
          <AddCandidateForm
            initialValues={
              editingCandidate
                ? mapCandidateToFormValues(editingCandidate)
                : undefined
            }
            isEdit={!!editingCandidate}
            onCancel={() => {
              setIsAddCandidateOpen(false);
              setEditingCandidate(null);
            }}
            onSuccess={(values: any) => {
              console.log("Success form values:", values);
              let updated: any[];
              if (editingCandidate) {
                const updatedCand = mapFormValuesToCandidate(
                  values,
                  editingCandidate.id,
                  editingCandidate.status,
                );
                updated = candidates.map((c) =>
                  c.id === editingCandidate.id ? updatedCand : c,
                );
              } else {
                const newCand = mapFormValuesToCandidate(
                  values,
                  String(Date.now()),
                );
                updated = [...candidates, newCand];
              }
              setCandidates(updated);
              localStorage.setItem("bench_candidates", JSON.stringify(updated));
              setIsAddCandidateOpen(false);
              setEditingCandidate(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedCandidateForDetails !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedCandidateForDetails(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[88vh] flex flex-col border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-[var(--dash-text-primary)] p-5 rounded-2xl">
          {selectedCandidateForDetails &&
            (() => {
              const formValues = mapCandidateToFormValues(
                selectedCandidateForDetails,
              );
              const rateDisplay = formatRateRange({
                min: formValues.rateDetails.rateMin,
                max: formValues.rateDetails.rateMax,
                period: formValues.rateDetails.rateType,
                currency: formValues.rateDetails.currency,
              });
              return (
                <>
                  <DialogHeader className="border-b border-[var(--dash-card-border)] pb-3 mb-3 flex-shrink-0 text-left">
                    <div>
                      <span className="inline-block text-[9.5px] font-bold text-[var(--req-card-badge-purple-text)] capitalize tracking-wider bg-[var(--req-card-badge-purple-bg)] border border-[var(--req-card-badge-purple-border)] px-1.5 py-0.5 rounded-md mb-1.5">
                        {String(selectedCandidateForDetails.id)
                          .toUpperCase()
                          .startsWith("CAN-")
                          ? selectedCandidateForDetails.id
                          : `CAN-${String(selectedCandidateForDetails.id).padStart(4, "0")}`}
                      </span>
                      <DialogTitle className="text-lg font-bold text-[var(--dash-text-primary)] flex items-center gap-2">
                        <span>
                          {formValues.basicInfo.firstName}{" "}
                          {formValues.basicInfo.lastName}
                        </span>
                        <span className="text-xs font-normal text-[var(--dash-text-muted)]">
                          ({formValues.basicInfo.gender})
                        </span>
                      </DialogTitle>
                    </div>
                    <DialogDescription className="text-[var(--dash-text-muted)] text-xs mt-0.5">
                      Candidate Profile Details & Professional Summary
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar py-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Column 1: Basic info, Preferences, Rates, Links */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-[10px] capitalize tracking-wider text-[var(--dash-text-muted)] font-bold mb-0.5">
                            Designation
                          </h4>
                          <p className="text-[13.5px] font-semibold text-[var(--dash-text-primary)]">
                            {formValues.basicInfo.designation}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-[10px] capitalize tracking-wider text-[var(--dash-text-muted)] font-bold mb-0.5">
                            Experience
                          </h4>
                          <p className="text-xs text-[var(--dash-text-secondary)]">
                            {formValues.basicInfo.totalExperience} of experience
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <h4 className="text-[10px] capitalize tracking-wider text-[var(--dash-text-muted)] font-bold mb-1">
                              Engagement Model
                            </h4>
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[11px] font-semibold">
                              <Briefcase className="w-3 h-3" />
                              {formValues.workPreferences.engagementType}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-[10px] capitalize tracking-wider text-[var(--dash-text-muted)] font-bold mb-1">
                              Deployment Mode
                            </h4>
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[11px] font-semibold">
                              <MapPin className="w-3 h-3" />
                              {formValues.workPreferences.deploymentType}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <h4 className="text-[10px] capitalize tracking-wider text-[var(--dash-text-muted)] font-bold mb-1">
                              Rate Details
                            </h4>
                            <p className="text-xs font-semibold text-emerald-500">
                              {rateDisplay}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-[10px] capitalize tracking-wider text-[var(--dash-text-muted)] font-bold mb-1">
                              Availability
                            </h4>
                            <span className="inline-block text-[11px] font-semibold text-[#3b82f6] bg-[#3b82f6]/10 border border-[#3b82f6]/20 px-2.5 py-0.5 rounded-full">
                              {formValues.workPreferences.availability}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[10px] capitalize tracking-wider text-[var(--dash-text-muted)] font-bold mb-0.5">
                            Location Details
                          </h4>
                          <p className="text-xs text-[var(--dash-text-secondary)]">
                            {formatLocationCityStateCountry(
                              formValues.location.location,
                            )}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-[10px] capitalize tracking-wider text-[var(--dash-text-muted)] font-bold mb-1.5">
                            Social & Professional Links
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {formValues.links.linkedIn && (
                              <a
                                href={formValues.links.linkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 text-blue-500 text-[11px] font-medium transition-colors"
                              >
                                <LinkedinIcon className="w-3 h-3" />
                                LinkedIn
                                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                              </a>
                            )}
                            {formValues.links.github && (
                              <a
                                href={formValues.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--dash-input-bg)] border border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-[11px] font-medium transition-colors"
                              >
                                <GithubIcon className="w-3 h-3" />
                                GitHub
                                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                              </a>
                            )}
                            {!formValues.links.linkedIn &&
                              !formValues.links.github && (
                                <span className="text-xs text-[var(--dash-text-muted)] italic">
                                  No links provided
                                </span>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Skills, Certifications, Education */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-[10px] capitalize tracking-wider text-[var(--dash-text-muted)] font-bold mb-1">
                            Primary Skills
                          </h4>
                          <div>
                            <SkillBadgeOverflow
                              skills={formValues.skills.primarySkills}
                              visibleCount={10}
                            />
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[10px] capitalize tracking-wider text-[var(--dash-text-muted)] font-bold mb-1">
                            Secondary Skills
                          </h4>
                          <div>
                            <SkillBadgeOverflow
                              skills={formValues.skills.secondarySkills}
                              visibleCount={10}
                            />
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[10px] capitalize tracking-wider text-[var(--dash-text-muted)] font-bold mb-1">
                            Certifications
                          </h4>
                          <div className="flex flex-col gap-0.5 mt-0.5">
                            {formValues.certifications.certifications.length >
                            0 ? (
                              formValues.certifications.certifications.map(
                                (cert) => (
                                  <span
                                    key={cert}
                                    className="text-[11px] text-[var(--dash-text-secondary)]"
                                  >
                                    • {cert}
                                  </span>
                                ),
                              )
                            ) : (
                              <span className="text-[11px] text-[var(--dash-text-muted)] italic">
                                No certifications listed
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[10px] capitalize tracking-wider text-[var(--dash-text-muted)] font-bold mb-1">
                            Education
                          </h4>
                          <div className="p-2.5 rounded-lg bg-[var(--dash-input-bg)] border border-[var(--dash-card-border)] space-y-0.5">
                            <p className="text-xs font-semibold text-[var(--dash-text-primary)]">
                              {formValues.education.degree}
                            </p>
                            <p className="text-[11px] text-[var(--dash-text-secondary)]">
                              {formValues.education.institute}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-[var(--dash-text-muted)] pt-0.5">
                              <span>
                                Passing Year: {formValues.education.passingYear}
                              </span>
                              {formValues.education.cgpaOrPercentage && (
                                <span>
                                  Percentage / CGPA:{" "}
                                  {formValues.education.cgpaOrPercentage}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Full-width Section: Work Experience */}
                    <div className="border-t border-[var(--dash-card-border)] pt-4 mt-4">
                      <h4 className="text-[10px] capitalize tracking-wider text-[var(--dash-text-muted)] font-bold mb-2">
                        Work Experience & Projects
                      </h4>
                      {formValues.workExperience &&
                      formValues.workExperience.length > 0 ? (
                        <Accordion type="multiple" className="w-full space-y-2">
                          {formValues.workExperience.map(
                            (exp: any, index: number) => {
                              const expDuration =
                                exp.duration ||
                                (exp.startDate && exp.endDate
                                  ? `${exp.startDate} – ${exp.endDate}`
                                  : exp.startDate || exp.endDate || "");
                              const companyDisplay =
                                exp.companyName || exp.company || "";

                              return (
                                <AccordionItem
                                  key={index}
                                  value={`exp-${index}`}
                                  className="border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)] rounded-xl overflow-hidden px-3.5"
                                >
                                  <AccordionTrigger className="hover:no-underline py-2.5 flex justify-between items-center w-full">
                                    <div className="flex justify-between items-center w-full text-left pr-4">
                                      <div>
                                        <h5 className="font-semibold text-[var(--dash-text-primary)] text-xs">
                                          {exp.role}
                                        </h5>
                                        {companyDisplay && (
                                          <p className="text-[11px] text-[var(--dash-text-secondary)]">
                                            {companyDisplay}
                                          </p>
                                        )}
                                      </div>
                                      {expDuration && (
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] text-[var(--dash-text-primary)] flex-shrink-0">
                                          {expDuration}
                                        </span>
                                      )}
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="pb-3 pt-0.5">
                                    {/* Projects */}
                                    {exp.projects && exp.projects.length > 0 ? (
                                      <div className="pl-2.5 border-l-2 border-indigo-500/40 space-y-2">
                                        <p className="text-[9.5px] font-bold text-indigo-500 capitalize tracking-wider mb-1.5">
                                          Projects
                                        </p>
                                        {exp.projects.map(
                                          (proj: any, pIndex: number) => (
                                            <div
                                              key={pIndex}
                                              className="space-y-0.5 bg-[var(--dash-card-bg-solid)] p-2 rounded-lg border border-[var(--dash-card-border)]"
                                            >
                                              <div className="flex justify-between items-baseline">
                                                <span className="text-[11.5px] font-semibold text-[var(--dash-text-primary)]">
                                                  {proj.projectTitle}
                                                </span>
                                                <span className="text-[9.5px] text-[var(--dash-text-muted)]">
                                                  {proj.startDate} -{" "}
                                                  {proj.endDate}
                                                </span>
                                              </div>
                                              <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[9.5px] text-[var(--dash-text-secondary)]">
                                                <span>
                                                  <strong>Role:</strong>{" "}
                                                  {proj.role}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                  <strong>Domain:</strong>{" "}
                                                  {proj.domain}
                                                </span>
                                              </div>
                                              {proj.projectDetails && (
                                                <p className="text-[11px] text-[var(--dash-text-secondary)] mt-1 leading-relaxed">
                                                  {proj.projectDetails}
                                                </p>
                                              )}
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-[11px] text-[var(--dash-text-muted)] italic pl-2.5 border-l-2 border-[var(--dash-card-border)]">
                                        No projects listed for this role
                                      </p>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            },
                          )}
                        </Accordion>
                      ) : (
                        <p className="text-xs text-[var(--dash-text-muted)] italic">
                          No work experience listed
                        </p>
                      )}
                    </div>

                    {/* Full-width Section: Personal Projects */}
                    {formValues.personalProjects &&
                      formValues.personalProjects.length > 0 && (
                        <div className="border-t border-[var(--dash-card-border)] pt-4 mt-4">
                          <h4 className="text-[10px] capitalize tracking-wider text-[var(--dash-text-muted)] font-bold mb-2 flex items-center gap-1.5">
                            <FolderGit2 className="w-3 h-3 text-indigo-400" />
                            Personal Projects
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {formValues.personalProjects.map(
                              (pProj: any, pIdx: number) => (
                                <div
                                  key={pIdx}
                                  className="p-2.5 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)] space-y-1.5"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <h5 className="text-[11.5px] font-semibold text-[var(--dash-text-primary)] flex items-center gap-1">
                                        {pProj.projectTitle}
                                      </h5>
                                      {pProj.role && (
                                        <p className="text-[10px] text-[var(--dash-text-secondary)]">
                                          {pProj.role}
                                        </p>
                                      )}
                                    </div>
                                    {pProj.projectUrl && (
                                      <a
                                        href={pProj.projectUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-indigo-400 hover:text-indigo-300 p-0.5 rounded hover:bg-indigo-500/10 transition-colors"
                                        title="View Project Link"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>

                                  {(pProj.domain || pProj.startDate) && (
                                    <div className="flex flex-wrap gap-x-2 text-[9.5px] text-[var(--dash-text-muted)]">
                                      {pProj.domain && (
                                        <span>
                                          <strong>Domain:</strong>{" "}
                                          {pProj.domain}
                                        </span>
                                      )}
                                      {pProj.domain && pProj.startDate && (
                                        <span>•</span>
                                      )}
                                      {pProj.startDate && (
                                        <span>
                                          {pProj.startDate}{" "}
                                          {pProj.endDate
                                            ? `- ${pProj.endDate}`
                                            : ""}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {pProj.technologies &&
                                    pProj.technologies.length > 0 && (
                                      <div className="flex flex-wrap gap-1 pt-0.5">
                                        {pProj.technologies.map(
                                          (tech: string, tIdx: number) => (
                                            <span
                                              key={tIdx}
                                              className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                                            >
                                              {tech}
                                            </span>
                                          ),
                                        )}
                                      </div>
                                    )}

                                  {pProj.projectDetails && (
                                    <p className="text-[10.5px] text-[var(--dash-text-secondary)] leading-relaxed pt-0.5">
                                      {pProj.projectDetails}
                                    </p>
                                  )}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  <DialogFooter className="border-t border-[var(--dash-card-border)] pt-3 mt-4 flex-shrink-0">
                    <DashButton
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8 px-3.5"
                      onClick={() => setSelectedCandidateForDetails(null)}
                    >
                      Close Details
                    </DashButton>
                  </DialogFooter>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={deletingCandidateId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingCandidateId(null);
        }}
        title="Delete Candidate"
        description="Are you sure you want to delete this candidate from your bench? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={() => {
          if (deletingCandidateId) {
            const updated = candidates.filter(
              (c) => c.id !== deletingCandidateId,
            );
            setCandidates(updated);
            localStorage.setItem("bench_candidates", JSON.stringify(updated));
          }
          setDeletingCandidateId(null);
        }}
      />
    </>
  );
}
