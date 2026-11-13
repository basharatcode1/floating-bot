"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Award,
  CheckCircle2,
  Clock,
  Users,
  Target,
  UserCheck,
  Star,
  StarHalf,
  Search,
  MapPin,
  Calendar,
  Building2,
  ShieldCheck,
  Globe,
  ChevronDown,
  BadgeCheck,
  Briefcase,
} from "lucide-react";
import Sidebar from "../dashboard/components/Sidebar";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import { Input } from "@/app/components/ui/input";
import { DashSearchInput } from "@/app/components/ui/dash-search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  SkeletonLine,
  SkeletonBlock,
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonContainer,
} from "../shared/skeletons/SkeletonBase";
import VendorPerformanceSkeleton from "./components/VendorPerformanceSkeleton";
import { useSidebar } from "@/app/components/SidebarContext";

interface Vendor {
  id: string;
  name: string;
  logoLetter: string;
  logoClass: string;
  isTop: boolean;
  tags: string[];
  successRate: number; // percentage
  successTrendData: number[];
  avgResponse: number; // days
  responseTrend: number;
  responseTrendData: number[];
  selected: { hired: number; total: number };
  rating: number; // e.g. 4.8
  glassdoor: { rating: number; reviews: string };
  ambitionbox: { rating: number; reviews: string };
  summary: string;
  // New company details
  headquarters: string;
  foundedYear: number;
  companySize: string;
  certifications: string[];
  industryDomain: string[];
}

const vendorsData: Vendor[] = [
  {
    id: "1",
    name: "TechHire Solutions",
    logoLetter: "T",
    logoClass: "vp-vendor-logo",
    isTop: true,
    tags: ["React", "Node.js", "Python", "TypeScript"],
    successRate: 92,
    successTrendData: [75, 80, 85, 82, 88, 92],
    avgResponse: 2.3,
    responseTrend: -0.4,
    responseTrendData: [3.0, 2.8, 2.5, 2.7, 2.4, 2.3],
    selected: { hired: 18, total: 28 },
    rating: 4.8,
    glassdoor: { rating: 4.8, reviews: "23.4k" },
    ambitionbox: { rating: 4.7, reviews: "21.1k" },
    summary: "A leading IT services provider specializing in end-to-end software development and team augmentation.",
    headquarters: "San Francisco, CA, USA",
    foundedYear: 2015,
    companySize: "500–1,000",
    certifications: ["ISO 27001", "SOC 2 Type II", "CMMI Level 5"],
    industryDomain: ["IT Services", "Software Development"],
  },
  {
    id: "2",
    name: "NextGen Talent",
    logoLetter: "N",
    logoClass: "vp-vendor-logo vp-vendor-logo-alt",
    isTop: false,
    tags: ["UI/UX", "React", "Flutter", "Mobile"],
    successRate: 88,
    successTrendData: [80, 78, 82, 85, 87, 88],
    avgResponse: 1.8,
    responseTrend: -0.6,
    responseTrendData: [2.5, 2.4, 2.2, 2.0, 1.9, 1.8],
    selected: { hired: 11, total: 15 },
    rating: 4.6,
    glassdoor: { rating: 4.6, reviews: "15.2k" },
    ambitionbox: { rating: 4.5, reviews: "14.8k" },
    summary: "Expert digital design and mobile application development agency known for high-quality UI/UX.",
    headquarters: "Bengaluru, Karnataka, India",
    foundedYear: 2018,
    companySize: "200–500",
    certifications: ["ISO 9001", "SOC 2 Type I"],
    industryDomain: ["Digital Design", "Mobile Development"],
  },
  {
    id: "3",
    name: "SkillBridge Partners",
    logoLetter: "S",
    logoClass: "vp-vendor-logo vp-vendor-logo-dark",
    isTop: false,
    tags: ["Java", "Spring Boot", "AWS", "Microservices"],
    successRate: 85,
    successTrendData: [70, 72, 75, 80, 82, 85],
    avgResponse: 3.1,
    responseTrend: 0.5,
    responseTrendData: [2.5, 2.6, 2.8, 2.7, 3.0, 3.1],
    selected: { hired: 14, total: 22 },
    rating: 4.5,
    glassdoor: { rating: 4.5, reviews: "12.1k" },
    ambitionbox: { rating: 4.3, reviews: "11.5k" },
    summary: "Enterprise solutions partner focusing on robust cloud architecture and scalable backend services.",
    headquarters: "Hyderabad, Telangana, India",
    foundedYear: 2012,
    companySize: "1,000–5,000",
    certifications: ["ISO 27001", "CMMI Level 3", "GDPR Compliant"],
    industryDomain: ["Enterprise Solutions", "Cloud Services"],
  },
  {
    id: "4",
    name: "CodeBridge Inc.",
    logoLetter: "C",
    logoClass: "vp-vendor-logo",
    isTop: false,
    tags: ["Python", "Django", "FastAPI", "PostgreSQL"],
    successRate: 82,
    successTrendData: [80, 81, 79, 83, 81, 82],
    avgResponse: 2.5,
    responseTrend: -0.2,
    responseTrendData: [2.8, 2.7, 2.7, 2.6, 2.6, 2.5],
    selected: { hired: 8, total: 12 },
    rating: 4.3,
    glassdoor: { rating: 4.3, reviews: "8.9k" },
    ambitionbox: { rating: 4.2, reviews: "7.6k" },
    summary: "Boutique data engineering and backend development firm delivering customized data pipelines.",
    headquarters: "Austin, TX, USA",
    foundedYear: 2019,
    companySize: "50–200",
    certifications: ["SOC 2 Type II", "ISO 9001"],
    industryDomain: ["Data Engineering", "Backend Development"],
  },
];

