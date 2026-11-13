"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  Wand2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Users,
  UserCheck,
  UserPlus,
  Building2,
  MoreVertical,
  Eye,
  Download,
  ChevronDown,
  Check,
  User,
  ClipboardList,
} from "lucide-react";
import VendorSidebar from "../dashboard/components/VendorSidebar";
import VendorDashboardHeader from "../dashboard/components/VendorDashboardHeader";
import { DashButton } from "@/app/components/ui/dash-button";
import { JobDescriptionModal } from "@/app/components/JobDescriptionModal";
import { DashSearchInput } from "@/app/components/ui/dash-search-input";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { EmptyState } from "@/app/components/ui/empty-state";
import { SkillBadgeOverflow } from "@/app/components/ui/skill-badge-overflow";
import { CardSkillBadgeOverflow } from "@/app/components/ui/card-skill-badge-overflow";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { ConfirmationDialog } from "@/app/components/ui/confirmation-dialog";
import { useVendorDashboardTheme } from "../dashboard/VendorDashboardThemeContext";
import { LoadingOverlay } from "@/app/onboarding/components/LoadingOverlay";
import AddCandidateForm from "../bench/components/AddCandidateForm";
import OpportunitiesSkeleton from "./components/OpportunitiesSkeleton";
import { CertificatePopover } from "./components/CertificatePopover";
import {
  formatRateRange,
  formatCompactRateAmount,
} from "@/app/lib/rate-format";
import { downloadJDPDF } from "@/app/lib/generate-jd-pdf";
import { useSidebar } from "@/app/components/SidebarContext";

export type Opportunity = {
  id: number;
  title: string;
  client: string;
  industry: string;
  startDate: string;
  location: string;
  type: "C-C" | "C-H";
  date: string;
  timezone: string;
  skills: string[];
  secondarySkills: string[];
  experience: string;
  certificates?: string[];
  certificate?: string;
  jdLink?: string;
  budget: string;
  budgetType?: "Hourly" | "Monthly" | "Daywise";
  positions: number;
  proposedCandidates: number;
  match: number;
  isHot: boolean;
  description: string;
  interviewRounds: number;
  education: string;
  duration: string;
  complianceRequirements?: {
    complianceStatus: string;
    complianceCertifications: string[];
    legalRegistrationDocs: string[];
    insuranceRequirements: string[];
    companyCertifications: string[];
  };
};

