"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  Users,
  Eye,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Info,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import VendorSidebar from "../dashboard/components/VendorSidebar";
import { SkillBadgeOverflow } from "@/app/components/ui/skill-badge-overflow";
import VendorDashboardHeader from "../dashboard/components/VendorDashboardHeader";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import VendorBenchSkeleton from "../bench/components/VendorBenchSkeleton"; // We can reuse the skeleton
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { useVendorDashboardTheme } from "../dashboard/VendorDashboardThemeContext";
import { DashButton } from "@/app/components/ui/dash-button";
import { JobDescriptionModal } from "@/app/components/JobDescriptionModal";
import { DashSearchInput } from "@/app/components/ui/dash-search-input";
import { formatRateRange } from "@/app/lib/rate-format";
import { downloadJDPDF } from "@/app/lib/generate-jd-pdf";
import { useSidebar } from "@/app/components/SidebarContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

type Requirement = {
  id: number;
  title: string;
  location: string;
  type: string;
  date: string;
  timezone: string;
  skills: string[];
  secondarySkills?: string[];
  experience?: string;
  certificate?: string;
  jdLink?: string;
  budget: string;
  budgetType?: "Hourly" | "Monthly" | "Daywise";
  positions: number;
  candidates: number;
  status: "Active" | "On Hold" | "Closed";
  interviewRounds?: number;
  education?: string;
  duration?: string;
};

const vendorJDs: Requirement[] = [
  {
    id: 1,
    title: "React Developer",
    location: "Bangalore (Remote)",
    type: "C-C",
    date: "15 March 2026",
    timezone: "IST",
    skills: ["React", "TypeScript", "Node.js"],
    secondarySkills: ["Next.js", "Redux", "Jest"],
    experience: "5-7 Years",
    certificate: "AWS Certified Developer",
    jdLink: "#",
    budget: "₹15-18L",
    budgetType: "Monthly",
    positions: 3,
    candidates: 12,
    status: "Active",
    interviewRounds: 3,
    education: "Bachelor's in CS / IT",
    duration: "12 Months",
  },
  {
    id: 2,
    title: "Java Backend",
    location: "Remote",
    type: "C-C",
    date: "18 March 2026",
    timezone: "IST",
    skills: ["Java", "Spring Boot", "Microservices"],
    secondarySkills: ["PostgreSQL", "Kafka", "Docker"],
    experience: "6-8 Years",
    certificate: "Oracle Certified Professional",
    jdLink: "#",
    budget: "₹18-22L",
    budgetType: "Monthly",
    positions: 2,
    candidates: 8,
    status: "Active",
    interviewRounds: 2,
    education: "Bachelor's Degree",
    duration: "6 Months",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    location: "Pune (Hybrid)",
    type: "C-H",
    date: "12 March 2026",
    timezone: "IST",
    skills: ["AWS", "Docker", "Kubernetes"],
    secondarySkills: ["Terraform", "CI/CD", "Ansible"],
    experience: "5+ Years",
    certificate: "AWS Solutions Architect",
    jdLink: "#",
    budget: "₹20-25L",
    budgetType: "Monthly",
    positions: 2,
    candidates: 3,
    status: "Active",
    interviewRounds: 4,
    education: "B.Tech/M.Tech in CS/EE",
    duration: "6 Months",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    location: "Mumbai (Hybrid)",
    type: "C-H",
    date: "10 March 2026",
    timezone: "IST",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    secondarySkills: ["Wireframing", "User Research", "CSS"],
    experience: "3+ Years",
    certificate: "Google UX Design Professional",
    jdLink: "#",
    budget: "₹10-14L",
    budgetType: "Monthly",
    positions: 1,
    candidates: 4,
    status: "Active",
    interviewRounds: 3,
    education: "Any Graduate / Design Diploma",
    duration: "Permanent",
  },
];

