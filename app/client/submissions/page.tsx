"use client";
import { DashPageHeader } from "@/app/components/ui/dash-page-header";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../dashboard/components/Sidebar";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import Link from "next/link";
import { DashButton } from "@/app/components/ui/dash-button";
import { DashSearchInput } from "@/app/components/ui/dash-search-input";
import SubmissionsSkeleton from "./components/SubmissionsSkeleton";
import { StrengthWeaknessCarousel } from "./components/StrengthWeaknessCarousel";
import { Input } from "@/app/components/ui/input";
import { SkillBadgeOverflow } from "@/app/components/ui/skill-badge-overflow";
import { CertificatePopover } from "../requirements/components/CertificatePopover";
import { JobDescriptionModal } from "@/app/components/JobDescriptionModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination";
import {
  Calendar,
  Search,
  FilterX,
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  Share2,
  MoreVertical,
  MapPin,
  Zap,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Send,
  AlertTriangle,
  Lightbulb,
  Star,
  BadgeCheck,
  Building,
  Phone,
  Mail,
  FileText,
  Globe,
  Bookmark,
  Award,
  ExternalLink,
  Laptop,
  Handshake,
  User,
  IndianRupee,
  DollarSign,
  XCircle,
  ShieldCheck,
  Download,
  University,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";
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
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/app/components/ui/accordion";
import JDUploadForm from "../requirements/components/JDUploadForm";
import { formatRateRange } from "@/app/lib/rate-format";
import {
  type Candidate,
  type CandidateStatus,
  CircularScore,
  MiniCircularScore,
  ScoreBar,
  StatusBadge,
  requirementsData,
  initialCandidates,
} from "./components/SubmissionsHelpers";
import { useSidebar } from "@/app/components/SidebarContext";
import { downloadCandidateReportPDF } from "@/app/lib/generate-candidate-pdf";
import { downloadJDPDF } from "@/app/lib/generate-jd-pdf";

// Helper to parse strings to bullet lists
const getBullets = (text: string) => {
  if (!text) return [];
  return text
    .split(/;|\n+|[,.]\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) => {
      let s = item.charAt(0).toUpperCase() + item.slice(1);
      if (s.endsWith(".") || s.endsWith(";")) {
        s = s.slice(0, -1);
      }
      return s;
    });
};

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

function TallChevronLeft({ className = "w-3.5 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 10 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 4.5L2.5 12L7 19.5" />
    </svg>
  );
}

