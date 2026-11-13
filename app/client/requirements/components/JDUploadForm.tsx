"use client";

import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import {
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Users,
  Building2,
  GraduationCap,
  ShieldCheck,
  ShieldAlert,
  DollarSign,
  FileCheck,
  Calendar,
  Plus,
  X,
  Check,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { Input } from "@/app/components/ui/input";
import { LocationAutocomplete } from "@/app/components/LocationAutocomplete";
import { DashMultiSelect } from "./DashMultiSelect";
import { DashCheckboxField } from "./DashCheckboxField";
import { Button } from "@/app/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/app/components/ui/textarea";
import { DashButton } from "@/app/components/ui/dash-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { LoadingOverlay } from "@/app/onboarding/components/LoadingOverlay";
import { useDashboardTheme } from "@/app/client/dashboard/DashboardThemeContext";
import { toast } from "@/app/components/ui/toast";

import {
  jdValidationSchema,
  initialJDFormValues,
  validateWithZod,
  JDFormValues,
} from "../schemas/jd.schema";
import { parseJDText } from "../utils/jdParser";
import { DomainSelectSearch } from "./DomainSelectSearch";
import { CERTIFICATIONS } from "./CertificationSelectSearch";
import {
  COMPLIANCE_CERTIFICATIONS,
  INSURANCE_OPTIONS,
  LEGAL_REGISTRATION_DOCS,
  CERTIFICATION_OPTIONS,
} from "@/app/onboarding/data/constants";

const getBudgetConfig = (budgetType: string, currency: string) => {
  const symbol = currency.match(/\((.*)\)/)?.[1] || "$";
  const isINR = currency.includes("INR");

  if (isINR) {
    switch (budgetType) {
      case "Hourly":
        return {
          min: 100,
          max: 15000,
          step: 100,
          format: (val: number) => {
            if (val >= 15000) return `${symbol}15k+`;
            if (val >= 1000) return `${symbol}${Math.round(val / 1000)}k`;
            return `${symbol}${val}`;
          },
        };
      case "Daywise":
        return {
          min: 500,
          max: 75000,
          step: 500,
          format: (val: number) => {
            if (val >= 75000) return `${symbol}75k+`;
            if (val >= 1000) return `${symbol}${Math.round(val / 1000)}k`;
            return `${symbol}${val}`;
          },
        };
      case "Monthly":
      default:
        return {
          min: 10000,
          max: 2000000,
          step: 10000,
          format: (val: number) => {
            if (val >= 2000000) return `${symbol}20L+`;
            if (val >= 100000) {
              const lakhs = val / 100000;
              return `${symbol}${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
            }
            if (val >= 1000) return `${symbol}${Math.round(val / 1000)}k`;
            return `${symbol}${val}`;
          },
        };
    }
  } else {
    // For USD, GBP, EUR
    switch (budgetType) {
      case "Hourly":
        return {
          min: 10,
          max: 750,
          step: 5,
          format: (val: number) => {
            if (val >= 750) return `${symbol}750+`;
            return `${symbol}${val}`;
          },
        };
      case "Daywise":
        return {
          min: 50,
          max: 7500,
          step: 50,
          format: (val: number) => {
            if (val >= 7500) return `${symbol}7.5k+`;
            if (val >= 1000) return `${symbol}${(val / 1000).toFixed(1)}k`;
            return `${symbol}${val}`;
          },
        };
      case "Monthly":
      default:
        return {
          min: 1000,
          max: 75000,
          step: 500,
          format: (val: number) => {
            if (val >= 75000) return `${symbol}75k+`;
            if (val >= 1000) return `${symbol}${Math.round(val / 1000)}k`;
            return `${symbol}${val}`;
          },
        };
    }
  }
};

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

// Helper to find the first error path in a nested errors object
const getFirstErrorPath = (obj: any, prefix = ""): string | null => {
  if (!obj || typeof obj !== "object") return null;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const newPath = prefix ? `${prefix}.${key}` : key;
    if (typeof val === "string") {
      return newPath;
    }
    const deepPath = getFirstErrorPath(val, newPath);
    if (deepPath) return deepPath;
  }
  return null;
};

function scrollToFieldError(errorPath: string) {
  if (!errorPath || typeof document === "undefined") return;

  const parts = errorPath.split(".");
  const rootField = parts[0];
  const lastField = parts[parts.length - 1];

  const candidates: (HTMLElement | null)[] = [
    // 1. Exact field container IDs
    document.getElementById(`field-${errorPath}`),
    document.getElementById(`field-${lastField}`),
    document.getElementById(`field-${rootField}`),
    // 2. Element by raw ID
    document.getElementById(errorPath),
    document.getElementById(lastField),
    document.getElementById(rootField),
    // 3. Custom component triggers and inputs
    document.getElementById(`trigger-${errorPath}`),
    document.getElementById(`trigger-${lastField}`),
    document.getElementById(`select-trigger-${errorPath}`),
    document.getElementById(`select-trigger-${lastField}`),
    document.getElementById(`input-${errorPath}`),
    document.getElementById(`input-${lastField}`),
    document.getElementById(`location-input-${errorPath}`),
    document.getElementById(`location-input-${lastField}`),
    // 4. Name attribute
    document.querySelector<HTMLElement>(`[name="${errorPath}"]`),
    document.querySelector<HTMLElement>(`[name="${lastField}"]`),
    // 5. Data-field attribute
    document.querySelector<HTMLElement>(`[data-field="${errorPath}"]`),
    document.querySelector<HTMLElement>(`[data-field="${lastField}"]`),
    document.querySelector<HTMLElement>(`[data-field="${rootField}"]`),
    // 6. Direct error message element
    document.getElementById(`error-${errorPath}`),
    document.getElementById(`error-${lastField}`),
    // 7. Aria-describedby containing error
    document.querySelector<HTMLElement>(`[aria-describedby*="${errorPath}"]`),
    document.querySelector<HTMLElement>(`[aria-describedby*="${lastField}"]`),
  ];

  let target: HTMLElement | null = null;
  for (const c of candidates) {
    if (c) {
      target = c;
      break;
    }
  }

  if (!target) return;

  // If target is an error message div, target its parent wrapper so the whole field is visible
  if (target.id?.startsWith("error-") && target.parentElement) {
    target = target.parentElement;
  }

  try {
    target.scrollIntoView({ behavior: "smooth", block: "center" });

    // Also explicitly scroll any scrollable parent container (e.g. overflow-y-auto modal content)
    let parent = target.parentElement;
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent);
      const isScrollable =
        (style.overflowY === "auto" || style.overflowY === "scroll") &&
        parent.scrollHeight > parent.clientHeight;
      if (isScrollable) {
        const parentRect = parent.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const relativeTop = targetRect.top - parentRect.top;
        const targetScrollTop =
          parent.scrollTop +
          relativeTop -
          parent.clientHeight / 2 +
          targetRect.height / 2;
        parent.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: "smooth",
        });
        break;
      }
      parent = parent.parentElement;
    }
  } catch {
    target.scrollIntoView();
  }

  const focusable = target.matches(
    "input, select, textarea, button, [tabindex]",
  )
    ? target
    : target.querySelector<HTMLElement>(
        "input, select, textarea, button, [tabindex]",
      );
  focusable?.focus?.({ preventScroll: true });
}

interface JDUploadFormProps {
  onSuccess?: (values?: JDFormValues) => void;
  onClose?: () => void;
  isDarkTheme?: boolean;
  initialValues?: JDFormValues;
  mode?: "create" | "edit";
}

export default function JDUploadForm({
  onSuccess,
  onClose,
  initialValues,
  mode = "create",
}: JDUploadFormProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [jdText, setJdText] = useState("");
  const [currentStep, setCurrentStep] = useState<1 | 2>(
    mode === "edit" ? 2 : 1,
  );
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(mode === "edit");
  const { mode: themeMode } = useDashboardTheme();
  const isDark = themeMode === "dark";
  const [primarySkillInput, setPrimarySkillInput] = useState("");
  const [secondarySkillInput, setSecondarySkillInput] = useState("");

  const formik = useFormik<JDFormValues>({
    initialValues: initialValues || initialJDFormValues,
    validate: validateWithZod(jdValidationSchema),
    onSubmit: (values) => {
      // Sync hidden engagementType fields with their form source fields
      values.engagementType.jdTitle = values.basicInfo.jobTitle;
      values.engagementType.location = values.basicInfo.location;
      values.engagementType.positions = values.hiringDetails.positions;
      values.engagementType.postedDate = new Date().toISOString().split("T")[0];
      values.engagementType.status = "Active";
      values.engagementType.budget = `${values.budgetInfo.currency.replace(/\s*\(.*\)/, "")} ${values.budgetInfo.minBudget}-${values.budgetInfo.maxBudget}/${values.budgetInfo.budgetType}`;

      console.log("Submitting JD Requirement:", values);
      toast.success(
        mode === "edit"
          ? "Requirement updated successfully!"
          : "Requirement submitted successfully!",
      );
      if (onSuccess) onSuccess(values);
    },
  });

  const prevSubmitCountRef = useRef(formik.submitCount);

  // Synchronize initial shiftTiming into shiftStartTime and shiftEndTime if needed
  useEffect(() => {
    if (
      formik.values.basicInfo.shiftTiming &&
      !formik.values.basicInfo.shiftStartTime &&
      !formik.values.basicInfo.shiftEndTime
    ) {
      const parts =
        formik.values.basicInfo.shiftTiming.split(/\s*-\s*|\s+to\s+/i);
      if (parts.length >= 2) {
        formik.setFieldValue("basicInfo.shiftStartTime", parts[0].trim());
        formik.setFieldValue("basicInfo.shiftEndTime", parts[1].trim());
      }
    }
  }, [formik.values.basicInfo.shiftTiming]);

  // Scroll to first error field on submission failure
  useEffect(() => {
    if (formik.submitCount > prevSubmitCountRef.current) {
      prevSubmitCountRef.current = formik.submitCount;
      if (!formik.isValid) {
        const firstErrorPath = getFirstErrorPath(formik.errors);
        if (firstErrorPath) {
          setTimeout(() => {
            scrollToFieldError(firstErrorPath);
          }, 100);
        }
      }
    } else {
      prevSubmitCountRef.current = formik.submitCount;
    }
  }, [formik.submitCount, formik.isValid, formik.errors]);

  // Handle PDF Upload / Parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      if (fileExt !== "pdf" && fileExt !== "txt") {
        setFileError(
          "Invalid file type. Only PDF and TXT files are supported.",
        );
        setUploadedFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFileError("File size exceeds the 10MB limit.");
        setUploadedFile(null);
        return;
      }
      setFileError(null);
      setUploadedFile(file);
    }
  };

  const handleNextStep = () => {
    if (uploadedFile) {
      const fileExt =
        uploadedFile.name.split(".").pop()?.toUpperCase() || "PDF";
      triggerAutoParse(`Sample Job Description extracted from uploaded ${fileExt} document: ${uploadedFile.name}.
We are seeking a Senior Full Stack Engineer (React & Node.js) for a Remote / Hybrid C-C role.
Required skills: React, TypeScript, Node.js, Next.js, PostgreSQL.
Shift preference: IST. Experience required: 5+ years. 3 Interview rounds. Budget $50-$80/hr.`);
    } else if (jdText.trim()) {
      triggerAutoParse(jdText);
    }
  };

  const triggerAutoParse = (rawText: string) => {
    setIsParsing(true);
    setParseSuccess(false);

    setTimeout(() => {
      const extracted = parseJDText(rawText);

      // Merge extracted values into Formik state
      formik.setValues((prev) => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          ...extracted.basicInfo,
        },
        hiringDetails: {
          ...prev.hiringDetails,
          ...extracted.hiringDetails,
        },
        engagementType: {
          ...prev.engagementType,
          ...extracted.engagementType,
        },
        qualificationRequirement: {
          ...prev.qualificationRequirement,
          ...extracted.qualificationRequirement,
        },
        budgetInfo: {
          ...prev.budgetInfo,
          ...extracted.budgetInfo,
        },
        jobDescription: {
          ...prev.jobDescription,
          ...extracted.jobDescription,
        },
        projectTimeline: {
          ...prev.projectTimeline,
          ...extracted.projectTimeline,
        },
      }));

      setIsParsing(false);
      setParseSuccess(true);
      setCurrentStep(2);
    }, 1000);
  };

  // Add / Remove Primary Skill tag
  const handleAddPrimarySkill = () => {
    const trimmed = primarySkillInput.trim();
    if (!trimmed) return;
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    const currentSkills = formik.values.basicInfo.primarySkills || [];
    if (!currentSkills.includes(formatted)) {
      formik.setFieldValue("basicInfo.primarySkills", [
        ...currentSkills,
        formatted,
      ]);
    }
    setPrimarySkillInput("");
  };

  const handleRemovePrimarySkill = (skillToRemove: string) => {
    const currentSkills = formik.values.basicInfo.primarySkills || [];
    formik.setFieldValue(
      "basicInfo.primarySkills",
      currentSkills.filter((s) => s !== skillToRemove),
    );
  };

  // Add / Remove Secondary Skill tag
  const handleAddSecondarySkill = () => {
    const trimmed = secondarySkillInput.trim();
    if (!trimmed) return;
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    const currentSkills = formik.values.basicInfo.secondarySkills || [];
    if (!currentSkills.includes(formatted)) {
      formik.setFieldValue("basicInfo.secondarySkills", [
        ...currentSkills,
        formatted,
      ]);
    }
    setSecondarySkillInput("");
  };

  const handleRemoveSecondarySkill = (skillToRemove: string) => {
    const currentSkills = formik.values.basicInfo.secondarySkills || [];
    formik.setFieldValue(
      "basicInfo.secondarySkills",
      currentSkills.filter((s) => s !== skillToRemove),
    );
  };

  // Parse experience string to extract years
  const expStr = formik.values.qualificationRequirement.experience || "";
  let currentYears = "0";

  if (expStr.includes("15+")) {
    currentYears = "15+";
  } else if (expStr.includes("0-6 Month") || expStr.includes("0-6 month")) {
    currentYears = "0";
  } else {
    const yearsMatch = expStr.match(/(\d+)\s*Year/i);
    if (yearsMatch) {
      currentYears = yearsMatch[1];
    }
  }

  const handleExperienceChange = (newYears: string) => {
    const yearsPart =
      newYears === "0"
        ? "0-6 Month"
        : `${newYears} Year${newYears !== "1" && newYears !== "15+" ? "s" : ""}`;
    formik.setFieldValue("qualificationRequirement.experience", yearsPart);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-h-[90vh] overflow-hidden bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] border rounded-xl shadow-xl text-[var(--dash-text-primary)] flex flex-col"
    >
      {/* STEP INDICATOR HEADER */}
      <div className="sticky top-0 z-40 bg-[var(--dash-card-bg-solid)] border-b border-[var(--dash-card-border)] p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${currentStep >= 1 ? "bg-indigo-500 text-white" : "bg-[var(--dash-input-bg)] text-[var(--dash-text-secondary)] border border-[var(--dash-input-border)]"}`}
            >
              1
            </div>
            <span
              className={`text-sm font-medium ${currentStep >= 1 ? "text-[var(--dash-text-primary)]" : "text-[var(--dash-text-secondary)]"}`}
            >
              Upload JD
            </span>
          </div>
          <div className="w-8 h-px bg-[var(--dash-card-border)] mx-1"></div>
          <div className="flex items-center gap-1.5">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${currentStep === 2 ? "bg-indigo-500 text-white" : "bg-[var(--dash-input-bg)] text-[var(--dash-text-secondary)] border border-[var(--dash-input-border)]"}`}
            >
              2
            </div>
            <span
              className={`text-sm font-medium ${currentStep === 2 ? "text-[var(--dash-text-primary)]" : "text-[var(--dash-text-secondary)]"}`}
            >
              {mode === "edit" ? "Edit Requirement" : "Review & Publish"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentStep === 2 && mode === "create" && (
            <Badge
              variant="outline"
              className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 text-xs gap-1 py-1"
            >
              <Sparkles className="w-3 h-3" /> Auto-Filled
            </Badge>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 opacity-70 transition-all hover:opacity-100 hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-secondary)] hover:text-[var(--dash-text-primary)] focus:outline-none"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[var(--dash-card-border)]">
        {currentStep === 1 && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4 border-b border-[var(--dash-card-border)] pb-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <div>
                  <h2 className="text-sm font-semibold text-[var(--dash-text-primary)] flex items-center gap-2">
                    Auto-Parse Job Description
                    <Badge
                      variant="outline"
                      className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 text-[10px] px-1.5 py-0"
                    >
                      AI Auto-Fill
                    </Badge>
                  </h2>
                  <p className="text-[11px] text-[var(--dash-text-secondary)] mt-0.5">
                    Upload a PDF or paste JD text to automatically extract and
                    pre-fill form fields.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative border-2 border-dashed border-[var(--dash-input-border)] hover:border-indigo-500/50 rounded-xl p-5 text-center transition-all bg-[var(--dash-input-bg)] group mb-4">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center gap-1.5">
                <div className="p-2.5 rounded-full bg-[var(--dash-card-border)] group-hover:bg-indigo-500/20 text-[var(--dash-text-secondary)] group-hover:text-indigo-400 transition-all">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-[var(--dash-text-primary)]">
                  {uploadedFile
                    ? uploadedFile.name
                    : "Drop your JD PDF or TXT here or click to browse"}
                </p>
                <p className="text-[11px] text-[var(--dash-text-secondary)]">
                  Supports PDF, TXT up to 10MB
                </p>
              </div>
            </div>
            {fileError && (
              <p className="text-xs text-red-500 font-medium mb-4 flex items-start gap-1.5 justify-center leading-4">
                <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                </span>
                <span className="leading-4">{fileError}</span>
              </p>
            )}

            <div className="flex items-center gap-4 my-5">
              <div className="h-px bg-[var(--dash-card-border)] flex-1"></div>
              <span className="text-[11px] font-medium text-[var(--dash-text-secondary)] capitalize tracking-wider">
                Or
              </span>
              <div className="h-px bg-[var(--dash-card-border)] flex-1"></div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1.5">
                Paste Job Description
              </label>
              <Textarea
                value={jdText}
                onChange={(e) => {
                  setJdText(e.target.value);
                  if (fileError) setFileError(null);
                }}
                placeholder="Paste your JD text here..."
                className="h-40 resize-none bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs placeholder:text-[var(--dash-text-secondary)]"
              />
            </div>
            {/* Status Indicators */}
            {isParsing && (
              <LoadingOverlay
                loaderText="EXTRACTING"
                message="Extracting details and mapping to form fields..."
                hideBorder={true}
                variant={isDark ? "default" : "light"}
              />
            )}

            {parseSuccess && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  <strong>Success!</strong> Form sections have been auto-filled.
                  Please review and complete any remaining mandatory fields.
                </span>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <>
            {/* ==========================================
                SECTION 1: BASIC INFORMATION
            ========================================== */}
            <div className="p-6">
              <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
                  1. Basic Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Row 1 Wrapper: Job Title, Location Mode, Location */}
                <div
                  className={`md:col-span-2 grid grid-cols-1 gap-4 ${
                    formik.values.basicInfo.locationType === "Remote"
                      ? "md:grid-cols-2"
                      : "md:grid-cols-[1.2fr_1fr_1.8fr]"
                  }`}
                >
                  {/* Job Title */}
                  <div
                    id="field-basicInfo.jobTitle"
                    data-field="basicInfo.jobTitle"
                  >
                    <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                      Job Title <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="input-basicInfo.jobTitle"
                      name="basicInfo.jobTitle"
                      placeholder="e.g. Senior React Developer"
                      value={formik.values.basicInfo.jobTitle}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs ${
                        formik.touched.basicInfo?.jobTitle &&
                        formik.errors.basicInfo?.jobTitle
                          ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                          : ""
                      }`}
                    />
                    {formik.touched.basicInfo?.jobTitle &&
                      formik.errors.basicInfo?.jobTitle && (
                        <p
                          id="error-basicInfo.jobTitle"
                          className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                        >
                          <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                          </span>
                          <span className="leading-4">
                            {formik.errors.basicInfo.jobTitle}
                          </span>
                        </p>
                      )}
                  </div>

                  {/* Location Mode */}
                  <div
                    id="field-basicInfo.locationType"
                    data-field="basicInfo.locationType"
                  >
                    <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                      Location Mode <span className="text-rose-500">*</span>
                    </label>
                    <Select
                      value={formik.values.basicInfo.locationType}
                      onValueChange={(val) => {
                        formik.setFieldValue("basicInfo.locationType", val);
                        if (val === "Remote") {
                          formik.setFieldValue("basicInfo.location", "Remote");
                        } else if (
                          formik.values.basicInfo.location === "Remote"
                        ) {
                          formik.setFieldValue("basicInfo.location", "");
                        }
                      }}
                    >
                      <SelectTrigger
                        id="trigger-basicInfo.locationType"
                        name="basicInfo.locationType"
                        className={`bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs ${
                          formik.touched.basicInfo?.locationType &&
                          formik.errors.basicInfo?.locationType
                            ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                            : ""
                        }`}
                      >
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-xs">
                        <SelectItem value="Onsite">Onsite</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                    {formik.touched.basicInfo?.locationType &&
                      formik.errors.basicInfo?.locationType && (
                        <p
                          id="error-basicInfo.locationType"
                          className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                        >
                          <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                          </span>
                          <span className="leading-4">
                            {formik.errors.basicInfo.locationType}
                          </span>
                        </p>
                      )}
                  </div>

                  {/* Location */}
                  {formik.values.basicInfo.locationType !== "Remote" && (
                    <div
                      id="field-basicInfo.location"
                      data-field="basicInfo.location"
                    >
                      <LocationAutocomplete
                        label="Location"
                        name="basicInfo.location"
                        value={formik.values.basicInfo.location}
                        onChange={(val) =>
                          formik.setFieldValue("basicInfo.location", val)
                        }
                        placeholder="e.g. Bangalore, Karnataka, India"
                        error={
                          formik.touched.basicInfo?.location
                            ? formik.errors.basicInfo?.location
                            : undefined
                        }
                        disabled={false}
                        required
                        className="space-y-0"
                        onlyCity={false}
                        labelClassName="block text-xs font-medium text-[var(--dash-text-primary)] mb-1"
                        inputClassName="h-[var(--dash-input-height)] w-full rounded-xl border bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs pl-11 pr-4 outline-none focus:border-sky-400/60 transition-colors disabled:opacity-50"
                      />
                    </div>
                  )}
                </div>

                {/* Shift */}
                <div id="field-basicInfo.shift" data-field="basicInfo.shift">
                  <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                    Shift Preference <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={formik.values.basicInfo.shift}
                    onValueChange={(val) => {
                      formik.setFieldValue("basicInfo.shift", val);
                      if (!val) {
                        formik.setFieldValue("basicInfo.shiftTiming", "");
                        formik.setFieldValue("basicInfo.shiftStartTime", "");
                        formik.setFieldValue("basicInfo.shiftEndTime", "");
                      }
                    }}
                  >
                    <SelectTrigger
                      id="trigger-basicInfo.shift"
                      name="basicInfo.shift"
                      className={`bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs ${
                        formik.touched.basicInfo?.shift &&
                        formik.errors.basicInfo?.shift
                          ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Shift" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-xs">
                      <SelectItem value="UTC−05:00 (EST): Eastern Standard Time (North America)">
                        UTC−05:00 (EST): Eastern Standard Time
                      </SelectItem>
                      <SelectItem value="UTC−06:00 (CST): Central Standard Time (North America)">
                        UTC−06:00 (CST): Central Standard Time
                      </SelectItem>
                      <SelectItem value="UTC−08:00 (PST): Pacific Standard Time (North America)">
                        UTC−08:00 (PST): Pacific Standard Time
                      </SelectItem>
                      <SelectItem value="UTC+01:00 (CET): Central European Time">
                        UTC+01:00 (CET): Central European Time
                      </SelectItem>
                      <SelectItem value="UTC+05:30 (IST): India Standard Time">
                        UTC+05:30 (IST): India Standard Time
                      </SelectItem>
                      <SelectItem value="UTC+08:00 (CST/SGT): China Standard Time / Singapore Time">
                        UTC+08:00 (CST/SGT): China Standard / Singapore Time
                      </SelectItem>
                      <SelectItem value="UTC +10 (AEST): Australian Eastern Standard Time">
                        UTC +10 (AEST): Australian Eastern Standard Time
                      </SelectItem>
                      <SelectItem value="Rotational Shift">
                        Rotational Shift
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.basicInfo?.shift &&
                    formik.errors.basicInfo?.shift && (
                      <p
                        id="error-basicInfo.shift"
                        className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {formik.errors.basicInfo.shift as string}
                        </span>
                      </p>
                    )}
                </div>

                {/* Shift Timing (Conditional Time Inputs) */}
                {formik.values.basicInfo.shift && (
                  <div
                    id="field-basicInfo.shiftTiming"
                    data-field="basicInfo.shiftTiming"
                  >
                    <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                      Shift Timing{" "}
                      <span className="text-[var(--dash-text-secondary)] font-normal">
                        (Optional)
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Select
                          value={formik.values.basicInfo.shiftStartTime || ""}
                          onValueChange={(val) => {
                            formik.setFieldValue(
                              "basicInfo.shiftStartTime",
                              val,
                            );
                            const end =
                              formik.values.basicInfo.shiftEndTime || "";
                            formik.setFieldValue(
                              "basicInfo.shiftTiming",
                              val && end ? `${val} - ${end}` : val || end || "",
                            );
                          }}
                        >
                          <SelectTrigger
                            id="input-basicInfo.shiftStartTime"
                            className="bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs"
                          >
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                          <SelectContent className="max-h-56 bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                            {Array.from({ length: 48 }, (_, i) => {
                              const h = String(Math.floor(i / 2)).padStart(
                                2,
                                "0",
                              );
                              const m = i % 2 === 0 ? "00" : "30";
                              const t = `${h}:${m}`;
                              return (
                                <SelectItem
                                  key={t}
                                  value={t}
                                  className="text-xs text-[var(--dash-text-primary)]"
                                >
                                  {t}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <span className="text-xs text-[var(--dash-text-secondary)] font-medium shrink-0">
                        to
                      </span>
                      <div className="flex-1">
                        <Select
                          value={formik.values.basicInfo.shiftEndTime || ""}
                          onValueChange={(val) => {
                            formik.setFieldValue("basicInfo.shiftEndTime", val);
                            const start =
                              formik.values.basicInfo.shiftStartTime || "";
                            formik.setFieldValue(
                              "basicInfo.shiftTiming",
                              start && val
                                ? `${start} - ${val}`
                                : start || val || "",
                            );
                          }}
                        >
                          <SelectTrigger
                            id="input-basicInfo.shiftEndTime"
                            className="bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs"
                          >
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                          <SelectContent className="max-h-56 bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)]">
                            {Array.from({ length: 48 }, (_, i) => {
                              const h = String(Math.floor(i / 2)).padStart(
                                2,
                                "0",
                              );
                              const m = i % 2 === 0 ? "00" : "30";
                              const t = `${h}:${m}`;
                              return (
                                <SelectItem
                                  key={t}
                                  value={t}
                                  className="text-xs text-[var(--dash-text-primary)]"
                                >
                                  {t}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {formik.touched.basicInfo?.shiftTiming &&
                      formik.errors.basicInfo?.shiftTiming && (
                        <p
                          id="error-basicInfo.shiftTiming"
                          className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                        >
                          <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                          </span>
                          <span className="leading-4">
                            {formik.errors.basicInfo.shiftTiming as string}
                          </span>
                        </p>
                      )}
                  </div>
                )}

                {/* Primary Skills */}
                <div
                  id="field-basicInfo.primarySkills"
                  data-field="basicInfo.primarySkills"
                  className="md:col-span-2"
                >
                  <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                    Primary Skills <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="input-basicInfo.primarySkills"
                      name="basicInfo.primarySkills"
                      placeholder="Type a primary skill (e.g. React, Node.js) and press Add"
                      value={primarySkillInput}
                      onChange={(e) => setPrimarySkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddPrimarySkill();
                        }
                      }}
                      className={`h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs flex-1 ${
                        formik.touched.basicInfo?.primarySkills &&
                        formik.errors.basicInfo?.primarySkills
                          ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                          : ""
                      }`}
                    />
                    <DashButton
                      type="button"
                      variant="secondary"
                      onClick={handleAddPrimarySkill}
                      className="h-[var(--dash-input-height)] rounded-xl gap-1 text-xs flex items-center justify-center px-4"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </DashButton>
                  </div>

                  <div
                    className={`flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-lg bg-[var(--dash-input-bg)] border border-[var(--dash-card-border)] ${
                      formik.touched.basicInfo?.primarySkills &&
                      formik.errors.basicInfo?.primarySkills
                        ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                        : ""
                    }`}
                  >
                    {formik.values.basicInfo.primarySkills.length === 0 ? (
                      <span className="text-xs text-[var(--dash-text-secondary)] italic">
                        No primary skills added yet
                      </span>
                    ) : (
                      formik.values.basicInfo.primarySkills.map(
                        (skill, index) => (
                          <Badge
                            key={`${skill}-${index}`}
                            variant="secondary"
                            className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] gap-1 text-[11px] py-0.5 px-2 font-normal"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemovePrimarySkill(skill)}
                              className="hover:text-rose-400 text-[var(--dash-text-secondary)]"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </Badge>
                        ),
                      )
                    )}
                  </div>
                  {formik.touched.basicInfo?.primarySkills &&
                    formik.errors.basicInfo?.primarySkills && (
                      <p
                        id="error-basicInfo.primarySkills"
                        className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {typeof formik.errors.basicInfo.primarySkills ===
                          "string"
                            ? formik.errors.basicInfo.primarySkills
                            : "Primary skills are required"}
                        </span>
                      </p>
                    )}
                </div>

                {/* Secondary Skills */}
                <div
                  id="field-basicInfo.secondarySkills"
                  data-field="basicInfo.secondarySkills"
                  className="md:col-span-2"
                >
                  <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                    Secondary Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="input-basicInfo.secondarySkills"
                      name="basicInfo.secondarySkills"
                      placeholder="Type a secondary skill (e.g. Next.js, PostgreSQL) and press Add"
                      value={secondarySkillInput}
                      onChange={(e) => setSecondarySkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSecondarySkill();
                        }
                      }}
                      className={`h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs flex-1 ${
                        formik.touched.basicInfo?.secondarySkills &&
                        formik.errors.basicInfo?.secondarySkills
                          ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                          : ""
                      }`}
                    />
                    <DashButton
                      type="button"
                      variant="secondary"
                      onClick={handleAddSecondarySkill}
                      className="h-[var(--dash-input-height)] rounded-xl gap-1 text-xs flex items-center justify-center px-4"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </DashButton>
                  </div>

                  <div
                    className={`flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-lg bg-[var(--dash-input-bg)] border border-[var(--dash-card-border)] ${
                      formik.touched.basicInfo?.secondarySkills &&
                      formik.errors.basicInfo?.secondarySkills
                        ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                        : ""
                    }`}
                  >
                    {formik.values.basicInfo.secondarySkills.length === 0 ? (
                      <span className="text-xs text-[var(--dash-text-secondary)] italic">
                        No secondary skills added yet
                      </span>
                    ) : (
                      formik.values.basicInfo.secondarySkills.map(
                        (skill, index) => (
                          <Badge
                            key={`${skill}-${index}`}
                            variant="secondary"
                            className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] gap-1 text-[11px] py-0.5 px-2 font-normal"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSecondarySkill(skill)}
                              className="hover:text-rose-400 text-[var(--dash-text-secondary)]"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </Badge>
                        ),
                      )
                    )}
                  </div>
                  {formik.touched.basicInfo?.secondarySkills &&
                    formik.errors.basicInfo?.secondarySkills && (
                      <p
                        id="error-basicInfo.secondarySkills"
                        className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {typeof formik.errors.basicInfo.secondarySkills ===
                          "string"
                            ? formik.errors.basicInfo.secondarySkills
                            : "Secondary skills error"}
                        </span>
                      </p>
                    )}
                </div>
              </div>
            </div>
            {/* ==========================================
          SECTION 2: HIRING DETAILS
      ========================================== */}
            <div className="p-6">
              <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
                  2. Hiring Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  id="field-hiringDetails.interviewRounds"
                  data-field="hiringDetails.interviewRounds"
                >
                  <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                    Interview Rounds <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    id="input-hiringDetails.interviewRounds"
                    type="number"
                    min={1}
                    max={8}
                    name="hiringDetails.interviewRounds"
                    value={formik.values.hiringDetails.interviewRounds}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs ${
                      formik.touched.hiringDetails?.interviewRounds &&
                      formik.errors.hiringDetails?.interviewRounds
                        ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                        : ""
                    }`}
                  />
                  {formik.touched.hiringDetails?.interviewRounds &&
                    formik.errors.hiringDetails?.interviewRounds && (
                      <p
                        id="error-hiringDetails.interviewRounds"
                        className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {formik.errors.hiringDetails.interviewRounds}
                        </span>
                      </p>
                    )}
                </div>

                <div
                  id="field-hiringDetails.positions"
                  data-field="hiringDetails.positions"
                >
                  <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                    Number of Positions <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    id="input-hiringDetails.positions"
                    type="number"
                    min={1}
                    max={20}
                    name="hiringDetails.positions"
                    value={formik.values.hiringDetails.positions}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue(
                        "engagementType.positions",
                        e.target.value,
                      );
                    }}
                    onBlur={formik.handleBlur}
                    className={`rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs ${
                      formik.touched.hiringDetails?.positions &&
                      formik.errors.hiringDetails?.positions
                        ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                        : ""
                    }`}
                  />
                  {formik.touched.hiringDetails?.positions &&
                    formik.errors.hiringDetails?.positions && (
                      <p
                        id="error-hiringDetails.positions"
                        className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {formik.errors.hiringDetails.positions}
                        </span>
                      </p>
                    )}
                </div>
              </div>
            </div>
            {/* ==========================================
          SECTION 3: ENGAGEMENT TYPE
      ========================================== */}
            <div className="p-6">
              <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
                  3. Engagement Type
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                {/* Engagement Model Choice */}
                <div
                  id="field-engagementType.engagementModel"
                  data-field="engagementType.engagementModel"
                >
                  <DashMultiSelect
                    label="Select your engagement models"
                    name="engagementType.engagementModel"
                    options={[
                      "Contract to Contract",
                      "Contract to Hire",
                      "Both",
                    ]}
                    value={formik.values.engagementType.engagementModel || []}
                    onChange={(selected) =>
                      formik.setFieldValue(
                        "engagementType.engagementModel",
                        selected,
                      )
                    }
                    placeholder="Select engagement models..."
                    error={
                      formik.touched.engagementType?.engagementModel &&
                      formik.errors.engagementType?.engagementModel
                        ? String(formik.errors.engagementType.engagementModel)
                        : undefined
                    }
                    required
                    allowCustom={false}
                    selectAllOption={{
                      name: "Both",
                      targets: ["Contract to Contract", "Contract to Hire"],
                    }}
                  />
                </div>
              </div>
            </div>
            {/* ==========================================
          SECTION 4: QUALIFICATION REQUIREMENT
      ========================================== */}
            <div className="p-6">
              <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
                  4. Qualification Requirement
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  id="field-qualificationRequirement.experience"
                  data-field="qualificationRequirement.experience"
                >
                  <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                    Required Experience Level{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={currentYears}
                    onValueChange={(val) => handleExperienceChange(val)}
                  >
                    <SelectTrigger
                      id="trigger-qualificationRequirement.experience"
                      name="qualificationRequirement.experience"
                      className={`bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs ${
                        formik.touched.qualificationRequirement?.experience &&
                        formik.errors.qualificationRequirement?.experience
                          ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Years" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-xs">
                      {Array.from({ length: 16 }, (_, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {i === 0
                            ? "0-6 Month"
                            : `${i} Year${i !== 1 ? "s" : ""}`}
                        </SelectItem>
                      ))}
                      <SelectItem value="15+">15+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.qualificationRequirement?.experience &&
                    formik.errors.qualificationRequirement?.experience && (
                      <p
                        id="error-qualificationRequirement.experience"
                        className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {formik.errors.qualificationRequirement.experience}
                        </span>
                      </p>
                    )}
                </div>

                <div
                  id="field-qualificationRequirement.qualification"
                  data-field="qualificationRequirement.qualification"
                >
                  <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                    Educational Requirements{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={formik.values.qualificationRequirement.qualification}
                    onValueChange={(val) =>
                      formik.setFieldValue(
                        "qualificationRequirement.qualification",
                        val,
                      )
                    }
                  >
                    <SelectTrigger
                      id="trigger-qualificationRequirement.qualification"
                      name="qualificationRequirement.qualification"
                      className={`bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs ${
                        formik.touched.qualificationRequirement
                          ?.qualification &&
                        formik.errors.qualificationRequirement?.qualification
                          ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Educational Qualification" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-xs">
                      <SelectItem value="Bachelor's Degree">
                        Bachelor&apos;s Degree
                      </SelectItem>
                      <SelectItem value="Master's Degree">
                        Master&apos;s Degree
                      </SelectItem>
                      <SelectItem value="Doctorate / Ph.D">
                        Doctorate / Ph.D
                      </SelectItem>
                      <SelectItem value="Diploma">
                        Diploma / Associate Degree
                      </SelectItem>
                      <SelectItem value="Any Graduation">
                        Any Graduation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.qualificationRequirement?.qualification &&
                    formik.errors.qualificationRequirement?.qualification && (
                      <p
                        id="error-qualificationRequirement.qualification"
                        className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {formik.errors.qualificationRequirement.qualification}
                        </span>
                      </p>
                    )}
                </div>

                <div
                  id="field-qualificationRequirement.domain"
                  data-field="qualificationRequirement.domain"
                >
                  <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                    Industry Domain <span className="text-rose-500">*</span>
                  </label>
                  <DomainSelectSearch
                    name="qualificationRequirement.domain"
                    value={formik.values.qualificationRequirement.domain}
                    onChange={(val) =>
                      formik.setFieldValue(
                        "qualificationRequirement.domain",
                        val,
                      )
                    }
                    placeholder="Select or enter industry…"
                    error={
                      formik.touched.qualificationRequirement?.domain &&
                      formik.errors.qualificationRequirement?.domain
                        ? String(formik.errors.qualificationRequirement.domain)
                        : undefined
                    }
                  />
                </div>

                <div
                  id="field-qualificationRequirement.certification"
                  data-field="qualificationRequirement.certification"
                >
                  <DashMultiSelect
                    label="Mandatory Certifications"
                    name="qualificationRequirement.certification"
                    options={CERTIFICATIONS}
                    value={
                      formik.values.qualificationRequirement.certification || []
                    }
                    onChange={(selected) =>
                      formik.setFieldValue(
                        "qualificationRequirement.certification",
                        selected,
                      )
                    }
                    placeholder="Select or enter certification…"
                  />
                </div>
              </div>
            </div>
            {/* ==========================================
          SECTION 5: BUDGET INFORMATION
      ========================================== */}
            <div className="p-6">
              <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
                <DollarSign className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
                  5. Budget Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  id="field-budgetInfo.currency"
                  data-field="budgetInfo.currency"
                >
                  <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                    Currency <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={formik.values.budgetInfo.currency}
                    onValueChange={(val) =>
                      formik.setFieldValue("budgetInfo.currency", val)
                    }
                  >
                    <SelectTrigger
                      id="trigger-budgetInfo.currency"
                      name="budgetInfo.currency"
                      className={`bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs ${
                        formik.touched.budgetInfo?.currency &&
                        formik.errors.budgetInfo?.currency
                          ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-xs">
                      <SelectItem value="INR (₹)">INR (₹)</SelectItem>
                      <SelectItem value="USD ($)">USD ($)</SelectItem>
                      <SelectItem value="EUR (€)">EUR (€)</SelectItem>
                      <SelectItem value="GBP (£)">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.budgetInfo?.currency &&
                    formik.errors.budgetInfo?.currency && (
                      <p
                        id="error-budgetInfo.currency"
                        className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {formik.errors.budgetInfo.currency}
                        </span>
                      </p>
                    )}
                </div>

                <div
                  id="field-budgetInfo.budgetType"
                  data-field="budgetInfo.budgetType"
                >
                  <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                    Budget Type <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={formik.values.budgetInfo.budgetType}
                    onValueChange={(val) =>
                      formik.setFieldValue("budgetInfo.budgetType", val)
                    }
                  >
                    <SelectTrigger
                      id="trigger-budgetInfo.budgetType"
                      name="budgetInfo.budgetType"
                      className={`bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs ${
                        formik.touched.budgetInfo?.budgetType &&
                        formik.errors.budgetInfo?.budgetType
                          ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-xs">
                      <SelectItem value="Hourly">Hourly Rate</SelectItem>
                      <SelectItem value="Monthly">Monthly Salary</SelectItem>
                      <SelectItem value="Daywise">Per Day</SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.budgetInfo?.budgetType &&
                    formik.errors.budgetInfo?.budgetType && (
                      <p
                        id="error-budgetInfo.budgetType"
                        className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {formik.errors.budgetInfo.budgetType}
                        </span>
                      </p>
                    )}
                </div>

                {/* Budget Range / Inputs */}
                <div className="md:col-span-2 space-y-4 bg-[var(--dash-input-bg)] p-5 rounded-xl border border-[var(--dash-card-border)]">
                  {(() => {
                    const config = getBudgetConfig(
                      formik.values.budgetInfo.budgetType,
                      formik.values.budgetInfo.currency,
                    );

                    return (
                      <>
                        <div className="flex items-center justify-between text-xs font-semibold text-[var(--dash-text-primary)]">
                          <span className="flex items-center gap-1.5 text-[var(--dash-text-secondary)] font-medium">
                            <DollarSign className="w-4 h-4 text-indigo-400" />
                            Budget Range:
                          </span>
                          <span className="text-indigo-400 font-bold text-sm">
                            {config.format(formik.values.budgetInfo.minBudget)}{" "}
                            -{" "}
                            {config.format(formik.values.budgetInfo.maxBudget)}
                            <span className="text-xs text-[var(--dash-text-secondary)] font-normal ml-1">
                              (
                              {formik.values.budgetInfo.budgetType === "Daywise"
                                ? "Per Day"
                                : formik.values.budgetInfo.budgetType}
                              )
                            </span>
                          </span>
                        </div>

                        {/* Direct Inputs for Min/Max */}
                        <div className="grid grid-cols-2 gap-4 pt-1">
                          <div
                            id="field-budgetInfo.minBudget"
                            data-field="budgetInfo.minBudget"
                          >
                            <label className="block text-[11px] text-[var(--dash-text-secondary)] mb-1">
                              Minimum Rate
                            </label>
                            <Input
                              id="input-budgetInfo.minBudget"
                              type="number"
                              min="0"
                              name="budgetInfo.minBudget"
                              value={formik.values.budgetInfo.minBudget}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                formik.setFieldValue(
                                  "budgetInfo.minBudget",
                                  val,
                                );
                                formik.setFieldValue(
                                  "engagementType.budget",
                                  `${formik.values.budgetInfo.currency} ${val}-${formik.values.budgetInfo.maxBudget}/${formik.values.budgetInfo.budgetType}`,
                                );
                              }}
                              onBlur={formik.handleBlur}
                              className={`h-10 rounded-xl bg-[var(--dash-card-bg-solid)] border border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs ${
                                formik.touched.budgetInfo?.minBudget &&
                                formik.errors.budgetInfo?.minBudget
                                  ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                                  : ""
                              }`}
                            />
                            {formik.touched.budgetInfo?.minBudget &&
                              formik.errors.budgetInfo?.minBudget && (
                                <p
                                  id="error-budgetInfo.minBudget"
                                  className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                                >
                                  <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                  </span>
                                  <span className="leading-4">
                                    {
                                      formik.errors.budgetInfo
                                        .minBudget as string
                                    }
                                  </span>
                                </p>
                              )}
                          </div>

                          <div
                            id="field-budgetInfo.maxBudget"
                            data-field="budgetInfo.maxBudget"
                          >
                            <label className="block text-[11px] text-[var(--dash-text-secondary)] mb-1">
                              Maximum Rate
                            </label>
                            <Input
                              id="input-budgetInfo.maxBudget"
                              type="number"
                              min="0"
                              name="budgetInfo.maxBudget"
                              value={formik.values.budgetInfo.maxBudget}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                formik.setFieldValue(
                                  "budgetInfo.maxBudget",
                                  val,
                                );
                                formik.setFieldValue(
                                  "engagementType.budget",
                                  `${formik.values.budgetInfo.currency} ${formik.values.budgetInfo.minBudget}-${val}/${formik.values.budgetInfo.budgetType}`,
                                );
                              }}
                              onBlur={formik.handleBlur}
                              className={`h-10 rounded-xl bg-[var(--dash-card-bg-solid)] border border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs ${
                                formik.touched.budgetInfo?.maxBudget &&
                                formik.errors.budgetInfo?.maxBudget
                                  ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                                  : ""
                              }`}
                            />
                            {formik.touched.budgetInfo?.maxBudget &&
                              formik.errors.budgetInfo?.maxBudget && (
                                <p
                                  id="error-budgetInfo.maxBudget"
                                  className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                                >
                                  <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                  </span>
                                  <span className="leading-4">
                                    {
                                      formik.errors.budgetInfo
                                        .maxBudget as string
                                    }
                                  </span>
                                </p>
                              )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
            {/* ==========================================
          SECTION 6: PROJECT TIMELINE
      ========================================== */}
            <div className="p-6">
              <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
                  6. Project Timeline
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  id="field-projectTimeline.startDate"
                  data-field="projectTimeline.startDate"
                >
                  <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                    Expected Start Date <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    id="input-projectTimeline.startDate"
                    type="date"
                    name="projectTimeline.startDate"
                    value={formik.values.projectTimeline.startDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min={new Date().toISOString().split("T")[0]}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker();
                      } catch (err) {
                        console.error("showPicker failed: ", err);
                      }
                    }}
                    className={`rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs cursor-pointer ${
                      formik.touched.projectTimeline?.startDate &&
                      formik.errors.projectTimeline?.startDate
                        ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                        : ""
                    }`}
                  />
                  {formik.touched.projectTimeline?.startDate &&
                    formik.errors.projectTimeline?.startDate && (
                      <p
                        id="error-projectTimeline.startDate"
                        className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {formik.errors.projectTimeline.startDate}
                        </span>
                      </p>
                    )}
                </div>

                <div
                  id="field-projectTimeline.projectDuration"
                  data-field="projectTimeline.projectDuration"
                >
                  <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                    Project Duration
                  </label>
                  <Select
                    value={formik.values.projectTimeline.projectDuration || ""}
                    onValueChange={(val) =>
                      formik.setFieldValue(
                        "projectTimeline.projectDuration",
                        val,
                      )
                    }
                  >
                    <SelectTrigger
                      id="trigger-projectTimeline.projectDuration"
                      name="projectTimeline.projectDuration"
                      className="bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs"
                    >
                      <SelectValue placeholder="Select Project Duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-xs">
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Half Yearly">Half Yearly</SelectItem>
                      <SelectItem value="1+ Years">1+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {/* ==========================================
          SECTION 7: JOB DESCRIPTION
      ========================================== */}
            <div className="p-6">
              <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
                <FileCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
                  7. Job Description
                </h3>
              </div>

              <div
                id="field-jobDescription.jdSummary"
                data-field="jobDescription.jdSummary"
              >
                <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                  JD Summary & Responsibilities{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <Textarea
                  id="input-jobDescription.jdSummary"
                  rows={5}
                  name="jobDescription.jdSummary"
                  placeholder="Detailed description of responsibilities, requirements, and role expectations..."
                  value={formik.values.jobDescription.jdSummary}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs placeholder:text-[var(--dash-text-secondary)] ${
                    formik.touched.jobDescription?.jdSummary &&
                    formik.errors.jobDescription?.jdSummary
                      ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                      : ""
                  }`}
                />
                {formik.touched.jobDescription?.jdSummary &&
                  formik.errors.jobDescription?.jdSummary && (
                    <p
                      id="error-jobDescription.jdSummary"
                      className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                    >
                      <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      </span>
                      <span className="leading-4">
                        {formik.errors.jobDescription.jdSummary}
                      </span>
                    </p>
                  )}
              </div>
            </div>{" "}
            {/* ==========================================
          SECTION 8: COMPLIANCE, INSURANCE & CERTIFICATIONS
      ========================================== */}
            <div className="p-6">
              <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
                  8. Compliance & Insurance Check
                </h3>
              </div>
              <p className="text-sm text-[var(--dash-text-secondary)] mb-4">
                Please confirm if your company meets the necessary statutory
                compliance and insurance requirements.
              </p>

              <div
                id="field-complianceRequirements.complianceStatus"
                data-field="complianceRequirements.complianceStatus"
                className="space-y-6"
              >
                <div>
                  <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-2">
                    Compliance and Insurance check for the vendor
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      id="trigger-complianceRequirements.complianceStatus"
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        formik.setFieldValue(
                          "complianceRequirements.complianceStatus",
                          "yes",
                        )
                      }
                      className={`flex items-center gap-2 flex-1 h-[var(--dash-input-height)] px-3 rounded-lg border cursor-pointer transition-all duration-200 text-left bg-transparent hover:bg-transparent text-xs font-medium inline-flex justify-start whitespace-nowrap ${
                        formik.values.complianceRequirements
                          .complianceStatus === "yes"
                          ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                          : "border-[var(--dash-card-border)] bg-[var(--dash-card-bg)]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          formik.values.complianceRequirements
                            .complianceStatus === "yes"
                            ? "border-[var(--accent-primary)]"
                            : "border-[var(--dash-text-secondary)]"
                        }`}
                      >
                        {formik.values.complianceRequirements
                          .complianceStatus === "yes" && (
                          <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck
                          className={`w-4 h-4 ${formik.values.complianceRequirements.complianceStatus === "yes" ? "text-[var(--accent-primary)]" : "text-[var(--dash-text-secondary)]"}`}
                        />
                        <span
                          className={`font-semibold ${formik.values.complianceRequirements.complianceStatus === "yes" ? "text-[var(--accent-primary)]" : "text-[var(--dash-text-secondary)]"}`}
                        >
                          Yes, we are compliant
                        </span>
                      </div>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        formik.setFieldValue(
                          "complianceRequirements.complianceStatus",
                          "no",
                        )
                      }
                      className={`flex items-center gap-2 flex-1 h-[var(--dash-input-height)] px-3 rounded-lg border cursor-pointer transition-all duration-200 text-left bg-transparent hover:bg-transparent text-xs font-medium inline-flex justify-start whitespace-nowrap ${
                        formik.values.complianceRequirements
                          .complianceStatus === "no"
                          ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                          : "border-[var(--dash-card-border)] bg-[var(--dash-card-bg)]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          formik.values.complianceRequirements
                            .complianceStatus === "no"
                            ? "border-[var(--accent-primary)]"
                            : "border-[var(--dash-text-secondary)]"
                        }`}
                      >
                        {formik.values.complianceRequirements
                          .complianceStatus === "no" && (
                          <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert
                          className={`w-4 h-4 ${formik.values.complianceRequirements.complianceStatus === "no" ? "text-[var(--accent-primary)]" : "text-[var(--dash-text-secondary)]"}`}
                        />
                        <span
                          className={`font-semibold ${formik.values.complianceRequirements.complianceStatus === "no" ? "text-[var(--accent-primary)]" : "text-[var(--dash-text-secondary)]"}`}
                        >
                          No, need assistance
                        </span>
                      </div>
                    </Button>
                  </div>
                  {formik.touched.complianceRequirements?.complianceStatus &&
                    formik.errors.complianceRequirements?.complianceStatus && (
                      <p
                        id="error-complianceRequirements.complianceStatus"
                        className="text-xs text-red-500 font-medium mt-2 flex items-start gap-1.5 leading-4"
                      >
                        <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        </span>
                        <span className="leading-4">
                          {
                            formik.errors.complianceRequirements
                              .complianceStatus
                          }
                        </span>
                      </p>
                    )}
                </div>

                <AnimatePresence>
                  {formik.values.complianceRequirements.complianceStatus ===
                    "yes" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-4 pt-4 border-t border-[var(--dash-card-border)] space-y-6"
                    >
                      <div
                        id="field-complianceRequirements.legalRegistrationDocs"
                        data-field="complianceRequirements.legalRegistrationDocs"
                        className="space-y-2"
                      >
                        {(formik.submitCount > 0 ||
                          Boolean(
                            (formik.touched.complianceRequirements as any)
                              ?.legalRegistrationDocs,
                          )) &&
                          formik.errors.complianceRequirements
                            ?.legalRegistrationDocs && (
                            <div
                              id="error-complianceRequirements.legalRegistrationDocs"
                              className="flex items-start gap-2 p-3 mb-2 rounded-xl border !border-red-500 bg-red-500/10 text-xs text-red-500 font-medium leading-4"
                              role="alert"
                            >
                              <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              </span>
                              <span className="leading-4">
                                {
                                  formik.errors.complianceRequirements
                                    .legalRegistrationDocs
                                }
                              </span>
                            </div>
                          )}
                        <DashCheckboxField
                          label="Legal Registration & Tax Documents"
                          name="toggle-all-docs"
                          checked={LEGAL_REGISTRATION_DOCS.every((d) =>
                            (
                              formik.values.complianceRequirements
                                .legalRegistrationDocs || []
                            ).includes(d.id),
                          )}
                          onChange={(checked) => {
                            if (checked) {
                              formik.setFieldValue(
                                "complianceRequirements.legalRegistrationDocs",
                                LEGAL_REGISTRATION_DOCS.map((d) => d.id),
                              );
                            } else {
                              formik.setFieldValue(
                                "complianceRequirements.legalRegistrationDocs",
                                [],
                              );
                            }
                          }}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-8">
                          {LEGAL_REGISTRATION_DOCS.map((doc) => (
                            <DashCheckboxField
                              key={doc.id}
                              label={doc.label}
                              name={`doc-${doc.id}`}
                              checked={(
                                formik.values.complianceRequirements
                                  .legalRegistrationDocs || []
                              ).includes(doc.id)}
                              onChange={(checked) => {
                                const current =
                                  formik.values.complianceRequirements
                                    .legalRegistrationDocs || [];
                                if (checked) {
                                  formik.setFieldValue(
                                    "complianceRequirements.legalRegistrationDocs",
                                    [...current, doc.id],
                                  );
                                } else {
                                  formik.setFieldValue(
                                    "complianceRequirements.legalRegistrationDocs",
                                    current.filter((id) => id !== doc.id),
                                  );
                                }
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <DashCheckboxField
                          label="Insurance"
                          name="toggle-all-insurance"
                          checked={INSURANCE_OPTIONS.every((i) =>
                            (
                              formik.values.complianceRequirements
                                .insuranceRequirements || []
                            ).includes(i.id),
                          )}
                          onChange={(checked) => {
                            if (checked) {
                              formik.setFieldValue(
                                "complianceRequirements.insuranceRequirements",
                                INSURANCE_OPTIONS.map((i) => i.id),
                              );
                            } else {
                              formik.setFieldValue(
                                "complianceRequirements.insuranceRequirements",
                                [],
                              );
                            }
                          }}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-8">
                          {INSURANCE_OPTIONS.map((ins) => (
                            <DashCheckboxField
                              key={ins.id}
                              label={ins.label}
                              name={`ins-${ins.id}`}
                              checked={(
                                formik.values.complianceRequirements
                                  .insuranceRequirements || []
                              ).includes(ins.id)}
                              onChange={(checked) => {
                                const current =
                                  formik.values.complianceRequirements
                                    .insuranceRequirements || [];
                                if (checked) {
                                  formik.setFieldValue(
                                    "complianceRequirements.insuranceRequirements",
                                    [...current, ins.id],
                                  );
                                } else {
                                  formik.setFieldValue(
                                    "complianceRequirements.insuranceRequirements",
                                    current.filter((id) => id !== ins.id),
                                  );
                                }
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-6 border-t border-[var(--dash-card-border)]">
                  <div className="w-full md:w-1/2">
                    <DashMultiSelect
                      label="Company Certifications"
                      name="complianceRequirements.companyCertifications"
                      options={CERTIFICATION_OPTIONS}
                      value={
                        formik.values.complianceRequirements
                          ?.companyCertifications || []
                      }
                      onChange={(selected) =>
                        formik.setFieldValue(
                          "complianceRequirements.companyCertifications",
                          selected,
                        )
                      }
                      placeholder="Select company certifications…"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="sticky bottom-0 z-50 flex items-center justify-between p-4 bg-[var(--dash-card-bg-solid)] border-t border-[var(--dash-card-border)] shrink-0">
        <div className="text-xs text-[var(--dash-text-secondary)] hidden sm:block">
          {currentStep === 1 ? (
            "Provide JD via upload or text to continue."
          ) : (
            <>
              All mandatory fields marked with{" "}
              <span className="text-rose-500">*</span> must be filled.
            </>
          )}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {currentStep === 1 ? (
            <DashButton
              type="button"
              variant="primary"
              size="sm"
              onClick={handleNextStep}
              disabled={(!uploadedFile && !jdText.trim()) || isParsing}
              className="gap-2 text-xs"
            >
              {isParsing ? "Extracting..." : "Next Step"}
              {!isParsing && <ArrowRight className="w-4 h-4" />}
            </DashButton>
          ) : (
            <>
              {mode === "create" && (
                <DashButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                  className="gap-2 text-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </DashButton>
              )}
              <DashButton
                type="submit"
                variant="primary"
                size="sm"
                className="gap-2 text-xs"
              >
                <Check className="w-4 h-4" />
                {mode === "edit" ? "Update Requirement" : "Publish Requirement"}
              </DashButton>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