const submissionsData = [
  {
    id: "CAN-1042",
    candidateName: "Rahul Verma",
    clientName: "TechCorp India",
    jdTitle: "React Developer",
    matchingScore: 94,
    status: "pending review",
    feedback: "Strong profile, considering for second round",
    technicalSkillsScore: "32.5",
    experienceScore: "31.5",
    educationScore: "30.0",
    strengths: "Excellent React knowledge, state management",
    weakness: "Lacks deep backend experience",
    improvements: "Node.js, Express",
    summary: "Highly recommended for frontend roles",
  },
  {
    id: "CAN-1043",
    candidateName: "Sneha Iyer",
    clientName: "DataSoft Solutions",
    jdTitle: "Java Backend",
    matchingScore: 88,
    status: "selected for the next round",
    feedback: "Interview scheduled for next week",
    technicalSkillsScore: "30.5",
    experienceScore: "29.0",
    educationScore: "28.5",
    strengths: "Strong Java, Spring Boot architecture",
    weakness: "Less exposure to cloud deployment",
    improvements: "AWS, CI/CD pipelines",
    summary: "Solid backend developer, good fit for the role",
  },
  {
    id: "CAN-1044",
    candidateName: "Amit Joshi",
    clientName: "CloudNine Systems",
    jdTitle: "DevOps Engineer",
    matchingScore: 76,
    status: "reject",
    feedback: "Lacking K8s production experience",
    technicalSkillsScore: "27.0",
    experienceScore: "25.0",
    educationScore: "24.0",
    strengths: "Good AWS basics, scripting skills",
    weakness: "Lacking Kubernetes production experience",
    improvements: "K8s, Advanced Terraform",
    summary: "Needs more production experience for this senior role",
  },
  {
    id: "CAN-1045",
    candidateName: "Neha Gupta",
    clientName: "DesignHub Creative",
    jdTitle: "UI/UX Designer",
    matchingScore: 91,
    status: "selected for the next round",
    feedback: "Excellent portfolio, offer extended",
    technicalSkillsScore: "31.0",
    experienceScore: "30.5",
    educationScore: "29.5",
    strengths: "Great eye for design, solid portfolio",
    weakness: "Less experience with complex data visualization",
    improvements: "Data-heavy dashboard design",
    summary: "Outstanding candidate with excellent visual skills",
  },
  {
    id: "CAN-1046",
    candidateName: "Aarav Mehta",
    clientName: "TechCorp India",
    jdTitle: "React Developer",
    matchingScore: 92,
    status: "pending review",
    feedback: "Technical round cleared, waiting for HR interview",
    technicalSkillsScore: "31.5",
    experienceScore: "30.5",
    educationScore: "30.0",
    strengths: "Strong problem solving, Next.js expertise",
    weakness: "Average communication skills",
    improvements: "Soft skills, leadership",
    summary: "Technically very strong candidate",
  },
  {
    id: "CAN-1047",
    candidateName: "Riya Sen",
    clientName: "CloudNine Systems",
    jdTitle: "DevOps Engineer",
    matchingScore: 85,
    status: "pending review",
    feedback: "Resume matched high, waiting for technical panel",
    technicalSkillsScore: "29.0",
    experienceScore: "28.5",
    educationScore: "27.5",
    strengths: "Good CI/CD knowledge, Terraform",
    weakness: "Only 2 years of cloud experience",
    improvements: "Cloud architecture, networking",
    summary: "Promising mid-level DevOps engineer",
  },
];