const initialOpportunitiesData: Opportunity[] = [
  {
    id: 1,
    title: "Senior React Developer",
    client: "TechCorp Industries",
    industry: "IT & Software",
    startDate: "1 April 2026",
    location: "Bangalore",
    type: "C-C",
    date: "1 Apr 2026",
    timezone: "IST",
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Next.js",
      "Redux",
      "GraphQL",
      "Tailwind CSS",
      "Jest",
      "REST APIs",
      "Webpack",
      "CI/CD",
      "Git",
    ],
    secondarySkills: ["PostgreSQL", "Docker", "AWS", "Redis"],
    experience: "5-7 Years",
    certificates: [
      "AWS Certified Developer",
      "Google Cloud Professional Architect",
    ],
    certificate: "AWS Certified Developer",
    jdLink: "#",
    budget: "₹15-18L",
    budgetType: "Monthly",
    positions: 3,
    proposedCandidates: 1,
    match: 94,
    isHot: true,
    description:
      "Looking for an experienced Senior React Developer to join our core product team. Must have deep experience building scalable, high-performance web applications, managing state architectures, and mentoring junior engineers.",
    interviewRounds: 3,
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
    id: 2,
    title: "DevOps & Cloud Engineer",
    client: "Cloud Solutions Ltd",
    industry: "DevOps & Cloud Infrastructure",
    startDate: "15 April 2026",
    location: "Remote",
    type: "C-C",
    date: "28 Mar 2026",
    timezone: "UST",
    skills: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Ansible",
      "Jenkins",
      "Helm",
      "Prometheus",
      "Grafana",
    ],
    secondarySkills: ["Python", "Bash", "CI/CD"],
    experience: "5+ Years",
    certificates: [
      "AWS Solutions Architect",
      "Certified Kubernetes Administrator (CKA)",
    ],
    certificate: "AWS Solutions Architect",
    jdLink: "#",
    budget: "₹20-25L",
    budgetType: "Monthly",
    positions: 2,
    proposedCandidates: 0,
    match: 87,
    isHot: true,
    description:
      "Seeking a skilled DevOps Engineer to automate and streamline cloud infrastructure. Design resilient multi-region AWS deployments, manage Kubernetes clusters, and establish robust CI/CD pipelines.",
    interviewRounds: 4,
    education: "B.Tech/M.Tech in CS/EE",
    duration: "6 Months",
    complianceRequirements: {
      complianceStatus: "yes",
      complianceCertifications: ["ISO 27001"],
      legalRegistrationDocs: ["GST Certificate"],
      insuranceRequirements: ["Professional Indemnity"],
      companyCertifications: [],
    },
  },
  {
    id: 3,
    title: "UI/UX Product Designer",
    client: "Innovate Web Studio",
    industry: "Design & Creative",
    startDate: "1 May 2026",
    location: "Hybrid - Mumbai",
    type: "C-H",
    date: "25 Mar 2026",
    timezone: "IST",
    skills: [
      "Figma",
      "Adobe XD",
      "CSS",
      "Design Systems",
      "User Research",
      "Wireframing",
      "Prototyping",
    ],
    secondarySkills: ["Illustrator", "Motion Design"],
    experience: "3+ Years",
    certificate: "Google UX Design Professional",
    jdLink: "#",
    budget: "₹10-14L",
    budgetType: "Monthly",
    positions: 1,
    proposedCandidates: 1,
    match: 78,
    isHot: false,
    description:
      "Creative product designer needed to design user interfaces and modern web design systems. High proficiency with Figma component libraries, responsive prototypes, and developer handoffs is required.",
    interviewRounds: 3,
    education: "Any Graduate / Design Diploma",
    duration: "12 Months",
  },
  {
    id: 4,
    title: "Python Backend Developer",
    client: "DataMinds Inc",
    industry: "Data & Enterprise Software",
    startDate: "20 April 2026",
    location: "Remote",
    type: "C-C",
    date: "22 Mar 2026",
    timezone: "UST",
    skills: [
      "Python",
      "Django",
      "FastAPI",
      "PostgreSQL",
      "REST APIs",
      "Celery",
      "Redis",
      "Docker",
    ],
    secondarySkills: ["AWS", "Microservices"],
    experience: "4-6 Years",
    certificate: "Python Institute PCPP",
    jdLink: "#",
    budget: "₹18-22L",
    budgetType: "Monthly",
    positions: 2,
    proposedCandidates: 0,
    match: 92,
    isHot: false,
    description:
      "Backend Developer position specializing in Python, FastAPI, and Django frameworks. Work on building robust asynchronous APIs, data ingestion microservices, and database query optimizations.",
    interviewRounds: 2,
    education: "Bachelor's Degree in CS",
    duration: "6 Months",
  },
  {
    id: 5,
    title: "Mobile App Engineer (Flutter)",
    client: "AppWave Technologies",
    industry: "Mobile & Consumer Tech",
    startDate: "10 May 2026",
    location: "Hyderabad",
    type: "C-H",
    date: "18 Mar 2026",
    timezone: "IST",
    skills: [
      "Flutter",
      "Dart",
      "Firebase",
      "iOS",
      "Android",
      "State Management (Bloc)",
      "REST APIs",
    ],
    secondarySkills: ["GraphQL", "Fastlane"],
    experience: "3-5 Years",
    certificate: "Google Associate Android Developer",
    jdLink: "#",
    budget: "₹12-16L",
    budgetType: "Monthly",
    positions: 3,
    proposedCandidates: 2,
    match: 81,
    isHot: false,
    description:
      "Join our high-velocity mobile app engineering team to help scale cross-platform consumer applications using Flutter and Dart. Integration with native device APIs and smooth 60fps animations.",
    interviewRounds: 3,
    education: "Bachelor's in CS / IT",
    duration: "12 Months",
  },
  {
    id: 6,
    title: "Lead Full Stack Architect",
    client: "NexGen Financial Systems",
    industry: "Fintech & Banking",
    startDate: "1 June 2026",
    location: "Pune",
    type: "C-C",
    date: "15 Mar 2026",
    timezone: "IST",
    skills: [
      "Node.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "AWS",
      "Kafka",
      "Microservices",
      "Docker",
    ],
    secondarySkills: ["Kubernetes", "Redis", "Elasticsearch"],
    experience: "8+ Years",
    certificates: ["AWS Solutions Architect Professional", "TOGAF 9 Certified"],
    certificate: "AWS Solutions Architect Professional",
    jdLink: "#",
    budget: "₹28-35L",
    budgetType: "Monthly",
    positions: 1,
    proposedCandidates: 0,
    match: 96,
    isHot: true,
    description:
      "Lead technical design and engineering delivery for a modern payment settlement engine. High requirements on system availability, secure banking data standards, and microservices decomposition.",
    interviewRounds: 4,
    education: "B.Tech/M.Tech in CS",
    duration: "12 Months",
    complianceRequirements: {
      complianceStatus: "yes",
      complianceCertifications: ["ISO 27001", "PCI-DSS"],
      legalRegistrationDocs: ["GST Certificate", "PAN Card"],
      insuranceRequirements: [
        "General Liability Insurance",
        "Professional Indemnity",
      ],
      companyCertifications: ["ISO 9001"],
    },
  },
];

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
} as const;