function TallChevronRight({ className = "w-3.5 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 10 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 4.5L7.5 12L3 19.5" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Main Content
// ─────────────────────────────────────────────
function SubmissionsContent() {
  const searchParams = useSearchParams();
  const rawReqParam =
    searchParams.get("requirementId") ||
    searchParams.get("jdId") ||
    searchParams.get("openJDId");

  const visibleReqs = 3;

  const getInitialReqId = () => {
    if (!rawReqParam) return 1;
    const match = rawReqParam.match(/\d+/);
    const parsed = match ? parseInt(match[0], 10) : parseInt(rawReqParam, 10);
    if (!isNaN(parsed) && requirementsData.some((r) => r.id === parsed)) {
      return parsed;
    }
    return 1;
  };

  const getScrollIndexForReq = (reqId: number, currentIndex = 0) => {
    const reqIndex = requirementsData.findIndex((r) => r.id === reqId);
    if (reqIndex !== -1) {
      const maxScroll = Math.max(0, requirementsData.length - visibleReqs);
      if (reqIndex >= currentIndex && reqIndex < currentIndex + visibleReqs) {
        return currentIndex;
      }
      return Math.max(0, Math.min(reqIndex, maxScroll));
    }
    return 0;
  };

  const {
    collapsed: sidebarCollapsed,
    toggleCollapse,
    mobileOpen,
    setMobileOpen,
    toggleMobile,
  } = useSidebar();

  const [loading, setLoading] = useState(true);
  const [selectedReqId, setSelectedReqId] = useState<number>(getInitialReqId);
  const [reqScrollIndex, setReqScrollIndex] = useState<number>(() =>
    getScrollIndexForReq(getInitialReqId()),
  );
  const [selectedCandidateId, setSelectedCandidateId] = useState<number>(1);
  const [isJDUploadModalOpen, setIsJDUploadModalOpen] = useState(false);
  const [isJDViewModalOpen, setIsJDViewModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [candidateModalTab, setCandidateModalTab] = useState("report");
  const [swiActiveTab, setSwiActiveTab] = useState<
    "strengths" | "weaknesses" | "improvements" | "summary"
  >("strengths");

  useEffect(() => {
    if (candidateModalTab) {
      const activeTrigger = document.getElementById(
        `modal-tab-trigger-${candidateModalTab}`,
      );
      if (activeTrigger) {
        activeTrigger.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }
    }
  }, [candidateModalTab]);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState<"matchScore" | "name">("matchScore");
  const [candidateStatusDraft, setCandidateStatusDraft] = useState<
    Record<number, CandidateStatus | "Update Status">
  >({});
  const [candidateFeedback, setCandidateFeedback] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    if (rawReqParam) {
      const match = rawReqParam.match(/\d+/);
      const id = match ? parseInt(match[0], 10) : parseInt(rawReqParam, 10);
      if (!isNaN(id) && requirementsData.some((r) => r.id === id)) {
        setSelectedReqId(id);
        setReqScrollIndex((prev) => getScrollIndexForReq(id, prev));
      }
    }
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (searchParams.get("openJD") === "true") setIsJDUploadModalOpen(true);
  }, [rawReqParam, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Auto-select first candidate when req changes
  useEffect(() => {
    const first = candidates.find((c) => c.requirementId === selectedReqId);
    if (first) setSelectedCandidateId(first.id);
  }, [selectedReqId, candidates]);

  // Synchronize selected requirement when searchQuery specifies a requirement ID
  useEffect(() => {
    if (!searchQuery) return;
    const searchTerms = searchQuery
      .toLowerCase()
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    for (const term of searchTerms) {
      const reqMatch = term.match(/^(?:req[-\s]*)0*(\d+)$/i);
      if (reqMatch) {
        const targetId = parseInt(reqMatch[1], 10);
        if (!isNaN(targetId)) {
          const found = requirementsData.find((r) => r.id === targetId);
          if (found && found.id !== selectedReqId) {
            setSelectedReqId(found.id);
            setReqScrollIndex((prev) => getScrollIndexForReq(found.id, prev));
            break;
          }
        }
      }
    }
  }, [searchQuery, selectedReqId]);

  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        if (c.requirementId !== selectedReqId) return false;

        const reqIdStr = String(c.requirementId);
        const formattedReqId = `req-${reqIdStr.padStart(4, "0")}`;
        const cleanReqId = formattedReqId.replace(/[^a-z0-9]/g, "");

        const candIdStr = String(c.id);
        const formattedCandId = `can-${candIdStr.padStart(4, "0")}`;
        const cleanCandId = formattedCandId.replace(/[^a-z0-9]/g, "");

        const req = requirementsData.find((r) => r.id === c.requirementId);
        const reqTitleStr = (req?.title || "").toLowerCase();

        const searchTerms = searchQuery
          .toLowerCase()
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        const matchesSearch =
          searchTerms.length === 0 ||
          searchTerms.every((term) => {
            const cleanTerm = term.replace(/[^a-z0-9]/g, "");
            const reqNumberMatch = term.match(/^(?:req[-\s]*)0*(\d+)$/i);
            const paddedReqTerm = reqNumberMatch
              ? `req-${reqNumberMatch[1].padStart(4, "0")}`
              : null;

            const matchesReqId =
              formattedReqId.includes(term) ||
              reqIdStr === term ||
              (cleanTerm.length > 0 && cleanReqId.includes(cleanTerm)) ||
              (paddedReqTerm !== null &&
                formattedReqId.includes(paddedReqTerm));

            const matchesCandId =
              formattedCandId.includes(term) ||
              candIdStr === term ||
              (cleanTerm.length > 0 && cleanCandId.includes(cleanTerm));

            return (
              matchesReqId ||
              matchesCandId ||
              reqTitleStr.includes(term) ||
              c.name.toLowerCase().includes(term) ||
              c.vendor.toLowerCase().includes(term) ||
              c.skills.some((s) => s.toLowerCase().includes(term))
            );
          });
        const matchesStatus =
          statusFilter === "All Status" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) =>
        sortBy === "matchScore"
          ? b.matchScore - a.matchScore
          : a.name.localeCompare(b.name),
      );
  }, [candidates, selectedReqId, searchQuery, statusFilter, sortBy]);

  const selectedCandidate =
    candidates.find((c) => c.id === selectedCandidateId) ??
    filteredCandidates[0] ??
    null;

  const activeRequirement =
    requirementsData.find((r) => r.id === selectedReqId) ?? requirementsData[0];

  const globalStats = useMemo(() => {
    const total = candidates.length;
    const pending = candidates.filter(
      (c) => c.status === "Pending review",
    ).length;
    const selected = candidates.filter(
      (c) => c.status === "Selected for the next round",
    ).length;
    const rejected = candidates.filter((c) => c.status === "Rejected").length;
    const avgScore =
      total > 0
        ? Math.round(candidates.reduce((s, c) => s + c.matchScore, 0) / total)
        : 0;
    return { total, pending, selected, rejected, avgScore };
  }, [candidates]);

  const handleUpdateStatusAndFeedback = (candidateId: number) => {
    const draftStatus = candidateStatusDraft[candidateId];
    const feedbackText = candidateFeedback[candidateId] || "";
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        return {
          ...c,
          status:
            draftStatus && draftStatus !== "Update Status"
              ? draftStatus
              : c.status,
          feedbacks: feedbackText.trim()
            ? [...c.feedbacks, feedbackText.trim()]
            : c.feedbacks,
        };
      }),
    );
    setCandidateFeedback((prev) => ({ ...prev, [candidateId]: "" }));
    setCandidateStatusDraft((prev) => {
      const cp = { ...prev };
      delete cp[candidateId];
      return cp;
    });
  };

  const maxScrollIndex = Math.max(0, requirementsData.length - visibleReqs);

  const firstVisibleReq = requirementsData[reqScrollIndex];
  const lastVisibleReq =
    requirementsData[
      Math.min(requirementsData.length - 1, reqScrollIndex + visibleReqs - 1)
    ];
  const isFirstVisibleActive = firstVisibleReq?.id === selectedReqId;
  const isLastVisibleActive = lastVisibleReq?.id === selectedReqId;

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
        style={{ maxWidth: "100%", minWidth: 0 }}
      >
        <DashboardHeader onMobileToggle={() => toggleMobile()} />

        <div className="dash-content px-4 sm:px-6">
          {loading ? (
            <SubmissionsSkeleton />
          ) : (
            <div className="sk-page-content-enter">
              {/* ── Page Header ── */}
              <DashPageHeader
                title="Candidate Submissions"
                subtitle="Review candidates submitted by vendors for each requirement."
              />

              {/* ── Global Stats Row ── */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-1.5 px-1.5 mb-5 bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl divide-y md:divide-y-0 md:divide-x divide-[var(--dash-divider)]">
                {/* Stat 1: Total Candidates */}
                <div className="flex-1 flex items-center justify-between py-1 px-1.5 md:py-0.5 md:px-2">
                  <div className="flex items-center gap-2">
                    <div className="text-blue-500 flex-shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--dash-text-muted)] capitalize tracking-wider whitespace-nowrap">
                      Total Candidates
                    </span>
                  </div>
                  <span className="text-base font-bold text-blue-500 pr-0.5">
                    {globalStats.total}
                  </span>
                </div>

                {/* Stat 2: Pending Review */}
                <div className="flex-1 flex items-center justify-between py-1 px-1.5 md:py-0.5 md:pl-3 md:pr-2">
                  <div className="flex items-center gap-2">
                    <div className="text-amber-500 flex-shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--dash-text-muted)] capitalize tracking-wider whitespace-nowrap">
                      Pending Review
                    </span>
                  </div>
                  <span className="text-base font-bold text-amber-500 pr-0.5">
                    {globalStats.pending}
                  </span>
                </div>

                {/* Stat 3: Selected for the next round */}
                <div className="flex-1 flex items-center justify-between py-1 px-1.5 md:py-0.5 md:pl-3 md:pr-2">
                  <div className="flex items-center gap-2">
                    <div className="text-emerald-500 flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--dash-text-muted)] capitalize tracking-wider whitespace-nowrap">
                      Selected for the next round
                    </span>
                  </div>
                  <span className="text-base font-bold text-emerald-500 pr-0.5">
                    {globalStats.selected}
                  </span>
                </div>

                {/* Stat 4: Rejected */}
                <div className="flex-1 flex items-center justify-between py-1 px-1.5 md:py-0.5 md:pl-3 md:pr-2">
                  <div className="flex items-center gap-2">
                    <div className="text-rose-500 flex-shrink-0">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--dash-text-muted)] capitalize tracking-wider whitespace-nowrap">
                      Rejected
                    </span>
                  </div>
                  <span className="text-base font-bold text-rose-500 pr-0.5">
                    {globalStats.rejected}
                  </span>
                </div>
              </div>

              {/* ── Requirement Selector Carousel ── */}
              <div className="flex flex-col gap-2.5 mb-5">
                <div className="flex items-center justify-between px-1">
                  <div className="text-[10px] font-semibold text-[var(--dash-text-muted)] capitalize tracking-wider">
                    Active Requirements
                  </div>
                  <p
                    className="text-[var(--dash-text-muted)] text-[11px] font-medium"
                    aria-live="polite"
                  >
                    Showing{" "}
                    <span className="text-[var(--dash-text-primary)] font-semibold">
                      {requirementsData.length > 0 ? reqScrollIndex + 1 : 0}-
                      {Math.min(
                        reqScrollIndex + visibleReqs,
                        requirementsData.length,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="text-[var(--dash-text-primary)] font-semibold">
                      {requirementsData.length}
                    </span>
                  </p>
                </div>

                <div className="relative group">
                  <button
                    onClick={() => setReqScrollIndex((i) => Math.max(0, i - 1))}
                    disabled={reqScrollIndex === 0}
                    aria-label="Previous requirements"
                    className={`absolute left-1 top-3 bottom-3 w-12 rounded-l-2xl border border-r-0 bg-gradient-to-r from-[var(--dash-card-bg-solid)]/90 via-[var(--dash-card-bg-solid)]/40 to-transparent backdrop-blur-sm flex items-center justify-start pl-2.5 text-[var(--dash-text-primary)] hover:text-[#6366F1] hover:bg-[var(--dash-card-hover)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[var(--dash-text-primary)] disabled:hover:bg-transparent z-10 [mask-image:linear-gradient(to_right,black_0%,black_40%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,black_40%,transparent_100%)] ${
                      isFirstVisibleActive
                        ? "border-[#6366F1]"
                        : "border-[var(--dash-card-border)]"
                    }`}
                  >
                    <TallChevronLeft className="w-3.5 h-7" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 overflow-hidden py-3 px-1">
                    {requirementsData
                      .slice(reqScrollIndex, reqScrollIndex + visibleReqs)
                      .map((req, idx, arr) => {
                        const isActive = req.id === selectedReqId;
                        const isFirst = idx === 0;
                        const isLast = idx === arr.length - 1;
                        return (
                          <button
                            key={req.id}
                            onClick={() => setSelectedReqId(req.id)}
                            className={`flex flex-col text-left p-2.5 rounded-2xl border transition-all duration-300 ${
                              isFirst ? "pl-12" : ""
                            } ${isLast ? "pr-12" : ""} ${
                              isActive
                                ? "bg-[var(--dash-card-bg-solid)] border-[#6366F1] shadow-[0_3px_8px_rgba(0,0,0,0.24)]"
                                : "bg-[var(--dash-card-bg)] border-[var(--dash-card-border)] hover:border-[rgba(129,140,248,0.3)]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1.5 mb-1.5">
                              <div className="text-[9px] font-semibold text-[var(--accent-primary)] capitalize tracking-wider bg-[var(--accent-primary)]/10 px-1.5 py-0.5 rounded">
                                REQ-{String(req.id).padStart(4, "0")}
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5 leading-snug line-clamp-1">
                              {req.title}
                            </span>
                            <div className="flex justify-between items-center text-xs text-[var(--dash-text-secondary)] mt-auto">
                              <span>
                                {formatRateRange({ amount: req.budget })}
                              </span>
                              <span className="text-[#60A5FA] font-semibold">
                                {req.submissionsCount} submission
                                {req.submissionsCount !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                  </div>

                  <button
                    onClick={() =>
                      setReqScrollIndex((i) => Math.min(maxScrollIndex, i + 1))
                    }
                    disabled={reqScrollIndex >= maxScrollIndex}
                    aria-label="Next requirements"
                    className={`absolute right-1 top-3 bottom-3 w-12 rounded-r-2xl border border-l-0 bg-gradient-to-l from-[var(--dash-card-bg-solid)]/90 via-[var(--dash-card-bg-solid)]/40 to-transparent backdrop-blur-sm flex items-center justify-end pr-2.5 text-[var(--dash-text-primary)] hover:text-[#6366F1] hover:bg-[var(--dash-card-hover)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[var(--dash-text-primary)] disabled:hover:bg-transparent z-10 [mask-image:linear-gradient(to_left,black_0%,black_40%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_left,black_0%,black_40%,transparent_100%)] ${
                      isLastVisibleActive
                        ? "border-[#6366F1]"
                        : "border-[var(--dash-card-border)]"
                    }`}
                  >
                    <TallChevronRight className="w-3.5 h-7" />
                  </button>
                </div>
              </div>

              {/* ── Split Panel Layout ── */}
              <div
                className="flex gap-4"
                style={{
                  height: "calc(100vh - 280px)",
                  alignItems: "stretch",
                  minHeight: 500,
                }}
              >
                {/* ── LEFT: Candidate List ── */}
                <div className="w-[40%] flex-shrink-0 flex-col gap-3 hidden md:flex overflow-hidden">
                  {/* Search & Filter */}
                  <div className="flex flex-col gap-2">
                    <DashSearchInput
                      placeholder="Search requirement ID, candidate, or skills..."
                      value={searchQuery}
                      onChange={setSearchQuery}
                      wrapperClassName="w-full max-w-full"
                    />
                    <div className="flex items-center gap-2">
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="flex-1 h-8 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)]">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                          <SelectItem value="All Status">All Status</SelectItem>
                          <SelectItem value="Selected for the next round">
                            Selected for the next round
                          </SelectItem>
                          <SelectItem value="Pending review">
                            Pending Review
                          </SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Sort toggle */}
                      <div className="flex rounded-xl overflow-hidden border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)]">
                        <button
                          onClick={() => setSortBy("matchScore")}
                          className={`p-1.5 transition-all ${
                            sortBy === "matchScore"
                              ? "bg-[#6366F1]/20 text-[#818CF8]"
                              : "text-[var(--dash-text-secondary)]"
                          }`}
                          title="Sort by AI Score"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSortBy("name")}
                          className={`p-1.5 transition-all ${
                            sortBy === "name"
                              ? "bg-[#6366F1]/20 text-[#818CF8]"
                              : "text-[var(--dash-text-secondary)]"
                          }`}
                          title="Sort A-Z"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {(searchQuery || statusFilter !== "All Status") && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("All Status");
                          }}
                          className="p-1.5 text-[var(--dash-danger-text)] hover:bg-[var(--dash-danger-bg)] rounded-lg transition-all"
                          title="Clear Filters"
                        >
                          <FilterX className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Candidate Cards */}
                  <div
                    className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 no-scrollbar overscroll-y-auto"
                    style={{
                      minHeight: 0,
                    }}
                  >
                    {filteredCandidates.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <FilterX className="w-8 h-8 text-[var(--dash-text-muted)] opacity-50 mb-2" />
                        <span className="text-sm font-medium text-[var(--dash-text-muted)]">
                          No candidates found
                        </span>
                      </div>
                    ) : (
                      filteredCandidates.map((candidate) => {
                        const isSelected = candidate.id === selectedCandidateId;
                        return (
                          <div
                            key={candidate.id}
                            onClick={() => setSelectedCandidateId(candidate.id)}
                            className={`p-3 rounded-xl cursor-pointer transition-all border group relative overflow-hidden flex-shrink-0 ${
                              isSelected
                                ? "border-[#6366F1] bg-[#6366F1]/[0.02]"
                                : "border-[var(--dash-card-border)] bg-[var(--dash-card-bg)] hover:border-[#6366F1]/30 hover:shadow-[0_4px_20px_-4px_rgba(99,102,241,0.1)]"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6366F1]" />
                            )}
                            <div className="flex items-start gap-2.5 w-full">
                              <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex flex-col gap-1 min-w-0 pr-1">
                                    <div className="flex items-center gap-1.5">
                                      <h3 className="text-[13.5px] font-semibold text-[var(--dash-text-primary)] truncate group-hover:text-[#6366F1] transition-colors">
                                        {candidate.name}
                                      </h3>
                                      <span className="text-[9.5px] px-1.5 py-0.5 rounded-md border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-[var(--dash-text-secondary)] font-medium whitespace-nowrap">
                                        {candidate.experience.replace(
                                          " Years",
                                          " yrs",
                                        )}
                                      </span>
                                      <span
                                        className={`text-[9.5px] px-1.5 py-0.5 rounded-md border font-medium whitespace-nowrap ${
                                          candidate.gender === "Female"
                                            ? "border-pink-500/20 bg-pink-500/10 text-pink-400"
                                            : "border-blue-500/20 bg-blue-500/10 text-blue-400"
                                        }`}
                                      >
                                        {candidate.gender}
                                      </span>
                                    </div>

                                    <div className="text-[11.5px] text-[var(--dash-text-secondary)] truncate">
                                      Vendor: {candidate.vendor}
                                    </div>

                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <Link
                                        href={`/client/requirements?openJDId=${candidate.requirementId}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-[9px] font-bold text-[#6366F1] bg-[#6366F1]/10 px-1.5 py-0.5 rounded-md whitespace-nowrap hover:underline cursor-pointer"
                                      >
                                        REQ-
                                        {String(
                                          candidate.requirementId,
                                        ).padStart(4, "0")}
                                      </Link>
                                      <span className="text-[10px] font-semibold text-[var(--dash-text-primary)] truncate">
                                        {activeRequirement?.title ||
                                          candidate.jobTitle}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <div className="flex flex-col items-end">
                                      <div className="text-sm font-bold text-[#6366F1] leading-none">
                                        {candidate.matchScore}%
                                      </div>
                                      <div className="text-[9px] font-medium text-[#6366F1] capitalize tracking-wide mt-1">
                                        AI Score
                                      </div>
                                    </div>

                                    <StatusBadge status={candidate.status} />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-1">
                                  <div className="flex flex-wrap gap-1.5 min-w-0">
                                    <SkillBadgeOverflow
                                      skills={candidate.skills}
                                      visibleCount={5}
                                      title="Primary Skills"
                                      className="z-10"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="pt-3 pb-2 border-t border-[var(--dash-divider)] mt-auto flex-shrink-0">
                    <Pagination>
                      <PaginationContent className="w-full justify-between">
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            className="border-[var(--dash-divider)] border hover:bg-[var(--dash-card-hover)]"
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <p
                            className="text-[var(--dash-text-muted)] text-[11px] font-medium"
                            aria-live="polite"
                          >
                            Showing{" "}
                            <span className="text-[var(--dash-text-primary)] font-semibold">
                              {filteredCandidates.length}
                            </span>{" "}
                            of{" "}
                            <span className="text-[var(--dash-text-primary)] font-semibold">
                              {
                                candidates.filter(
                                  (c) => c.requirementId === selectedReqId,
                                ).length
                              }
                            </span>
                          </p>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            className="border-[var(--dash-divider)] border hover:bg-[var(--dash-card-hover)]"
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>

                {/* ── RIGHT: Candidate Detail Panel ── */}
                {selectedCandidate ? (
                  <div className="flex-1 min-w-0 flex flex-col h-[calc(100vh-280px)] md:h-auto pb-4 md:pb-0">
                    {/* Card */}
                    <div className="rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] flex flex-col flex-1 overflow-hidden min-h-0 h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-3 p-4 pb-0 flex-shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="text-base font-semibold text-[var(--dash-text-primary)]">
                                {selectedCandidate.name}
                              </h2>
                              <BadgeCheck
                                className="text-blue-500 flex-shrink-0"
                                style={{ width: 14, height: 14 }}
                              />
                              {selectedCandidate.gender && (
                                <span
                                  className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                                    selectedCandidate.gender === "Female"
                                      ? "bg-pink-500/10 text-pink-500 border-pink-500/20"
                                      : selectedCandidate.gender === "Male"
                                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                        : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                  }`}
                                >
                                  <User className="w-2.5 h-2.5" />
                                  {selectedCandidate.gender}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
                              {selectedCandidate.jobTitle}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Social Links in Header */}
                          {selectedCandidate.linkedIn && (
                            <a
                              href={selectedCandidate.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1.5 rounded-lg border border-[#0A66C2]/20 bg-[#0A66C2]/5 text-[#0A66C2] hover:bg-[#0A66C2]/15 hover:border-[#0A66C2]/40 transition-all duration-200"
                              title="LinkedIn Profile"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-3 h-3"
                              >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z" />
                              </svg>
                              <span className="hidden sm:inline">LinkedIn</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          )}
                          {selectedCandidate.github && (
                            <a
                              href={selectedCandidate.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1.5 rounded-lg border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-[var(--dash-text-primary)] hover:bg-[var(--dash-card-hover)] transition-all duration-200"
                              title="GitHub Profile"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-3 h-3"
                              >
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                              </svg>
                              <span className="hidden sm:inline">GitHub</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          )}
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="w-8 h-8 rounded-lg border border-[var(--dash-card-border)] flex items-center justify-center text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] hover:bg-[var(--dash-card-hover)] transition-all">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent
                              align="end"
                              className="w-48 p-1.5 border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-[var(--dash-text-primary)] shadow-lg rounded-xl z-50"
                            >
                              <div className="flex flex-col gap-0.5">
                                <button
                                  onClick={() => setIsCandidateModalOpen(true)}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[var(--dash-text-primary)] hover:bg-[var(--dash-card-hover)] transition-all flex items-center gap-2"
                                >
                                  <Users className="w-3.5 h-3.5 text-[var(--dash-text-secondary)]" />
                                  View Candidate Detail
                                </button>
                                <button
                                  onClick={() => setIsJDViewModalOpen(true)}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[var(--dash-text-primary)] hover:bg-[var(--dash-card-hover)] transition-all flex items-center gap-2"
                                >
                                  <FileText className="w-3.5 h-3.5 text-[var(--dash-text-secondary)]" />
                                  View Requirement
                                </button>

                                <button
                                  onClick={() =>
                                    selectedCandidate &&
                                    downloadCandidateReportPDF(
                                      selectedCandidate,
                                      activeRequirement,
                                    )
                                  }
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#6366F1] hover:bg-[var(--dash-card-hover)] transition-all flex items-center gap-2 border-t border-[var(--dash-divider)] pt-2 mt-0.5"
                                >
                                  <Download className="w-3.5 h-3.5 text-[#6366F1]" />
                                  Download Report
                                </button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      {/* Tabs */}
                      <Tabs
                        value={candidateModalTab}
                        onValueChange={setCandidateModalTab}
                        className="w-full flex-1 flex flex-col min-h-0"
                      >
                        <div className="px-4 flex-shrink-0">
                          <TabsList className="bg-transparent border-b border-[var(--dash-divider)] w-full rounded-none p-0 h-auto justify-start gap-0 overflow-x-auto no-scrollbar">
                            {[
                              {
                                value: "report",
                                label: "AI Match Report",
                                icon: Sparkles,
                              },
                              {
                                value: "details",
                                label: "Candidate Details",
                                icon: Users,
                              },
                              {
                                value: "work",
                                label: "Work Experience",
                                icon: Briefcase,
                              },
                              {
                                value: "education",
                                label: "Education & Certification",
                                icon: GraduationCap,
                              },
                              {
                                value: "vendor",
                                label: "Vendor Details",
                                icon: Building,
                              },
                            ].map(({ value, label, icon: Icon }) => (
                              <TabsTrigger
                                key={value}
                                value={value}
                                id={`modal-tab-trigger-${value}`}
                                className="flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-medium text-[var(--dash-text-secondary)] border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:text-[#818CF8] rounded-none bg-transparent hover:text-[var(--dash-text-primary)] transition-all whitespace-nowrap"
                              >
                                <Icon className="w-3.5 h-3.5" />
                                {label}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </div>

                        {/* Middle Content (Scrollable) */}
                        <div className="flex-1 overflow-y-auto overscroll-y-auto p-4 pt-4 no-scrollbar">
                          {/* AI Match Report */}
                          <TabsContent value="report" className="mt-0">
                            {(() => {
                              const summaryBullets = getBullets(
                                selectedCandidate.summary ||
                                  selectedCandidate.quote,
                              );
                              const strengthsBullets = getBullets(
                                selectedCandidate.strengths,
                              );
                              const weaknessBullets = getBullets(
                                selectedCandidate.weakness,
                              );
                              const improvementsBullets = getBullets(
                                selectedCandidate.improvements,
                              );
                              return (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                  {/* Overall Score Column */}
                                  <div className="w-full h-fit flex flex-col px-3 py-5 rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)] bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-transparent dark:to-transparent gap-4">
                                    <div className="flex justify-between items-center w-full">
                                      <span className="text-[11px] font-bold text-[var(--dash-text-muted)] tracking-wider text-left">
                                        AI Score
                                      </span>
                                      <span
                                        className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2.5 py-0.5 rounded-full border ${
                                          selectedCandidate.matchScore >= 90
                                            ? "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-emerald-400 dark:bg-emerald-500/20 dark:border-emerald-500/20"
                                            : selectedCandidate.matchScore >= 75
                                              ? "text-indigo-600 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400 dark:bg-indigo-500/20 dark:border-indigo-500/20"
                                              : "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20 dark:border-amber-500/20"
                                        }`}
                                      >
                                        {selectedCandidate.matchScore >= 90
                                          ? "Top Score"
                                          : selectedCandidate.matchScore >= 75
                                            ? "Good Score"
                                            : "Average Score"}
                                      </span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center flex-1 text-center">
                                      <CircularScore
                                        score={selectedCandidate.matchScore}
                                        size={130}
                                      />
                                    </div>
                                  </div>

                                  {/* Score Breakdown Column */}
                                  <div className="w-full md:col-span-2 flex flex-col px-3 py-5 rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)] gap-4">
                                    <span className="text-[11px] font-bold text-[var(--dash-text-muted)] tracking-wider">
                                      Score Breakdown
                                    </span>
                                    <div className="w-full flex-1 flex flex-col justify-center gap-2">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                                        {/* Technical Skills Row */}
                                        <div className="w-full px-3 py-2 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)]">
                                          <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-medium text-[var(--dash-text-secondary)]">
                                              Technical Skills
                                            </span>
                                            <span className="font-semibold text-[var(--dash-text-primary)]">
                                              {
                                                selectedCandidate.technicalSkillsScore
                                              }{" "}
                                              <span className="text-[9px] text-[var(--dash-text-muted)] font-normal">
                                                / 40
                                              </span>
                                            </span>
                                          </div>
                                          <ScoreBar
                                            value={
                                              selectedCandidate.technicalSkillsScore
                                            }
                                            max={40}
                                            color="#6366f1"
                                          />
                                        </div>

                                        {/* Experience Row */}
                                        <div className="w-full px-3 py-2 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)]">
                                          <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-medium text-[var(--dash-text-secondary)]">
                                              Experience
                                            </span>
                                            <span className="font-semibold text-[var(--dash-text-primary)]">
                                              {
                                                selectedCandidate.experienceScore
                                              }{" "}
                                              <span className="text-[9px] text-[var(--dash-text-muted)] font-normal">
                                                / 40
                                              </span>
                                            </span>
                                          </div>
                                          <ScoreBar
                                            value={
                                              selectedCandidate.experienceScore
                                            }
                                            max={40}
                                            color="#06b6d4"
                                          />
                                        </div>
                                      </div>

                                      {/* Education Row */}
                                      <div className="w-full px-3 py-2 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)]">
                                        <div className="flex justify-between items-center text-[11px]">
                                          <span className="font-medium text-[var(--dash-text-secondary)]">
                                            Education
                                          </span>
                                          <span className="font-semibold text-[var(--dash-text-primary)]">
                                            {selectedCandidate.educationScore}{" "}
                                            <span className="text-[9px] text-[var(--dash-text-muted)] font-normal">
                                              / 40
                                            </span>
                                          </span>
                                        </div>
                                        <ScoreBar
                                          value={
                                            selectedCandidate.educationScore
                                          }
                                          max={40}
                                          color="#8b5cf6"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Strengths, Weaknesses, Improvements Carousel */}
                                  <div className="col-span-1 md:col-span-3 w-full">
                                    <StrengthWeaknessCarousel
                                      items={[
                                        {
                                          id: "summary",
                                          title: "SUMMARY",
                                          icon: FileText,
                                          color: "#8b5cf6",
                                          colorLight:
                                            "rgba(139, 92, 246, 0.12)",
                                          content: summaryBullets,
                                        },
                                        {
                                          id: "strengths",
                                          title: "STRENGTHS",
                                          icon: Star,
                                          color: "#10b981",
                                          colorLight:
                                            "rgba(16, 185, 129, 0.12)",
                                          content: strengthsBullets,
                                        },
                                        {
                                          id: "weaknesses",
                                          title: "WEAKNESSES",
                                          icon: AlertTriangle,
                                          color: "#f59e0b",
                                          colorLight:
                                            "rgba(245, 158, 11, 0.12)",
                                          content: weaknessBullets,
                                        },
                                        {
                                          id: "improvements",
                                          title: "IMPROVEMENTS",
                                          icon: Lightbulb,
                                          color: "#3b82f6",
                                          colorLight:
                                            "rgba(59, 130, 246, 0.12)",
                                          content: improvementsBullets,
                                        },
                                      ]}
                                    />
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Feedback History */}
                            {selectedCandidate.feedbacks.length > 0 && (
                              <div className="mt-3 p-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)]">
                                <span className="text-[11px] font-bold tracking-wider text-[var(--dash-text-muted)] block mb-2">
                                  Feedback History
                                </span>
                                <div className="flex flex-col gap-1.5">
                                  {selectedCandidate.feedbacks.map(
                                    (fb, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-start gap-2 text-xs text-[var(--dash-text-secondary)] p-2 rounded-lg border border-[var(--dash-input-border)] bg-[var(--dash-input-bg)]"
                                      >
                                        <MessageSquare className="w-3.5 h-3.5 text-[#6366F1] flex-shrink-0 mt-0.5" />
                                        <span>{fb}</span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </TabsContent>

                          {/* Candidate Details */}
                          <TabsContent value="details" className="mt-0">
                            <div className="flex flex-col gap-5">
                              {/* ── Consolidated Overview Card matching reference design ── */}
                              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-[var(--dash-text-primary)] shadow-sm flex flex-col gap-4">
                                {/* Row 1: 4 columns (Experience, Location, Deployment, Rate Details) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                  {/* Experience */}
                                  <div className="flex items-center gap-3 min-w-0 pr-2 lg:border-r border-[var(--dash-divider)]">
                                    <div className="text-[#6366F1] flex items-center justify-center flex-shrink-0">
                                      <Briefcase className="w-4 h-4 stroke-[1.5]" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-[11px] font-bold tracking-wider text-[var(--dash-text-muted)] mb-0.5">
                                        Experience
                                      </span>
                                      <span className="text-xs font-bold text-[var(--dash-text-primary)] truncate">
                                        {selectedCandidate.experience}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Location */}
                                  <div className="flex items-center gap-3 min-w-0 pr-2 lg:border-r border-[var(--dash-divider)]">
                                    <div className="text-[#EC4899] flex items-center justify-center flex-shrink-0">
                                      <MapPin className="w-4 h-4 stroke-[1.5]" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-[11px] font-bold tracking-wider text-[var(--dash-text-muted)] mb-0.5">
                                        Location
                                      </span>
                                      {(() => {
                                        const loc =
                                          selectedCandidate.currentLocation.includes(
                                            "Bangalore",
                                          ) &&
                                          !selectedCandidate.currentLocation.includes(
                                            "Karnataka",
                                          )
                                            ? selectedCandidate.currentLocation.replace(
                                                "Bangalore",
                                                "Bangalore, Karnataka",
                                              )
                                            : selectedCandidate.currentLocation.includes(
                                                  "Hyderabad",
                                                ) &&
                                                !selectedCandidate.currentLocation.includes(
                                                  "Telangana",
                                                )
                                              ? selectedCandidate.currentLocation.replace(
                                                  "Hyderabad",
                                                  "Hyderabad, Telangana",
                                                )
                                              : selectedCandidate.currentLocation.includes(
                                                    "Pune",
                                                  ) &&
                                                  !selectedCandidate.currentLocation.includes(
                                                    "Maharashtra",
                                                  )
                                                ? selectedCandidate.currentLocation.replace(
                                                    "Pune",
                                                    "Pune, Maharashtra",
                                                  )
                                                : selectedCandidate.currentLocation;

                                        const parts = loc
                                          .split(",")
                                          .map((s) => s.trim());
                                        if (parts.length >= 2) {
                                          return (
                                            <div className="text-[11px] font-bold text-[var(--dash-text-primary)] leading-tight">
                                              <div className="truncate">
                                                {parts[0]}
                                              </div>
                                              <div className="text-[9.5px] text-[var(--dash-text-secondary)] font-medium leading-tight break-words">
                                                {parts.slice(1).join(", ")}
                                              </div>
                                            </div>
                                          );
                                        }
                                        return (
                                          <span className="text-[11px] font-bold text-[var(--dash-text-primary)] truncate">
                                            {loc}
                                          </span>
                                        );
                                      })()}
                                    </div>
                                  </div>

                                  {/* Deployment */}
                                  <div className="flex items-center gap-3 min-w-0 pr-2 lg:border-r border-[var(--dash-divider)]">
                                    <div className="text-[#F59E0B] flex items-center justify-center flex-shrink-0">
                                      <Laptop className="w-4 h-4 stroke-[1.5]" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-[11px] font-bold tracking-wider text-[var(--dash-text-muted)] mb-0.5">
                                        Deployment
                                      </span>
                                      <span className="text-xs font-bold text-[var(--dash-text-primary)] truncate">
                                        {selectedCandidate.deploymentType ||
                                          "Remote"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Rate Details */}
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="text-[#10B981] flex items-center justify-center flex-shrink-0">
                                      {selectedCandidate.currency === "INR" ||
                                      selectedCandidate.currency ===
                                        "INR (₹)" ||
                                      selectedCandidate.expectedRate?.includes(
                                        "₹",
                                      ) ||
                                      selectedCandidate.expectedRate?.includes(
                                        "INR",
                                      ) ? (
                                        <IndianRupee className="w-4 h-4 stroke-[1.5]" />
                                      ) : (
                                        <DollarSign className="w-4 h-4 stroke-[1.5]" />
                                      )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-[11px] font-bold tracking-wider text-[var(--dash-text-muted)] mb-0.5">
                                        Rate Details
                                      </span>
                                      {(() => {
                                        const rateStr =
                                          selectedCandidate.expectedRate || "";
                                        const currencySuffix =
                                          selectedCandidate.currency
                                            ? `${selectedCandidate.currency.includes("INR") ? "INR" : "USD"}`
                                            : rateStr.includes("₹") ||
                                                rateStr.includes("INR")
                                              ? "INR"
                                              : rateStr.includes("$")
                                                ? "USD"
                                                : "USD";

                                        if (rateStr.includes("/")) {
                                          const [amount, period] = rateStr
                                            .split("/")
                                            .map((s) => s.trim());
                                          return (
                                            <div className="text-xs font-bold text-[var(--dash-text-primary)] leading-snug">
                                              <div className="truncate">
                                                {amount} /
                                              </div>
                                              <div className="text-[9.5px] text-[var(--dash-text-secondary)] font-medium leading-tight truncate">
                                                {period} • {currencySuffix}
                                              </div>
                                            </div>
                                          );
                                        }

                                        return (
                                          <div className="text-xs font-bold text-[var(--dash-text-primary)] leading-snug">
                                            <div className="truncate">
                                              {rateStr}
                                            </div>
                                            {currencySuffix && (
                                              <div className="text-[9.5px] text-[var(--dash-text-secondary)] font-medium leading-tight truncate">
                                                • {currencySuffix}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>

                                <div className="h-[1px] w-full bg-[var(--dash-divider)]" />

                                {/* Row 2: 3 columns (Availability, Engagement, Vendor) */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                  {/* Availability */}
                                  <div className="flex items-center gap-3 min-w-0 pr-2 sm:border-r border-[var(--dash-divider)]">
                                    <div className="text-[#10B981] flex items-center justify-center flex-shrink-0">
                                      <Clock className="w-4 h-4 stroke-[1.5]" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-[11px] font-bold tracking-wider text-[var(--dash-text-muted)] mb-0.5">
                                        Availability
                                      </span>
                                      <span className="text-xs font-bold text-[var(--dash-text-primary)] truncate">
                                        {selectedCandidate.availability ||
                                          "Immediate Joiner"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Engagement */}
                                  <div className="flex items-center gap-3 min-w-0 pr-2 sm:border-r border-[var(--dash-divider)]">
                                    <div className="text-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                                      <Handshake className="w-4 h-4 stroke-[1.5]" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-[11px] font-bold tracking-wider text-[var(--dash-text-muted)] mb-0.5">
                                        Engagement
                                      </span>
                                      <span className="text-xs font-bold text-[var(--dash-text-primary)] truncate">
                                        {selectedCandidate.engagement || "C-C"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Vendor */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCandidateModalTab("vendor")
                                    }
                                    className="flex items-center gap-4 min-w-0 text-left cursor-pointer group/vendor transition-all hover:opacity-90"
                                    title="Click to view Vendor Details"
                                  >
                                    <div className="text-[#06B6D4] flex items-center justify-center flex-shrink-0 group-hover/vendor:scale-105 transition-all">
                                      <Building className="w-4 h-4 stroke-[1.5]" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-[11px] font-bold tracking-wider text-[var(--dash-text-muted)] mb-0.5">
                                        Vendor
                                      </span>
                                      <span className="text-xs font-bold text-[#6366F1] group-hover/vendor:underline truncate">
                                        {selectedCandidate.vendor ||
                                          "TechHire Solutions"}
                                      </span>
                                    </div>
                                  </button>
                                </div>
                              </div>

                              {/* ── Section 4: Skills Showcase ── */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Primary Skills */}
                                <div className="p-4 rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)]">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center justify-center">
                                      <Zap className="w-4 h-4 text-[#6366F1]" />
                                    </div>
                                    <span className="text-[11px] font-bold tracking-wider text-[var(--dash-text-muted)]">
                                      Primary Skills
                                    </span>
                                  </div>
                                  <div>
                                    <SkillBadgeOverflow
                                      skills={selectedCandidate.skills}
                                      visibleCount={3}
                                      title="Primary Skills"
                                    />
                                  </div>
                                </div>

                                {/* Secondary Skills */}
                                <div className="p-4 rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)]">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center justify-center">
                                      <Star className="w-4 h-4 text-[#8B5CF6]" />
                                    </div>
                                    <span className="text-[11px] font-bold tracking-wider text-[var(--dash-text-muted)]">
                                      Secondary Skills
                                    </span>
                                  </div>
                                  <div>
                                    <SkillBadgeOverflow
                                      skills={selectedCandidate.secondarySkills}
                                      visibleCount={3}
                                      title="Secondary Skills"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          {/* Work Experience */}
                          <TabsContent value="work" className="mt-0">
                            <Accordion
                              type="single"
                              collapsible
                              defaultValue="exp-0"
                              className="w-full space-y-3"
                            >
                              {(
                                selectedCandidate.workExperience || [
                                  {
                                    role: selectedCandidate.role,
                                    company: selectedCandidate.company,
                                    duration: selectedCandidate.duration,
                                    currentLocation:
                                      selectedCandidate.currentLocation,
                                    projects: selectedCandidate.projects,
                                  },
                                ]
                              ).map((exp, idx) => (
                                <AccordionItem
                                  key={idx}
                                  value={`exp-${idx}`}
                                  className="p-3.5 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)]"
                                >
                                  <AccordionTrigger className="hover:no-underline py-0 flex justify-between items-center w-full">
                                    <div className="flex items-center gap-3 text-left w-full pr-4">
                                      <div>
                                        <div className="text-[13px] font-semibold text-[var(--dash-text-primary)]">
                                          {exp.role}
                                        </div>
                                        <div className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
                                          {exp.company}
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionTrigger>

                                  <AccordionContent className="pt-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-xs border-t border-b border-[var(--dash-divider)] py-3">
                                      <div>
                                        <span className="text-[var(--dash-text-secondary)]">
                                          Duration:{" "}
                                        </span>
                                        <span className="font-medium text-[var(--dash-text-primary)]">
                                          {exp.duration}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-[var(--dash-text-secondary)]">
                                          Location:{" "}
                                        </span>
                                        <span className="font-medium text-[var(--dash-text-primary)]">
                                          {exp.currentLocation}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Projects */}
                                    {exp.projects && exp.projects.length > 0 ? (
                                      <div className="space-y-3">
                                        <h4 className="text-[11px] font-bold text-[var(--dash-text-muted)] tracking-wider">
                                          Projects
                                        </h4>
                                        <div className="space-y-3">
                                          {exp.projects.map(
                                            (proj: any, pIndex: number) => (
                                              <div
                                                key={pIndex}
                                                className="space-y-1.5 p-3.5 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)]/40 text-left"
                                              >
                                                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                                                  <span className="text-[13px] font-semibold text-[var(--dash-text-primary)]">
                                                    {proj.projectTitle}
                                                  </span>
                                                  <span className="text-xs text-[var(--dash-text-secondary)]">
                                                    {proj.startDate} -{" "}
                                                    {proj.endDate}
                                                  </span>
                                                </div>
                                                <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-[var(--dash-text-secondary)]">
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
                                                  <p className="text-xs text-[var(--dash-text-secondary)] mt-1.5 leading-relaxed bg-[var(--dash-input-bg)]/30 p-2.5 rounded-lg border border-[var(--dash-input-border)]/50">
                                                    <strong className="text-[var(--dash-text-primary)]">
                                                      Description:
                                                    </strong>{" "}
                                                    {proj.projectDetails}
                                                  </p>
                                                )}
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-xs text-[var(--dash-text-muted)] italic">
                                        No projects listed for this role
                                      </p>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </TabsContent>

                          {/* Education & Certification */}
                          <TabsContent
                            value="education"
                            className="mt-0 space-y-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Education Card */}
                              <div className="p-5 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)] flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="text-violet-500 flex-shrink-0">
                                      <GraduationCap className="w-4 h-4 stroke-[1.5]" />
                                    </div>
                                    <div>
                                      <h4 className="text-[11px] tracking-wider text-[var(--dash-text-muted)] font-bold">
                                        Education
                                      </h4>
                                      <div className="text-[13px] font-semibold text-[var(--dash-text-primary)]">
                                        {selectedCandidate.degree}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mb-3">
                                    <div className="flex items-center gap-1.5 text-[13px] text-[var(--dash-text-secondary)] font-medium">
                                      <University className="w-3.5 h-3.5 text-[var(--dash-text-muted)] flex-shrink-0" />
                                      {selectedCandidate.institute}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)]">
                                      <span className="text-[var(--dash-text-muted)] font-medium">
                                        Passing Year
                                      </span>
                                      <span className="font-semibold text-[var(--dash-text-primary)]">
                                        {selectedCandidate.passingYear}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)]">
                                      <span className="text-[var(--dash-text-muted)] font-medium">
                                        Percentage / CGPA
                                      </span>
                                      <span className="font-semibold text-[var(--dash-text-primary)]">
                                        {selectedCandidate.cgpaOrPercentage ||
                                          "8.8 CGPA"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Certifications Card */}
                              <div className="p-5 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)] flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="text-amber-500 flex-shrink-0">
                                      <Award className="w-4 h-4 stroke-[1.5]" />
                                    </div>
                                    <div>
                                      <h4 className="text-[11px] tracking-wider text-[var(--dash-text-muted)] font-bold">
                                        Certifications
                                      </h4>
                                      <div className="text-[13px] font-semibold text-[var(--dash-text-primary)]">
                                        Professional Credentials
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    {(() => {
                                      const certsList =
                                        selectedCandidate.certifications &&
                                        selectedCandidate.certifications
                                          .length > 0
                                          ? selectedCandidate.certifications
                                          : selectedCandidate.certification
                                            ? [selectedCandidate.certification]
                                            : [];
                                      if (certsList.length === 0) {
                                        return (
                                          <p className="text-xs text-[var(--dash-text-muted)] italic">
                                            No certifications listed
                                          </p>
                                        );
                                      }

                                      const visibleCerts = certsList.slice(
                                        0,
                                        2,
                                      );
                                      const remainingCerts = certsList.slice(2);

                                      return (
                                        <>
                                          {visibleCerts.map((cert, cIdx) => (
                                            <div
                                              key={cIdx}
                                              className="flex items-center gap-2 p-2 rounded-lg border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)] font-medium"
                                            >
                                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                              <span className="truncate">
                                                {cert}
                                              </span>
                                            </div>
                                          ))}

                                          {remainingCerts.length > 0 && (
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <button
                                                  type="button"
                                                  className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all"
                                                >
                                                  +{remainingCerts.length} More
                                                  Certificates
                                                </button>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-80 p-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] shadow-xl z-[100]">
                                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                                  {certsList.map(
                                                    (cert, idx) => (
                                                      <div
                                                        key={idx}
                                                        className="flex items-center gap-2 p-2 rounded-lg border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)] text-xs text-[var(--dash-text-primary)] font-medium"
                                                      >
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                                        <span>{cert}</span>
                                                      </div>
                                                    ),
                                                  )}
                                                </div>
                                              </PopoverContent>
                                            </Popover>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Achievements */}
                            {selectedCandidate.achievements && (
                              <div className="p-5 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)]">
                                <div className="flex items-center gap-2 mb-3">
                                  <Award className="w-4 h-4 text-emerald-500" />
                                  <h4 className="text-[11px] tracking-wider text-[var(--dash-text-muted)] font-bold">
                                    Key Achievements
                                  </h4>
                                </div>
                                <p className="text-xs text-[var(--dash-text-primary)] leading-relaxed">
                                  {selectedCandidate.achievements}
                                </p>
                              </div>
                            )}

                            {/* Personal Projects */}
                            {selectedCandidate.personalProjects &&
                              selectedCandidate.personalProjects.length > 0 && (
                                <div className="space-y-4">
                                  <h4 className="text-[11px] tracking-wider text-[var(--dash-text-muted)] font-bold flex items-center gap-2 mt-2">
                                    <Laptop className="w-4 h-4 text-indigo-400" />
                                    Personal Projects
                                  </h4>
                                  <div className="grid grid-cols-1 gap-4">
                                    {selectedCandidate.personalProjects.map(
                                      (proj: any, idx: number) => (
                                        <div
                                          key={idx}
                                          className="p-4 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] space-y-3"
                                        >
                                          <div className="flex justify-between items-start gap-2">
                                            <h5 className="font-semibold text-sm text-[var(--dash-text-primary)]">
                                              {proj.projectTitle}
                                            </h5>
                                            {proj.projectUrl && (
                                              <a
                                                href={proj.projectUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-indigo-500 hover:text-indigo-600"
                                              >
                                                <ExternalLink className="w-4 h-4" />
                                              </a>
                                            )}
                                          </div>
                                          {proj.liveUrl && (
                                            <div className="flex flex-wrap gap-3 text-xs text-[var(--dash-text-secondary)]">
                                              <a
                                                href={proj.liveUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-indigo-500 hover:text-indigo-600 flex items-center gap-1 text-xs"
                                              >
                                                <ExternalLink className="w-3.5 h-3.5" />{" "}
                                                Live Link
                                              </a>
                                            </div>
                                          )}

                                          {proj.technologies &&
                                            proj.technologies.length > 0 && (
                                              <div className="flex flex-wrap gap-1.5 pt-1">
                                                {proj.technologies.map(
                                                  (
                                                    tech: string,
                                                    tIdx: number,
                                                  ) => (
                                                    <span
                                                      key={tIdx}
                                                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
                                                    >
                                                      {tech}
                                                    </span>
                                                  ),
                                                )}
                                              </div>
                                            )}

                                          {proj.projectDetails && (
                                            <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed pt-3 border-t border-[var(--dash-divider)]">
                                              {proj.projectDetails}
                                            </p>
                                          )}
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}
                          </TabsContent>
                          {/* Vendor Details */}
                          <TabsContent value="vendor" className="mt-0">
                            {selectedCandidate.vendorDetails ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Left Column: Vendor info */}
                                <div className="p-5 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)] space-y-4">
                                  <div>
                                    <h4 className="text-[11px] tracking-wider text-[var(--dash-text-muted)] font-bold">
                                      Vendor Name
                                    </h4>
                                    <div className="text-[13px] font-semibold text-[var(--dash-text-primary)]">
                                      {selectedCandidate.vendorDetails.name}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-xs border-t border-[var(--dash-divider)] pt-4">
                                    <div>
                                      <span className="text-[var(--dash-text-secondary)] block text-xs mb-1">
                                        HQ Location
                                      </span>
                                      <span className="font-medium text-[var(--dash-text-primary)]">
                                        {selectedCandidate.vendorDetails.hq}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-[var(--dash-text-secondary)] block text-xs mb-1">
                                        Founded Year
                                      </span>
                                      <span className="font-medium text-[var(--dash-text-primary)]">
                                        {
                                          selectedCandidate.vendorDetails
                                            .foundedYear
                                        }
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-[var(--dash-text-secondary)] block text-xs mb-1">
                                        Company Size
                                      </span>
                                      <span className="font-medium text-[var(--dash-text-primary)]">
                                        {
                                          selectedCandidate.vendorDetails
                                            .companySize
                                        }
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-[var(--dash-text-secondary)] block text-xs mb-1">
                                        Industry Domain
                                      </span>
                                      <span className="font-medium text-[var(--dash-text-primary)]">
                                        {
                                          selectedCandidate.vendorDetails
                                            .industryDomain
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Column: Rating & Reviews */}
                                <div className="p-5 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)] flex flex-col justify-between">
                                  <div>
                                    <h4 className="text-[11px] tracking-wider text-[var(--dash-text-muted)] font-bold mb-3">
                                      Rating & Reviews
                                    </h4>

                                    <div className="flex flex-col gap-2.5">
                                      {/* Glassdoor */}
                                      <div className="p-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center shrink-0 p-1">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                              src="/glassdoor-icon.svg"
                                              alt="Glassdoor"
                                              className="w-full h-full object-contain"
                                            />
                                          </div>
                                          <div>
                                            <span className="font-bold text-[11px] text-[var(--dash-text-primary)] flex items-center gap-1.5">
                                              Glassdoor
                                            </span>
                                            <span className="block text-[10px] text-[var(--dash-text-muted)]">
                                              {selectedCandidate.vendorDetails
                                                .glassdoor?.reviews ||
                                                "850"}{" "}
                                              reviews
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg shrink-0">
                                          <Star className="w-3 h-3 text-emerald-600 dark:text-emerald-400 fill-emerald-500" />
                                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                            {selectedCandidate.vendorDetails
                                              .glassdoor?.rating || 4.5}
                                          </span>
                                        </div>
                                      </div>
                                      {/* AmbitionBox */}
                                      <div className="p-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center shrink-0 p-1">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                              src="/ambitionbox-icon.svg"
                                              alt="AmbitionBox"
                                              className="w-full h-full object-contain"
                                            />
                                          </div>
                                          <div>
                                            <span className="font-bold text-[11px] text-[var(--dash-text-primary)] flex items-center gap-1.5">
                                              AmbitionBox
                                            </span>
                                            <span className="block text-[10px] text-[var(--dash-text-muted)]">
                                              {selectedCandidate.vendorDetails
                                                .ambitionBox?.reviews ||
                                                "1.2k"}{" "}
                                              reviews
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-lg shrink-0">
                                          <Star className="w-3 h-3 text-indigo-600 dark:text-indigo-400 fill-indigo-500" />
                                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                            {selectedCandidate.vendorDetails
                                              .ambitionBox?.rating || 4.6}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Full Width: Compliance */}
                                <div className="md:col-span-2 p-5 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)]">
                                  <Tabs
                                    defaultValue="certifications"
                                    className="w-full"
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                                      <h4 className="text-[11px] tracking-wider text-[var(--dash-text-muted)] font-bold">
                                        Compliance & Verification
                                      </h4>
                                      <TabsList className="bg-[var(--dash-card-bg-solid)] border border-[var(--dash-divider)] h-auto p-1 rounded-lg self-start sm:self-auto">
                                        <TabsTrigger
                                          value="certifications"
                                          className="text-[11px] py-1 px-2.5 data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-md transition-all font-semibold"
                                        >
                                          Certifications
                                        </TabsTrigger>
                                        <TabsTrigger
                                          value="legal"
                                          className="text-[11px] py-1 px-2.5 data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-md transition-all font-semibold"
                                        >
                                          Legal Reg & Tax Docs
                                        </TabsTrigger>
                                        <TabsTrigger
                                          value="insurance"
                                          className="text-[11px] py-1 px-2.5 data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-md transition-all font-semibold"
                                        >
                                          Insurance
                                        </TabsTrigger>
                                      </TabsList>
                                    </div>

                                    <TabsContent
                                      value="certifications"
                                      className="mt-0"
                                    >
                                      <div className="flex flex-wrap gap-2.5 items-center">
                                        {(() => {
                                          const complianceList =
                                            selectedCandidate.vendorDetails
                                              .compliance
                                              ? selectedCandidate.vendorDetails.compliance
                                                  .split(",")
                                                  .map((s) => s.trim())
                                                  .filter(Boolean)
                                              : [];

                                          if (complianceList.length === 0) {
                                            return (
                                              <p className="text-xs text-[var(--dash-text-muted)] italic">
                                                No certifications listed
                                              </p>
                                            );
                                          }

                                          return complianceList.map(
                                            (comp, cIdx) => (
                                              <div
                                                key={cIdx}
                                                className="inline-flex w-fit items-center gap-2 p-2.5 rounded-lg border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)] font-medium"
                                              >
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                <span className="whitespace-nowrap">
                                                  {comp}
                                                </span>
                                              </div>
                                            ),
                                          );
                                        })()}
                                      </div>
                                    </TabsContent>

                                    <TabsContent value="legal" className="mt-0">
                                      <div className="flex flex-wrap gap-2.5 items-center">
                                        {selectedCandidate.vendorDetails
                                          .legalDocs &&
                                        selectedCandidate.vendorDetails
                                          .legalDocs.length > 0 ? (
                                          selectedCandidate.vendorDetails.legalDocs.map(
                                            (doc, idx) => (
                                              <div
                                                key={idx}
                                                className="inline-flex w-fit items-center gap-2 p-2.5 rounded-lg border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)] font-medium"
                                              >
                                                <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                                <span className="whitespace-nowrap">
                                                  {doc}
                                                </span>
                                              </div>
                                            ),
                                          )
                                        ) : (
                                          <p className="text-xs text-[var(--dash-text-muted)] italic">
                                            No legal documents listed
                                          </p>
                                        )}
                                      </div>
                                    </TabsContent>

                                    <TabsContent
                                      value="insurance"
                                      className="mt-0"
                                    >
                                      <div className="flex flex-wrap gap-2.5 items-center">
                                        {selectedCandidate.vendorDetails
                                          .insurance &&
                                        selectedCandidate.vendorDetails
                                          .insurance.length > 0 ? (
                                          selectedCandidate.vendorDetails.insurance.map(
                                            (ins, idx) => (
                                              <div
                                                key={idx}
                                                className="inline-flex w-fit items-center gap-2 p-2.5 rounded-lg border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)] font-medium"
                                              >
                                                <ShieldCheck className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                                <span className="whitespace-nowrap">
                                                  {ins}
                                                </span>
                                              </div>
                                            ),
                                          )
                                        ) : (
                                          <p className="text-xs text-[var(--dash-text-muted)] italic">
                                            No insurance details listed
                                          </p>
                                        )}
                                      </div>
                                    </TabsContent>
                                  </Tabs>
                                </div>

                                {/* Summary across both columns */}
                                <div className="md:col-span-2 p-5 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)]">
                                  <h4 className="text-[11px] tracking-wider text-[var(--dash-text-muted)] font-bold mb-2">
                                    Summary
                                  </h4>
                                  <p className="text-xs text-[var(--dash-text-secondary)] leading-relaxed">
                                    {selectedCandidate.vendorDetails.summary}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)]">
                                <Building className="w-10 h-10 text-[var(--dash-text-muted)] opacity-40 mb-3" />
                                <p className="text-sm font-medium text-[var(--dash-text-muted)]">
                                  No vendor details available
                                </p>
                              </div>
                            )}
                          </TabsContent>
                        </div>
                      </Tabs>

                      {/* ── Action Bar ── */}
                      <div className="flex flex-col sm:flex-row gap-3 p-4 border-t border-[var(--dash-divider)] items-stretch sm:items-center bg-[var(--dash-card-bg-solid)] flex-shrink-0 z-10 relative">
                        <Select
                          value={
                            candidateStatusDraft[selectedCandidate.id] ||
                            "Update Status"
                          }
                          onValueChange={(val: any) =>
                            setCandidateStatusDraft((prev) => ({
                              ...prev,
                              [selectedCandidate.id]: val,
                            }))
                          }
                        >
                          <SelectTrigger className="sm:w-[185px] h-8 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-xs text-[var(--dash-text-primary)] font-medium">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                            <SelectItem value="Update Status">
                              Update Status
                            </SelectItem>
                            <SelectItem value="Selected for the next round">
                              Selected for the next round
                            </SelectItem>
                            <SelectItem value="Pending review">
                              Pending review
                            </SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="flex-1">
                          <Input
                            type="text"
                            placeholder="Add feedback / comment..."
                            value={
                              candidateFeedback[selectedCandidate.id] || ""
                            }
                            onChange={(e) =>
                              setCandidateFeedback((prev) => ({
                                ...prev,
                                [selectedCandidate.id]: e.target.value,
                              }))
                            }
                            className="w-full h-8 rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs"
                          />
                        </div>

                        <DashButton
                          variant="primary"
                          className="gap-2 h-8 whitespace-nowrap"
                          onClick={() =>
                            handleUpdateStatusAndFeedback(selectedCandidate.id)
                          }
                        >
                          <Send className="w-4 h-4" />
                          Submit Feedback
                        </DashButton>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)]">
                    <Users className="w-12 h-12 text-[var(--dash-text-muted)] opacity-40 mb-3" />
                    <p className="text-sm font-medium text-[var(--dash-text-muted)]">
                      Select a candidate to view details
                    </p>
                  </div>
                )}
              </div>

              {/* ── Mobile: Candidate List ── */}
              <div className="flex flex-col gap-3 mt-4 md:hidden">
                <div className="text-xs font-semibold text-[var(--dash-text-muted)] capitalize tracking-wider">
                  All Candidates
                </div>
                {filteredCandidates.map((candidate) => (
                  <button
                    key={candidate.id}
                    onClick={() => setSelectedCandidateId(candidate.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      candidate.id === selectedCandidateId
                        ? "border-[#6366F1] bg-[var(--dash-card-bg-solid)]"
                        : "border-[var(--dash-card-border)] bg-[var(--dash-card-bg)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[var(--dash-text-primary)] truncate">
                            {candidate.name}
                          </span>
                          <span className="text-xs font-bold text-[#60A5FA] ml-2">
                            {candidate.matchScore}%
                          </span>
                        </div>
                        <div className="text-xs text-[var(--dash-text-secondary)] truncate">
                          {candidate.vendor}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <StatusBadge status={candidate.status} />
                          <span
                            className={`text-[9.5px] px-1.5 py-0.5 rounded-md border font-medium whitespace-nowrap ${
                              candidate.gender === "Female"
                                ? "border-pink-500/20 bg-pink-500/10 text-pink-400"
                                : "border-blue-500/20 bg-blue-500/10 text-blue-400"
                            }`}
                          >
                            {candidate.gender}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* JD Upload Modal */}
        <Dialog
          open={isJDUploadModalOpen}
          onOpenChange={setIsJDUploadModalOpen}
        >
          <DialogContent className="sm:max-w-[800px] p-0 bg-transparent border-none shadow-none overflow-hidden">
            <JDUploadForm onSuccess={() => setIsJDUploadModalOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Full JD View Modal */}
        <JobDescriptionModal
          open={isJDViewModalOpen}
          onOpenChange={setIsJDViewModalOpen}
          requirement={activeRequirement}
          variant="client-submissions"
          onDownloadPDF={downloadJDPDF}
        />

        {/* Candidate Details Modal */}
        <Dialog
          open={isCandidateModalOpen}
          onOpenChange={setIsCandidateModalOpen}
        >
          <DialogContent className="max-w-3xl max-h-[88vh] flex flex-col border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-[var(--dash-text-primary)] p-5 rounded-2xl">
            {selectedCandidate &&
              (() => {
                const nameParts = (selectedCandidate.name || "").split(" ");
                const firstName = nameParts[0] || "";
                const lastName = nameParts.slice(1).join(" ") || "";

                const formValues = {
                  basicInfo: {
                    firstName,
                    lastName,
                    gender: selectedCandidate.gender || "Male",
                    designation:
                      selectedCandidate.jobTitle ||
                      selectedCandidate.role ||
                      "",
                    totalExperience: selectedCandidate.experience || "3 yrs",
                  },
                  workPreferences: {
                    deploymentType:
                      selectedCandidate.deploymentType || "Remote",
                    availability:
                      selectedCandidate.availability || "Immediate Joiner",
                    engagementType: selectedCandidate.engagement || "C-C",
                  },
                  skills: {
                    primarySkills: selectedCandidate.skills || [],
                    secondarySkills: selectedCandidate.secondarySkills || [],
                  },
                  location: {
                    location:
                      selectedCandidate.currentLocation ||
                      "Location Not Specified",
                  },
                  certifications: {
                    certifications: selectedCandidate.certifications || [],
                  },
                  workExperience:
                    selectedCandidate.workExperience &&
                    selectedCandidate.workExperience.length > 0
                      ? selectedCandidate.workExperience.map((exp: any) => ({
                          ...exp,
                          companyName:
                            exp.companyName ||
                            exp.company ||
                            selectedCandidate.company ||
                            "TechCorp",
                          role:
                            exp.role ||
                            exp.jobTitle ||
                            selectedCandidate.role ||
                            selectedCandidate.jobTitle ||
                            "Software Engineer",
                          duration:
                            exp.duration ||
                            (exp.startDate && exp.endDate
                              ? `${exp.startDate} – ${exp.endDate}`
                              : exp.startDate || exp.endDate || ""),
                          startDate:
                            exp.startDate ||
                            (exp.duration
                              ? exp.duration.split("–")[0]?.trim() ||
                                exp.duration.split("-")[0]?.trim()
                              : "2023"),
                          endDate:
                            exp.endDate ||
                            (exp.duration
                              ? exp.duration.split("–")[1]?.trim() ||
                                exp.duration.split("-")[1]?.trim()
                              : "Present"),
                          projects: exp.projects || [],
                        }))
                      : [
                          {
                            companyName:
                              selectedCandidate.company || "TechCorp",
                            role:
                              selectedCandidate.role ||
                              selectedCandidate.jobTitle ||
                              "Software Engineer",
                            duration:
                              selectedCandidate.duration ||
                              selectedCandidate.experienceRange ||
                              "2023 – Present",
                            startDate: "2023",
                            endDate: "Present",
                            projects: selectedCandidate.projects || [],
                          },
                        ],
                  education: {
                    degree:
                      selectedCandidate.degree || "B.Tech in Computer Science",
                    institute: selectedCandidate.institute || "IIT Bombay",
                    passingYear: selectedCandidate.passingYear || "2022",
                    cgpaOrPercentage:
                      selectedCandidate.cgpaOrPercentage || "8.8 CGPA",
                  },
                  links: {
                    linkedIn:
                      selectedCandidate.linkedIn ||
                      "https://linkedin.com/in/candidate",
                    github:
                      selectedCandidate.github ||
                      "https://github.com/candidate",
                  },
                  rateDetails: {
                    currency: selectedCandidate.currency || "USD ($)",
                    rateType: selectedCandidate.rateType || "Hourly",
                    rateMin: selectedCandidate.rateMin || "",
                    rateMax: selectedCandidate.rateMax || "",
                  },
                };

                const rateDisplay =
                  formValues.rateDetails.rateMin &&
                  formValues.rateDetails.rateMax
                    ? formatRateRange({
                        min: formValues.rateDetails.rateMin,
                        max: formValues.rateDetails.rateMax,
                        period: formValues.rateDetails.rateType,
                        currency: formValues.rateDetails.currency,
                      })
                    : formatRateRange({
                        amount:
                          selectedCandidate.expectedRate ||
                          formValues.rateDetails.rateMin ||
                          "",
                        period: formValues.rateDetails.rateType,
                        currency: formValues.rateDetails.currency,
                      });

                return (
                  <>
                    <DialogHeader className="border-b border-[var(--dash-card-border)] pb-3 mb-3 flex-shrink-0 text-left">
                      <div>
                        <span className="inline-block text-[9.5px] font-bold text-[var(--req-card-badge-purple-text)] capitalize tracking-wider bg-[var(--req-card-badge-purple-bg)] border border-[var(--req-card-badge-purple-border)] px-1.5 py-0.5 rounded-md mb-1.5">
                          {String(selectedCandidate.id)
                            .toUpperCase()
                            .startsWith("CAN-")
                            ? selectedCandidate.id
                            : `CAN-${String(selectedCandidate.id).padStart(4, "0")}`}
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
                              {formValues.basicInfo.totalExperience} of
                              experience
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
                                  (cert: string) => (
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
                              <p className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-1">
                                <Building className="w-3 h-3 text-violet-500 flex-shrink-0" />
                                {formValues.education.institute}
                              </p>
                              <div className="flex items-center justify-between text-[10px] text-[var(--dash-text-muted)] pt-0.5 whitespace-nowrap">
                                <span className="flex-shrink-0">
                                  Passing Year:{" "}
                                  {formValues.education.passingYear}
                                </span>
                                <span className="flex-shrink-0">
                                  Percentage / CGPA:{" "}
                                  {formValues.education.cgpaOrPercentage ||
                                    selectedCandidate.cgpaOrPercentage ||
                                    "8.8 CGPA"}
                                </span>
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
                          <Accordion
                            type="multiple"
                            className="w-full space-y-2"
                          >
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
                                      {exp.projects &&
                                      exp.projects.length > 0 ? (
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
                    </div>

                    <DialogFooter className="border-t border-[var(--dash-card-border)] pt-3 mt-4 flex-shrink-0">
                      <DashButton
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 px-3.5"
                        onClick={() => setIsCandidateModalOpen(false)}
                      >
                        Close Details
                      </DashButton>
                    </DialogFooter>
                  </>
                );
              })()}
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}

function SubmissionsFallback() {
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
        style={{ maxWidth: "100%", minWidth: 0 }}
      >
        <DashboardHeader onMobileToggle={() => {}} />
        <div className="dash-content px-4 sm:px-6">
          <SubmissionsSkeleton />
        </div>
      </main>
    </>
  );
}

export default function SubmissionsPage() {
  return (
    <Suspense fallback={<SubmissionsFallback />}>
      <SubmissionsContent />
    </Suspense>
  );
}
