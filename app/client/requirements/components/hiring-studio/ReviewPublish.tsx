"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Calendar,
  Users,
  Clock,
  Coins,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Send,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Building2,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Progress } from "@/app/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { FormCard } from "@/app/onboarding/components/FormCard";
import { SectionHeading } from "@/app/components/ui/section-heading";
import { InputField } from "@/app/onboarding/components/InputField";
import { TagInputField } from "@/app/onboarding/components/TagInputField";
import { TextareaField } from "@/app/onboarding/components/TextareaField";
import { CheckboxField } from "@/app/onboarding/components/CheckboxField";
import { LocationAutocomplete } from "@/app/components/LocationAutocomplete";
import { Robot } from "./Robot";
import type { Answers, JDDraft } from "./types";
import {
  LEGAL_REGISTRATION_DOCS,
  INSURANCE_OPTIONS,
  CERTIFICATION_OPTIONS,
} from "@/app/onboarding/data/constants";
import {
  buildInitialFormData,
  ReviewPublishFormData,
  EXPERIENCE_OPTIONS,
  INDUSTRY_OPTIONS,
  EDUCATION_OPTIONS,
  PREFERRED_EDUCATION_OPTIONS,
  CERTIFICATION_SUGGESTIONS,
  WORK_MODE_OPTIONS,
  SHIFT_OPTIONS,
  BUDGET_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  TIME_OPTIONS,
} from "./review-publish.types";
import { validateReviewPublishForm } from "./review-publish.schema";

