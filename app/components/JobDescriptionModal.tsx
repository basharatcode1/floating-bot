"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { DashButton } from "@/app/components/ui/dash-button";
import { SkillBadgeOverflow } from "@/app/components/ui/skill-badge-overflow";
import { CertificatePopover } from "@/app/client/requirements/components/CertificatePopover";
import { formatRateRange } from "@/app/lib/rate-format";
import { downloadJDPDF } from "@/app/lib/generate-jd-pdf";
import {
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  Users,
  Eye,
  Download,
  UserPlus,
  Building2,
} from "lucide-react";

export interface JobDescriptionRequirement {
  id: number | string;
  title: string;
  status?: string;
  client?: string;
  location?: string;
  type?: string;
  timezone?: string;
  date?: string;
  candidates?: number | string;
  description?: string;
  skills?: string[];
  secondarySkills?: string[];
  experience?: string;
  positions?: number | string;
  budget?: number | string;
  budgetType?: any;
  certificates?: string[] | null;
  certificate?: string | null;
  interviewRounds?: number | string;
  duration?: string;
  education?: string;
  industry?: string;
  startDate?: string;
  complianceRequirements?: {
    complianceStatus?: string;
    legalRegistrationDocs?: string[];
    insuranceRequirements?: string[];
    companyCertifications?: string[];
  };
  jdLink?: string | boolean;
  isHot?: boolean;
  jd_summary?: string;
  inferred_fields?: string[] | null;
  location_city?: string | null;
  location_state?: string | null;
  location_country?: string | null;
  work_mode?: string | null;
}

export type JobDescriptionVariant =
  | "client"
  | "client-submissions"
  | "vendor-opportunity"
  | "vendor-submission";

export interface JobDescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requirement: JobDescriptionRequirement | null;
  variant?: JobDescriptionVariant;
  themeMode?: string;
  onDownloadPDF?: (req: JobDescriptionRequirement) => void;
  onProposeCandidate?: (req: JobDescriptionRequirement) => void;
}

