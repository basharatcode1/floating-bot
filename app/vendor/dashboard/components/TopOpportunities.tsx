"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  Building2,
  UserPlus,
  Users,
  UserCheck,
  MoreVertical,
  Eye,
} from "lucide-react";
import { formatRateRange } from "@/app/lib/rate-format";
import { Card } from "@/app/components/ui/card";
import { DashButton } from "@/app/components/ui/dash-button";
import { SectionHeading } from "@/app/components/ui/section-heading";
import { CertificatePopover } from "../../opportunities/components/CertificatePopover";
import { CardSkillBadgeOverflow } from "@/app/components/ui/card-skill-badge-overflow";

const opportunities = [
  {
    id: 1,
    title: "Senior React Developer",
    client: "TechCorp",
    location: "Bangalore",
    type: "Full-time",
    budget: "₹15-18L",
    posted: "Apr 1, 2026",
    duration: "12 months",
    experience: "5-8 yrs",
    certificates: [
      "AWS Certified Developer",
      "Google Cloud Professional Architect",
    ],
    certificate: "AWS Certified Developer",
    match: 94,
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Next.js",
      "Redux Toolkit",
      "GraphQL",
      "Tailwind CSS",
      "REST APIs",
      "HTML5/CSS3",
      "JavaScript (ES6+)",
      "Webpack",
      "Vite",
    ],
    secondarySkills: [
      "PostgreSQL",
      "Docker",
      "AWS",
      "Redis",
      "Jest",
      "Cypress",
      "React Testing Library",
      "Git",
      "CI/CD",
      "Micro-frontends",
    ],
    positions: 2,
    proposedCandidates: 1,
    isHot: true,
  },
  {
    id: 2,
    title: "DevOps Engineer",
    client: "Innovate Inc",
    location: "Remote",
    type: "C2C",
    budget: "₹20-25L",
    posted: "Apr 15, 2026",
    duration: "6 months",
    experience: "4-7 yrs",
    certificates: [
      "AWS Solutions Architect",
      "Certified Kubernetes Administrator (CKA)",
    ],
    certificate: "AWS Solutions Architect",
    match: 87,
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
      "Linux",
      "Bash",
      "GitOps",
    ],
    secondarySkills: [
      "CI/CD",
      "Python",
      "GitLab CI",
      "ArgoCD",
      "Azure",
      "GCP",
      "ELK Stack",
      "CloudWatch",
      "Vault",
      "Networking",
    ],
    positions: 1,
    proposedCandidates: 0,
    isHot: false,
  },
  {
    id: 3,
    title: "UI/UX Designer",
    client: "DataSys",
    location: "Mumbai",
    type: "Full-time",
    budget: "₹10-14L",
    posted: "May 1, 2026",
    duration: "Permanent",
    experience: "3-5 yrs",
    certificate: "Google UX Design Professional",
    match: 78,
    skills: [
      "Figma",
      "Adobe XD",
      "Design Systems",
      "User Research",
      "Wireframing",
      "Interactive Prototyping",
      "Information Architecture",
      "Visual Design",
      "Design Tokens",
      "Accessibility (a11y)",
    ],
    secondarySkills: [
      "Illustrator",
      "Motion Design",
      "After Effects",
      "Storyboarding",
      "HTML/CSS",
      "Usability Testing",
      "Persona Mapping",
      "Micro-interactions",
      "Framer",
      "Zeplin",
    ],
    positions: 3,
    proposedCandidates: 0,
    isHot: false,
  },
];

export default function TopOpportunities() {
  const router = useRouter();
  const [activeActionMenuId, setActiveActionMenuId] = useState<number | null>(
    null,
  );

  return (
    <div className="dash-card">
      <SectionHeading
        title="Top Opportunities"
        icon={<Briefcase />}
        action={
          <Link href="/vendor/opportunities" className="dash-view-all">
            View All →
          </Link>
        }
      />

      <div className="flex flex-col gap-3">
        {opportunities.map((opp) => (
          <Card
            key={opp.id}
            className="req-card p-3 bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl hover:border-[var(--dash-card-hover-border)] transition-all duration-300 relative group overflow-visible"
          >
            <div className="req-card-grid grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
              {/* Column 1: Title & Meta Details */}
              <div className="req-card-col lg:col-span-3 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col  gap-2 py-0.5 min-w-0">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-semibold text-[var(--req-card-badge-purple-text)] capitalize tracking-wider bg-[var(--req-card-badge-purple-bg)] border border-[var(--req-card-badge-purple-border)] w-fit px-2 py-0.5 rounded-md">
                      JD-{String(opp.id).padStart(4, "0")}
                    </span>
                    {opp.isHot && (
                      <span className="px-2 py-0.5 text-[9px] font-semibold text-[var(--dash-badge-text)] bg-[var(--dash-badge-bg)] border border-[var(--dash-badge-border)] rounded-md capitalize tracking-wider">
                        Hot
                      </span>
                    )}
                  </div>
                  <h2 className="req-card-title">{opp.title}</h2>
                  <div className="flex items-center gap-1 text-xs text-[var(--dash-accent-text)] font-semibold truncate">
                    <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{opp.client}</span>
                  </div>
                </div>

                {/* Meta Details Grid */}
                <div className="grid grid-cols-2 items-start gap-x-2 gap-y-2 text-[10px] text-[var(--dash-text-secondary)]">
                  <span className="flex items-start gap-1.5 min-w-0">
                    <Calendar className="w-3.5 h-3.5 text-[var(--req-card-icon-color,#3b82f6)] flex-shrink-0" />
                    <span className="break-words leading-[14px]">{opp.posted}</span>
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
                    <span className="break-words leading-[14px]">{opp.duration}</span>
                  </span>
                </div>
              </div>

              <div className="req-card-col lg:col-span-4 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col  py-0.5 min-w-0">
                <div className="flex flex-col gap-1">
                  <span className="req-card-label">Primary Skills</span>
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

                <div className="flex flex-col gap-1 mt-2">
                  <span className="req-card-label">Secondary Skills</span>
                  {opp.secondarySkills && opp.secondarySkills.length > 0 ? (
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

              {/* Column 3: Experience, Rate Offered & Certifications */}
              <div className="req-card-col lg:col-span-3 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-between py-0.5 min-w-0 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="req-card-label">Experience</span>
                  <div className="flex items-center gap-1 req-card-value">
                    <Briefcase className="w-4 h-4 text-[var(--req-card-icon-color,#3b82f6)]" />
                    <span className="truncate">{opp.experience}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="req-card-label">Rate Offered</span>
                  <div className="flex items-center gap-1 req-card-value">
                    <span className="truncate  font-semibold">
                      {formatRateRange({ amount: opp.budget })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="req-card-label">Certifications</span>
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
                  <DashButton
                    variant="primary"
                    className="flex-1 text-xs font-semibold py-2 h-auto flex items-center justify-center gap-1.5 shadow-sm rounded-xl"
                    onClick={() => router.push("/vendor/opportunities")}
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
                          activeActionMenuId === opp.id ? null : opp.id,
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
                              router.push("/vendor/opportunities");
                            }}
                            className="w-full text-left h-auto py-2 px-4 text-xs hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-primary)] flex items-center gap-2 rounded-none font-normal"
                          >
                            <Eye className="w-3.5 h-3.5 text-[var(--dash-text-secondary)]" />
                            <span>View Job Description</span>
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
                    <span className="font-semibold">{opp.positions}</span>
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
                    <span className="font-semibold ">
                      {opp.proposedCandidates || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
