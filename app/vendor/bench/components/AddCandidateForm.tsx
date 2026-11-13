"use client";

import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import {
  Upload,
  User,
  Briefcase,
  Layers,
  MapPin,
  Award,
  Building2,
  GraduationCap,
  Link as LinkIcon,
  DollarSign,
  AlertCircle,
  Plus,
  X,
  Sparkles,
  CheckCircle2,
  FolderGit2,
} from "lucide-react";

import { Input } from "@/app/components/ui/input";
import { LocationAutocomplete } from "@/app/components/LocationAutocomplete";
import { DashButton } from "@/app/components/ui/dash-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { LoadingOverlay } from "@/app/onboarding/components/LoadingOverlay";

import {
  candidateValidationSchema,
  initialCandidateFormValues,
  validateWithZod,
  CandidateFormValues,
} from "../schemas/candidate.schema";
import { parseCVText } from "../utils/cvParser";
import { CertificationSelectSearch } from "@/app/client/requirements/components/CertificationSelectSearch";
import { toast } from "@/app/components/ui/toast";
import { DomainSelectSearch } from "@/app/client/requirements/components/DomainSelectSearch";

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

const TOTAL_EXPERIENCE_OPTIONS: string[] = [
  "6 months",
  "1 yr",
  ...Array.from({ length: 29 }, (_, i) => `${i + 2} yrs`),
  "30+ yrs",
];

interface AddCandidateFormProps {
  onSuccess?: (values: CandidateFormValues) => void;
  onCancel?: () => void;
  initialValues?: CandidateFormValues;
  isEdit?: boolean;
  submitButtonText?: string;
}

