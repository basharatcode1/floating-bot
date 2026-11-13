"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Clock,
  Users,
  Star,
  StarHalf,
  ChevronDown,
  MapPin,
  Calendar,
  Building2,
  ShieldCheck,
  Briefcase,
  Target,
  UserCheck,
} from "lucide-react";
import VendorSidebar from "../dashboard/components/VendorSidebar";
import VendorDashboardHeader from "../dashboard/components/VendorDashboardHeader";
import { DashSearchInput } from "@/app/components/ui/dash-search-input";
import ClientPerformanceSkeleton from "./components/ClientPerformanceSkeleton";
import { useSidebar } from "@/app/components/SidebarContext";
import { DashPageHeader } from "@/app/components/ui/dash-page-header";

interface Client {
  id: string;
  name: string;
  isTop: boolean;
  industry: string;
  tags: string[];
  successRate: number; // percentage
  avgResponse: number; // days
  hires: { placed: number; total: number };
  rating: number; // e.g. 4.8
  glassdoor: { rating: number; reviews: string };
  ambitionbox: { rating: number; reviews: string };
  // New details
  headquarters: string;
  foundedYear: number;
  companySize: string;
  certifications: string[];
  industryDomain: string[];
}

const clientsData: Client[] = [
  {
    id: "1",
    name: "TechCorp Industries",
    isTop: true,
    industry: "Software & IT",
    tags: ["React", "Node.js", "Python", "TypeScript"],
    successRate: 94,
    avgResponse: 1.5,
    hires: { placed: 12, total: 15 },
    rating: 4.9,
    glassdoor: { rating: 4.9, reviews: "53.3k" },
    ambitionbox: { rating: 4.8, reviews: "47.6k" },
    headquarters: "Seattle, WA, USA",
    foundedYear: 2012,
    companySize: "1,000–5,000",
    certifications: ["ISO 27001", "SOC 2 Type II"],
    industryDomain: ["Software Development", "Enterprise IT"],
  },
  {
    id: "2",
    name: "Cloud Solutions Ltd",
    isTop: true,
    industry: "Cloud & DevOps",
    tags: ["AWS", "DevOps", "Kubernetes", "Docker"],
    successRate: 90,
    avgResponse: 2.1,
    hires: { placed: 8, total: 10 },
    rating: 4.7,
    glassdoor: { rating: 4.7, reviews: "32.1k" },
    ambitionbox: { rating: 4.6, reviews: "28.4k" },
    headquarters: "Austin, TX, USA",
    foundedYear: 2016,
    companySize: "500–1,000",
    certifications: ["AWS Advanced Partner", "ISO 9001"],
    industryDomain: ["Cloud Computing", "Infrastructure"],
  },
  {
    id: "3",
    name: "Innovate Web Studio",
    isTop: false,
    industry: "Design & UX",
    tags: ["UI/UX", "Figma", "React", "Tailwind"],
    successRate: 85,
    avgResponse: 3.0,
    hires: { placed: 5, total: 7 },
    rating: 4.4,
    glassdoor: { rating: 4.4, reviews: "12.5k" },
    ambitionbox: { rating: 4.5, reviews: "10.2k" },
    headquarters: "New York, NY, USA",
    foundedYear: 2018,
    companySize: "50–200",
    certifications: ["W3C Web Accessibility", "UXQB Certified"],
    industryDomain: ["Digital Agency", "Creative Services"],
  },
  {
    id: "4",
    name: "DataMinds Inc",
    isTop: false,
    industry: "AI & Analytics",
    tags: ["Python", "Machine Learning", "PyTorch", "SQL"],
    successRate: 80,
    avgResponse: 2.8,
    hires: { placed: 4, total: 6 },
    rating: 4.2,
    glassdoor: { rating: 4.2, reviews: "8.3k" },
    ambitionbox: { rating: 4.1, reviews: "7.9k" },
    headquarters: "Boston, MA, USA",
    foundedYear: 2017,
    companySize: "200–500",
    certifications: ["ISO 27001", "Google Cloud Partner"],
    industryDomain: ["Artificial Intelligence", "Data Analytics"],
  },
  {
    id: "5",
    name: "AppWave Ltd",
    isTop: false,
    industry: "Mobile Apps",
    tags: ["Flutter", "React Native", "iOS", "Android"],
    successRate: 75,
    avgResponse: 4.2,
    hires: { placed: 3, total: 5 },
    rating: 4.0,
    glassdoor: { rating: 4.0, reviews: "4.1k" },
    ambitionbox: { rating: 3.9, reviews: "3.5k" },
    headquarters: "London, UK",
    foundedYear: 2019,
    companySize: "10–50",
    certifications: ["Apple Developer Enterprise"],
    industryDomain: ["Mobile Development", "Consumer Apps"],
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

/* Circular progress ring for success rate */
const CircularProgress = ({ value }: { value: number }) => {
  return <div className="font-semibold text-sm">{value}%</div>;
};

export default function ClientPerformancePage() {
  const {
    collapsed: sidebarCollapsed,
    toggleCollapse,
    mobileOpen,
    setMobileOpen,
    toggleMobile,
  } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("success_rate");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedClients, setExpandedClients] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleClientExpand = (id: string) => {
    setExpandedClients((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredClients = clientsData.filter((client) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      client.name.toLowerCase().includes(q) ||
      client.industry.toLowerCase().includes(q) ||
      client.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortBy === "success_rate") return b.successRate - a.successRate;
    if (sortBy === "response_time") return a.avgResponse - b.avgResponse;
    if (sortBy === "selected_count") return b.hires.placed - a.hires.placed;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  // Calculate KPIs
  const totalClientsCount = filteredClients.length;
  const avgSuccessRate = totalClientsCount
    ? Math.round(
        filteredClients.reduce((acc, c) => acc + c.successRate, 0) /
          totalClientsCount,
      )
    : 0;
  const avgResponseTime = totalClientsCount
    ? (
        filteredClients.reduce((acc, c) => acc + c.avgResponse, 0) /
        totalClientsCount
      ).toFixed(1)
    : "0.0";
  const totalHired = filteredClients.reduce(
    (acc, c) => acc + c.hires.placed,
    0,
  );

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

        <div className="dash-content relative">
          {loading ? (
            <ClientPerformanceSkeleton />
          ) : (
            <div className="sk-page-content-enter relative z-10">
              {/* Page Header */}
              <div className="dash-page-header">
                <div>
                  <h1 className="dash-page-title">Client Performance</h1>
                  <p className="dash-page-subtitle text-xs text-[var(--dash-text-secondary)]">
                    Comprehensive overview & key metrics
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <DashSearchInput
                    placeholder="Search client by name..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    wrapperClassName="w-full sm:w-64"
                  />
                </div>
              </div>

              {/* Client List Table */}
              <div
                className="border rounded-2xl overflow-hidden shadow-sm"
                style={{
                  background: "var(--dash-card-bg)",
                  borderColor: "var(--dash-card-border)",
                }}
              >
                <div className="vp-table-header">
                  <div>#</div>
                  <div>Client</div>
                  <div className="text-center">Success Rate</div>
                  <div>Response Time</div>
                  <div>Selected</div>
                  <div>External Ratings</div>
                </div>

                <div className="flex flex-col">
                  {sortedClients.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-[var(--dash-text-muted)] text-sm">
                        No clients found matching criteria.
                      </p>
                    </div>
                  ) : (
                    sortedClients.map((client, index) => {
                      const isExpanded = expandedClients.has(client.id);

                      return (
                        <div key={client.id} className="vp-card-wrapper">
                          <div
                            className={`vp-table-row vp-table-row-clickable ${isExpanded ? "vp-table-row-expanded" : ""}`}
                            onClick={() => toggleClientExpand(client.id)}
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

                            {/* Client Info */}
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="font-bold text-[var(--dash-text-primary)] text-sm">
                                    {client.name}
                                  </span>
                                  {client.isTop && (
                                    <span
                                      className="text-[9px] font-bold px-1.5 py-0.5 rounded capitalize tracking-wide"
                                      style={{
                                        background: "var(--dash-warning-bg)",
                                        color: "var(--dash-warning-text)",
                                      }}
                                    >
                                      Top Client
                                    </span>
                                  )}
                                  <ChevronDown
                                    size={16}
                                    className={`vp-chevron-toggle ${isExpanded ? "vp-chevron-open" : ""}`}
                                    style={{
                                      color: "var(--dash-text-muted)",
                                      marginLeft: "4px",
                                    }}
                                  />
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {client.tags.map((tag) => (
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

                            {/* Success Rate */}
                            <div className="flex items-center justify-center">
                              <CircularProgress value={client.successRate} />
                            </div>

                            {/* Avg Response */}
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5 font-semibold text-sm text-[var(--dash-text-primary)]">
                                  <Clock
                                    size={14}
                                    style={{
                                      color:
                                        "var(--req-card-icon-color, #6366f1)",
                                    }}
                                  />
                                  {client.avgResponse} days
                                </div>
                              </div>
                            </div>

                            {/* Selected / Hired */}
                            <div className="flex flex-col justify-center pr-4">
                              <div className="flex items-center gap-1.5 font-semibold text-sm mb-1.5 text-[var(--dash-text-primary)]">
                                <Users
                                  size={14}
                                  style={{ color: "var(--dash-badge-text)" }}
                                />
                                {client.hires.placed}/{client.hires.total}
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
                                    width: `${(client.hires.placed / client.hires.total) * 100}%`,
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
                                      {renderStars(client.glassdoor.rating)}
                                    </div>
                                    <span
                                      className="text-xs font-bold leading-none"
                                      style={{
                                        color: "var(--dash-success-text)",
                                      }}
                                    >
                                      {client.glassdoor.rating}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-[var(--dash-text-muted)] mt-1">
                                    {client.glassdoor.reviews} reviews
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
                                      {renderStars(client.ambitionbox.rating)}
                                    </div>
                                    <span
                                      className="text-xs font-bold leading-none"
                                      style={{
                                        color:
                                          "var(--req-card-icon-color, #6366f1)",
                                      }}
                                    >
                                      {client.ambitionbox.rating}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-[var(--dash-text-muted)] mt-1">
                                    {client.ambitionbox.reviews} reviews
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expandable Company Details Panel */}
                          <div
                            className={`vp-details-panel ${isExpanded ? "vp-details-panel-open" : ""}`}
                          >
                            <div className="vp-details-inner">
                              <div className="vp-details-grid">
                                {/* Headquarters */}
                                <div className="vp-detail-item">
                                  <div className="vp-detail-icon-rose mt-1">
                                    <MapPin size={15} />
                                  </div>
                                  <div>
                                    <div className="vp-detail-label">
                                      Headquarters (HQ)
                                    </div>
                                    <div className="vp-detail-value">
                                      {client.headquarters}
                                    </div>
                                  </div>
                                </div>

                                {/* Founded Year */}
                                <div className="vp-detail-item">
                                  <div className="vp-detail-icon-blue mt-1">
                                    <Calendar size={15} />
                                  </div>
                                  <div>
                                    <div className="vp-detail-label">
                                      Founded Year
                                    </div>
                                    <div className="vp-detail-value">
                                      {client.foundedYear}
                                      <span className="vp-detail-sub">
                                        {" "}
                                        ·{" "}
                                        {new Date().getFullYear() -
                                          client.foundedYear}{" "}
                                        yrs
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Company Size */}
                                <div className="vp-detail-item">
                                  <div className="vp-detail-icon-teal mt-1">
                                    <Users size={15} />
                                  </div>
                                  <div>
                                    <div className="vp-detail-label">
                                      Company Size
                                    </div>
                                    <div className="vp-detail-value">
                                      {client.companySize} employees
                                    </div>
                                  </div>
                                </div>

                                {/* Certifications */}
                                <div className="vp-detail-item">
                                  <div className="vp-detail-icon-emerald mt-1">
                                    <ShieldCheck size={15} />
                                  </div>
                                  <div>
                                    <div className="vp-detail-label">
                                      Certifications
                                    </div>
                                    <div className="flex flex-col gap-1.5 mt-1.5">
                                      {client.certifications.map((cert) => (
                                        <div
                                          key={cert}
                                          className="vp-cert-badge"
                                        >
                                          <ShieldCheck size={12} />
                                          {cert}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Industry Domain */}
                                <div className="vp-detail-item">
                                  <div className="vp-detail-icon-violet mt-1">
                                    <Briefcase size={15} />
                                  </div>
                                  <div>
                                    <div className="vp-detail-label">
                                      Industry Domain
                                    </div>
                                    <div className="flex flex-col gap-1.5 mt-1.5">
                                      {client.industryDomain.map((domain) => (
                                        <div
                                          key={domain}
                                          className="vp-domain-badge"
                                        >
                                          {domain}
                                        </div>
                                      ))}
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
