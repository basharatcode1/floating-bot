"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader2, RotateCcw, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "@/app/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Stepper } from "./Stepper";
import { AssistantIntro, type Path } from "./AssistantIntro";
import { SourceInput, type SourceState } from "./SourceInput";
import { CreateChat } from "./CreateChat";
import { ReviewPublish } from "./ReviewPublish";
import { DemoBadge, Robot } from "./Robot";
import { demoAssembleDraft, splitIntoSections } from "./demo-service";
import {
  emptyDraft,
  type Answers,
  type JDDraft,
  type SectionKey,
} from "./types";
import type { ReviewPublishFormData } from "./review-publish.types";
import type { Requirement } from "../../page";

type View = "intro" | Path;

export function HiringStudio({
  onClose,
  onSuccess,
  onStepChange,
}: {
  onClose: () => void;
  onSuccess: (newReq: Requirement) => void;
  onStepChange?: (step: 1 | 2) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);
  const [view, setView] = useState<View>("intro");
  const [source, setSource] = useState<SourceState>({ file: null, text: "" });
  const [answers, setAnswers] = useState<Answers>({});
  const [qIndex, setQIndex] = useState(0);
  const [draft, setDraft] = useState<JDDraft>(emptyDraft);
  const [hasDraft, setHasDraft] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<{ msg: string; retry: () => void } | null>(
    null,
  );
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const setSection = (k: SectionKey, content: string) =>
    setDraft((d) => ({ ...d, [k]: { content, source: "user" } }));

  async function run(label: string, fn: () => Promise<void>) {
    setBusy(label);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError({
        msg: (e as Error).message || "Something went wrong.",
        retry: () => run(label, fn),
      });
    } finally {
      setBusy(null);
    }
  }

  const fromSource = () => {
    setDraft(splitIntoSections(source.text));
    setHasDraft(true);
    setStep(2);
  };

  const finishChat = () =>
    run("Assembling your job description…", async () => {
      const assembled = await demoAssembleDraft({ ...answers });
      setDraft(assembled);
      setHasDraft(true);
      setStep(2);
    });

  const saveDraft = () => {
    try {
      localStorage.setItem(
        "staffsync-jd-draft",
        JSON.stringify({ draft, answers, savedAt: Date.now() }),
      );
      setSavedAt(new Date());
      toast.success("Draft saved", {
        description: "Stored in this browser session.",
      });
    } catch {
      toast.error("Couldn't save draft", {
        description: "Browser storage is unavailable. Please try again.",
      });
    }
  };

  const handleFinalPublish = (formData?: ReviewPublishFormData) => {
    const today = new Date();
    const formattedDate = `${today.getDate()} ${today.toLocaleString(
      "default",
      {
        month: "long",
      },
    )} ${today.getFullYear()}`;

    if (formData) {
      const isCH = formData.engagement.engagementType.includes("C-H");
      const isCC = formData.engagement.engagementType.includes("C-C");
      const reqType = isCH && isCC ? "C-C/C-H" : isCH ? "C-H" : "C-C";

      const newReq: Requirement = {
        id: Date.now(),
        title: formData.basicDetails.jobTitle || "Senior Software Engineer",
        location:
          formData.workSchedule.workMode === "Remote"
            ? "Remote"
            : formData.workSchedule.location || "Bengaluru, India",
        type: reqType,
        date: formattedDate,
        timezone: `${formData.workSchedule.shiftPreference}${
          formData.workSchedule.startTime && formData.workSchedule.endTime
            ? ` (${formData.workSchedule.startTime} - ${formData.workSchedule.endTime})`
            : ""
        }`,
        skills:
          formData.basicDetails.primarySkills.length > 0
            ? formData.basicDetails.primarySkills
            : ["React", "TypeScript", "Node.js"],
        secondarySkills: formData.basicDetails.secondarySkills,
        budget: `${formData.budget.currencySymbol}${formData.budget.minBudget} - ${formData.budget.currencySymbol}${formData.budget.maxBudget} / ${formData.budget.budgetType}`,
        budgetType:
          formData.budget.budgetType === "Per Day"
            ? "Daywise"
            : (formData.budget.budgetType as "Hourly" | "Monthly"),
        budget_min: Number(formData.budget.minBudget) || 0,
        budget_max: Number(formData.budget.maxBudget) || 0,
        currency: formData.budget.currency,
        positions: Number(formData.hiringProcess.positions) || 1,
        openPositions: Number(formData.hiringProcess.positions) || 1,
        candidates: 0,
        status: "Active",
        interviewRounds: Number(formData.hiringProcess.interviewRounds) || 2,
        education: formData.qualification.minimumEducation,
        duration: formData.engagement.projectDuration || "Flexible",
        experience: formData.basicDetails.experience,
        certificates: formData.qualification.mandatoryCertifications,
        certificate: formData.qualification.mandatoryCertifications[0] || "",
        industry: formData.basicDetails.industryDomain || "Information Technology",
        startDate: formData.engagement.expectedStartDate || "Immediate",
        description: formData.jobDescription.description || "Hiring requirement",
        jd_summary: formData.jobDescription.description || "Hiring requirement",
        work_mode: formData.workSchedule.workMode,
        engagement_type: formData.engagement.engagementType,
        complianceRequirements: {
          complianceStatus:
            formData.compliance.legalRegistrationDocs.length > 0 ||
            formData.compliance.insuranceRequirements.length > 0 ||
            formData.compliance.companyCertifications.length > 0
              ? "yes"
              : "no",
          complianceCertifications: formData.compliance.companyCertifications,
          legalRegistrationDocs: formData.compliance.legalRegistrationDocs,
          insuranceRequirements: formData.compliance.insuranceRequirements,
          companyCertifications: formData.compliance.companyCertifications,
        },
      };

      setTimeout(() => {
        onSuccess(newReq);
        toast.success("Requirement published", {
          description: `“${newReq.title}” is now active and visible to vendors.`,
        });
      }, 1200);
      return;
    }

    // Extract skills from answers or bullet points
    const primarySkills = answers.mandatory
      ? answers.mandatory
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : draft.required.content
          .split("\n")
          .map((l) => l.replace(/^[•\-\*]\s*/, "").trim())
          .filter(Boolean)
          .slice(0, 5);

    const secondarySkills = answers.preferred
      ? answers.preferred
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : draft.preferred.content
          .split("\n")
          .map((l) => l.replace(/^[•\-\*]\s*/, "").trim())
          .filter(Boolean)
          .slice(0, 4);

    const parsedTitle =
      answers.title ||
      draft.overview.content
        .match(/hiring\s+(?:\d+\s+)?([^\.,\(\n]+)/i)?.[1]
        ?.trim() ||
      "Senior Software Engineer";

    const isCH = answers.employment?.includes("C-H") || false;

    const newReq: Requirement = {
      id: Date.now(),
      title: parsedTitle,
      location:
        answers.location ||
        draft.location.content.split("·")[0]?.trim() ||
        "Remote",
      type: isCH ? "C-H" : "C-C",
      date: formattedDate,
      timezone: "Day Shift (9 AM - 6 PM IST)",
      skills:
        primarySkills.length > 0
          ? primarySkills
          : ["React", "TypeScript", "Node.js"],
      secondarySkills: secondarySkills,
      budget: answers.salary || draft.compensation.content || "₹18–25 LPA",
      budgetType: "Monthly",
      positions: parseInt(answers.openings || "1") || 1,
      openPositions: parseInt(answers.openings || "1") || 1,
      candidates: 0,
      status: "Active",
      interviewRounds: parseInt(answers.interviewRounds || "2") || 2,
      education: "Bachelor's Degree in Computer Science or related field",
      duration: "6 Months",
      experience: answers.experience || draft.experience.content || "3–5 years",
      certificates: [],
      industry: "Information Technology",
      startDate: answers.urgency?.includes("Immediate")
        ? "Immediate"
        : "Within 30 Days",
      description: draft.overview.content || "Hiring requirement",
      jd_summary: draft.overview.content || "Hiring requirement",
      work_mode:
        answers.workMode ||
        (draft.location.content.includes("Hybrid")
          ? "Hybrid"
          : draft.location.content.includes("On-site")
            ? "On-site"
            : "Remote"),
      engagement_type: isCH
        ? "Contract to Hire (C-H)"
        : "Contract to Contract (C-C)",
    };

    setTimeout(() => {
      onSuccess(newReq);
      toast.success("Requirement published", {
        description: `“${newReq.title}” is now active and visible to vendors.`,
      });
    }, 1200);
  };

  const back = (to: View) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setView(to)}
      className="mb-3 text-xs gap-1.5 text-[var(--dash-text-secondary,#475569)]"
    >
      <ArrowLeft className="h-3.5 w-3.5" /> Back
    </Button>
  );

  useEffect(() => {
    if (step === 2) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [step, onClose]);

  if (step === 1) {
    return (
      <Dialog
        open={true}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent className="w-[95vw] sm:max-w-[960px] max-h-[92dvh] flex flex-col p-4 sm:p-6 bg-[var(--dash-card-bg-solid,#ffffff)] border border-[var(--dash-card-border,#e2e8f0)] !rounded-3xl shadow-2xl overflow-hidden">
          <DialogTitle className="sr-only">
            Create Hiring Requirement
          </DialogTitle>
          <DialogDescription className="sr-only">
            Build a clear job description with StaffSync AI, then review and
            publish it to your vendors.
          </DialogDescription>

          <div className="w-full text-[var(--dash-text-primary,#0f172a)] flex flex-col flex-1 min-h-0 animate-in fade-in duration-200">
            {/* Title & Stepper Header Row */}
            <div className="shrink-0 mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pr-8 sm:pr-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--dash-heading-color,#000000)] tracking-tight leading-tight sm:whitespace-nowrap">
                  Create Hiring Requirement
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[var(--dash-text-muted,#64748b)] leading-normal max-w-lg">
                  Build a clear job description with StaffSync AI, then review and
                  publish it to your vendors.
                </p>
              </div>
              <div className="shrink-0 self-start sm:self-center">
                <Stepper step={step} onGo={setStep} canReview={hasDraft} />
              </div>
            </div>

            {/* Scrollable Body for Step 1 content */}
            <div
              className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1 pb-1 custom-scrollbar"
              data-lenis-prevent
            >
              {error && (
                <div
                  role="alert"
                  className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-600 dark:text-red-400"
                >
                  <span>{error.msg}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={error.retry}
                    className="h-7 text-xs gap-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Retry
                  </Button>
                </div>
              )}

              {busy ? (
                <div
                  className="flex flex-col items-center rounded-3xl border border-[var(--dash-card-border,#e2e8f0)] bg-[var(--dash-card-bg-solid,#ffffff)] py-16 text-center shadow-sm"
                  role="status"
                >
                  <Robot size={80} />
                  <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-[var(--dash-text-primary,#0f172a)]">
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--color-primary,#005A9C)]" />
                    {busy}
                  </p>
                  <div className="mt-3">
                    <DemoBadge label="AI synthesis in progress" />
                  </div>
                </div>
              ) : view === "upload" ? (
                <section className="mx-auto max-w-3xl">
                  {back("intro")}
                  <div className="rounded-2xl border border-[var(--dash-card-border,#e2e8f0)] bg-[var(--dash-card-bg-solid,#ffffff)] p-4 sm:p-5 shadow-sm">
                    <SourceInput
                      value={source}
                      onChange={setSource}
                      onSubmit={fromSource}
                      submitLabel="Continue to Review & Publish"
                    />
                  </div>
                </section>
              ) : view === "create" ? (
                <div className="mx-auto max-w-3xl">
                  <CreateChat
                    answers={answers}
                    setAnswers={setAnswers}
                    index={qIndex}
                    setIndex={setQIndex}
                    onDone={finishChat}
                    onExit={() => setView("intro")}
                  />
                </div>
              ) : (
                <>
                  <AssistantIntro onPick={(p) => setView(p)} />
                  {hasDraft && (
                    <p className="mt-3 text-center text-xs text-[var(--dash-text-muted,#64748b)]">
                      You have a draft in progress.{" "}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-semibold text-[var(--dash-accent-text,#005A9C)] underline-offset-2 hover:bg-transparent hover:underline"
                        onClick={() => setStep(2)}
                      >
                        Return to Review & Publish
                      </Button>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="w-full text-[var(--dash-text-primary,#0f172a)] animate-in fade-in duration-200 pt-1 pb-2">
      {/* Title & Stepper Header Row with Close Button */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            Create Hiring Requirement
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-normal">
            Build a clear job description with StaffSync AI, then review and
            publish it to your vendors.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Stepper step={step} onGo={setStep} canReview={hasDraft} />
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Step 2 Review & Publish Full Page */}
      <ReviewPublish
        draft={draft}
        answers={answers}
        onBack={() => setStep(1)}
        onSaveDraft={saveDraft}
        onConfirmPublish={handleFinalPublish}
        savedAt={savedAt}
      />
    </div>
  );
}