function OpportunitiesContent() {
  const {
    collapsed: sidebarCollapsed,
    toggleCollapse,
    mobileOpen,
    setMobileOpen,
    toggleMobile,
  } = useSidebar();
  const [loading, setLoading] = useState(true);
  const { mode } = useVendorDashboardTheme();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  useEffect(() => {
    if (openPopoverId === null) return;
    const handleScroll = () => setOpenPopoverId(null);
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

  // Main Opportunities State
  const [opportunities, setOpportunities] = useState<Opportunity[]>(
    initialOpportunitiesData,
  );

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [engagementFilter, setEngagementFilter] = useState("All Engagements");
  const [sortBy, setSortBy] = useState("newest");

  // Tag expansion states
  const [expandedSkills, setExpandedSkills] = useState<Record<number, boolean>>(
    {},
  );
  const [expandedSecSkills, setExpandedSecSkills] = useState<
    Record<number, boolean>
  >({});

  // Card dropdown state
  const [activeActionMenuId, setActiveActionMenuId] = useState<number | null>(
    null,
  );

  // View JD Modal State
  const [selectedJD, setSelectedJD] = useState<Opportunity | null>(null);
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);

  // Propose Candidate Flow States
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [selectedOppForPropose, setSelectedOppForPropose] =
    useState<Opportunity | null>(null);
  const [, setCandidateName] = useState("");
  const [, setCandidateExp] = useState("");
  const [, setUploadedFile] = useState<File | null>(null);
  const [proposeStatus, setProposeStatus] = useState<
    "idle" | "scanning" | "result"
  >("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [calculatedScore, setCalculatedScore] = useState<number>(0);
  const [simulationMode] = useState<"random" | "high" | "low">("high");

  const [pendingFormValues, setPendingFormValues] = useState<any | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const searchVal = searchParams.get("search");
    if (searchVal) {
      setSearchQuery(searchVal);
    }
    const openJDId = searchParams.get("openJDId");
    if (openJDId) {
      const idNum = Number(openJDId);
      const found = opportunities.find((o) => o.id === idNum);
      if (found) {
        setSelectedJD(found);
        setIsJDModalOpen(true);
      }
    }
  }, [searchParams, opportunities]);

  const mapFormValuesToCandidate = (
    values: any,
    id: string,
    existingStatus?: string,
  ) => {
    const isINR = values.rateDetails?.currency?.includes("INR");
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

  const proceedWithSubmission = (formValues: any) => {
    if (!formValues) return;
    setPendingFormValues(formValues);

    setProposeStatus("scanning");
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          let score = 0;
          if (simulationMode === "high") {
            score = Math.floor(Math.random() * 15) + 82; // 82 to 96
          } else if (simulationMode === "low") {
            score = Math.floor(Math.random() * 15) + 50;
          } else {
            score = Math.floor(Math.random() * 45) + 50;
          }

          setCalculatedScore(score);
          setProposeStatus("result");

          // Increment proposed count on opportunity if score >= 80
          if (score >= 80 && selectedOppForPropose) {
            setOpportunities((prevOpps) =>
              prevOpps.map((o) =>
                o.id === selectedOppForPropose.id
                  ? {
                      ...o,
                      proposedCandidates: (o.proposedCandidates || 0) + 1,
                    }
                  : o,
              ),
            );

            // Automatically add to bench if score >= 80
            const stored = localStorage.getItem("bench_candidates");
            let currentCandidates = [];
            if (stored) {
              try {
                currentCandidates = JSON.parse(stored);
              } catch (e) {
                console.error(e);
              }
            }

            const newCand = mapFormValuesToCandidate(
              formValues,
              String(Date.now()),
            );
            newCand.workExperience = `Submitted for JD-${selectedOppForPropose?.id} with match score ${score}%. ${newCand.workExperience}`;

            localStorage.setItem(
              "bench_candidates",
              JSON.stringify([...currentCandidates, newCand]),
            );
          }

          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleManualAddToBench = () => {
    if (!pendingFormValues) return;
    const stored = localStorage.getItem("bench_candidates");
    let currentCandidates = [];
    if (stored) {
      try {
        currentCandidates = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }

    const newCand = mapFormValuesToCandidate(
      pendingFormValues,
      String(Date.now()),
    );
    newCand.workExperience = `Attempted submission for JD-${selectedOppForPropose?.id} with match score ${calculatedScore}%. ${newCand.workExperience}`;

    localStorage.setItem(
      "bench_candidates",
      JSON.stringify([...currentCandidates, newCand]),
    );
    setIsProposeModalOpen(false);
  };

  // Filter & Sort Logic
  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        const formattedId = `JD-${String(opp.id).padStart(4, "0")}`;
        const searchTerms = searchQuery
          .toLowerCase()
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        const matchesSearch =
          searchTerms.length === 0 ||
          searchTerms.every(
            (term) =>
              opp.title.toLowerCase().includes(term) ||
              opp.client.toLowerCase().includes(term) ||
              formattedId.toLowerCase().includes(term) ||
              opp.skills.some((skill) => skill.toLowerCase().includes(term)) ||
              opp.location.toLowerCase().includes(term),
          );

        // Work Type filter
        const matchesType =
          typeFilter === "All Types" ||
          (typeFilter === "Remote" &&
            opp.location.toLowerCase().includes("remote")) ||
          (typeFilter === "Hybrid" &&
            opp.location.toLowerCase().includes("hybrid")) ||
          (typeFilter === "Onsite" &&
            !opp.location.toLowerCase().includes("remote") &&
            !opp.location.toLowerCase().includes("hybrid"));

        // Engagement Model filter
        const matchesEngagement =
          engagementFilter === "All Engagements" ||
          opp.type.toLowerCase() === engagementFilter.toLowerCase();

        return matchesSearch && matchesType && matchesEngagement;
      })
      .sort((a, b) => {
        if (sortBy === "match") return b.match - a.match;
        if (sortBy === "positions") return b.positions - a.positions;
        if (sortBy === "newest") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return 0;
      });
  }, [opportunities, searchQuery, typeFilter, engagementFilter, sortBy]);

  const hasActiveFilters =
    searchQuery !== "" ||
    typeFilter !== "All Types" ||
    engagementFilter !== "All Engagements" ||
    sortBy !== "newest";

  const handleResetFilters = () => {
    setSearchQuery("");
    setTypeFilter("All Types");
    setEngagementFilter("All Engagements");
    setSortBy("newest");
  };

  const handleOpenProposeModal = (opp: Opportunity) => {
    setSelectedOppForPropose(opp);
    setIsProposeModalOpen(true);
    setCandidateName("");
    setCandidateExp("");
    setUploadedFile(null);
    setProposeStatus("idle");
    setPendingFormValues(null);
  };

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

        <div className="dash-content px-4 sm:px-8">
          {loading ? (
            <OpportunitiesSkeleton />
          ) : (
            <div className="sk-page-content-enter">
              {/* Header */}
              <div className="dash-page-header">
                <div>
                  <h1 className="dash-page-title">Opportunities</h1>
                  <p className="dash-page-subtitle">
                    Find new job requirements posted by clients. Submit
                    candidates from your bench.
                  </p>
                </div>
              </div>

              {/* Stats Overview Row (Evaluated for Vendor needs) */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-1.5 px-1.5 mb-5 bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl divide-y md:divide-y-0 md:divide-x divide-[var(--dash-divider)]">
                {/* Stat 1: Total Opportunities */}
                <div className="flex-1 flex items-center justify-between py-1 px-1.5 md:py-0.5 md:px-2">
                  <div className="flex items-center gap-2">
                    <div className="text-blue-500 flex-shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--dash-text-muted)] capitalize tracking-wider whitespace-nowrap">
                      Total Opportunities
                    </span>
                  </div>
                  <span className="text-base font-bold text-blue-500 pr-0.5">
                    {opportunities.length}
                  </span>
                </div>

                {/* Stat 2: Open Positions */}
                <div className="flex-1 flex items-center justify-between py-1 px-1.5 md:py-0.5 md:pl-3 md:pr-2">
                  <div className="flex items-center gap-2">
                    <div className="text-purple-500 flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--dash-text-muted)] capitalize tracking-wider whitespace-nowrap">
                      Open Positions
                    </span>
                  </div>
                  <span className="text-base font-bold text-purple-500 pr-0.5">
                    {opportunities.reduce(
                      (sum, o) => sum + (o.positions || 1),
                      0,
                    )}
                  </span>
                </div>

                {/* Stat 3: My Proposed Candidates */}
                <div className="flex-1 flex items-center justify-between py-1 px-1.5 md:py-0.5 md:pl-3 md:pr-2">
                  <div className="flex items-center gap-2">
                    <div className="text-emerald-500 flex-shrink-0">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--dash-text-muted)] capitalize tracking-wider whitespace-nowrap">
                      My Proposed Candidates
                    </span>
                  </div>
                  <span className="text-base font-bold text-emerald-500 pr-0.5">
                    {opportunities.reduce(
                      (sum, o) => sum + (o.proposedCandidates || 0),
                      0,
                    )}
                  </span>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center">
                {/* Search Input */}
                <DashSearchInput
                  placeholder="Search by title, ID, skills, client..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />

                {/* Dropdown Filters */}
                <div className="flex flex-wrap w-full md:w-auto gap-2.5 sm:gap-3 items-center">
                  {/* Work Type Select */}
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="flex-1 md:w-[130px] md:flex-none h-8 px-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                      <SelectItem value="All Types">All Types</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Onsite">Onsite</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Engagement Model Select (Only C-C and C-H as per Rule 9) */}
                  <Select
                    value={engagementFilter}
                    onValueChange={setEngagementFilter}
                  >
                    <SelectTrigger className="flex-1 md:w-[160px] md:flex-none h-8 px-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)]">
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

                  {/* Sort Select */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="flex-1 md:w-[160px] md:flex-none h-8 px-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)]">
                      <SelectValue placeholder="Sort: Newest" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="positions">Positions</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Clear Filters Button */}
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="h-8 px-2 text-xs font-semibold text-[var(--dash-danger-text)] hover:bg-[var(--dash-danger-bg)]/10 rounded-lg whitespace-nowrap flex items-center justify-center transition-all duration-300 flex-shrink-0 cursor-pointer -ml-1.5 sm:-ml-2.5"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Opportunities Cards List */}
              <div className="flex flex-col gap-4">
                {filteredOpportunities.length === 0 ? (
                  <EmptyState
                    icon={Search}
                    title="No opportunities match your filters"
                    description="Try adjusting your search query, match score threshold, work types, or engagement model, or clear all filters to see all available opportunities."
                    actionText="Reset All Filters"
                    onAction={handleResetFilters}
                  />
                ) : (
                  filteredOpportunities.map((opp) => (
                    <Card
                      key={opp.id}
                      className="req-card p-3 bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl hover:border-[rgba(129,140,248,0.22)] transition-all duration-300 relative group overflow-visible"
                    >
                      {/* Card Content Grid matching Client layout */}
                      <div className="req-card-grid grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
                        {/* Column 1: Title & Meta Details */}
                        <div className="req-card-col lg:col-span-3 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col  gap-2 py-0.5 min-w-0">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[9px] font-semibold text-[var(--req-card-badge-purple-text)] capitalize tracking-wider bg-[var(--req-card-badge-purple-bg)] border border-[var(--req-card-badge-purple-border)] w-fit px-2 py-0.5 rounded-md">
                                JD-{String(opp.id).padStart(4, "0")}
                              </span>
                              {opp.isHot && (
                                <span className="px-2 py-0.5 text-[9px] font-semibold text-[#818CF8] bg-[#6366F1]/15 border border-[#6366F1]/30 rounded-md capitalize tracking-wider">
                                  Hot
                                </span>
                              )}
                            </div>
                            <h2 className="req-card-title">{opp.title}</h2>
                            {/* Client Name - Critical for Vendor */}
                            <div className="flex items-center gap-1 text-xs text-indigo-400 font-semibold truncate">
                              <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{opp.client}</span>
                            </div>
                          </div>

                          {/* Meta Details Grid */}
                          <div className="grid grid-cols-2 items-start gap-x-2 gap-y-2 text-[10px] text-[var(--dash-text-secondary)]">
                            <span className="flex items-start gap-1.5 min-w-0">
                              <Calendar className="w-3.5 h-3.5 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                              <span className="break-words leading-[14px]">{opp.date}</span>
                            </span>
                            <span className="flex items-start gap-1.5 min-w-0">
                              <Briefcase className="w-3.5 h-3.5 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                              <span className="break-words leading-[14px]">{opp.type}</span>
                            </span>
                            <span className="flex items-start gap-1.5 min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                              <span className="break-words leading-[14px]">{opp.location}</span>
                            </span>
                            <span className="flex items-start gap-1.5 min-w-0">
                              <Clock className="w-3.5 h-3.5 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                              <span className="break-words leading-[14px]">
                                {opp.duration || opp.timezone}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Column 2: Primary & Secondary Skills Stacked */}
                        <div className="req-card-col lg:col-span-4 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col  py-0.5 min-w-0">
                          {/* Primary Skills */}
                          <div className="flex flex-col gap-1">
                            <span className="req-card-label">
                              Primary Skills
                            </span>
                            {opp.skills && opp.skills.length > 0 ? (
                              <CardSkillBadgeOverflow
                                skills={opp.skills}
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
                            {opp.secondarySkills &&
                            opp.secondarySkills.length > 0 ? (
                              <CardSkillBadgeOverflow
                                skills={opp.secondarySkills}
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

                        {/* Column 3: Experience, Salary/Rate, Certificate */}
                        <div className="req-card-col lg:col-span-3 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-between py-0.5 min-w-0 gap-2">
                          {/* Experience */}
                          <div className="flex flex-col gap-1">
                            <span className="req-card-label">Experience</span>
                            <div className="flex items-center gap-1 req-card-value">
                              <Briefcase className="w-4 h-4 text-[var(--req-card-icon-color,#3b82f6)]" />
                              <span className="truncate">
                                {opp.experience || "Not Specified"}
                              </span>
                            </div>
                          </div>

                          {/* Rate / Budget */}
                          <div className="flex flex-col gap-1">
                            <span className="req-card-label">Rate Offered</span>
                            <div className="flex items-center gap-1 req-card-value">
                              <span className="truncate  font-semibold">
                                {formatRateRange({
                                  amount: opp.budget,
                                  period: opp.budgetType,
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Certificate */}
                          <div className="flex flex-col gap-1">
                            <span className="req-card-label">
                              Certifications
                            </span>
                            <CertificatePopover
                              certificates={opp.certificates}
                              singleCertificate={opp.certificate}
                            />
                          </div>
                        </div>

                        {/* Column 4: Propose Action, 3-dot Menu & Stats Box */}
                        <div className="req-card-col lg:col-span-2 flex flex-col  py-0.5 min-w-0 h-full gap-2.5">
                          {/* Top row: Propose Candidate button & 3-dot action menu */}
                          <div className="flex items-center justify-between gap-2">
                            {/* Primary CTA: Propose Candidate */}
                            <DashButton
                              variant="primary"
                              className="flex-1 text-xs font-semibold py-2 h-auto flex items-center justify-center gap-1.5 shadow-sm rounded-xl"
                              onClick={() => handleOpenProposeModal(opp)}
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              Propose Candidate
                            </DashButton>

                            {/* Action menu button */}
                            <div className="relative overflow-visible">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveActionMenuId(
                                    activeActionMenuId === opp.id
                                      ? null
                                      : opp.id,
                                  );
                                }}
                                className="h-8 w-8 rounded-lg text-[var(--dash-text-secondary)] hover:bg-[var(--dash-card-hover)] hover:text-[var(--dash-text-primary)] flex items-center justify-center transition-colors flex-shrink-0"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {activeActionMenuId === opp.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveActionMenuId(null);
                                    }}
                                  />
                                  <div className="absolute right-0 mt-1.5 w-48 bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in-50 slide-in-from-top-1 flex flex-col gap-0.5">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveActionMenuId(null);
                                        setSelectedJD(opp);
                                        setIsJDModalOpen(true);
                                      }}
                                      className="w-full text-left h-auto py-2 px-4 text-xs hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-primary)] flex items-center gap-2 rounded-none font-normal"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-[var(--dash-text-secondary)]" />
                                      <span>View Job Description</span>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveActionMenuId(null);
                                        downloadJDPDF(opp);
                                      }}
                                      className="w-full text-left h-auto py-2 px-4 text-xs hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-primary)] flex items-center gap-2 rounded-none font-normal"
                                    >
                                      <Download className="w-3.5 h-3.5 text-[var(--dash-text-secondary)]" />
                                      <span>Download JD (PDF)</span>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Stats Panel Box: Open Positions & My Submissions */}
                          <div className="req-stats-panel">
                            {/* Positions stat */}
                            <div className="req-stat-row">
                              <div className="flex items-center gap-2">
                                <div className="req-stat-icon-box text-blue-500">
                                  <Users className="w-3 h-3" />
                                </div>
                                <span>Positions</span>
                              </div>
                              <span className="font-semibold">
                                {opp.positions}
                              </span>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-[var(--dash-divider)] my-0.5" />

                            {/* My Submissions stat */}
                            <div className="req-stat-row">
                              <div className="flex items-center gap-2">
                                <div className="req-stat-icon-box text-violet-500">
                                  <UserCheck className="w-3 h-3" />
                                </div>
                                <span>My Proposed</span>
                              </div>
                              <span className="font-semibold">
                                {opp.proposedCandidates || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* View Job Description Modal Dialog */}
              <JobDescriptionModal
                open={isJDModalOpen}
                onOpenChange={setIsJDModalOpen}
                requirement={selectedJD}
                variant="vendor-opportunity"
                themeMode={mode}
                onDownloadPDF={downloadJDPDF}
                onProposeCandidate={() => {
                  if (selectedJD) {
                    handleOpenProposeModal(selectedJD);
                  }
                }}
              />

              {/* Propose Candidate Modal Dialog */}
              <Dialog
                open={isProposeModalOpen}
                onOpenChange={setIsProposeModalOpen}
              >
                <DialogContent
                  data-dashboard-theme={mode}
                  className={
                    proposeStatus === "idle"
                      ? "max-w-4xl p-0 overflow-hidden border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)]"
                      : "max-w-md p-6 border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-[var(--dash-text-primary)]"
                  }
                >
                  {proposeStatus === "idle" && (
                    <AddCandidateForm
                      submitButtonText="Propose Candidate"
                      onCancel={() => setIsProposeModalOpen(false)}
                      onSuccess={(values) => {
                        proceedWithSubmission(values);
                      }}
                    />
                  )}

                  {proposeStatus === "scanning" && (
                    <div className="min-h-[300px] flex items-center justify-center">
                      <LoadingOverlay
                        variant="default"
                        message="Analyzing Candidate Profile & Calculating Match..."
                        loaderText="ANALYZING"
                      />
                    </div>
                  )}

                  {proposeStatus === "result" && (
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <div className="text-xs text-[var(--dash-text-muted)] capitalize tracking-widest font-bold">
                          MATCH SCORE RESULT
                        </div>
                        <div
                          className={`text-5xl font-extrabold ${calculatedScore >= 80 ? "text-emerald-500" : "text-rose-500"}`}
                        >
                          {calculatedScore}%
                        </div>
                      </div>

                      {calculatedScore >= 80 ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-semibold text-[var(--dash-text-primary)]">
                              Proposed Successfully!
                            </div>
                            <div className="text-xs text-[var(--dash-text-secondary)] mt-1">
                              Match score is above 80%. Candidate has been
                              successfully proposed to{" "}
                              {selectedOppForPropose?.client || "the client"}{" "}
                              and added to your bench automatically.
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex flex-col gap-3">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                              <div className="text-sm font-semibold text-[var(--dash-text-primary)]">
                                Cannot Propose to Client
                              </div>
                              <div className="text-xs text-[var(--dash-text-secondary)] mt-1">
                                Match score is below 80%. The candidate does not
                                meet the minimum match threshold for this
                                requirement.
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 pt-3 border-t border-rose-500/20">
                            <div className="text-xs font-medium text-[var(--dash-text-primary)] mb-3">
                              Would you like to add this candidate to your bench
                              instead?
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <DashButton
                                variant="primary"
                                onClick={handleManualAddToBench}
                              >
                                Yes, add to bench
                              </DashButton>
                              <DashButton
                                variant="outline"
                                onClick={() => setIsProposeModalOpen(false)}
                              >
                                No, discard
                              </DashButton>
                            </div>
                          </div>
                        </div>
                      )}

                      {calculatedScore >= 80 && (
                        <DialogFooter className="pt-4 border-t border-[var(--dash-divider)] sm:justify-end">
                          <DashButton
                            variant="primary"
                            onClick={() => setIsProposeModalOpen(false)}
                          >
                            Done
                          </DashButton>
                        </DialogFooter>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function VendorOpportunitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="dash-content px-4 sm:px-8">
          <OpportunitiesSkeleton />
        </div>
      }
    >
      <OpportunitiesContent />
    </Suspense>
  );
}