export default function AddCandidateForm({
  onSuccess,
  onCancel,
  initialValues,
  isEdit = false,
  submitButtonText,
}: AddCandidateFormProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);
  const [primarySkillInput, setPrimarySkillInput] = useState("");
  const [secondarySkillInput, setSecondarySkillInput] = useState("");
  const [projectTechInputs, setProjectTechInputs] = useState<
    Record<number, string>
  >({});

  const formik = useFormik<CandidateFormValues>({
    initialValues: initialValues || initialCandidateFormValues,
    enableReinitialize: true,
    validate: validateWithZod(candidateValidationSchema),
    onSubmit: (values) => {
      console.log("Submitting Candidate:", values);
      toast.success(
        isEdit
          ? "Candidate updated successfully!"
          : "Candidate added to bench successfully!"
      );
      if (onSuccess) onSuccess(values);
    },
  });

  const getFirstErrorPath = (obj: any, prefix = ""): string | null => {
    if (!obj || typeof obj !== "object") return null;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const newPath = prefix ? `${prefix}.${key}` : key;
      if (typeof val === "string") return newPath;
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

    // If target is inside a collapsed accordion, open it
    const accordionItem = target.closest('[data-state="closed"]');
    if (accordionItem) {
      const trigger = accordionItem.querySelector<HTMLElement>(
        'button[data-state="closed"], [aria-expanded="false"], button',
      );
      trigger?.click();
    }

    const performScroll = () => {
      if (!target) return;
      // If target is an error message div, target its parent wrapper so the whole field is visible
      let scrollTarget = target;
      if (scrollTarget.id?.startsWith("error-") && scrollTarget.parentElement) {
        scrollTarget = scrollTarget.parentElement;
      }

      try {
        scrollTarget.scrollIntoView({ behavior: "smooth", block: "center" });

        // Also explicitly scroll any scrollable parent container (e.g. overflow-y-auto modal content)
        let parent = scrollTarget.parentElement;
        while (parent && parent !== document.body) {
          const style = window.getComputedStyle(parent);
          const isScrollable =
            (style.overflowY === "auto" || style.overflowY === "scroll") &&
            parent.scrollHeight > parent.clientHeight;
          if (isScrollable) {
            const parentRect = parent.getBoundingClientRect();
            const targetRect = scrollTarget.getBoundingClientRect();
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
        scrollTarget.scrollIntoView();
      }

      const focusable = target.matches(
        "input, select, textarea, button, [tabindex]",
      )
        ? target
        : target.querySelector<HTMLElement>(
            "input, select, textarea, button, [tabindex]",
          );
      focusable?.focus?.({ preventScroll: true });
    };

    if (accordionItem) {
      setTimeout(performScroll, 80);
    } else {
      performScroll();
    }
  }

  const prevSubmitCountRef = useRef(formik.submitCount);

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
      // Keep track of submitCount if it changes externally or resets
      prevSubmitCountRef.current = formik.submitCount;
    }
  }, [formik.submitCount, formik.isValid, formik.errors]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      if (
        fileExt !== "pdf" &&
        fileExt !== "txt" &&
        fileExt !== "doc" &&
        fileExt !== "docx"
      ) {
        setFileError(
          "Invalid file type. Only PDF, DOC, DOCX and TXT files are supported.",
        );
        setUploadedFile(null);
        return;
      }
      setFileError(null);
      setUploadedFile(file);

      // Automatically trigger CV extraction / parsing
      setIsParsing(true);
      setParseSuccess(false);

      setTimeout(() => {
        const extracted = parseCVText(file.name);

        formik.setValues((prev) => ({
          ...prev,
          basicInfo: { ...prev.basicInfo, ...extracted.basicInfo },
          workPreferences: {
            ...prev.workPreferences,
            ...extracted.workPreferences,
          },
          skills: { ...prev.skills, ...extracted.skills },
          location: { ...prev.location, ...extracted.location },
          certifications: {
            ...prev.certifications,
            ...extracted.certifications,
          },
          workExperience: extracted.workExperience || prev.workExperience,
          personalProjects:
            extracted.personalProjects || prev.personalProjects || [],
          education: { ...prev.education, ...extracted.education },
          links: { ...prev.links, ...extracted.links },
          rateDetails: { ...prev.rateDetails, ...extracted.rateDetails },
          achievements: extracted.achievements || prev.achievements || [],
        }));

        setIsParsing(false);
        setParseSuccess(true);
        setTimeout(() => setParseSuccess(false), 5000);
      }, 1500);
    }
  };

  const handleAddPrimarySkill = () => {
    const trimmed = primarySkillInput.trim();
    if (!trimmed) return;
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    const currentSkills = formik.values.skills.primarySkills || [];
    if (!currentSkills.includes(formatted)) {
      formik.setFieldValue("skills.primarySkills", [
        ...currentSkills,
        formatted,
      ]);
    }
    setPrimarySkillInput("");
  };

  const handleAddSecondarySkill = () => {
    const trimmed = secondarySkillInput.trim();
    if (!trimmed) return;
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    const currentSkills = formik.values.skills.secondarySkills || [];
    if (!currentSkills.includes(formatted)) {
      formik.setFieldValue("skills.secondarySkills", [
        ...currentSkills,
        formatted,
      ]);
    }
    setSecondarySkillInput("");
  };

  const config = getBudgetConfig(
    formik.values.rateDetails.rateType,
    formik.values.rateDetails.currency,
  );

  const rateMinRaw = Number(formik.values.rateDetails.rateMin) || 0;
  const rateMaxRaw = Number(formik.values.rateDetails.rateMax) || 0;
  const clampedMin = Math.min(Math.max(rateMinRaw, config.min), config.max);
  const clampedMax = Math.min(Math.max(rateMaxRaw, config.min), config.max);
  const minPercent =
    ((clampedMin - config.min) / (config.max - config.min)) * 100;
  const maxPercent =
    ((clampedMax - config.min) / (config.max - config.min)) * 100;
  const safeMinPercent = Math.min(minPercent, maxPercent);
  const safeMaxPercent = Math.max(minPercent, maxPercent);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking directly on a thumb handle (captured by class), let it drag naturally
    if ((e.target as HTMLElement).classList.contains("budget-thumb")) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;

    // Calculate the value mapped to this click position
    const clickedValue = config.min + percent * (config.max - config.min);

    // Determine which handle is closer
    const distMin = Math.abs(formik.values.rateDetails.rateMin - clickedValue);
    const distMax = Math.abs(formik.values.rateDetails.rateMax - clickedValue);

    if (distMin < distMax) {
      const val = Math.min(
        Math.round(clickedValue),
        formik.values.rateDetails.rateMax,
      );
      formik.setFieldValue("rateDetails.rateMin", val);
    } else {
      const val = Math.max(
        Math.round(clickedValue),
        formik.values.rateDetails.rateMin,
      );
      formik.setFieldValue("rateDetails.rateMax", val);
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-h-[85vh] flex flex-col overflow-hidden bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] border rounded-xl text-[var(--dash-text-primary)]"
    >
      <style>{`
        /* Fix for browser autofill background in dark mode */
        form input:-webkit-autofill,
        form input:-webkit-autofill:hover, 
        form input:-webkit-autofill:focus, 
        form input:-webkit-autofill:active {
          transition: background-color 5000s ease-in-out 0s !important;
          -webkit-text-fill-color: var(--dash-text-primary) !important;
        }

        /* Fix for dropdown menus being cut off inside expanded accordions */
        div[data-state="open"] > .overflow-hidden {
          overflow: visible !important;
        }

        /* Standard inputs inside the form */
        form input,
        form button.SelectTrigger {
          border-radius: 0.75rem !important; /* rounded-xl (12px) */
        }

        /* Smaller inputs inside work experience/project cards */
        form input[name^="workExperience."] {
          border-radius: 0.375rem !important; /* rounded-md (6px) */
        }

        /* Style domain select box to match smaller project text inputs */
        div[id*=".domain"] > div[role="combobox"] {
          height: var(--dash-input-height) !important;
          border-radius: 0.375rem !important; /* rounded-md (6px) */
          padding-left: 0.5rem !important;
          padding-right: 0.5rem !important;
        }
        div[id*=".domain"] > div[role="combobox"] span {
          font-size: 11px !important;
        }
        div[id*=".domain"] > div[role="combobox"] svg {
          width: 0.75rem !important; /* w-3 */
          height: 0.75rem !important; /* h-3 */
        }
      `}</style>
      <div className="sticky top-0 z-40 bg-[var(--dash-card-bg-solid)] border-b border-[var(--dash-card-border)] p-4 flex items-center justify-between shrink-0">
        <h2 className="text-lg font-semibold text-[var(--dash-text-primary)]">
          {isEdit ? "Edit Candidate" : "Add Candidate"}
        </h2>
        {parseSuccess && (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs gap-1 py-1"
          >
            <CheckCircle2 className="w-3 h-3" /> Auto-Filled
          </Badge>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[var(--dash-card-border)] pb-8 relative">
        {isParsing && (
          <LoadingOverlay
            loaderText="EXTRACTING"
            message="Extracting CV details..."
            hideBorder={true}
            variant="default"
          />
        )}
        {/* CV Upload */}
        <div className="p-6 bg-[var(--dash-card-bg)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--dash-text-primary)]">
                Auto-Fill from CV (Optional)
              </h3>
              <p className="text-xs text-[var(--dash-text-secondary)] mt-0.5">
                Upload a CV to automatically populate the candidate details.
              </p>
            </div>
          </div>

          <div className="relative border-2 border-dashed border-[var(--dash-input-border)] hover:border-indigo-500/50 rounded-xl p-6 text-center transition-all bg-[var(--dash-input-bg)] group">
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-3 rounded-full bg-[var(--dash-card-border)] group-hover:bg-indigo-500/20 text-[var(--dash-text-secondary)] group-hover:text-indigo-400 transition-all">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[var(--dash-text-primary)]">
                {uploadedFile
                  ? uploadedFile.name
                  : "Drop CV here or click to browse"}
              </p>
              <p className="text-xs text-[var(--dash-text-secondary)]">
                Supports PDF, DOC, DOCX, TXT up to 10MB
              </p>
            </div>
          </div>
          {fileError && (
            <p className="text-xs text-red-500 font-medium mt-2 flex items-start gap-1.5 leading-4">
              <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              </span>
              <span className="leading-4 text-red-500">{fileError}</span>
            </p>
          )}
        </div>

        {/* 1. Basic Info */}
        <div className="p-6">
          <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
            <User className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
              1. Basic Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              id="field-basicInfo.firstName"
              data-field="basicInfo.firstName"
            >
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <Input
                id="input-basicInfo.firstName"
                name="basicInfo.firstName"
                placeholder="e.g. Rahul"
                value={formik.values.basicInfo.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${formik.touched.basicInfo?.firstName && formik.errors.basicInfo?.firstName ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : ""}`}
              />
              {formik.touched.basicInfo?.firstName &&
                formik.errors.basicInfo?.firstName && (
                  <div id="error-basicInfo.firstName" className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4">
                    <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    </span>
                    <span className="leading-4">{formik.errors.basicInfo.firstName}</span>
                  </div>
                )}
            </div>

            <div id="field-basicInfo.lastName" data-field="basicInfo.lastName">
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <Input
                id="input-basicInfo.lastName"
                name="basicInfo.lastName"
                placeholder="e.g. Verma"
                value={formik.values.basicInfo.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${formik.touched.basicInfo?.lastName && formik.errors.basicInfo?.lastName ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : ""}`}
              />
              {formik.touched.basicInfo?.lastName &&
                formik.errors.basicInfo?.lastName && (
                  <div id="error-basicInfo.lastName" className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4">
                    <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    </span>
                    <span className="leading-4">{formik.errors.basicInfo.lastName}</span>
                  </div>
                )}
            </div>

            <div id="field-basicInfo.gender" data-field="basicInfo.gender">
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                Gender <span className="text-rose-500">*</span>
              </label>
              <Select
                value={formik.values.basicInfo.gender}
                onValueChange={(val) =>
                  formik.setFieldValue("basicInfo.gender", val)
                }
              >
                <SelectTrigger
                  id="trigger-basicInfo.gender"
                  className={`h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${formik.touched.basicInfo?.gender && formik.errors.basicInfo?.gender ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : ""}`}
                >
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-xs">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.basicInfo?.gender &&
                formik.errors.basicInfo?.gender && (
                  <div id="error-basicInfo.gender" className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4">
                    <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    </span>
                    <span className="leading-4">{formik.errors.basicInfo.gender}</span>
                  </div>
                )}
            </div>

            <div
              id="field-basicInfo.designation"
              data-field="basicInfo.designation"
            >
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                Designation <span className="text-rose-500">*</span>
              </label>
              <Input
                id="input-basicInfo.designation"
                name="basicInfo.designation"
                placeholder="e.g. Senior Frontend Engineer"
                value={formik.values.basicInfo.designation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${formik.touched.basicInfo?.designation && formik.errors.basicInfo?.designation ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : ""}`}
              />
              {formik.touched.basicInfo?.designation &&
                formik.errors.basicInfo?.designation && (
                  <div id="error-basicInfo.designation" className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4">
                    <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    </span>
                    <span className="leading-4">{formik.errors.basicInfo.designation}</span>
                  </div>
                )}
            </div>

            <div
              id="field-basicInfo.totalExperience"
              data-field="basicInfo.totalExperience"
            >
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                Total Experience <span className="text-rose-500">*</span>
              </label>
              <Select
                value={
                  formik.values.basicInfo.totalExperience === "6 month"
                    ? "6 months"
                    : formik.values.basicInfo.totalExperience
                }
                onValueChange={(val) =>
                  formik.setFieldValue("basicInfo.totalExperience", val)
                }
              >
                <SelectTrigger
                  id="trigger-basicInfo.totalExperience"
                  className={`h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${formik.touched.basicInfo?.totalExperience && formik.errors.basicInfo?.totalExperience ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : ""}`}
                >
                  <SelectValue placeholder="Select Experience" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-xs max-h-60 overflow-y-auto">
                  {TOTAL_EXPERIENCE_OPTIONS.map((exp) => (
                    <SelectItem key={exp} value={exp}>
                      {exp}
                    </SelectItem>
                  ))}
                  {formik.values.basicInfo.totalExperience &&
                    !TOTAL_EXPERIENCE_OPTIONS.includes(
                      formik.values.basicInfo.totalExperience === "6 month"
                        ? "6 months"
                        : formik.values.basicInfo.totalExperience,
                    ) && (
                      <SelectItem
                        value={formik.values.basicInfo.totalExperience}
                      >
                        {formik.values.basicInfo.totalExperience}
                      </SelectItem>
                    )}
                </SelectContent>
              </Select>
              {formik.touched.basicInfo?.totalExperience &&
                formik.errors.basicInfo?.totalExperience && (
                  <div id="error-basicInfo.totalExperience" className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4">
                    <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    </span>
                    <span className="leading-4">{formik.errors.basicInfo.totalExperience}</span>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* 2. Work Preferences */}
        <div className="p-6">
          <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
              2. Work Preferences
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              id="field-workPreferences.deploymentType"
              data-field="workPreferences.deploymentType"
            >
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                Deployment Type
              </label>
              <Select
                value={formik.values.workPreferences.deploymentType}
                onValueChange={(val) =>
                  formik.setFieldValue("workPreferences.deploymentType", val)
                }
              >
                <SelectTrigger
                  id="trigger-workPreferences.deploymentType"
                  className="h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)]"
                >
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-xs">
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Onsite">Onsite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div
              id="field-workPreferences.availability"
              data-field="workPreferences.availability"
            >
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                Availability
              </label>
              <Select
                value={formik.values.workPreferences.availability}
                onValueChange={(val) =>
                  formik.setFieldValue("workPreferences.availability", val)
                }
              >
                <SelectTrigger
                  id="trigger-workPreferences.availability"
                  className="h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)]"
                >
                  <SelectValue placeholder="Select Availability" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-xs">
                  <SelectItem value="Immediate Joiner">
                    Immediate Joiner
                  </SelectItem>
                  <SelectItem value="Notice Period">Notice Period</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div
              id="field-workPreferences.engagementType"
              data-field="workPreferences.engagementType"
            >
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                Engagement Type
              </label>
              <Select
                value={formik.values.workPreferences.engagementType}
                onValueChange={(val) =>
                  formik.setFieldValue("workPreferences.engagementType", val)
                }
              >
                <SelectTrigger
                  id="trigger-workPreferences.engagementType"
                  className="h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)]"
                >
                  <SelectValue placeholder="Select Engagement" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-xs">
                  <SelectItem value="C-C">
                    C-C (Contract to Contract)
                  </SelectItem>
                  <SelectItem value="C-H">C-H (Contract to Hire)</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 3. Skills */}
        <div className="p-6">
          <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
              3. Skills
            </h3>
          </div>

          <div className="space-y-4">
            {/* Primary Skills */}
            <div
              id="field-skills.primarySkills"
              data-field="skills.primarySkills"
            >
              <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                Primary Skills <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="input-skills.primarySkills"
                  name="skills.primarySkills"
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
                    formik.touched.skills?.primarySkills &&
                    formik.errors.skills?.primarySkills
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
                  formik.touched.skills?.primarySkills &&
                  formik.errors.skills?.primarySkills
                    ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                    : ""
                }`}
              >
                {formik.values.skills.primarySkills.length === 0 ? (
                  <span className="text-xs text-[var(--dash-text-secondary)] italic">
                    No primary skills added yet
                  </span>
                ) : (
                  formik.values.skills.primarySkills.map((skill, index) => (
                    <Badge
                      key={`${skill}-${index}`}
                      variant="secondary"
                      className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] gap-1 text-[11px] py-0.5 px-2 font-normal"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue(
                            "skills.primarySkills",
                            formik.values.skills.primarySkills.filter(
                              (s) => s !== skill,
                            ),
                          );
                        }}
                        className="hover:text-rose-400 text-[var(--dash-text-secondary)]"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
              {formik.touched.skills?.primarySkills &&
                formik.errors.skills?.primarySkills && (
                  <div id="error-skills.primarySkills" className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4">
                    <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    </span>
                    <span className="leading-4">
                      {typeof formik.errors.skills.primarySkills === "string"
                        ? formik.errors.skills.primarySkills
                        : "Primary skills are required"}
                    </span>
                  </div>
                )}
            </div>

            {/* Secondary Skills */}
            <div
              id="field-skills.secondarySkills"
              data-field="skills.secondarySkills"
            >
              <label className="block text-xs font-medium text-[var(--dash-text-primary)] mb-1">
                Secondary Skills
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="input-skills.secondarySkills"
                  name="skills.secondarySkills"
                  placeholder="Type a secondary skill (e.g. Next.js, PostgreSQL) and press Add"
                  value={secondarySkillInput}
                  onChange={(e) => setSecondarySkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSecondarySkill();
                    }
                  }}
                  className="h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs flex-1"
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

              <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-lg bg-[var(--dash-input-bg)] border border-[var(--dash-card-border)]">
                {formik.values.skills.secondarySkills.length === 0 ? (
                  <span className="text-xs text-[var(--dash-text-secondary)] italic">
                    No secondary skills added yet
                  </span>
                ) : (
                  formik.values.skills.secondarySkills.map((skill, index) => (
                    <Badge
                      key={`${skill}-${index}`}
                      variant="secondary"
                      className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] gap-1 text-[11px] py-0.5 px-2 font-normal"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue(
                            "skills.secondarySkills",
                            formik.values.skills.secondarySkills.filter(
                              (s) => s !== skill,
                            ),
                          );
                        }}
                        className="hover:text-rose-400 text-[var(--dash-text-secondary)]"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Location */}
        <div className="p-6">
          <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
              4. Location
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div id="field-location.location" data-field="location.location">
              <LocationAutocomplete
                label="Location"
                name="location.location"
                value={formik.values.location.location}
                onChange={(val) =>
                  formik.setFieldValue("location.location", val)
                }
                placeholder="e.g. Mumbai, Maharashtra, India"
                error={
                  formik.touched.location?.location
                    ? formik.errors.location?.location
                    : undefined
                }
                disabled={false}
                required
                className="space-y-0"
                onlyCity={false}
                labelClassName="block text-xs font-medium text-[var(--dash-text-primary)] mb-1"
                inputClassName="h-[var(--dash-input-height)] w-full rounded-xl border bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs pl-11 pr-4 outline-none focus:border-indigo-500/50 transition-colors disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* 5. Certifications */}
        <div className="p-6">
          <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
            <Award className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
              5. Certifications
            </h3>
          </div>

          <div
            id="field-certifications.certifications"
            data-field="certifications.certifications"
          >
            <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
              Add Certifications
            </label>
            <div className="mb-3">
              <CertificationSelectSearch
                name="certifications.certifications"
                selectedValues={formik.values.certifications.certifications}
                onValuesChange={(newCerts) => {
                  formik.setFieldValue(
                    "certifications.certifications",
                    newCerts,
                  );
                }}
                placeholder="Select or enter certification..."
                showCheckboxes={true}
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {formik.values.certifications.certifications.map(
                (cert, index) => (
                  <span
                    key={`${cert}-${index}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => {
                        formik.setFieldValue(
                          "certifications.certifications",
                          formik.values.certifications.certifications.filter(
                            (c) => c !== cert,
                          ),
                        );
                      }}
                      className="hover:bg-indigo-100 rounded p-0.5 transition-colors cursor-pointer text-indigo-400 hover:text-indigo-700"
                      aria-label={`Remove ${cert}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* 6. Work Experience */}
        <div className="p-6">
          <div className="flex items-center justify-between border-b border-[var(--dash-card-border)] pb-3 mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
                6. Work Experience
              </h3>
            </div>
            <DashButton
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                formik.setFieldValue("workExperience", [
                  ...formik.values.workExperience,
                  {
                    companyName: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    projects: [],
                  },
                ]);
              }}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Experience
            </DashButton>
          </div>

          <div className="space-y-6">
            {formik.values.workExperience.map((exp, expIndex) => (
              <div
                key={expIndex}
                className="p-4 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)] relative"
              >
                <button
                  type="button"
                  onClick={() => {
                    const newExps = [...formik.values.workExperience];
                    newExps.splice(expIndex, 1);
                    formik.setFieldValue("workExperience", newExps);
                  }}
                  className="absolute top-4 right-4 text-[var(--dash-text-muted)] hover:text-rose-400"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-6">
                  <div>
                    <label className="block text-[10px] font-medium text-[var(--dash-text-secondary)] mb-1">
                      Company Name
                    </label>
                    <Input
                      name={`workExperience.${expIndex}.companyName`}
                      value={exp.companyName}
                      onChange={formik.handleChange}
                      className="h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[var(--dash-text-secondary)] mb-1">
                      Role
                    </label>
                    <Input
                      name={`workExperience.${expIndex}.role`}
                      value={exp.role}
                      onChange={formik.handleChange}
                      className="h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-[var(--dash-text-secondary)] mb-1">
                        Start Date
                      </label>
                      <Input
                        type="date"
                        name={`workExperience.${expIndex}.startDate`}
                        value={exp.startDate}
                        onChange={formik.handleChange}
                        onClick={(e) => {
                          try {
                            e.currentTarget.showPicker();
                          } catch (err) {
                            console.error("showPicker failed: ", err);
                          }
                        }}
                        className="h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[var(--dash-text-secondary)] mb-1">
                        End Date
                      </label>
                      <Input
                        type="date"
                        name={`workExperience.${expIndex}.endDate`}
                        value={exp.endDate}
                        onChange={formik.handleChange}
                        onClick={(e) => {
                          try {
                            e.currentTarget.showPicker();
                          } catch (err) {
                            console.error("showPicker failed: ", err);
                          }
                        }}
                        className="h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Projects */}
                {exp.projects.length > 0 && (
                  <Accordion type="multiple" className="w-full space-y-2 mb-3">
                    {exp.projects.map((proj, projIndex) => (
                      <AccordionItem
                        key={projIndex}
                        value={`proj-${projIndex}`}
                        className="border border-[var(--dash-input-border)] rounded-lg px-3 py-1 bg-[var(--dash-card-bg-solid)]"
                      >
                        <AccordionTrigger className="hover:no-underline py-2 text-xs font-medium text-[var(--dash-text-primary)]">
                          {proj.projectTitle || `Project ${projIndex + 1}`}
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                            <div>
                              <label className="block text-[10px] font-medium text-[var(--dash-text-secondary)] mb-1">
                                Project Title
                              </label>
                              <Input
                                name={`workExperience.${expIndex}.projects.${projIndex}.projectTitle`}
                                value={proj.projectTitle}
                                onChange={formik.handleChange}
                                className="h-7 bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[11px] text-[var(--dash-text-primary)]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-medium text-[var(--dash-text-secondary)] mb-1">
                                Role in Project
                              </label>
                              <Input
                                name={`workExperience.${expIndex}.projects.${projIndex}.role`}
                                value={proj.role}
                                onChange={formik.handleChange}
                                className="h-7 bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[11px] text-[var(--dash-text-primary)]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-medium text-[var(--dash-text-secondary)] mb-1">
                                Domain
                              </label>
                              <DomainSelectSearch
                                name={`workExperience.${expIndex}.projects.${projIndex}.domain`}
                                value={proj.domain}
                                onChange={(val) =>
                                  formik.setFieldValue(
                                    `workExperience.${expIndex}.projects.${projIndex}.domain`,
                                    val,
                                  )
                                }
                                placeholder="Select or enter industry domain..."
                                error={
                                  (
                                    formik.touched.workExperience?.[
                                      expIndex
                                    ] as any
                                  )?.projects?.[projIndex]?.domain &&
                                  (
                                    formik.errors.workExperience?.[
                                      expIndex
                                    ] as any
                                  )?.projects?.[projIndex]?.domain
                                    ? String(
                                        (
                                          formik.errors.workExperience?.[
                                            expIndex
                                          ] as any
                                        ).projects[projIndex].domain,
                                      )
                                    : undefined
                                }
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-medium text-[var(--dash-text-secondary)] mb-1">
                                  Start Date
                                </label>
                                <Input
                                  type="date"
                                  name={`workExperience.${expIndex}.projects.${projIndex}.startDate`}
                                  value={proj.startDate}
                                  onChange={formik.handleChange}
                                  onClick={(e) => {
                                    try {
                                      e.currentTarget.showPicker();
                                    } catch (err) {
                                      console.error("showPicker failed: ", err);
                                    }
                                  }}
                                  className="h-7 bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[11px] text-[var(--dash-text-primary)] cursor-pointer"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-medium text-[var(--dash-text-secondary)] mb-1">
                                  End Date
                                </label>
                                <Input
                                  type="date"
                                  name={`workExperience.${expIndex}.projects.${projIndex}.endDate`}
                                  value={proj.endDate}
                                  onChange={formik.handleChange}
                                  onClick={(e) => {
                                    try {
                                      e.currentTarget.showPicker();
                                    } catch (err) {
                                      console.error("showPicker failed: ", err);
                                    }
                                  }}
                                  className="h-7 bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[11px] text-[var(--dash-text-primary)] cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="text-[10px] text-rose-400 hover:text-rose-300"
                              onClick={() => {
                                const newExps = [
                                  ...formik.values.workExperience,
                                ];
                                newExps[expIndex].projects.splice(projIndex, 1);
                                formik.setFieldValue("workExperience", newExps);
                              }}
                            >
                              Remove Project
                            </button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
                <DashButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px] text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                  onClick={() => {
                    const newExps = [...formik.values.workExperience];
                    newExps[expIndex].projects.push({
                      projectTitle: "",
                      role: "",
                      startDate: "",
                      endDate: "",
                      domain: "",
                    });
                    formik.setFieldValue("workExperience", newExps);
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Project
                </DashButton>
              </div>
            ))}
            {formik.values.workExperience.length === 0 && (
              <div className="text-center py-6 text-[var(--dash-text-muted)] text-xs border border-dashed border-[var(--dash-card-border)] rounded-xl">
                No work experience added.
              </div>
            )}
          </div>
        </div>

        {/* 7. Personal Projects (Optional) */}
        <div className="p-6">
          <div className="flex items-center justify-between border-b border-[var(--dash-card-border)] pb-3 mb-6">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
                7. Personal Projects (Optional)
              </h3>
            </div>
            <Badge
              variant="outline"
              className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px]"
            >
              Optional
            </Badge>
          </div>

          <div className="space-y-4">
            {formik.values.personalProjects &&
              formik.values.personalProjects.map((proj, pIdx) => (
                <div
                  key={pIdx}
                  className="p-4 border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] rounded-xl space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-[var(--dash-card-border)] pb-2 mb-3">
                    <span className="text-xs font-semibold text-[var(--dash-text-primary)] flex items-center gap-1.5">
                      <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                      {proj.projectTitle || `Personal Project #${pIdx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formik.values.personalProjects];
                        updated.splice(pIdx, 1);
                        formik.setFieldValue("personalProjects", updated);
                      }}
                      className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20"
                    >
                      <X className="w-3 h-3" /> Remove Project
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                        Project Title <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        name={`personalProjects.${pIdx}.projectTitle`}
                        placeholder="e.g. AI Resume Matcher"
                        value={proj.projectTitle}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${
                          (formik.touched.personalProjects as any)?.[pIdx]
                            ?.projectTitle &&
                          (formik.errors.personalProjects as any)?.[pIdx]
                            ?.projectTitle
                            ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                            : ""
                        }`}
                      />
                      {(formik.touched.personalProjects as any)?.[pIdx]
                        ?.projectTitle &&
                        (formik.errors.personalProjects as any)?.[pIdx]
                          ?.projectTitle && (
                          <p className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4">
                            <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            </span>
                            <span className="leading-4 text-red-500">
                              {
                                (formik.errors.personalProjects as any)[pIdx]
                                  .projectTitle
                              }
                            </span>
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div id={`field-personalProjects.${pIdx}.projectUrl`} data-field={`personalProjects.${pIdx}.projectUrl`}>
                      <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                        GitHub Repo (Optional)
                      </label>
                      <div className="relative">
                        <Input
                          id={`input-personalProjects.${pIdx}.projectUrl`}
                          name={`personalProjects.${pIdx}.projectUrl`}
                          placeholder="https://github.com/..."
                          value={proj.projectUrl || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`h-[var(--dash-input-height)] pl-7 bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${
                            (formik.touched.personalProjects as any)?.[pIdx]?.projectUrl &&
                            (formik.errors.personalProjects as any)?.[pIdx]?.projectUrl
                              ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                              : ""
                          }`}
                        />
                        <LinkIcon className="w-3.5 h-3.5 text-[var(--dash-text-muted)] absolute left-2 top-2.5" />
                      </div>
                      {(formik.touched.personalProjects as any)?.[pIdx]?.projectUrl &&
                        (formik.errors.personalProjects as any)?.[pIdx]?.projectUrl && (
                          <p
                            id={`error-personalProjects.${pIdx}.projectUrl`}
                            className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                          >
                            <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            </span>
                            <span className="leading-4 text-red-500">
                              {(formik.errors.personalProjects as any)[pIdx].projectUrl}
                            </span>
                          </p>
                        )}
                    </div>

                    <div id={`field-personalProjects.${pIdx}.liveUrl`} data-field={`personalProjects.${pIdx}.liveUrl`}>
                      <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                        Live Link (Optional)
                      </label>
                      <div className="relative">
                        <Input
                          id={`input-personalProjects.${pIdx}.liveUrl`}
                          name={`personalProjects.${pIdx}.liveUrl`}
                          placeholder="https://yourproject.com"
                          value={proj.liveUrl || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`h-[var(--dash-input-height)] pl-7 bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${
                            (formik.touched.personalProjects as any)?.[pIdx]?.liveUrl &&
                            (formik.errors.personalProjects as any)?.[pIdx]?.liveUrl
                              ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                              : ""
                          }`}
                        />
                        <LinkIcon className="w-3.5 h-3.5 text-[var(--dash-text-muted)] absolute left-2 top-2.5" />
                      </div>
                      {(formik.touched.personalProjects as any)?.[pIdx]?.liveUrl &&
                        (formik.errors.personalProjects as any)?.[pIdx]?.liveUrl && (
                          <p
                            id={`error-personalProjects.${pIdx}.liveUrl`}
                            className="text-xs text-red-500 font-medium mt-1 flex items-start gap-1.5 leading-4"
                          >
                            <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            </span>
                            <span className="leading-4 text-red-500">
                              {(formik.errors.personalProjects as any)[pIdx].liveUrl}
                            </span>
                          </p>
                        )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                      Technologies / Stack Used
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={projectTechInputs[pIdx] || ""}
                        onChange={(e) =>
                          setProjectTechInputs({
                            ...projectTechInputs,
                            [pIdx]: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            (projectTechInputs[pIdx] || "").trim()
                          ) {
                            e.preventDefault();
                            const val = (projectTechInputs[pIdx] || "").trim();
                            const formatted =
                              val.charAt(0).toUpperCase() + val.slice(1);
                            const currentTechs = proj.technologies || [];
                            if (!currentTechs.includes(formatted)) {
                              formik.setFieldValue(
                                `personalProjects.${pIdx}.technologies`,
                                [...currentTechs, formatted],
                              );
                            }
                            setProjectTechInputs({
                              ...projectTechInputs,
                              [pIdx]: "",
                            });
                          }
                        }}
                        placeholder="e.g. React, Node.js, Python (Press Enter to add)"
                        className="h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)]"
                      />
                      <DashButton
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-[var(--dash-input-height)] px-3 text-xs"
                        onClick={() => {
                          const val = (projectTechInputs[pIdx] || "").trim();
                          if (val) {
                            const formatted =
                              val.charAt(0).toUpperCase() + val.slice(1);
                            const currentTechs = proj.technologies || [];
                            if (!currentTechs.includes(formatted)) {
                              formik.setFieldValue(
                                `personalProjects.${pIdx}.technologies`,
                                [...currentTechs, formatted],
                              );
                            }
                            setProjectTechInputs({
                              ...projectTechInputs,
                              [pIdx]: "",
                            });
                          }
                        }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </DashButton>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies &&
                        proj.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 gap-1 text-[10px] py-0.5"
                          >
                            {tech}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-indigo-200"
                              onClick={() => {
                                formik.setFieldValue(
                                  `personalProjects.${pIdx}.technologies`,
                                  proj.technologies.filter((t) => t !== tech),
                                );
                              }}
                            />
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                      Project Details / Key Features
                    </label>
                    <textarea
                      name={`personalProjects.${pIdx}.projectDetails`}
                      rows={2}
                      placeholder="Describe key features, responsibilities, architecture, or outcome..."
                      value={proj.projectDetails || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full rounded-md bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ))}

            {(!formik.values.personalProjects ||
              formik.values.personalProjects.length === 0) && (
              <div className="text-center py-5 text-[var(--dash-text-muted)] text-xs border border-dashed border-[var(--dash-card-border)] rounded-xl">
                No personal projects added yet. (Optional)
              </div>
            )}

            <DashButton
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-dashed border-indigo-500/30 w-full justify-center"
              onClick={() => {
                const current = formik.values.personalProjects || [];
                formik.setFieldValue("personalProjects", [
                  ...current,
                  {
                    projectTitle: "",
                    technologies: [],
                    projectUrl: "",
                    liveUrl: "",
                    projectDetails: "",
                  },
                ]);
              }}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Personal Project
            </DashButton>
          </div>
        </div>

        {/* 8. Education */}
        <div className="p-6">
          <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
              8. Education
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div id="field-education.degree" data-field="education.degree">
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                Degree <span className="text-rose-500">*</span>
              </label>
              <Input
                id="input-education.degree"
                name="education.degree"
                placeholder="e.g. B.Tech"
                value={formik.values.education.degree}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${formik.touched.education?.degree && formik.errors.education?.degree ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : ""}`}
              />
              {formik.touched.education?.degree &&
                formik.errors.education?.degree && (
                  <div id="error-education.degree" className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4">
                    <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    </span>
                    <span className="leading-4">{formik.errors.education.degree}</span>
                  </div>
                )}
            </div>
            <div
              id="field-education.institute"
              data-field="education.institute"
            >
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                Institute <span className="text-rose-500">*</span>
              </label>
              <Input
                id="input-education.institute"
                name="education.institute"
                placeholder="e.g. IIT Bombay"
                value={formik.values.education.institute}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${formik.touched.education?.institute && formik.errors.education?.institute ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : ""}`}
              />
              {formik.touched.education?.institute &&
                formik.errors.education?.institute && (
                  <div id="error-education.institute" className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4">
                    <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    </span>
                    <span className="leading-4">{formik.errors.education.institute}</span>
                  </div>
                )}
            </div>
            <div
              id="field-education.passingYear"
              data-field="education.passingYear"
            >
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                Passing Year <span className="text-rose-500">*</span>
              </label>
              <Input
                id="input-education.passingYear"
                name="education.passingYear"
                placeholder="e.g. 2021"
                value={formik.values.education.passingYear}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${formik.touched.education?.passingYear && formik.errors.education?.passingYear ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : ""}`}
              />
              {formik.touched.education?.passingYear &&
                formik.errors.education?.passingYear && (
                  <div id="error-education.passingYear" className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4">
                    <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    </span>
                    <span className="leading-4">{formik.errors.education.passingYear}</span>
                  </div>
                )}
            </div>
            <div
              id="field-education.cgpaOrPercentage"
              data-field="education.cgpaOrPercentage"
            >
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                Percentage / CGPA (Optional)
              </label>
              <Input
                id="input-education.cgpaOrPercentage"
                name="education.cgpaOrPercentage"
                placeholder="e.g. 85% or 8.8 CGPA"
                value={formik.values.education.cgpaOrPercentage || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)]"
              />
            </div>
          </div>
        </div>

        {/* 9. Links */}
        <div className="p-6">
          <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
            <LinkIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
              9. Links
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div id="field-links.linkedIn" data-field="links.linkedIn">
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                LinkedIn <span className="text-rose-500">*</span>
              </label>
              <Input
                id="input-links.linkedIn"
                name="links.linkedIn"
                placeholder="https://linkedin.com/in/..."
                value={formik.values.links.linkedIn}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${formik.touched.links?.linkedIn && formik.errors.links?.linkedIn ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : ""}`}
              />
              {formik.touched.links?.linkedIn &&
                formik.errors.links?.linkedIn && (
                  <div id="error-links.linkedIn" className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4">
                    <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    </span>
                    <span className="leading-4">{formik.errors.links.linkedIn}</span>
                  </div>
                )}
            </div>
            <div id="field-links.github" data-field="links.github">
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                GitHub (Optional)
              </label>
              <Input
                id="input-links.github"
                name="links.github"
                placeholder="https://github.com/..."
                value={formik.values.links.github}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${formik.touched.links?.github && formik.errors.links?.github ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : ""}`}
              />
              {formik.touched.links?.github &&
                formik.errors.links?.github && (
                  <div id="error-links.github" className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4">
                    <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    </span>
                    <span className="leading-4">{formik.errors.links.github}</span>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* 10. Rate Details */}
        <div className="p-6">
          <div className="flex items-center gap-2 border-b border-[var(--dash-card-border)] pb-3 mb-6">
            <DollarSign className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
              10. Rate Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div
              id="field-rateDetails.currency"
              data-field="rateDetails.currency"
            >
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                Currency <span className="text-rose-500">*</span>
              </label>
              <Select
                value={formik.values.rateDetails.currency}
                onValueChange={(val) => {
                  formik.setFieldValue("rateDetails.currency", val);
                  const newConfig = getBudgetConfig(
                    formik.values.rateDetails.rateType,
                    val,
                  );
                  if (formik.values.rateDetails.rateMax > newConfig.max) {
                    formik.setFieldValue("rateDetails.rateMax", newConfig.max);
                  }
                  if (formik.values.rateDetails.rateMin < newConfig.min) {
                    formik.setFieldValue("rateDetails.rateMin", newConfig.min);
                  }
                }}
              >
                <SelectTrigger
                  id="trigger-rateDetails.currency"
                  className="h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-xs">
                  <SelectItem value="INR (₹)">INR (₹)</SelectItem>
                  <SelectItem value="USD ($)">USD ($)</SelectItem>
                  <SelectItem value="GBP (£)">GBP (£)</SelectItem>
                  <SelectItem value="EUR (€)">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              id="field-rateDetails.rateType"
              data-field="rateDetails.rateType"
            >
              <label className="block text-[11px] font-medium text-[var(--dash-text-secondary)] mb-1">
                Rate Type <span className="text-rose-500">*</span>
              </label>
              <Select
                value={formik.values.rateDetails.rateType}
                onValueChange={(val) => {
                  formik.setFieldValue("rateDetails.rateType", val);
                  const newConfig = getBudgetConfig(
                    val,
                    formik.values.rateDetails.currency,
                  );
                  formik.setFieldValue("rateDetails.rateMin", newConfig.min);
                  formik.setFieldValue("rateDetails.rateMax", newConfig.max);
                }}
              >
                <SelectTrigger
                  id="trigger-rateDetails.rateType"
                  className="h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] text-xs">
                  <SelectItem value="Hourly">Hourly</SelectItem>
                  <SelectItem value="Daywise">Daywise</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="px-2">
            <style>{`
              .budget-thumb,
              .budget-thumb::-webkit-slider-thumb {
                -webkit-appearance: none;
                -webkit-tap-highlight-color: transparent;
              }
              .budget-thumb {
                pointer-events: none;
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                outline: none;
                background: none;
                margin: 0;
              }
              /* For Chrome/Safari/Opera/Edge */
              .budget-thumb::-webkit-slider-thumb {
                background-color: transparent;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                height: 24px;
                width: 24px;
                pointer-events: all;
                position: relative;
              }
              /* For Firefox */
              .budget-thumb::-moz-range-thumb {
                background-color: transparent;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                height: 24px;
                width: 24px;
                pointer-events: all;
                position: relative;
              }
            `}</style>
            <div
              className="relative h-6 flex items-center w-full mb-6 cursor-pointer"
              onClick={handleTrackClick}
            >
              <input
                type="range"
                min={config.min}
                max={config.max}
                step={config.step}
                value={formik.values.rateDetails.rateMin}
                onChange={(e) => {
                  const val = Math.min(
                    Number(e.target.value),
                    formik.values.rateDetails.rateMax,
                  );
                  formik.setFieldValue("rateDetails.rateMin", val);
                }}
                className="budget-thumb z-10"
              />
              <input
                type="range"
                min={config.min}
                max={config.max}
                step={config.step}
                value={formik.values.rateDetails.rateMax}
                onChange={(e) => {
                  const val = Math.max(
                    Number(e.target.value),
                    formik.values.rateDetails.rateMin,
                  );
                  formik.setFieldValue("rateDetails.rateMax", val);
                }}
                className="budget-thumb z-20"
              />
              <div className="w-full h-1.5 bg-[var(--dash-card-border)] rounded-full relative">
                <div
                  className="absolute h-full bg-indigo-500 rounded-full"
                  style={{
                    left: `${safeMinPercent}%`,
                    width: `${safeMaxPercent - safeMinPercent}%`,
                  }}
                />
                <div
                  className="rounded-full bg-indigo-500 border-2 border-white shadow-md pointer-events-none z-10 flex items-center justify-center absolute -top-[5px]"
                  style={{
                    left: `${minPercent}%`,
                    width: "16px",
                    height: "16px",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-indigo-600 text-[10px] !text-white keep-text-white rounded shadow-md pointer-events-none whitespace-nowrap"
                    style={{ color: "#ffffff" }}
                  >
                    {config.format(formik.values.rateDetails.rateMin)}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-600 w-0 h-0" />
                  </div>
                </div>
                <div
                  className="rounded-full bg-indigo-500 border-2 border-white shadow-md pointer-events-none z-20 flex items-center justify-center absolute -top-[5px]"
                  style={{
                    left: `${maxPercent}%`,
                    width: "16px",
                    height: "16px",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-indigo-600 text-[10px] !text-white rounded shadow-md pointer-events-none whitespace-nowrap"
                    style={{ color: "#ffffff" }}
                  >
                    {config.format(formik.values.rateDetails.rateMax)}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-600 w-0 h-0" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-[var(--dash-card-border)] pt-4">
              <div
                id="field-rateDetails.rateMin"
                data-field="rateDetails.rateMin"
              >
                <label className="block text-[11px] text-[var(--dash-text-secondary)] mb-1">
                  Minimum Rate
                </label>
                <Input
                  id="input-rateDetails.rateMin"
                  type="number"
                  min="0"
                  name="rateDetails.rateMin"
                  value={formik.values.rateDetails.rateMin}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    formik.setFieldValue("rateDetails.rateMin", val);
                  }}
                  onBlur={formik.handleBlur}
                  className={`h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${formik.touched.rateDetails?.rateMin && formik.errors.rateDetails?.rateMin ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : ""}`}
                />
                {formik.touched.rateDetails?.rateMin &&
                  formik.errors.rateDetails?.rateMin && (
                    <div id="error-rateDetails.rateMin" className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4">
                      <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      </span>
                      <span className="leading-4">{formik.errors.rateDetails.rateMin as string}</span>
                    </div>
                  )}
              </div>
              <div
                id="field-rateDetails.rateMax"
                data-field="rateDetails.rateMax"
              >
                <label className="block text-[11px] text-[var(--dash-text-secondary)] mb-1">
                  Maximum Rate
                </label>
                <Input
                  id="input-rateDetails.rateMax"
                  type="number"
                  min="0"
                  name="rateDetails.rateMax"
                  value={formik.values.rateDetails.rateMax}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    formik.setFieldValue("rateDetails.rateMax", val);
                  }}
                  onBlur={formik.handleBlur}
                  className={`h-[var(--dash-input-height)] bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] ${formik.touched.rateDetails?.rateMax && formik.errors.rateDetails?.rateMax ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : ""}`}
                />
                {formik.touched.rateDetails?.rateMax &&
                  formik.errors.rateDetails?.rateMax && (
                    <div id="error-rateDetails.rateMax" className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-1 leading-4">
                      <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      </span>
                      <span className="leading-4">{formik.errors.rateDetails.rateMax as string}</span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
        {/* 11. Achievements (Optional) */}
        <div className="p-6">
          <div className="flex items-center justify-between border-b border-[var(--dash-card-border)] pb-3 mb-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-semibold text-[var(--dash-text-primary)]">
                11. Achievements (Optional)
              </h3>
            </div>
            <DashButton
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                formik.setFieldValue("achievements", [
                  ...(formik.values.achievements || []),
                  "",
                ]);
              }}
            >
              <Plus className="w-3 h-3 mr-1" /> Add Achievement
            </DashButton>
          </div>

          <div className="space-y-4">
            {formik.values.achievements &&
              formik.values.achievements.map((achievement, idx) => (
                <div key={idx} className="flex gap-2 items-start relative">
                  <textarea
                    value={achievement}
                    onChange={(e) => {
                      const updated = [...formik.values.achievements];
                      updated[idx] = e.target.value;
                      formik.setFieldValue("achievements", updated);
                    }}
                    placeholder="Enter achievement details..."
                    className="flex-1 rounded-md bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] text-xs text-[var(--dash-text-primary)] p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formik.values.achievements];
                      updated.splice(idx, 1);
                      formik.setFieldValue("achievements", updated);
                    }}
                    className="mt-1 p-1.5 text-[var(--dash-text-muted)] hover:text-rose-400 bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            {(!formik.values.achievements ||
              formik.values.achievements.length === 0) && (
              <div className="text-center py-4 text-[var(--dash-text-muted)] text-xs border border-dashed border-[var(--dash-card-border)] rounded-xl">
                No achievements added.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="sticky bottom-0 z-50 flex items-center justify-between p-4 bg-[var(--dash-card-bg-solid)] border-t border-[var(--dash-card-border)] shrink-0">
        <div className="text-xs text-[var(--dash-text-secondary)] hidden sm:block">
          All mandatory fields marked with{" "}
          <span className="text-rose-500">*</span> must be filled.
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <DashButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
            className="text-xs"
          >
            Cancel
          </DashButton>
          <DashButton
            type="submit"
            variant="primary"
            size="sm"
            className="text-xs"
          >
            {submitButtonText || (isEdit ? "Save Changes" : "Add to Bench")}
          </DashButton>
        </div>
      </div>
    </form>
  );
}