const renderStars = (rating: number, size: number = 10) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const remainder = rating - fullStars;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star
          key={i}
          size={size}
          fill="currentColor"
          style={{ color: "var(--dash-warning-text)" }}
        />,
      );
    } else if (i === fullStars + 1 && remainder > 0) {
      if (remainder >= 0.75) {
        stars.push(
          <Star
            key={i}
            size={size}
            fill="currentColor"
            style={{ color: "var(--dash-warning-text)" }}
          />,
        );
      } else if (remainder >= 0.25) {
        stars.push(
          <StarHalf
            key={i}
            size={size}
            fill="currentColor"
            style={{ color: "var(--dash-warning-text)" }}
          />,
        );
      } else {
        stars.push(
          <Star
            key={i}
            size={size}
            fill="currentColor"
            style={{ color: "var(--dash-divider)" }}
          />,
        );
      }
    } else {
      stars.push(
        <Star
          key={i}
          size={size}
          fill="currentColor"
          style={{ color: "var(--dash-divider)" }}
        />,
      );
    }
  }
  return stars;
};

const Sparkline = ({
  data,
  color,
  className,
}: {
  data: number[];
  color: string;
  className?: string;
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 20;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" L ");

  const lastX = width;
  const lastY = height - ((data[data.length - 1] - min) / range) * height;

  const gradientId = `grad-${color.replace(/[^a-zA-Z0-9]/g, "")}-${Math.random().toString(36).substring(7)}`;

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 -5 ${width} ${height + 10}`}
    >
      <path
        d={`M ${points}`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
      <path
        d={`M 0,${height} L ${points} L ${width},${height} Z`}
        fill={`url(#${gradientId})`}
        opacity="0.3"
      />
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/* Circular progress ring for success rate */
const CircularProgress = ({ value }: { value: number }) => {
  return (
    <div className="font-semibold text-sm text-[var(--dash-text-primary)]">
      {value}%
    </div>
  );
};

export default function VendorPerformancePage() {
  const {
    collapsed: sidebarCollapsed,
    toggleCollapse,
    mobileOpen,
    setMobileOpen,
    toggleMobile,
  } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState("all");
  const [sortBy, setSortBy] = useState("success_rate");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedVendors, setExpandedVendors] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedVendors((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filterSkills = [
    { value: "all", label: "All Skills" },
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "Python", label: "Python" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "UI/UX", label: "UI/UX" },
    { value: "Flutter", label: "Flutter" },
    { value: "Java", label: "Java" },
    { value: "DevOps", label: "DevOps" },
    { value: "Cloud", label: "Cloud" },
  ];

  // Filter & Sort logic
  const filteredVendors = vendorsData
    .filter((vendor) => {
      if (
        skillFilter !== "all" &&
        !vendor.tags.some(
          (tag) => tag.toLowerCase() === skillFilter.toLowerCase(),
        )
      ) {
        return false;
      }
      if (
        searchQuery &&
        !vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "success_rate") {
        return b.successRate - a.successRate;
      }
      if (sortBy === "response_time") {
        return a.avgResponse - b.avgResponse;
      }
      if (sortBy === "selected_count") {
        return b.selected.hired - a.selected.hired;
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });

  // Summary KPI calculations
  const avgSuccessRate =
    filteredVendors.length > 0
      ? Math.round(
          filteredVendors.reduce((sum, v) => sum + v.successRate, 0) /
            filteredVendors.length,
        )
      : 0;
  const avgResponseTime =
    filteredVendors.length > 0
      ? (
          filteredVendors.reduce((sum, v) => sum + v.avgResponse, 0) /
          filteredVendors.length
        ).toFixed(1)
      : "0";
  const totalHired = filteredVendors.reduce(
    (sum, v) => sum + v.selected.hired,
    0,
  );

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

        <div className="dash-content relative">
          {loading ? (
            <VendorPerformanceSkeleton />
          ) : (
            <div className="sk-page-content-enter relative z-10">
              {/* Page Header */}
              <div className="dash-page-header">
                <div>
                  <h1 className="dash-page-title">Vendor Performance</h1>
                  <p className="dash-page-subtitle text-xs text-[var(--dash-text-secondary)]">
                    Comprehensive overview & key metrics
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <DashSearchInput
                    placeholder="Search vendor by name..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    wrapperClassName="w-full sm:w-64"
                  />
                </div>
              </div>

              {/* Vendor List Table */}
              <div
                className="border rounded-2xl overflow-hidden shadow-sm"
                style={{
                  background: "var(--dash-card-bg)",
                  borderColor: "var(--dash-card-border)",
                }}
              >
                <div className="vp-table-header">
                  <div>#</div>
                  <div>Vendor</div>
                  <div className="text-center">Success Rate</div>
                  <div>Response Time</div>
                  <div>Selected</div>
                  <div>External Ratings</div>
                </div>

                <div className="flex flex-col">
                  {filteredVendors.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-[var(--dash-text-muted)] text-sm">
                        No vendors found matching criteria.
                      </p>
                    </div>
                  ) : (
                    filteredVendors.map((vendor, index) => {
                      const isExpanded = expandedVendors.has(vendor.id);
                      return (
                        <div key={vendor.id} className="vp-card-wrapper">
                          {/* Main Row */}
                          <div
                            className={`vp-table-row vp-table-row-clickable ${isExpanded ? "vp-table-row-expanded" : ""}`}
                            onClick={() => toggleExpand(vendor.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleExpand(vendor.id);
                              }
                            }}
                          >
                            {/* Rank */}
                            <div>
                              {index === 0 ? (
                                <div className="vp-rank-badge vp-rank-gold">
                                  <Award
                                    size={24}
                                    fill="currentColor"
                                    className="opacity-30"
                                  />
                                  <span
                                    className="absolute font-bold text-xs"
                                    style={{
                                      color: "var(--dash-text-primary)",
                                    }}
                                  >
                                    1
                                  </span>
                                </div>
                              ) : index === 1 ? (
                                <div className="vp-rank-badge vp-rank-silver">
                                  <Award
                                    size={24}
                                    fill="currentColor"
                                    className="opacity-30"
                                  />
                                  <span
                                    className="absolute font-bold text-xs"
                                    style={{
                                      color: "var(--dash-text-primary)",
                                    }}
                                  >
                                    2
                                  </span>
                                </div>
                              ) : index === 2 ? (
                                <div className="vp-rank-badge vp-rank-bronze">
                                  <Award
                                    size={24}
                                    fill="currentColor"
                                    className="opacity-30"
                                  />
                                  <span
                                    className="absolute font-bold text-xs"
                                    style={{
                                      color: "var(--dash-text-primary)",
                                    }}
                                  >
                                    3
                                  </span>
                                </div>
                              ) : (
                                <div className="vp-rank-badge">
                                  <div className="vp-rank-number">
                                    {index + 1}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Vendor Info */}
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="font-bold text-[var(--dash-text-primary)] text-sm">
                                    {vendor.name}
                                  </span>
                                  {vendor.isTop && (
                                    <span
                                      className="text-[9px] font-bold px-1.5 py-0.5 rounded capitalize tracking-wide"
                                      style={{
                                        background: "var(--dash-warning-bg)",
                                        color: "var(--dash-warning-text)",
                                      }}
                                    >
                                      Top Vendor
                                    </span>
                                  )}
                                  <ChevronDown
                                    size={14}
                                    className={`vp-chevron-toggle ${isExpanded ? "vp-chevron-open" : ""}`}
                                    style={{
                                      color: "var(--dash-text-muted)",
                                    }}
                                  />
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {vendor.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                      style={{
                                        background: "var(--dash-input-bg)",
                                        color: "var(--dash-text-secondary)",
                                      }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Success Rate with circular progress */}
                            <div className="flex items-center justify-center">
                              <CircularProgress value={vendor.successRate} />
                            </div>

                            {/* Avg Response */}
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5 font-semibold text-sm text-[var(--dash-text-primary)]">
                                  <Clock
                                    size={14}
                                    style={{
                                      color: "var(--req-card-icon-color)",
                                    }}
                                  />
                                  {vendor.avgResponse} days
                                </div>
                              </div>
                            </div>

                            {/* Selected */}
                            <div className="flex flex-col justify-center pr-4">
                              <div className="flex items-center gap-1.5 font-semibold text-sm mb-1.5 text-[var(--dash-text-primary)]">
                                <Users
                                  size={14}
                                  style={{
                                    color: "var(--dash-badge-text)",
                                  }}
                                />
                                {vendor.selected.hired}/{vendor.selected.total}
                              </div>
                              <div
                                className="h-1.5 w-full rounded-full overflow-hidden"
                                style={{
                                  background: "var(--dash-progress-bg)",
                                }}
                              >
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${(vendor.selected.hired / vendor.selected.total) * 100}%`,
                                    background: "var(--dash-badge-text)",
                                  }}
                                />
                              </div>
                            </div>

                            {/* External Ratings */}
                            <div
                              className="flex flex-col gap-2 border-l pl-4"
                              style={{ borderColor: "var(--dash-divider)" }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center shrink-0 p-1">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src="/glassdoor-icon.svg"
                                      alt="Glassdoor"
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <span className="text-[11px] font-semibold text-[var(--dash-text-secondary)]">
                                    Glassdoor
                                  </span>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="flex items-center gap-1.5">
                                    <div className="flex items-center">
                                      {renderStars(vendor.glassdoor.rating)}
                                    </div>
                                    <span
                                      className="text-xs font-bold leading-none"
                                      style={{
                                        color: "var(--dash-success-text)",
                                      }}
                                    >
                                      {vendor.glassdoor.rating}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-[var(--dash-text-muted)] mt-1">
                                    {vendor.glassdoor.reviews} reviews
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center shrink-0 p-1">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src="/ambitionbox-icon.svg"
                                      alt="AmbitionBox"
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <span className="text-[11px] font-semibold text-[var(--dash-text-secondary)]">
                                    AmbitionBox
                                  </span>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="flex items-center gap-1.5">
                                    <div className="flex items-center">
                                      {renderStars(vendor.ambitionbox.rating)}
                                    </div>
                                    <span
                                      className="text-xs font-bold leading-none"
                                      style={{
                                        color: "var(--req-card-icon-color)",
                                      }}
                                    >
                                      {vendor.ambitionbox.rating}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-[var(--dash-text-muted)] mt-1">
                                    {vendor.ambitionbox.reviews} reviews
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            className={`vp-details-panel ${isExpanded ? "vp-details-panel-open" : ""}`}
                          >
                            <div className="vp-details-inner">
                              <div className="border-t" style={{ borderColor: "var(--dash-divider)", background: "var(--dash-input-bg)" }}>
                                {/* Summary line */}
                                <p className="px-6 pt-4 pb-2 text-[13px] text-[var(--dash-text-secondary)] leading-relaxed">
                                  {vendor.summary}
                                </p>
                                {/* Details grid */}
                                <div className="vp-details-grid" style={{ borderTop: "none", paddingTop: 0 }}>
                                  {/* Headquarters */}
                                  <div className="vp-detail-item">
                                    <div className="vp-detail-icon vp-detail-icon-rose">
                                      <MapPin size={15} />
                                    </div>
                                    <div>
                                      <div className="vp-detail-label">
                                        Headquarters (HQ)
                                      </div>
                                      <div className="vp-detail-value">
                                        {vendor.headquarters}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Founded Year */}
                                  <div className="vp-detail-item">
                                    <div className="vp-detail-icon vp-detail-icon-blue">
                                      <Calendar size={15} />
                                    </div>
                                    <div>
                                      <div className="vp-detail-label">
                                        Founded Year
                                      </div>
                                      <div className="vp-detail-value">
                                        {vendor.foundedYear}
                                        <span className="vp-detail-sub">
                                          {" "}
                                          ·{" "}
                                          {new Date().getFullYear() -
                                            vendor.foundedYear}{" "}
                                          yrs
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Company Size */}
                                  <div className="vp-detail-item">
                                    <div className="vp-detail-icon vp-detail-icon-teal">
                                      <Users size={15} />
                                    </div>
                                    <div>
                                      <div className="vp-detail-label">
                                        Company Size
                                      </div>
                                      <div className="vp-detail-value">
                                        {vendor.companySize} employees
                                      </div>
                                    </div>
                                  </div>

                                  {/* Certifications */}
                                  <div className="vp-detail-item">
                                    <div className="vp-detail-icon vp-detail-icon-emerald">
                                      <ShieldCheck size={15} />
                                    </div>
                                    <div>
                                      <div className="vp-detail-label">
                                        Certifications
                                      </div>
                                      <div className="flex flex-wrap gap-1.5 mt-1">
                                        {vendor.certifications.map((cert) => (
                                          <span
                                            key={cert}
                                            className="vp-cert-badge"
                                          >
                                            <BadgeCheck size={10} />
                                            {cert}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Industry Domain */}
                                  <div className="vp-detail-item">
                                    <div className="vp-detail-icon vp-detail-icon-violet">
                                      <Briefcase size={15} />
                                    </div>
                                    <div>
                                      <div className="vp-detail-label">
                                        Industry Domain
                                      </div>
                                      <div className="flex flex-wrap gap-1.5 mt-1">
                                        {vendor.industryDomain.map((domain) => (
                                          <span
                                            key={domain}
                                            className="vp-domain-badge"
                                          >
                                            {domain}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