export default function VendorSubmissionsPage() {
  const router = useRouter();
  const {
    collapsed: sidebarCollapsed,
    toggleCollapse,
    mobileOpen,
    setMobileOpen,
    toggleMobile,
  } = useSidebar();
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-status");

  const [selectedJD, setSelectedJD] = useState<Requirement | null>(null);
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);
  const [selectedCandidateScore, setSelectedCandidateScore] = useState<
    (typeof submissionsData)[0] | null
  >(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const { mode } = useVendorDashboardTheme();

  // Calculate dynamic stats
  const stats = {
    pendingReview: submissionsData.filter((s) => s.status === "pending review")
      .length,
    selected: submissionsData.filter(
      (s) => s.status === "selected for the next round",
    ).length,
    rejected: submissionsData.filter((s) => s.status === "reject").length,
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get("search");
      if (searchParam) {
        setSearch(searchParam);
      }
    }
  }, []);

  const filteredData = submissionsData.filter((item) => {
    const rawId = String(item.id || "").toLowerCase();
    const cleanId = rawId.replace(/[^a-z0-9]/g, "");

    const searchTerms = search
      .toLowerCase()
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const candidateNameStr = item.candidateName.toLowerCase();
    const clientNameStr = item.clientName.toLowerCase();
    const jdTitleStr = item.jdTitle.toLowerCase();

    const matchesSearch =
      searchTerms.length === 0 ||
      searchTerms.every((term) => {
        const cleanTerm = term.replace(/[^a-z0-9]/g, "");
        const idNumberMatch = term.match(/^(?:can|cand)[-\s]*(\d+)$/i);
        const paddedTerm = idNumberMatch
          ? `can-${idNumberMatch[1].padStart(4, "0")}`
          : null;

        const matchesId =
          rawId.includes(term) ||
          (cleanTerm.length > 0 && cleanId.includes(cleanTerm)) ||
          (paddedTerm !== null && rawId.includes(paddedTerm));

        return (
          matchesId ||
          candidateNameStr.includes(term) ||
          clientNameStr.includes(term) ||
          jdTitleStr.includes(term)
        );
      });

    const matchesStatus =
      statusFilter === "all-status" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
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

        <div className="dash-content px-4 sm:px-8">
          {loading ? (
            <VendorBenchSkeleton />
          ) : (
            <div className="sk-page-content-enter">
              {/* Page Header */}
              <div className="dash-page-header">
                <div>
                  <h1 className="dash-page-title">Submission Tracking</h1>
                  <p className="dash-page-subtitle">
                    Track all your candidate submissions, client feedback, and
                    status updates.
                  </p>
                </div>

                {/* Badges */}
                {/* <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>{stats.pendingReview} pending review</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{stats.selected} selected</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <CheckCircle2 className="w-3 h-3 text-rose-400 opacity-0 hidden" />
                    <span>{stats.rejected} rejected</span>
                  </div>
                </div> */}
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center">
                <DashSearchInput
                  placeholder="Search candidate ID, name, client, or JD..."
                  value={search}
                  onChange={setSearch}
                />

                <div className="flex w-full md:w-auto gap-2.5 sm:gap-4 items-center">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="flex-1 md:w-[160px] md:flex-none h-8 px-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                      <SelectItem value="all-status">All Status</SelectItem>
                      <SelectItem value="pending review">
                        Pending Review
                      </SelectItem>
                      <SelectItem value="selected for the next round">
                        Selected for Next Round
                      </SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submissions Table */}
              <div className="bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[var(--dash-text-primary)]">
                    <thead className="bg-[var(--dash-card-bg)] border-b border-[var(--dash-card-border)] text-[10px] capitalize text-[var(--dash-text-muted)] tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-semibold whitespace-nowrap">
                          Candidate ID
                        </th>
                        <th className="px-4 py-3 font-semibold whitespace-nowrap">
                          Candidate Name
                        </th>
                        <th className="px-4 py-3 font-semibold whitespace-nowrap">
                          Client Name
                        </th>
                        <th className="px-4 py-3 font-semibold whitespace-nowrap">
                          JD Title
                        </th>
                        <th className="px-4 py-3 font-semibold whitespace-nowrap">
                          AI Match Score
                        </th>
                        <th className="px-4 py-3 font-semibold whitespace-nowrap">
                          Status
                        </th>
                        <th className="px-4 py-3 font-semibold whitespace-nowrap">
                          Client Feedback
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2738]">
                      {filteredData.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-[#131b2c] transition-colors"
                        >
                          <td className="px-4 py-3 font-mono text-[11px] whitespace-nowrap">
                            <span
                              className="text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer transition-colors"
                              onClick={() =>
                                router.push(
                                  `/vendor/bench?search=${encodeURIComponent(item.candidateName)}`,
                                )
                              }
                            >
                              {item.id}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-200 whitespace-nowrap">
                            {item.candidateName}
                          </td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                            {item.clientName}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className="text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer transition-colors"
                              onClick={() => {
                                const jdData = vendorJDs.find(
                                  (jd) => jd.title === item.jdTitle,
                                );
                                if (jdData) {
                                  setSelectedJD(jdData);
                                  setIsJDModalOpen(true);
                                }
                              }}
                            >
                              {item.jdTitle}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCandidateScore(item);
                                setIsScoreModalOpen(true);
                              }}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer bg-transparent border border-current ${
                                item.matchingScore >= 75
                                  ? "text-emerald-500"
                                  : item.matchingScore >= 50
                                    ? "text-blue-500"
                                    : item.matchingScore >= 25
                                      ? "text-orange-500"
                                      : "text-red-500"
                              }`}
                              title="Click to view candidate match report"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                              <span>{item.matchingScore}%</span>
                            </button>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium ${
                                item.status === "selected for the next round"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : item.status === "pending review"
                                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                    : item.status === "reject"
                                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                      : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td
                            className="px-4 py-3 text-slate-400  max-w-xs truncate"
                            title={item.feedback}
                          >
                            {item.feedback || "-"}
                          </td>
                        </tr>
                      ))}
                      {filteredData.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-8 text-center text-slate-500"
                          >
                            No submissions found matching your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* JD View Modal Dialog */}
              <JobDescriptionModal
                open={isJDModalOpen}
                onOpenChange={setIsJDModalOpen}
                requirement={selectedJD}
                variant="vendor-submission"
                themeMode={mode}
                onDownloadPDF={downloadJDPDF}
              />
              {/* Candidate Score Modal */}
              <Dialog
                open={isScoreModalOpen}
                onOpenChange={setIsScoreModalOpen}
              >
                <DialogContent
                  data-dashboard-theme={mode}
                  className="max-w-2xl p-6 border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-[var(--dash-text-primary)]"
                >
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-lg font-bold">
                      Candidate Match Report
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-[var(--dash-text-secondary)]">
                      Detailed AI evaluation for{" "}
                      {selectedCandidateScore?.candidateName}.
                    </DialogDescription>
                  </DialogHeader>

                  {selectedCandidateScore && (
                    <div className="space-y-5">
                      <div className="bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] p-3 rounded-xl">
                        <span className="text-[10px] tracking-wider font-bold text-[var(--dash-text-muted)] uppercase block mb-0.5">
                          Match Score
                        </span>
                        <span className="text-xl font-extrabold text-[#60A5FA]">
                          {selectedCandidateScore.matchingScore}%
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] p-3 rounded-xl flex flex-col justify-center items-center text-center">
                          <span className="text-[10px] tracking-wider font-bold text-[var(--dash-text-muted)] uppercase mb-0.5">
                            Technical Skills Score
                          </span>
                          <span className="text-sm font-bold text-[var(--dash-text-primary)]">
                            {selectedCandidateScore.technicalSkillsScore}
                          </span>
                        </div>
                        <div className="bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] p-3 rounded-xl flex flex-col justify-center items-center text-center">
                          <span className="text-[10px] tracking-wider font-bold text-[var(--dash-text-muted)] uppercase mb-0.5">
                            Experience Score
                          </span>
                          <span className="text-sm font-bold text-[var(--dash-text-primary)]">
                            {selectedCandidateScore.experienceScore}
                          </span>
                        </div>
                        <div className="bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] p-3 rounded-xl flex flex-col justify-center items-center text-center">
                          <span className="text-[10px] tracking-wider font-bold text-[var(--dash-text-muted)] uppercase mb-0.5">
                            Education Score
                          </span>
                          <span className="text-sm font-bold text-[var(--dash-text-primary)]">
                            {selectedCandidateScore.educationScore}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Tabs defaultValue="strengths" className="w-full">
                          <TabsList className="grid w-full grid-cols-4 h-9 bg-[var(--dash-bg-tertiary)]/60 p-1 rounded-lg">
                            <TabsTrigger
                              value="strengths"
                              className="text-[10px] font-semibold tracking-wide uppercase rounded-md text-[var(--dash-text-muted)] data-[state=active]:bg-[var(--dash-card-bg-solid)] data-[state=active]:text-[#34D399] data-[state=active]:shadow-sm transition-all"
                            >
                              Strengths
                            </TabsTrigger>
                            <TabsTrigger
                              value="weakness"
                              className="text-[10px] font-semibold tracking-wide uppercase rounded-md text-[var(--dash-text-muted)] data-[state=active]:bg-[var(--dash-card-bg-solid)] data-[state=active]:text-[#FBBF24] data-[state=active]:shadow-sm transition-all"
                            >
                              Weakness
                            </TabsTrigger>
                            <TabsTrigger
                              value="improvements"
                              className="text-[10px] font-semibold tracking-wide uppercase rounded-md text-[var(--dash-text-muted)] data-[state=active]:bg-[var(--dash-card-bg-solid)] data-[state=active]:text-[var(--accent-primary)] data-[state=active]:shadow-sm transition-all"
                            >
                              Improvements
                            </TabsTrigger>
                            <TabsTrigger
                              value="summary"
                              className="text-[10px] font-semibold tracking-wide uppercase rounded-md text-[var(--dash-text-muted)] data-[state=active]:bg-[var(--dash-card-bg-solid)] data-[state=active]:text-[var(--dash-text-primary)] data-[state=active]:shadow-sm transition-all"
                            >
                              Summary
                            </TabsTrigger>
                          </TabsList>

                          <div className="mt-4">
                            <TabsContent
                              value="strengths"
                              className="mt-0 outline-none"
                            >
                              <div className="bg-[#34D399]/5 border border-[#34D399]/10 rounded-xl p-4 flex gap-3 items-center">
                                <div className="text-[#34D399]">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <p className="text-sm text-[var(--dash-text-primary)] font-medium leading-relaxed">
                                  {selectedCandidateScore.strengths}
                                </p>
                              </div>
                            </TabsContent>

                            <TabsContent
                              value="weakness"
                              className="mt-0 outline-none"
                            >
                              <div className="bg-[#FBBF24]/5 border border-[#FBBF24]/10 rounded-xl p-4 flex gap-3 items-center">
                                <div className="text-[#FBBF24]">
                                  <AlertCircle className="w-4 h-4" />
                                </div>
                                <p className="text-sm text-[var(--dash-text-primary)] font-medium leading-relaxed">
                                  {selectedCandidateScore.weakness}
                                </p>
                              </div>
                            </TabsContent>

                            <TabsContent
                              value="improvements"
                              className="mt-0 outline-none"
                            >
                              <div className="bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/10 rounded-xl p-4 flex gap-3 items-center">
                                <div className="text-[var(--accent-primary)]">
                                  <TrendingUp className="w-4 h-4" />
                                </div>
                                <p className="text-sm text-[var(--dash-text-primary)] font-medium leading-relaxed">
                                  {selectedCandidateScore.improvements}
                                </p>
                              </div>
                            </TabsContent>

                            <TabsContent
                              value="summary"
                              className="mt-0 outline-none"
                            >
                              <div className="bg-[#6366F1]/5 border border-[#6366F1]/10 rounded-xl p-4 flex gap-3 items-center">
                                <div className="text-[#6366F1]">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <p className="text-sm text-[var(--dash-text-primary)] font-medium leading-relaxed ">
                                  {selectedCandidateScore.summary}
                                </p>
                              </div>
                            </TabsContent>
                          </div>
                        </Tabs>
                      </div>
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