export function JobDescriptionModal({
  open,
  onOpenChange,
  requirement,
  variant = "client",
  themeMode,
  onDownloadPDF,
  onProposeCandidate,
}: JobDescriptionModalProps) {
  const mode = themeMode;

  if (!requirement) return null;

  const handleDownload = () => {
    if (onDownloadPDF) {
      onDownloadPDF(requirement);
    } else {
      downloadJDPDF({
        ...requirement,
        skills: requirement.skills || [],
        budget:
          requirement.budget !== undefined
            ? String(requirement.budget)
            : undefined,
        positions:
          typeof requirement.positions === "number"
            ? requirement.positions
            : Number(requirement.positions) || undefined,
        candidates:
          typeof requirement.candidates === "number"
            ? requirement.candidates
            : Number(requirement.candidates) || undefined,
        interviewRounds:
          typeof requirement.interviewRounds === "number"
            ? requirement.interviewRounds
            : Number(requirement.interviewRounds) || undefined,
        jdLink:
          typeof requirement.jdLink === "string"
            ? requirement.jdLink
            : undefined,
        status: requirement.status as any,
      });
    }
  };

  const isVendorOpp = variant === "vendor-opportunity";
  const isVendorSub = variant === "vendor-submission";
  const isClientSub = variant === "client-submissions";

  const idPrefix = isVendorOpp ? "JD" : "REQ";
  const headerSubtitle = isVendorOpp
    ? "Detailed view of client requirement specification."
    : "Detailed view of the requirement specification.";

  const aboutRoleText =
    requirement.description ||
    requirement.jd_summary ||
    `We are looking for a highly skilled ${requirement.title} to join our dynamic team. The ideal candidate will have strong technical expertise, excellent problem-solving skills, and a passion for building scalable solutions. You will collaborate with cross-functional teams to design, develop, and deploy high-quality software products.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-dashboard-theme={mode}
        data-lenis-prevent
        className="max-h-[90vh] overflow-y-auto max-w-2xl p-6 border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-[var(--dash-text-primary)]"
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-[16px] sm:text-lg font-bold flex justify-between items-center pr-4">
            Job Description
          </DialogTitle>
          <DialogDescription className="text-small-xs sm:text-xs text-[var(--dash-text-secondary)]">
            {headerSubtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Top Metadata Header */}
          <div className="space-y-2.5 border-b border-[var(--dash-divider)]/40 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-[10px] font-bold text-[var(--accent-primary)] capitalize tracking-wider bg-[var(--accent-primary)]/10 w-fit px-2 py-0.5 rounded-md">
                {idPrefix}-{String(requirement.id).padStart(4, "0")}
              </div>
              {isVendorOpp && requirement.isHot && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md capitalize tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Hot
                </span>
              )}
              {requirement.status && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize tracking-wider ${
                    requirement.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : requirement.status === "On Hold"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {requirement.status}
                </span>
              )}
            </div>

            <h2 className="text-[16px] sm:text-lg font-bold text-[var(--dash-text-primary)]">
              {requirement.title}
            </h2>

            {requirement.client && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>{requirement.client}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-small-xs sm:text-xs text-[var(--dash-text-secondary)]">
              {requirement.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--dash-text-muted)]" />{" "}
                  {requirement.location}
                </span>
              )}
              {requirement.type && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[var(--dash-text-muted)]" />{" "}
                  {requirement.type}
                </span>
              )}
              {requirement.timezone && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--dash-text-muted)]" />{" "}
                  {requirement.timezone}
                </span>
              )}
              {requirement.date && (
                <>
                  <span className="text-[var(--dash-text-muted)] hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--dash-text-muted)]" />{" "}
                    Posted: {requirement.date}
                  </span>
                </>
              )}
              {requirement.candidates !== undefined && (
                <>
                  <span className="text-[var(--dash-text-muted)] hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[var(--dash-text-muted)]" />{" "}
                    {requirement.candidates} Candidates
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* About the Role */}
            <div>
              <h3 className="text-small-xs sm:text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                About the Role
              </h3>
              <p className="text-small-xs sm:text-xs text-[var(--dash-text-secondary)] leading-relaxed whitespace-pre-line">
                {aboutRoleText}
              </p>
            </div>

            {/* Primary Skills */}
            {requirement.skills && requirement.skills.length > 0 && (
              <div>
                <h3 className="text-small-xs sm:text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                  Primary Skills
                </h3>
                <SkillBadgeOverflow
                  skills={requirement.skills}
                  visibleCount={isVendorOpp ? 4 : 10}
                />
              </div>
            )}

            {/* Secondary Skills */}
            {requirement.secondarySkills && requirement.secondarySkills.length > 0 && (
              <div>
                <h3 className="text-small-xs sm:text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                  Secondary Skills
                </h3>
                <SkillBadgeOverflow
                  skills={requirement.secondarySkills}
                  visibleCount={10}
                />
              </div>
            )}

            {/* Other Details Grid */}
            <div>
              <h3 className="text-small-xs sm:text-xs font-semibold text-[var(--dash-text-primary)] mb-1.5">
                Other Details
              </h3>
              <div
                className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl ${
                  isVendorOpp
                    ? "bg-[var(--dash-card-hover)] border border-[var(--dash-card-border)]"
                    : "bg-[var(--dash-bg-tertiary)]"
                }`}
              >
                <div>
                  <span className="block text-tiny sm:text-[10px] capitalize text-[var(--dash-text-muted)] font-bold mb-0.5 sm:mb-1">
                    Experience
                  </span>
                  <span className="text-small-xs sm:text-xs font-medium text-[var(--dash-text-primary)]">
                    {requirement.experience || "Not Specified"}
                  </span>
                </div>

                <div>
                  <span className="block text-tiny sm:text-[10px] capitalize text-[var(--dash-text-muted)] font-bold mb-0.5 sm:mb-1">
                    {isVendorOpp ? "Open Positions" : "Positions"}
                  </span>
                  <span className="text-small-xs sm:text-xs font-medium text-[var(--dash-text-primary)]">
                    {requirement.positions}
                  </span>
                </div>

                <div>
                  <span className="block text-tiny sm:text-[10px] capitalize text-[var(--dash-text-muted)] font-bold mb-0.5 sm:mb-1">
                    {isVendorOpp ? "Rate Offered" : "Budget"}
                  </span>
                  <span
                    className={`text-small-xs sm:text-xs font-medium ${
                      isVendorOpp ? "text-emerald-500 font-bold" : "text-[var(--dash-text-primary)]"
                    }`}
                  >
                    {formatRateRange({
                      amount:
                        requirement.budget !== undefined
                          ? String(requirement.budget)
                          : undefined,
                      period: requirement.budgetType,
                    })}
                  </span>
                </div>

                <div>
                  <span className="block text-tiny sm:text-[10px] capitalize text-[var(--dash-text-muted)] font-bold mb-0.5 sm:mb-1">
                    Certifications
                  </span>
                  {isVendorSub ? (
                    <span className="text-small-xs sm:text-xs font-semibold text-[var(--dash-text-primary)]">
                      {requirement.certificate || "None"}
                    </span>
                  ) : (
                    <div className="mt-0.5 sm:mt-1">
                      <CertificatePopover
                        certificates={requirement.certificates}
                        singleCertificate={requirement.certificate}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <span className="block text-tiny sm:text-[10px] capitalize text-[var(--dash-text-muted)] font-bold mb-0.5 sm:mb-1">
                    Interviews
                  </span>
                  <span className="text-small-xs sm:text-xs font-medium text-[var(--dash-text-primary)]">
                    {requirement.interviewRounds
                      ? `${requirement.interviewRounds} Rounds`
                      : "3 Rounds"}
                  </span>
                </div>

                <div className={isVendorSub ? "col-span-2" : ""}>
                  <span className="block text-tiny sm:text-[10px] capitalize text-[var(--dash-text-muted)] font-bold mb-0.5 sm:mb-1">
                    {isVendorOpp ? "Project Duration" : "Project Timeline"}
                  </span>
                  <span className="text-small-xs sm:text-xs font-medium text-[var(--dash-text-primary)]">
                    {requirement.duration || "6 Months"}
                  </span>
                </div>

                <div>
                  <span className="block text-tiny sm:text-[10px] capitalize text-[var(--dash-text-muted)] font-bold mb-0.5 sm:mb-1">
                    Education
                  </span>
                  <span className="text-small-xs sm:text-xs font-medium text-[var(--dash-text-primary)]">
                    {requirement.education || "Bachelor's Degree"}
                  </span>
                </div>

                {!isVendorSub && !isVendorOpp && (
                  <div>
                    <span className="block text-tiny sm:text-[10px] capitalize text-[var(--dash-text-muted)] font-bold mb-0.5 sm:mb-1">
                      Industry
                    </span>
                    <span className="text-small-xs sm:text-xs font-medium text-[var(--dash-text-primary)]">
                      {requirement.industry || "IT & Software"}
                    </span>
                  </div>
                )}

                {isVendorOpp && (
                  <div>
                    <span className="block text-tiny sm:text-[10px] capitalize text-[var(--dash-text-muted)] font-bold mb-0.5 sm:mb-1">
                      Expected Start
                    </span>
                    <span className="text-small-xs sm:text-xs font-medium text-[var(--dash-text-primary)]">
                      {requirement.startDate || "Immediate"}
                    </span>
                  </div>
                )}

                {!isVendorSub && !isVendorOpp && (
                  <div>
                    <span className="block text-tiny sm:text-[10px] capitalize text-[var(--dash-text-muted)] font-bold mb-0.5 sm:mb-1">
                      Expected Start Date
                    </span>
                    <span className="text-small-xs sm:text-xs font-medium text-[var(--dash-text-primary)]">
                      {requirement.startDate || "1 April 2026"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Compliance & Insurance Check */}
            {!isVendorSub &&
              requirement.complianceRequirements &&
              requirement.complianceRequirements.complianceStatus === "yes" && (
                <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-[var(--dash-divider)]/40">
                  <h3 className="text-small-xs sm:text-xs font-semibold text-[var(--dash-text-primary)] mb-2">
                    Compliance &amp; Insurance Check
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {requirement.complianceRequirements.legalRegistrationDocs &&
                      requirement.complianceRequirements.legalRegistrationDocs.length > 0 && (
                        <div>
                          <span className="block text-[10px] sm:text-xs capitalize text-[var(--dash-text-muted)] font-bold mb-1.5 sm:mb-2">
                            Legal Registration & Tax Documents
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {requirement.complianceRequirements.legalRegistrationDocs.map(
                              (doc, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-1.5 text-small-xs sm:text-xs font-semibold text-[var(--dash-text-primary)]"
                                >
                                  <span className="w-1 h-1 rounded-full bg-[var(--dash-text-muted)] shrink-0" />
                                  <span>{doc}</span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {requirement.complianceRequirements.insuranceRequirements &&
                      requirement.complianceRequirements.insuranceRequirements.length > 0 && (
                        <div>
                          <span className="block text-[10px] sm:text-xs capitalize text-[var(--dash-text-muted)] font-bold mb-1.5 sm:mb-2">
                            Insurance
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {requirement.complianceRequirements.insuranceRequirements.map(
                              (ins, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-1.5 text-small-xs sm:text-xs font-semibold text-[var(--dash-text-primary)]"
                                >
                                  <span className="w-1 h-1 rounded-full bg-[var(--dash-text-muted)] shrink-0" />
                                  <span>{ins}</span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {requirement.complianceRequirements.companyCertifications &&
                      requirement.complianceRequirements.companyCertifications.length > 0 && (
                        <div>
                          <span className="block text-[10px] sm:text-xs capitalize text-[var(--dash-text-muted)] font-bold mb-1.5 sm:mb-2">
                            Company Certifications
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {requirement.complianceRequirements.companyCertifications.map(
                              (cert, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-1.5 text-small-xs sm:text-xs font-semibold text-[var(--dash-text-primary)]"
                                >
                                  <span className="w-1 h-1 rounded-full bg-[var(--dash-text-muted)] shrink-0" />
                                  <span>{cert}</span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}

            {/* JD Attachment Link */}
            {requirement.jdLink && (
              <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-[var(--dash-divider)]/40 flex items-center justify-between">
                <span className="text-small-xs sm:text-xs capitalize text-[var(--dash-text-muted)] font-bold">
                  JD Attachment
                </span>
                <button
                  type="button"
                  className="text-small-xs sm:text-xs font-semibold text-[#60A5FA] hover:underline flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent border-0 p-0"
                  onClick={handleDownload}
                >
                  <Eye className="w-3.5 h-3.5" /> View/Download JD Document
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        {isVendorOpp ? (
          <DialogFooter className="mt-6 pt-4 border-t border-[var(--dash-divider)] sm:justify-between flex flex-row items-center gap-2">
            <DashButton
              variant="outline"
              onClick={handleDownload}
              className="gap-1.5 text-xs"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </DashButton>
            <div className="flex items-center gap-2">
              <DashButton
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-xs"
              >
                Close
              </DashButton>
              {onProposeCandidate && (
                <DashButton
                  variant="primary"
                  onClick={() => {
                    onOpenChange(false);
                    onProposeCandidate(requirement);
                  }}
                  className="gap-1.5 text-xs"
                >
                  <UserPlus className="w-4 h-4" />
                  Propose Candidate
                </DashButton>
              )}
            </div>
          </DialogFooter>
        ) : isClientSub ? (
          <DialogFooter className="mt-6 pt-4 border-t border-[var(--dash-divider)] sm:justify-between flex flex-row items-center gap-2">
            <DashButton
              variant="outline"
              onClick={handleDownload}
              className="gap-1.5 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </DashButton>
            <div className="flex items-center gap-2">
              <DashButton
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-xs"
              >
                Close
              </DashButton>
            </div>
          </DialogFooter>
        ) : (
          <DialogFooter className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-[var(--dash-divider)] sm:justify-end">
            <DashButton
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Close
            </DashButton>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