interface NavSectionItem {
  id: string;
  number: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_SECTIONS: NavSectionItem[] = [
  { id: "basic-details", number: 1, label: "Basic Details", icon: Briefcase },
  {
    id: "qualification-certifications",
    number: 2,
    label: "Qualification & Certifications",
    icon: GraduationCap,
  },
  {
    id: "engagement-timeline",
    number: 3,
    label: "Engagement & Timeline",
    icon: Calendar,
  },
  { id: "hiring-process", number: 4, label: "Hiring Process", icon: Users },
  { id: "work-schedule", number: 5, label: "Work Schedule", icon: Clock },
  { id: "budget", number: 6, label: "Budget", icon: Coins },
  {
    id: "job-description",
    number: 7,
    label: "Job Description",
    icon: FileText,
  },
  {
    id: "compliance-insurance",
    number: 8,
    label: "Compliance & Insurance",
    icon: ShieldCheck,
  },
];

const SECTION_FIELDS: Record<string, string[]> = {
  "basic-details": [
    "basicDetails.jobTitle",
    "basicDetails.experience",
    "basicDetails.primarySkills",
    "basicDetails.secondarySkills",
    "basicDetails.industryDomain",
  ],
  "qualification-certifications": [
    "qualification.minimumEducation",
    "qualification.preferredEducation",
    "qualification.mandatoryCertifications",
  ],
  "engagement-timeline": [
    "engagement.engagementType",
    "engagement.expectedStartDate",
    "engagement.projectDuration",
  ],
  "hiring-process": [
    "hiringProcess.positions",
    "hiringProcess.interviewRounds",
  ],
  "work-schedule": [
    "workSchedule.workMode",
    "workSchedule.location",
    "workSchedule.shiftPreference",
    "workSchedule.startTime",
    "workSchedule.endTime",
  ],
  budget: [
    "budget.currency",
    "budget.budgetType",
    "budget.minBudget",
    "budget.maxBudget",
  ],
  "job-description": ["jobDescription.description"],
  "compliance-insurance": [
    "compliance.legalRegistrationDocs",
    "compliance.insuranceRequirements",
    "compliance.companyCertifications",
  ],
};

export function ReviewPublish({
  draft,
  answers,
  onBack,
  onSaveDraft,
  onConfirmPublish,
  savedAt,
}: {
  draft: JDDraft;
  answers?: Answers;
  onBack: () => void;
  onSaveDraft: () => void;
  onConfirmPublish: (data: ReviewPublishFormData) => void;
  savedAt: Date | null;
}) {
  const [formData, setFormData] = useState<ReviewPublishFormData>(() =>
    buildInitialFormData(answers, draft),
  );

  const [activeSectionId, setActiveSectionId] =
    useState<string>("basic-details");
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "publishing" | "done">("idle");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearError = (path: string) => {
    setErrors((prev) => {
      if (!prev[path]) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
  };

  const hasSectionError = (sectionId: string): boolean => {
    const fields = SECTION_FIELDS[sectionId];
    if (!fields || !errors) return false;
    return Object.keys(errors).some((key) =>
      fields.some(
        (f) => key === f || key.startsWith(`${f}.`) || key.startsWith(`${f}[`),
      ),
    );
  };

  /* ── Completeness calculation ── */
  const calculateCompleteness = useCallback(() => {
    let completed = 0;
    const total = 8;

    // 1. Basic Details (Required: Job Title, Experience, Primary Skills, Secondary Skills)
    if (
      formData.basicDetails.jobTitle.trim() &&
      formData.basicDetails.experience.trim() &&
      formData.basicDetails.primarySkills.length > 0 &&
      formData.basicDetails.secondarySkills.length > 0
    ) {
      completed++;
    }

    // 2. Qualification & Certifications (Required: Minimum Education)
    if (formData.qualification.minimumEducation.trim()) {
      completed++;
    }

    // 3. Engagement & Timeline (Required: Engagement Type)
    if (formData.engagement.engagementType) {
      completed++;
    }

    // 4. Hiring Process (Required: Positions, Interview Rounds)
    if (
      Number(formData.hiringProcess.positions) >= 1 &&
      Number(formData.hiringProcess.interviewRounds) >= 1
    ) {
      completed++;
    }

    // 5. Work Schedule (Required: Work Mode, Shift Preference; Location if Onsite/Hybrid)
    if (
      formData.workSchedule.workMode &&
      formData.workSchedule.shiftPreference &&
      (formData.workSchedule.workMode === "Remote" ||
        Boolean(formData.workSchedule.location?.trim()))
    ) {
      completed++;
    }

    // 6. Budget (Required: Currency, Budget Type, Min Budget, Max Budget)
    if (
      formData.budget.currency &&
      formData.budget.budgetType &&
      formData.budget.minBudget &&
      Number(formData.budget.minBudget) > 0 &&
      formData.budget.maxBudget &&
      Number(formData.budget.maxBudget) >= Number(formData.budget.minBudget)
    ) {
      completed++;
    }

    // 7. Job Description (Optional)
    completed++;

    // 8. Compliance & Insurance (Optional)
    completed++;

    return {
      completed,
      total,
      pct: Math.round((completed / total) * 100),
    };
  }, [formData]);

  const stats = calculateCompleteness();

  /* ── Section Scroll-Spy ── */
  useEffect(() => {
    const getScrollEl = (): HTMLElement | null => {
      return (
        scrollContainerRef.current?.closest(".dash-content") ||
        (document.querySelector(".dash-content") as HTMLElement | null)
      );
    };

    const handleScroll = () => {
      if (isUserScrollingRef.current) return;
      const scrollEl = getScrollEl();

      const candidates = NAV_SECTIONS.map((s) => ({
        id: s.id,
        el: document.getElementById(`section-${s.id}`),
      })).filter((c) => Boolean(c.el));

      if (candidates.length === 0) return;

      if (scrollEl) {
        const scrollTop = scrollEl.scrollTop;
        let currentId = candidates[0].id;

        for (const item of candidates) {
          if (!item.el) continue;
          const top = item.el.offsetTop - scrollEl.offsetTop;
          if (scrollTop + 140 >= top) {
            currentId = item.id;
          }
        }

        // If user scrolled to near the bottom, mark the last section active
        if (
          scrollEl.scrollTop + scrollEl.clientHeight >=
          scrollEl.scrollHeight - 80
        ) {
          currentId = candidates[candidates.length - 1].id;
        }

        setActiveSectionId(currentId);
      } else {
        let currentId = candidates[0].id;
        for (const item of candidates) {
          if (!item.el) continue;
          const rect = item.el.getBoundingClientRect();
          if (rect.top <= 140) {
            currentId = item.id;
          }
        }
        setActiveSectionId(currentId);
      }
    };

    const scrollEl = getScrollEl();
    if (scrollEl) {
      scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (scrollEl) scrollEl.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ── Smooth Scroll on Sidebar Click ── */
  const handleNavClick = (id: string) => {
    setActiveSectionId(id);
    isUserScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    const target = document.getElementById(`section-${id}`);
    const scrollEl =
      scrollContainerRef.current?.closest(".dash-content") ||
      (document.querySelector(".dash-content") as HTMLElement | null);

    if (target && scrollEl) {
      const scrollElRect = scrollEl.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const top = scrollEl.scrollTop + (targetRect.top - scrollElRect.top) - 16;
      scrollEl.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    } else if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 700);
  };

  /* ── Helper to toggle item in array ── */
  const toggleArrayItem = (
    array: string[],
    item: string,
    setter: (updated: string[]) => void,
  ) => {
    if (array.includes(item)) {
      setter(array.filter((x) => x !== item));
    } else {
      setter([...array, item]);
    }
  };

  const handlePublish = async () => {
    const result = validateReviewPublishForm(formData, declarationAccepted);

    if (!result.isValid) {
      setErrors(result.errors);

      if (result.firstError) {
        const target =
          document.getElementById(result.firstError.elementId) ||
          document.getElementById(`section-${result.firstError.sectionId}`);

        const scrollEl =
          scrollContainerRef.current?.closest(".dash-content") ||
          (document.querySelector(".dash-content") as HTMLElement | null);

        if (target && scrollEl) {
          const scrollElRect = scrollEl.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          const top =
            scrollEl.scrollTop + (targetRect.top - scrollElRect.top) - 60;
          scrollEl.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        } else if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    setErrors({});
    setState("publishing");
    setTimeout(() => {
      setState("done");
      onConfirmPublish(formData);
    }, 1200);
  };

  if (state === "done") {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-[#cee1f1] bg-white p-10 text-center shadow-card">
        <Robot size={88} className="mx-auto" />
        <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Requirement Published!
        </h3>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          Your hiring requirement for{" "}
          <strong className="text-slate-900 font-semibold">
            {formData.basicDetails.jobTitle}
          </strong>{" "}
          has been published to vetted vendor networks. Matching talent
          submissions will appear directly in your dashboard.
        </p>
        <div className="mt-5 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Requirement Live & Active
          </span>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {/* ── Two Column Layout (Onboarding Design Language) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-6 items-start">
        {/* ── Left Sidebar: Completeness & Sections Nav ── */}
        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start z-10">
          {/* Form Completeness Card */}
          <div className="rounded-2xl border border-[#cee1f1] bg-white p-4 shadow-card space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="form-section-title text-xs font-semibold text-slate-900">
                Form Completeness
              </span>
              <span className="text-sm font-bold text-[#005A9C]">
                {stats.pct}%
              </span>
            </div>
            <Progress value={stats.pct} className="h-1.5" />

            <p className="text-[11px] text-slate-500">
              {stats.completed} of {stats.total} sections reviewed
            </p>

            {savedAt && (
              <p className="text-center text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                Last saved at {savedAt.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Section Navigation Card (Exact Onboarding Look) */}
          <nav aria-label="Requirement sections" className="w-full">
            <div className="rounded-2xl border border-[#cee1f1] bg-white p-3 shadow-card">
              <p className="px-3 pb-2 pt-1 text-xs font-semibold tracking-wider text-slate-400 select-none">
                Sections
              </p>
              <ol className="flex flex-col gap-0.5">
                {NAV_SECTIONS.map((section) => {
                  const isActive = activeSectionId === section.id;
                  const hasError = hasSectionError(section.id);
                  const Icon = section.icon;

                  return (
                    <li key={section.id} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => handleNavClick(section.id)}
                        aria-current={isActive ? "location" : undefined}
                        className={`group w-full flex items-center gap-2.5 rounded-lg text-xs font-medium px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C] cursor-pointer ${
                          isActive
                            ? "bg-[#EFF6FF] text-[#005A9C]"
                            : "text-slate-500 hover:bg-slate-100/70 hover:text-slate-900"
                        }`}
                      >
                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-semibold leading-none select-none transition-colors ${
                            hasError
                              ? "bg-[#ef4444] text-white"
                              : isActive
                                ? "bg-[#005A9C] text-white"
                                : "bg-slate-100 text-slate-500 group-hover:text-slate-900"
                          }`}
                        >
                          {hasError ? "!" : section.number}
                        </span>
                        <span className="text-xs font-medium leading-snug truncate">
                          {section.label}
                        </span>
                        {hasError && (
                          <span className="sr-only">(has errors)</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </nav>
        </aside>

        {/* ── Right Content: Stacked Form Cards (Onboarding Style) ── */}
        <div
          ref={scrollContainerRef}
          className="flex-1 min-w-0 space-y-6"
        >
          {/* ═════════ 1. Basic Details ═════════ */}
          <div id="section-basic-details" className="scroll-mt-4">
            <FormCard>
              <SectionHeading
                title="1. Basic Details"
                icon={<Briefcase className="w-5 h-5 text-[#005A9C]" />}
                description="Core role designation, experience level, domain, and skills"
              />

              <div className="space-y-4">
                <InputField
                  label="Job Title"
                  name="jobTitle"
                  required
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={formData.basicDetails.jobTitle}
                  error={errors["basicDetails.jobTitle"]}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      basicDetails: {
                        ...formData.basicDetails,
                        jobTitle: e.target.value,
                      },
                    });
                    if (e.target.value.trim().length >= 2) {
                      clearError("basicDetails.jobTitle");
                    }
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5" id="field-experience">
                    <label className="inline-flex items-center form-label text-xs font-medium text-slate-700">
                      <span>Experience</span>
                      <span className="text-rose-500 font-bold ml-0.5">*</span>
                    </label>
                    <Select
                      value={formData.basicDetails.experience}
                      onValueChange={(val) => {
                        setFormData({
                          ...formData,
                          basicDetails: {
                            ...formData.basicDetails,
                            experience: val,
                          },
                        });
                        clearError("basicDetails.experience");
                      }}
                    >
                      <SelectTrigger
                        className={`h-[var(--dash-input-height)] text-xs rounded-xl border bg-white ${
                          errors["basicDetails.experience"]
                            ? "!border-red-500 focus:!ring-red-500/20"
                            : "border-slate-300"
                        }`}
                      >
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-xs">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors["basicDetails.experience"] && (
                      <div
                        className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4"
                        role="alert"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {errors["basicDetails.experience"]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="inline-flex items-center form-label text-xs font-medium text-slate-700">
                      <span>Industry Domain</span>
                    </label>
                    <Select
                      value={formData.basicDetails.industryDomain}
                      onValueChange={(val) =>
                        setFormData({
                          ...formData,
                          basicDetails: {
                            ...formData.basicDetails,
                            industryDomain: val,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="h-[var(--dash-input-height)] text-xs rounded-xl border border-slate-300 bg-white">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-xs">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <TagInputField
                  label="Primary Skills"
                  name="primarySkills"
                  required
                  placeholder="Type skill & press Enter (e.g. React, Node.js)"
                  value={formData.basicDetails.primarySkills}
                  error={errors["basicDetails.primarySkills"]}
                  onChange={(skills) => {
                    setFormData({
                      ...formData,
                      basicDetails: {
                        ...formData.basicDetails,
                        primarySkills: skills,
                      },
                    });
                    if (skills.length > 0) {
                      clearError("basicDetails.primarySkills");
                    }
                  }}
                  suggestions={[
                    "React",
                    "Node.js",
                    "TypeScript",
                    "Python",
                    "Java",
                    "Next.js",
                    "PostgreSQL",
                    "AWS",
                  ]}
                  quickAddLabel="Suggested:"
                />

                <TagInputField
                  label="Secondary Skills"
                  name="secondarySkills"
                  required
                  placeholder="Type skill & press Enter (e.g. Docker, Redis)"
                  value={formData.basicDetails.secondarySkills}
                  error={errors["basicDetails.secondarySkills"]}
                  onChange={(skills) => {
                    setFormData({
                      ...formData,
                      basicDetails: {
                        ...formData.basicDetails,
                        secondarySkills: skills,
                      },
                    });
                    if (skills.length > 0) {
                      clearError("basicDetails.secondarySkills");
                    }
                  }}
                  suggestions={[
                    "Docker",
                    "Kubernetes",
                    "GraphQL",
                    "CI/CD",
                    "Redis",
                    "Tailwind CSS",
                    "Kafka",
                  ]}
                  quickAddLabel="Suggested:"
                />
              </div>
            </FormCard>
          </div>

          {/* ═════════ 2. Qualification & Certifications ═════════ */}
          <div
            id="section-qualification-certifications"
            className="scroll-mt-4"
          >
            <FormCard>
              <SectionHeading
                title="2. Qualification & Certifications"
                icon={<GraduationCap className="w-5 h-5 text-[#005A9C]" />}
                description="Educational qualifications and professional certification mandates"
              />

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5" id="field-minimumEducation">
                    <label className="inline-flex items-center form-label text-xs font-medium text-slate-700">
                      <span>Minimum Education</span>
                      <span className="text-rose-500 font-bold ml-0.5">*</span>
                    </label>
                    <Select
                      value={formData.qualification.minimumEducation}
                      onValueChange={(val) => {
                        setFormData({
                          ...formData,
                          qualification: {
                            ...formData.qualification,
                            minimumEducation: val,
                          },
                        });
                        clearError("qualification.minimumEducation");
                      }}
                    >
                      <SelectTrigger
                        className={`h-[var(--dash-input-height)] text-xs rounded-xl border bg-white ${
                          errors["qualification.minimumEducation"]
                            ? "!border-red-500 focus:!ring-red-500/20"
                            : "border-slate-300"
                        }`}
                      >
                        <SelectValue placeholder="Select minimum education" />
                      </SelectTrigger>
                      <SelectContent>
                        {EDUCATION_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-xs">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors["qualification.minimumEducation"] && (
                      <div
                        className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4"
                        role="alert"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {errors["qualification.minimumEducation"]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="inline-flex items-center form-label text-xs font-medium text-slate-700">
                      <span>Preferred Education</span>
                    </label>
                    <Select
                      value={formData.qualification.preferredEducation}
                      onValueChange={(val) =>
                        setFormData({
                          ...formData,
                          qualification: {
                            ...formData.qualification,
                            preferredEducation: val,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="h-[var(--dash-input-height)] text-xs rounded-xl border border-slate-300 bg-white">
                        <SelectValue placeholder="Select preferred education" />
                      </SelectTrigger>
                      <SelectContent>
                        {PREFERRED_EDUCATION_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-xs">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t border-slate-200 my-4" />

                <TagInputField
                  label="Mandatory Certifications"
                  name="mandatoryCertifications"
                  placeholder="Type certification & press Enter"
                  value={formData.qualification.mandatoryCertifications}
                  onChange={(certs) =>
                    setFormData({
                      ...formData,
                      qualification: {
                        ...formData.qualification,
                        mandatoryCertifications: certs,
                      },
                    })
                  }
                  suggestions={CERTIFICATION_SUGGESTIONS}
                  quickAddLabel="Suggested:"
                />
              </div>
            </FormCard>
          </div>

          {/* ═════════ 3. Engagement & Timeline ═════════ */}
          <div id="section-engagement-timeline" className="scroll-mt-4">
            <FormCard>
              <SectionHeading
                title="3. Engagement & Timeline"
                icon={<Calendar className="w-5 h-5 text-[#005A9C]" />}
                description="Contractual engagement model and expected start schedule"
              />

              <div className="space-y-4">
                <div className="space-y-2" id="field-engagementType">
                  <label className="inline-flex items-center form-label text-xs font-medium text-slate-700">
                    <span>Engagement Type (C-C / C-H only)</span>
                    <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        val: "Contract to Contract (C-C)" as const,
                        label: "Contract to Contract (C-C)",
                        desc: "Vendor employee contracted on B2B terms",
                      },
                      {
                        val: "Contract to Hire (C-H)" as const,
                        label: "Contract to Hire (C-H)",
                        desc: "Initial contract with potential conversion",
                      },
                      {
                        val: "Both (C-C / C-H)" as const,
                        label: "Both (C-C / C-H)",
                        desc: "Open to either C-C or C-H models",
                      },
                    ].map((item) => {
                      const selected =
                        formData.engagement.engagementType === item.val;
                      return (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              engagement: {
                                ...formData.engagement,
                                engagementType: item.val,
                              },
                            });
                            clearError("engagement.engagementType");
                          }}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            selected
                              ? "border-[#005A9C] bg-[#EFF6FF] ring-1 ring-[#005A9C]"
                              : errors["engagement.engagementType"]
                                ? "border-red-400 hover:border-red-500 bg-white"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900">
                              {item.label}
                            </span>
                            {selected && (
                              <Check className="w-4 h-4 text-[#005A9C]" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                            {item.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  {errors["engagement.engagementType"] && (
                    <div
                      className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4"
                      role="alert"
                    >
                      <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                      </span>
                      <span className="leading-4">
                        {errors["engagement.engagementType"]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="inline-flex items-center form-label text-xs font-medium text-slate-700">
                      <span>Expected Start Date</span>
                    </label>
                    <Input
                      type="date"
                      name="expectedStartDate"
                      value={
                        /^\d{4}-\d{2}-\d{2}$/.test(
                          formData.engagement.expectedStartDate,
                        )
                          ? formData.engagement.expectedStartDate
                          : new Date().toISOString().split("T")[0]
                      }
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          engagement: {
                            ...formData.engagement,
                            expectedStartDate: e.target.value,
                          },
                        })
                      }
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker();
                        } catch (err) {
                          console.error("showPicker failed: ", err);
                        }
                      }}
                      className="h-[var(--dash-input-height)] text-xs rounded-xl border border-slate-300 bg-white cursor-pointer px-3 text-slate-900 font-medium transition-all focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="inline-flex items-center form-label text-xs font-medium text-slate-700">
                      <span>Project Duration</span>
                      <span className="text-slate-400 font-normal ml-1">
                        (e.g. 3 to 6 months)
                      </span>
                    </label>
                    <Input
                      name="projectDuration"
                      placeholder="e.g. 3 to 6 months"
                      value={formData.engagement.projectDuration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          engagement: {
                            ...formData.engagement,
                            projectDuration: e.target.value,
                          },
                        })
                      }
                      className="h-[var(--dash-input-height)] text-xs rounded-xl border border-slate-300 bg-white px-3 text-slate-900 font-medium transition-all focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20"
                    />
                  </div>
                </div>
              </div>
            </FormCard>
          </div>

          {/* ═════════ 4. Hiring Process ═════════ */}
          <div id="section-hiring-process" className="scroll-mt-4">
            <FormCard>
              <SectionHeading
                title="4. Hiring Process"
                icon={<Users className="w-5 h-5 text-[#005A9C]" />}
                description="Headcount requisitions and interview pipeline structure"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5" id="field-positions">
                  <label className="inline-flex items-center form-label text-xs font-medium text-slate-700">
                    <span>Number of Positions</span>
                    <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <Input
                    type="number"
                    name="positions"
                    min={1}
                    max={20}
                    required
                    placeholder="e.g. 1"
                    value={formData.hiringProcess.positions || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = val === "" ? 0 : parseInt(val, 10);
                      setFormData({
                        ...formData,
                        hiringProcess: {
                          ...formData.hiringProcess,
                          positions: isNaN(num) ? 0 : num,
                        },
                      });
                      if (num >= 1 && num <= 20) {
                        clearError("hiringProcess.positions");
                      }
                    }}
                    className={`h-[var(--dash-input-height)] text-xs rounded-xl border bg-white px-3 text-slate-900 font-medium transition-all ${
                      errors["hiringProcess.positions"]
                        ? "!border-red-500 focus:!ring-red-500/20"
                        : "border-slate-300 focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20"
                    }`}
                  />
                  {errors["hiringProcess.positions"] && (
                    <div
                      className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4"
                      role="alert"
                    >
                      <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                      </span>
                      <span className="leading-4">
                        {errors["hiringProcess.positions"]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5" id="field-interviewRounds">
                  <label className="inline-flex items-center form-label text-xs font-medium text-slate-700">
                    <span>Interview Rounds</span>
                    <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <Input
                    type="number"
                    name="interviewRounds"
                    min={1}
                    max={8}
                    required
                    placeholder="e.g. 2"
                    value={formData.hiringProcess.interviewRounds || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = val === "" ? 0 : parseInt(val, 10);
                      setFormData({
                        ...formData,
                        hiringProcess: {
                          ...formData.hiringProcess,
                          interviewRounds: isNaN(num) ? 0 : num,
                        },
                      });
                      if (num >= 1 && num <= 8) {
                        clearError("hiringProcess.interviewRounds");
                      }
                    }}
                    className={`h-[var(--dash-input-height)] text-xs rounded-xl border bg-white px-3 text-slate-900 font-medium transition-all ${
                      errors["hiringProcess.interviewRounds"]
                        ? "!border-red-500 focus:!ring-red-500/20"
                        : "border-slate-300 focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20"
                    }`}
                  />
                  {errors["hiringProcess.interviewRounds"] && (
                    <div
                      className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4"
                      role="alert"
                    >
                      <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                      </span>
                      <span className="leading-4">
                        {errors["hiringProcess.interviewRounds"]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </FormCard>
          </div>

          {/* ═════════ 5. Work Schedule ═════════ */}
          <div id="section-work-schedule" className="scroll-mt-4">
            <FormCard>
              <SectionHeading
                title="5. Work Schedule"
                icon={<Clock className="w-5 h-5 text-[#005A9C]" />}
                description="Work mode arrangements and daily shift schedule"
              />

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div className="space-y-1.5" id="field-workMode">
                    <label className="inline-flex items-center form-label text-xs font-medium text-slate-700">
                      <span>Work Mode</span>
                      <span className="text-rose-500 font-bold ml-0.5">*</span>
                    </label>
                    <Select
                      value={formData.workSchedule.workMode}
                      onValueChange={(val: "Onsite" | "Hybrid" | "Remote") => {
                        setFormData({
                          ...formData,
                          workSchedule: {
                            ...formData.workSchedule,
                            workMode: val,
                            location:
                              val === "Remote"
                                ? ""
                                : formData.workSchedule.location,
                          },
                        });
                        clearError("workSchedule.workMode");
                        if (val === "Remote") {
                          clearError("workSchedule.location");
                        }
                      }}
                    >
                      <SelectTrigger
                        className={`h-[var(--dash-input-height)] text-xs rounded-xl border bg-white ${
                          errors["workSchedule.workMode"]
                            ? "!border-red-500 focus:!ring-red-500/20"
                            : "border-slate-300"
                        }`}
                      >
                        <SelectValue placeholder="Select work mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {WORK_MODE_OPTIONS.map((mode) => (
                          <SelectItem
                            key={mode}
                            value={mode}
                            className="text-xs"
                          >
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors["workSchedule.workMode"] && (
                      <div
                        className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4"
                        role="alert"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {errors["workSchedule.workMode"]}
                        </span>
                      </div>
                    )}
                  </div>

                  {(formData.workSchedule.workMode === "Onsite" ||
                    formData.workSchedule.workMode === "Hybrid") && (
                    <LocationAutocomplete
                      label="Location"
                      name="location"
                      value={formData.workSchedule.location || ""}
                      onChange={(val) => {
                        setFormData({
                          ...formData,
                          workSchedule: {
                            ...formData.workSchedule,
                            location: val,
                          },
                        });
                        if (val?.trim()) {
                          clearError("workSchedule.location");
                        }
                      }}
                      placeholder="e.g. Bangalore, Karnataka, India"
                      required
                      error={errors["workSchedule.location"]}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div className="space-y-1.5" id="field-shiftPreference">
                    <label className="inline-flex items-center form-label text-xs font-medium text-slate-700">
                      <span>Shift Preference</span>
                      <span className="text-rose-500 font-bold ml-0.5">*</span>
                    </label>
                    <Select
                      value={formData.workSchedule.shiftPreference}
                      onValueChange={(val) => {
                        setFormData({
                          ...formData,
                          workSchedule: {
                            ...formData.workSchedule,
                            shiftPreference: val,
                          },
                        });
                        clearError("workSchedule.shiftPreference");
                      }}
                    >
                      <SelectTrigger
                        className={`h-[var(--dash-input-height)] text-xs rounded-xl border bg-white ${
                          errors["workSchedule.shiftPreference"]
                            ? "!border-red-500 focus:!ring-red-500/20"
                            : "border-slate-300"
                        }`}
                      >
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHIFT_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-xs">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors["workSchedule.shiftPreference"] && (
                      <div
                        className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4"
                        role="alert"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {errors["workSchedule.shiftPreference"]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="inline-flex items-center form-label text-xs font-medium text-slate-700">
                      <span>Shift Timing</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Select
                          value={formData.workSchedule.startTime}
                          onValueChange={(val) =>
                            setFormData({
                              ...formData,
                              workSchedule: {
                                ...formData.workSchedule,
                                startTime: val,
                              },
                            })
                          }
                        >
                          <SelectTrigger className="h-[var(--dash-input-height)] text-xs rounded-xl border border-slate-300 bg-white">
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                          <SelectContent className="max-h-56 bg-white border-slate-200">
                            {TIME_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t} className="text-xs">
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <span className="text-xs text-slate-500 font-medium shrink-0">
                        to
                      </span>

                      <div className="flex-1">
                        <Select
                          value={formData.workSchedule.endTime}
                          onValueChange={(val) =>
                            setFormData({
                              ...formData,
                              workSchedule: {
                                ...formData.workSchedule,
                                endTime: val,
                              },
                            })
                          }
                        >
                          <SelectTrigger className="h-[var(--dash-input-height)] text-xs rounded-xl border border-slate-300 bg-white">
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                          <SelectContent className="max-h-56 bg-white border-slate-200">
                            {TIME_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t} className="text-xs">
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FormCard>
          </div>

          {/* ═════════ 6. Budget ═════════ */}
          <div id="section-budget" className="scroll-mt-4">
            <FormCard>
              <SectionHeading
                title="6. Budget"
                icon={<Coins className="w-5 h-5 text-[#005A9C]" />}
                description="Commercial compensation structure and rate boundaries"
              />

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5" id="field-currency">
                    <label className="inline-flex items-center form-label text-xs font-medium text-slate-700">
                      <span>Currency</span>
                      <span className="text-rose-500 font-bold ml-0.5">*</span>
                    </label>
                    <Select
                      value={formData.budget.currency}
                      onValueChange={(val) => {
                        const opt = CURRENCY_OPTIONS.find(
                          (c) => c.value === val,
                        );
                        setFormData({
                          ...formData,
                          budget: {
                            ...formData.budget,
                            currency: val,
                            currencySymbol: opt?.symbol || "₹",
                          },
                        });
                        clearError("budget.currency");
                      }}
                    >
                      <SelectTrigger
                        className={`h-[var(--dash-input-height)] text-xs rounded-xl border bg-white ${
                          errors["budget.currency"]
                            ? "!border-red-500 focus:!ring-red-500/20"
                            : "border-slate-300"
                        }`}
                      >
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCY_OPTIONS.map((c) => (
                          <SelectItem
                            key={c.value}
                            value={c.value}
                            className="text-xs"
                          >
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors["budget.currency"] && (
                      <div
                        className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4"
                        role="alert"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {errors["budget.currency"]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5" id="field-budgetType">
                    <label className="inline-flex items-center form-label text-xs font-medium text-slate-700">
                      <span>Budget Type</span>
                      <span className="text-rose-500 font-bold ml-0.5">*</span>
                    </label>
                    <Select
                      value={formData.budget.budgetType}
                      onValueChange={(val: "Hourly" | "Per Day" | "Monthly") => {
                        setFormData({
                          ...formData,
                          budget: {
                            ...formData.budget,
                            budgetType: val,
                          },
                        });
                        clearError("budget.budgetType");
                      }}
                    >
                      <SelectTrigger
                        className={`h-[var(--dash-input-height)] text-xs rounded-xl border bg-white ${
                          errors["budget.budgetType"]
                            ? "!border-red-500 focus:!ring-red-500/20"
                            : "border-slate-300"
                        }`}
                      >
                        <SelectValue placeholder="Select budget type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_TYPE_OPTIONS.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="text-xs"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors["budget.budgetType"] && (
                      <div
                        className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4"
                        role="alert"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {errors["budget.budgetType"]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Minimum Budget"
                    name="minBudget"
                    type="number"
                    required
                    placeholder="e.g. 80000"
                    leftIcon={
                      <span className="text-xs font-semibold text-slate-500">
                        {formData.budget.currencySymbol}
                      </span>
                    }
                    value={String(formData.budget.minBudget)}
                    error={errors["budget.minBudget"]}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        budget: {
                          ...formData.budget,
                          minBudget: e.target.value,
                        },
                      });
                      if (e.target.value.trim().length > 0) {
                        clearError("budget.minBudget");
                        clearError("budget.maxBudget");
                      }
                    }}
                  />

                  <InputField
                    label="Maximum Budget"
                    name="maxBudget"
                    type="number"
                    required
                    placeholder="e.g. 120000"
                    leftIcon={
                      <span className="text-xs font-semibold text-slate-500">
                        {formData.budget.currencySymbol}
                      </span>
                    }
                    value={String(formData.budget.maxBudget)}
                    error={errors["budget.maxBudget"]}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        budget: {
                          ...formData.budget,
                          maxBudget: e.target.value,
                        },
                      });
                      if (e.target.value.trim().length > 0) {
                        clearError("budget.maxBudget");
                      }
                    }}
                  />
                </div>
              </div>
            </FormCard>
          </div>

          {/* ═════════ 7. Job Description ═════════ */}
          <div id="section-job-description" className="scroll-mt-4">
            <FormCard>
              <SectionHeading
                title="7. Job Description"
                icon={<FileText className="w-5 h-5 text-[#005A9C]" />}
                description="Provide a detailed description of the role, including responsibilities, expectations, technologies, and project overview."
              />

              <TextareaField
                name="jdDescription"
                label="Detailed Role Overview & Deliverables"
                rows={9}
                placeholder="Provide a detailed description of the role, including responsibilities, expectations, technologies, and project overview..."
                value={formData.jobDescription.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jobDescription: {
                      description: e.target.value,
                    },
                  })
                }
                helperText="Comprehensive outline used by vendor recruitment teams to screen candidates"
              />
            </FormCard>
          </div>

          {/* ═════════ 8. Compliance & Insurance ═════════ */}
          <div id="section-compliance-insurance" className="scroll-mt-4">
            <FormCard>
              <SectionHeading
                title="8. Compliance & Insurance"
                icon={<ShieldCheck className="w-5 h-5 text-[#005A9C]" />}
                description="Statutory legal documents, insurances, and company certifications expected from the vendor"
              />

              <div className="space-y-6">
                {/* Section: Legal Docs */}
                <div className="space-y-2" id="field-legalDocs">
                  <CheckboxField
                    label="Legal Registration & Tax Documents"
                    name="toggle-all-docs"
                    checked={LEGAL_REGISTRATION_DOCS.every((d) =>
                      (
                        formData.compliance.legalRegistrationDocs || []
                      ).includes(d.id),
                    )}
                    onChange={(checked) => {
                      setFormData({
                        ...formData,
                        compliance: {
                          ...formData.compliance,
                          legalRegistrationDocs: checked
                            ? LEGAL_REGISTRATION_DOCS.map((d) => d.id)
                            : [],
                        },
                      });
                    }}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-8">
                    {LEGAL_REGISTRATION_DOCS.map((doc) => (
                      <CheckboxField
                        key={doc.id}
                        label={doc.label}
                        name={`doc-${doc.id}`}
                        checked={(
                          formData.compliance.legalRegistrationDocs || []
                        ).includes(doc.id)}
                        onChange={(checked) => {
                          const current =
                            formData.compliance.legalRegistrationDocs || [];
                          setFormData({
                            ...formData,
                            compliance: {
                              ...formData.compliance,
                              legalRegistrationDocs: checked
                                ? [...current, doc.id]
                                : current.filter((id) => id !== doc.id),
                            },
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Section: Insurance */}
                <div className="space-y-2" id="field-insurance">
                  <CheckboxField
                    label="Insurance"
                    name="toggle-all-insurance"
                    checked={INSURANCE_OPTIONS.every((i) =>
                      (
                        formData.compliance.insuranceRequirements || []
                      ).includes(i.id),
                    )}
                    onChange={(checked) => {
                      setFormData({
                        ...formData,
                        compliance: {
                          ...formData.compliance,
                          insuranceRequirements: checked
                            ? INSURANCE_OPTIONS.map((i) => i.id)
                            : [],
                        },
                      });
                    }}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-8">
                    {INSURANCE_OPTIONS.map((ins) => (
                      <CheckboxField
                        key={ins.id}
                        label={ins.label}
                        name={`ins-${ins.id}`}
                        checked={(
                          formData.compliance.insuranceRequirements || []
                        ).includes(ins.id)}
                        onChange={(checked) => {
                          const current =
                            formData.compliance.insuranceRequirements || [];
                          setFormData({
                            ...formData,
                            compliance: {
                              ...formData.compliance,
                              insuranceRequirements: checked
                                ? [...current, ins.id]
                                : current.filter((id) => id !== ins.id),
                            },
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Section: Company Certifications */}
                <div className="pt-2 border-t border-slate-100">
                  <TagInputField
                    label="Company Certifications"
                    name="companyCertifications"
                    placeholder="Type certification & press Enter"
                    value={formData.compliance.companyCertifications}
                    onChange={(certs) =>
                      setFormData({
                        ...formData,
                        compliance: {
                          ...formData.compliance,
                          companyCertifications: certs,
                        },
                      })
                    }
                    suggestions={CERTIFICATION_OPTIONS}
                    helperText="Select or type company certifications required from the vendor (e.g. ISO 27001, SOC 2)"
                  />
                </div>
              </div>
            </FormCard>
          </div>

          {/* ═════════ Declaration Card (Exact Onboarding Style) ═════════ */}
          <div id="section-declaration">
            <FormCard
              className={`!p-4 sm:!py-3.5 sm:!px-6 transition-all duration-200 ${
                errors.declarationAccepted ? "!border-red-500 bg-red-50/10" : ""
              }`}
            >
              <div id="field-declarationAccepted">
                <label
                  htmlFor="declarationAccepted"
                  className="cursor-pointer select-none block"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <input
                      type="checkbox"
                      id="declarationAccepted"
                      name="declarationAccepted"
                      checked={declarationAccepted}
                      onChange={(e) => {
                        setDeclarationAccepted(e.target.checked);
                        if (e.target.checked) clearError("declarationAccepted");
                      }}
                      className={`h-4 w-4 rounded border-slate-300 accent-[#005A9C] text-[#005A9C] focus:ring-[#005A9C] cursor-pointer flex-shrink-0 ${
                        errors.declarationAccepted ? "!border-red-500" : ""
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-900">
                      Declaration
                    </span>
                    <span className="text-rose-500 font-bold ml-0.5 text-xs">
                      *
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6.5">
                    I confirm that the requirement details, commercial budget
                    parameters, and candidate evaluation criteria provided above
                    are accurate and authorized. I agree to publish this
                    requirement to vetted vendor partners in accordance with the
                    platform Terms of Service and Privacy Policy.
                  </p>
                </label>
              </div>
              {errors.declarationAccepted && (
                <div
                  id="error-declarationAccepted"
                  className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-2 pl-1 leading-4"
                  role="alert"
                >
                  <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                  </span>
                  <span className="leading-4">
                    {errors.declarationAccepted}
                  </span>
                </div>
              )}
            </FormCard>
          </div>

          {/* ═════════ Bottom Actions (Publish & Save as Draft) ═════════ */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 pb-2">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto h-10 px-5 !rounded-xl gap-2 text-xs font-semibold border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer shadow-sm transition-all"
              onClick={onSaveDraft}
            >
              <Save className="h-3.5 w-3.5 text-slate-400" /> Save as Draft
            </Button>

            <Button
              type="button"
              disabled={state === "publishing"}
              className="w-full sm:w-auto h-10 px-6 !rounded-xl bg-[#005A9C] hover:bg-[#004A82] text-white gap-2 text-xs font-bold cursor-pointer transition-all shadow-sm hover:shadow"
              onClick={handlePublish}
            >
              {state === "publishing" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Publish Requirement
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
