"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Layers,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Hash,
  FileText,
  Users,
  Calendar,
  AtSign,
  User,
  UserCircle,
} from "lucide-react";

/* ── Shared components ── */
import { StickyFooterActions } from "@/app/onboarding/components/StickyFooterActions";
import { FormCard } from "@/app/onboarding/components/FormCard";
import { InputField } from "@/app/onboarding/components/InputField";
import { PhoneNumberField } from "@/app/onboarding/components/PhoneNumberField";
import { TextareaField } from "@/app/onboarding/components/TextareaField";
import { MultiSelect } from "@/app/onboarding/components/MultiSelect";
import { TagInputField } from "@/app/onboarding/components/TagInputField";
export interface Category {
  id: string;
  name: string;
  isCustom?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  categoryIds: string[];
  isCustom?: boolean;
}
import { SuccessPage } from "@/app/onboarding/components/SuccessPage";
import { LoadingOverlay } from "@/app/onboarding/components/LoadingOverlay";
import { ToastContainer, useToast } from "@/app/onboarding/components/Toast";
import { OnboardingGuideMascot } from "@/app/onboarding/components/OnboardingGuideMascot";
import { CheckboxField } from "@/app/onboarding/components/CheckboxField";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { PhoneOtpVerification } from "@/app/onboarding/components/PhoneOtpVerification";
import { SocialCard } from "@/app/onboarding/components/SocialCard";
import { LocationAutocomplete } from "@/app/components/LocationAutocomplete";
import { SectionHeading } from "@/app/components/ui/section-heading";
import { OnboardingPageHeader } from "@/app/onboarding/components/OnboardingPageHeader";
import {
  SectionNavSidebar,
  NavSection,
  hasSectionError,
} from "@/app/onboarding/components/SectionNavSidebar";

/* ── Hooks ── */
import { useMultiStepForm } from "@/app/onboarding/hooks/useMultiStepForm";
import { useAutoSave } from "@/app/onboarding/hooks/useAutoSave";
import { useUnsavedChanges } from "@/app/onboarding/hooks/useUnsavedChanges";
import { useSignup } from "@/app/components/auth/SignupContext";

/* ── Schemas & data ── */
import {
  vendorFormSchema,
  vendorStepSchemas,
} from "@/app/onboarding/schemas/vendor.schema";
import type { VendorFormData } from "@/app/onboarding/schemas/vendor.schema";
import { fetchMockCompanyProfile } from "@/app/onboarding/utils/mockCompanyFetcher";
import {
  VENDOR_MODELS,
  COMPANY_SIZES,
  SOCIAL_PLATFORMS,
  CERTIFICATION_OPTIONS,
  TECH_STACK_OPTIONS,
  LEGAL_REGISTRATION_DOCS,
  INSURANCE_OPTIONS,
} from "@/app/onboarding/data/constants";

/* ── Default values ── */
const defaultValues: VendorFormData = {
  companyName: "",
  gstNumber: "",
  cin: "",
  websiteUrl: "",
  companyEmail: "",
  companyPhone: "",
  companyPhoneCountry: "IN",
  alternativePhone: "",
  alternativePhoneCountry: "IN",
  verifiedCompanyName: "",
  headquartersVerified: "",
  foundedYearVerified: "",
  aboutCompanyVerified: "",
  isVerified: false,
  contactName: "",
  designation: "",
  mobileNumber: "",
  phoneCountry: "IN",
  contactEmail: "",
  vendorModels: [],
  categories: [],
  skills: [],
  companySize: "",
  headquarters: "",
  headquartersCoordinates: undefined,
  foundedYear: "",
  certifications: [],
  aboutCompany: "",
  linkedinUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  complianceStatus: "" as any,
  legalDocs: [],
  complianceCertifications: [],
  insuranceOptions: [],
  declarationAccepted: false,
};

const CATEGORY_DATA = {
  frontend: {
    label: "Frontend Development",
    skills: [
      "React",
      "Next.js",
      "Vue.js",
      "Angular",
      "TypeScript",
      "Tailwind CSS",
      "HTML5/CSS3",
      "Redux",
    ],
  },
  backend: {
    label: "Backend Development",
    skills: [
      "Node.js",
      "Python",
      "Java",
      "Go",
      ".NET",
      "PHP",
      "Ruby on Rails",
      "FastAPI",
    ],
  },
  mobile: {
    label: "Mobile App Development",
    skills: [
      "React Native",
      "Flutter",
      "iOS (Swift)",
      "Android (Kotlin)",
      "Expo",
      "Ionic",
    ],
  },
  devops: {
    label: "DevOps & Cloud",
    skills: [
      "AWS",
      "Azure",
      "Google Cloud",
      "Docker",
      "Kubernetes",
      "Terraform",
      "CI/CD Pipelines",
      "Linux",
    ],
  },
  data_ai: {
    label: "Data & AI / ML",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "Computer Vision",
      "Data Engineering",
      "Python",
      "TensorFlow",
      "PyTorch",
    ],
  },
  cybersecurity: {
    label: "Cybersecurity",
    skills: [
      "Penetration Testing",
      "SOC Analysis",
      "Cloud Security",
      "Application Security",
      "Network Security",
      "SIEM",
    ],
  },
  blockchain: {
    label: "Blockchain & Web3",
    skills: [
      "Solidity",
      "Smart Contracts",
      "Ethereum",
      "Rust",
      "Web3.js",
      "Hardhat",
    ],
  },
  qa_testing: {
    label: "QA & Testing",
    skills: [
      "Selenium",
      "Cypress",
      "Jest",
      "Playwright",
      "Manual Testing",
      "Automation Testing",
    ],
  },
};

const MOCK_CATEGORIES = Object.entries(CATEGORY_DATA).map(([id, data]) => ({
  id,
  name: data.label,
}));

export function VendorOnboardingForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);

  const { toasts, addToast, removeToast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /* ── Load saved draft ── */
  const [savedDraft, setSavedDraft] = useState<Partial<VendorFormData> | null>(
    null,
  );
  useEffect(() => {
    try {
      const raw = localStorage.getItem("onboarding-draft-vendor");
      if (raw) {
        const timer = setTimeout(() => {
          setSavedDraft(JSON.parse(raw));
        }, 0);
        return () => clearTimeout(timer);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const { currentStep, isValidating, validateCurrentStep, form } =
    useMultiStepForm<VendorFormData>({
      totalSteps: 1,
      schema: vendorFormSchema,
      stepSchemas: [vendorFormSchema],
      defaultValues,
      savedValues: savedDraft || undefined,
      stepGates: {
        0: isPhoneVerified,
      },
      onGateFailed: (stepIndex) => {
        if (stepIndex === 0) {
          addToast({
            type: "error",
            title: "Phone Verification Required",
            message:
              "Please complete the mobile verification before proceeding.",
          });
        }
      },
    });

  const {
    register,
    formState: { errors, isDirty },
    watch,
    setValue,
    getValues,
  } = form;

  const watchedValues = watch();

  const {
    email: signupEmail,
    companyName: signupCompanyName,
    companyWebsite: signupCompanyWebsite,
  } = useSignup();
  const hasInitializedSignupDataRef = useRef(false);

  useEffect(() => {
    if (!hasInitializedSignupDataRef.current) {
      const currentValues = getValues();
      if (signupEmail && !currentValues.contactEmail) {
        setValue("contactEmail", signupEmail, { shouldValidate: true });
      }
      if (signupCompanyName && !currentValues.companyName) {
        setValue("companyName", signupCompanyName, { shouldValidate: true });
      }
      if (signupCompanyWebsite && !currentValues.websiteUrl) {
        setValue("websiteUrl", signupCompanyWebsite, { shouldValidate: true });
      }
      if (signupEmail || signupCompanyName || signupCompanyWebsite) {
        hasInitializedSignupDataRef.current = true;
      }
    }
  }, [
    signupEmail,
    signupCompanyName,
    signupCompanyWebsite,
    setValue,
    getValues,
  ]);

  /* ── Auto-save ── */
  const { clearDraft } = useAutoSave({
    key: "vendor",
    data: watchedValues,
    debounceMs: 3000,
  });

  /* ── Unsaved changes ── */
  useUnsavedChanges({ hasUnsavedChanges: isDirty && !isSubmitted });

  /* ── Submit ── */
  const onSubmit = useCallback(async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    clearDraft();
    addToast({
      type: "success",
      title: "Vendor Onboarding Submitted",
      message:
        "Your vendor registration has been received. Our team will review your credentials.",
    });
  }, [clearDraft, addToast]);

  // ── Helper handlers for document checklist toggling ──
  const toggleDoc = useCallback(
    (id: string) => {
      const current = getValues().legalDocs || [];
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      setValue("legalDocs", next, { shouldDirty: true, shouldValidate: true });
    },
    [getValues, setValue],
  );

  const toggleAllDocs = useCallback(() => {
    const current = getValues().legalDocs || [];
    const all = LEGAL_REGISTRATION_DOCS.map((d) => d.id);
    const next = current.length === all.length ? [] : all;
    setValue("legalDocs", next, { shouldDirty: true, shouldValidate: true });
  }, [getValues, setValue]);

  const toggleInsurance = useCallback(
    (id: string) => {
      const current = getValues().insuranceOptions || [];
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      setValue("insuranceOptions", next, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [getValues, setValue],
  );

  const toggleAllInsurance = useCallback(() => {
    const current = getValues().insuranceOptions || [];
    const all = INSURANCE_OPTIONS.map((i) => i.id);
    const next = current.length === all.length ? [] : all;
    setValue("insuranceOptions", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [getValues, setValue]);

  const handleCategoriesStringChange = useCallback(
    (selectedNames: string[]) => {
      const nextCategories: Category[] = selectedNames.map((rawName) => {
        const isCustom = rawName.endsWith(" (Others)");
        const cleanName = isCustom
          ? rawName.replace(" (Others)", "").trim()
          : rawName;
        const existing = (watchedValues.categories || []).find(
          (c) => c.name.toLowerCase() === cleanName.toLowerCase(),
        );
        if (existing) return existing;
        return {
          id: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name: cleanName,
          isCustom,
        };
      });

      setValue("categories", nextCategories, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [watchedValues.categories, setValue],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const isValid = validateCurrentStep();
      if (!isValid) {
        addToast({
          type: "error",
          title: "Validation Error",
          message: "Please fix the highlighted fields before submitting.",
        });
        return;
      }

      if (!isPhoneVerified) {
        addToast({
          type: "warning",
          title: "Mobile Verification Required",
          message:
            "Please verify your corporate contact mobile number with OTP before submitting.",
        });
        const el = document.getElementById("field-mobileNumber");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      if (!getValues().declarationAccepted) {
        addToast({
          type: "warning",
          title: "Declaration Required",
          message:
            "Please review and accept the declaration before submitting.",
        });
        const el =
          document.getElementById("field-declarationAccepted") ||
          document.getElementById("declarationAccepted");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      await onSubmit();
    },
    [isPhoneVerified, validateCurrentStep, onSubmit, addToast, getValues],
  );

  /* ── If submitted, show success ── */
  if (isSubmitted) {
    return (
      <div className="py-6">
        <SuccessPage type="vendor" companyName={watchedValues.companyName} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  const VENDOR_SECTION_FIELDS: Record<string, string[]> = {
    "company-details": ["companyName", "gstNumber", "cin"],
    "company-contact": [
      "companyEmail",
      "companyPhone",
      "alternativePhone",
      "websiteUrl",
    ],
    "point-of-contact": [
      "contactName",
      "designation",
      "contactEmail",
      "mobileNumber",
    ],
    "company-other-details": [
      "headquarters",
      "foundedYear",
      "companySize",
      "vendorModels",
      "certifications",
      "categories",
    ],
    "company-summary": ["aboutCompany"],
    compliance: ["complianceStatus", "legalDocs", "insuranceOptions"],
    "social-links": ["linkedinUrl", "twitterUrl", "instagramUrl"],
    declaration: ["declarationAccepted"],
  };

  const VENDOR_NAV_SECTIONS: NavSection[] = [
    {
      id: "company-details",
      label: "Company Registration Details",
      fields: VENDOR_SECTION_FIELDS["company-details"],
      hasError: hasSectionError(
        errors,
        VENDOR_SECTION_FIELDS["company-details"],
      ),
    },
    {
      id: "company-contact",
      label: "Company Contact Details",
      fields: VENDOR_SECTION_FIELDS["company-contact"],
      hasError: hasSectionError(
        errors,
        VENDOR_SECTION_FIELDS["company-contact"],
      ),
    },
    {
      id: "point-of-contact",
      label: "POC ( Point of Contact ) Details",
      fields: VENDOR_SECTION_FIELDS["point-of-contact"],
      hasError: hasSectionError(
        errors,
        VENDOR_SECTION_FIELDS["point-of-contact"],
      ),
    },
    {
      id: "company-other-details",
      label: "Company Other Details",
      fields: VENDOR_SECTION_FIELDS["company-other-details"],
      hasError: hasSectionError(
        errors,
        VENDOR_SECTION_FIELDS["company-other-details"],
      ),
    },
    {
      id: "company-summary",
      label: "Company Summary",
      fields: VENDOR_SECTION_FIELDS["company-summary"],
      hasError: hasSectionError(
        errors,
        VENDOR_SECTION_FIELDS["company-summary"],
      ),
    },
    {
      id: "compliance",
      label: "Compliance & Insurance",
      fields: VENDOR_SECTION_FIELDS["compliance"],
      hasError: hasSectionError(errors, VENDOR_SECTION_FIELDS["compliance"]),
    },
    {
      id: "social-links",
      label: "Digital Presence",
      fields: VENDOR_SECTION_FIELDS["social-links"],
      hasError: hasSectionError(errors, VENDOR_SECTION_FIELDS["social-links"]),
    },
    {
      id: "declaration",
      label: "Declaration",
      fields: VENDOR_SECTION_FIELDS["declaration"],
      hasError: hasSectionError(errors, VENDOR_SECTION_FIELDS["declaration"]),
    },
  ];

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 auth-modal-root text-[var(--ob-text)]"
    >
      {/* ── Page Header (Full Width at Top) ── */}
      <OnboardingPageHeader role="vendor" />

      {/* ── Body: Floating Sidebar + Scrollable Form ── */}
      <div className="flex flex-1 relative items-start gap-8 px-4 sm:px-6 lg:px-8 py-2">
        {/* ── Left sidebar nav (Sticky to left side on scroll) ── */}
        <aside className="hidden lg:block flex-shrink-0 w-[19.5rem] z-20 self-start sticky top-6">
          <SectionNavSidebar
            sections={VENDOR_NAV_SECTIONS}
            errors={errors}
            scrollContainerRef={scrollContainerRef}
          />
        </aside>

        {/* ── Form content ── */}
        <div
          ref={scrollContainerRef}
          className="flex-1 min-w-0 w-full space-y-6"
        >
          {/* ═══════ Section 1: Company Registration Details ═══════ */}
          <div id="section-company-details">
            <FormCard>
              <SectionHeading
                title="Company Registration Details"
                icon={<Building2 className="w-5 h-5 text-[#005A9C]" />}
                description="Official vendor organization registration and identity"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Company Name"
                  placeholder="e.g. Example Corp Pvt Ltd"
                  required
                  leftIcon={<Building2 className="w-4 h-4" />}
                  error={errors.companyName?.message}
                  {...register("companyName")}
                />

                <InputField
                  label="CIN Number"
                  placeholder="e.g. U12345MH2020PTC123456"
                  helperText="21 characters"
                  leftIcon={<FileText className="w-4 h-4" />}
                  error={errors.cin?.message}
                  {...register("cin")}
                />

                <InputField
                  label="GST Number"
                  placeholder="e.g. 22AAAAA0000A1Z5"
                  helperText="15 characters"
                  required
                  leftIcon={<Hash className="w-4 h-4" />}
                  error={errors.gstNumber?.message}
                  {...register("gstNumber")}
                />
              </div>
            </FormCard>
          </div>

          {/* ═══════ Section 2 & 3: Company Contact & POC Details ═══════ */}
          <div id="section-company-contact">
            <FormCard>
              <SectionHeading
                title="Company Contact Details"
                icon={<Phone className="w-5 h-5 text-[#005A9C]" />}
                description="Primary company communication and reachability channels"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Company Email"
                  placeholder="e.g. contact@example.com"
                  required
                  type="email"
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={errors.companyEmail?.message}
                  {...register("companyEmail")}
                />

                <PhoneNumberField
                  label="Company Contact Number"
                  name="companyPhone"
                  required
                  placeholder="98765 43210"
                  leftIcon={<Phone className="w-4 h-4" />}
                  error={errors.companyPhone?.message}
                  value={watchedValues.companyPhone}
                  countryValue={watchedValues.companyPhoneCountry as any}
                  onChange={(val) =>
                    setValue("companyPhone", val || "", {
                      shouldValidate: true,
                    })
                  }
                  onCountryChange={(c) =>
                    setValue("companyPhoneCountry", c, {
                      shouldValidate: true,
                    })
                  }
                  onBlur={() => {
                    const { register } = form;
                    const reg = register("companyPhone");
                    reg.onBlur({
                      target: { name: "companyPhone" },
                    } as any);
                  }}
                />

                <PhoneNumberField
                  label="Alternative Contact Number"
                  name="alternativePhone"
                  placeholder="98765 43210"
                  leftIcon={<Phone className="w-4 h-4" />}
                  error={errors.alternativePhone?.message}
                  value={watchedValues.alternativePhone}
                  countryValue={watchedValues.alternativePhoneCountry as any}
                  onChange={(val) =>
                    setValue("alternativePhone", val || "", {
                      shouldValidate: true,
                    })
                  }
                  onCountryChange={(c) =>
                    setValue("alternativePhoneCountry", c, {
                      shouldValidate: true,
                    })
                  }
                  onBlur={() => {
                    const { register } = form;
                    const reg = register("alternativePhone");
                    reg.onBlur({
                      target: { name: "alternativePhone" },
                    } as any);
                  }}
                />

                <InputField
                  label="Company Website"
                  placeholder="e.g. https://example.com"
                  required
                  leftIcon={<Globe className="w-4 h-4" />}
                  error={errors.websiteUrl?.message}
                  {...register("websiteUrl")}
                />
              </div>

              {/* ── Section Divider ── */}
              <div className="border-t border-slate-200 my-8" />

              {/* ── Section: Point of Contact ── */}
              <div id="section-point-of-contact" className="scroll-mt-6">
                <SectionHeading
                  title="POC ( Point of Contact ) Details"
                  icon={<UserCircle className="w-5 h-5 text-[#005A9C]" />}
                  description="Authorized representative for talent engagement and correspondence"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name"
                    required
                    placeholder="Your full name"
                    leftIcon={<User className="w-4 h-4" />}
                    error={errors.contactName?.message}
                    {...register("contactName")}
                  />

                  <InputField
                    label="Designation"
                    required
                    placeholder="e.g. Director, HR Lead"
                    leftIcon={<Briefcase className="w-4 h-4" />}
                    error={errors.designation?.message}
                    {...register("designation")}
                  />

                  <InputField
                    label="Official Email"
                    required
                    placeholder="you@company.com"
                    type="email"
                    leftIcon={<AtSign className="w-4 h-4" />}
                    error={errors.contactEmail?.message}
                    {...register("contactEmail")}
                  />

                  <PhoneOtpVerification
                    phoneNumber={watchedValues.mobileNumber}
                    isVerified={isPhoneVerified}
                    onVerified={() => setIsPhoneVerified(true)}
                    onOtpSentChange={setIsOtpSent}
                    inline
                  >
                    <PhoneNumberField
                      label="Official Contact Number"
                      name="mobileNumber"
                      required
                      placeholder="98765 43210"
                      leftIcon={<Phone className="w-4 h-4" />}
                      error={errors.mobileNumber?.message}
                      disabled={isPhoneVerified || isOtpSent}
                      value={watchedValues.mobileNumber}
                      countryValue={watchedValues.phoneCountry as any}
                      onChange={(val) =>
                        setValue("mobileNumber", val || "", {
                          shouldValidate: true,
                        })
                      }
                      onCountryChange={(c) =>
                        setValue("phoneCountry", c, { shouldValidate: true })
                      }
                      onBlur={() => {
                        const { register } = form;
                        register("mobileNumber").onBlur({
                          target: { name: "mobileNumber" },
                        } as any);
                      }}
                    />
                  </PhoneOtpVerification>
                </div>
              </div>
            </FormCard>
          </div>

          {/* ═══════ Section 4: Company Other Details ═══════ */}
          <div id="section-company-other-details">
            <FormCard>
              <SectionHeading
                title="Company Other Details"
                icon={<Briefcase className="w-5 h-5 text-[#005A9C]" />}
                description="Headquarters, engagement models, certifications, and tech stack"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LocationAutocomplete
                  required
                  theme="light"
                  label="Headquarters"
                  name="headquarters"
                  value={watchedValues.headquarters || ""}
                  error={errors.headquarters?.message}
                  onChange={(val, suggestion) => {
                    setValue("headquarters", val, { shouldValidate: true });
                    setValue(
                      "headquartersCoordinates",
                      suggestion
                        ? {
                            latitude: suggestion.latitude,
                            longitude: suggestion.longitude,
                            provider: suggestion.provider,
                          }
                        : undefined,
                    );
                  }}
                />

                <InputField
                  label="Founded Year"
                  required
                  placeholder="e.g. 2018"
                  leftIcon={<Calendar className="w-4 h-4" />}
                  error={errors.foundedYear?.message}
                  {...register("foundedYear")}
                />

                <div
                  className="space-y-1.5"
                  id="field-companySize"
                  data-field="companySize"
                >
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                    <span className="text-[#005A9C] flex items-center justify-center shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5">
                      <Users className="w-4 h-4" />
                    </span>
                    <span>Company Size</span>
                  </label>
                  <Select
                    value={watchedValues.companySize || ""}
                    onValueChange={(val) =>
                      setValue("companySize", val, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger
                      id="select-trigger-companySize"
                      className="relative w-full h-[var(--dash-input-height)] px-4 rounded-xl border border-slate-300 bg-white text-small-xs font-medium text-slate-900 transition-all duration-200 hover:border-slate-400 focus:border-[#005A9C] focus:bg-white focus:ring-2 focus:ring-[#005A9C]/20 cursor-pointer"
                    >
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-slate-900 border border-slate-200 shadow-xl">
                      {COMPANY_SIZES.map((option) => (
                        <SelectItem
                          key={option.id}
                          value={option.id}
                          className="text-slate-700 hover:bg-slate-100 focus:bg-[#EFF6FF] focus:text-[#005A9C] cursor-pointer"
                        >
                          {option.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <MultiSelect
                  label="Engagement Models"
                  name="vendorModels"
                  options={VENDOR_MODELS.map((m) => m.title)}
                  value={(watchedValues.vendorModels || [])
                    .map(
                      (id) =>
                        VENDOR_MODELS.find((m) => m.id === id)?.title || "",
                    )
                    .filter(Boolean)}
                  onChange={(selectedTitles) => {
                    let selectedIds: string[];

                    if (selectedTitles.includes("Both")) {
                      selectedIds = ["c2c", "c2h"];
                    } else {
                      selectedIds = selectedTitles
                        .map(
                          (title) =>
                            VENDOR_MODELS.find((m) => m.title === title)?.id ||
                            "",
                        )
                        .filter((id) => id && id !== "both");
                    }

                    setValue("vendorModels", selectedIds, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  required
                  showCheckboxes
                  placeholder="Select engagement models…"
                  error={errors.vendorModels?.message}
                  leftIcon={<Layers className="w-4 h-4" />}
                />

                {/* Certifications (Full Width) */}
                <div className="col-span-1 md:col-span-2">
                  <TagInputField
                    label="Company Certifications"
                    name="certifications"
                    suggestions={CERTIFICATION_OPTIONS}
                    value={watchedValues.certifications || []}
                    onChange={(selected) =>
                      setValue("certifications", selected, {
                        shouldDirty: true,
                      })
                    }
                    placeholder="e.g. ISO 27001, SOC 2, HIPAA..."
                    error={errors.certifications?.message}
                  />
                </div>

                {/* Tech Stack (Full Width) */}
                <div className="col-span-1 md:col-span-2">
                  <TagInputField
                    label="Tech Stack"
                    name="categories"
                    required
                    suggestions={TECH_STACK_OPTIONS}
                    value={(watchedValues.categories || []).map((c) => c.name)}
                    onChange={handleCategoriesStringChange}
                    placeholder="e.g. React, Next.js, Python, AWS..."
                    error={(errors.categories as any)?.message}
                  />
                </div>
              </div>

              {/* ── Section Divider ── */}
              <div className="border-t border-slate-200 my-8" />

              {/* ── Section: Company Summary ── */}
              <div id="section-company-summary" className="scroll-mt-6">
                <SectionHeading
                  title="Company Summary"
                  icon={<FileText className="w-5 h-5 text-[#005A9C]" />}
                  description="Describe your company's core competencies, unique strengths, and the kind of talent you provide"
                />
                <TextareaField
                  placeholder="Describe your company's core competencies, unique strengths, and the kind of talent you provide…"
                  maxLength={1000}
                  rows={6}
                  value={watchedValues.aboutCompany || ""}
                  error={errors.aboutCompany?.message}
                  leftIcon={<FileText className="w-4 h-4" />}
                  {...register("aboutCompany")}
                />
              </div>
            </FormCard>
          </div>

          {/* ═══════ Section 6: Compliance & Insurance Check ═══════ */}
          <div id="section-compliance">
            <FormCard>
              <SectionHeading
                title="Compliance & Insurance"
                icon={<ShieldCheck className="w-5 h-5 text-[#005A9C]" />}
                description="Statutory compliance, legal registration documents, and insurance coverage"
              />

              <div className="space-y-4" id="field-complianceStatus">
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                  Compliance and Insurance check for the vendor
                  <span className="text-rose-500 font-semibold">*</span>
                </label>

                <div className="flex flex-row gap-3">
                  {/* Yes Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setValue("complianceStatus", "yes", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className={`flex items-center gap-2 flex-1 h-[var(--dash-input-height)] px-3 rounded-lg border cursor-pointer transition-all duration-200 text-left text-xs font-medium inline-flex justify-start whitespace-nowrap ${
                      watchedValues.complianceStatus === "yes"
                        ? "border-[#005A9C] bg-[#EFF6FF] text-[#005A9C] ring-1 ring-[#005A9C]/30"
                        : errors.complianceStatus &&
                            !watchedValues.complianceStatus
                          ? "border-rose-300 bg-rose-50/20 text-slate-700 hover:border-rose-400 hover:bg-rose-50/30"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        watchedValues.complianceStatus === "yes"
                          ? "border-[#005A9C] bg-[#EFF6FF]"
                          : errors.complianceStatus &&
                              !watchedValues.complianceStatus
                            ? "border-rose-400 bg-white"
                            : "border-slate-300 bg-white"
                      }`}
                    >
                      {watchedValues.complianceStatus === "yes" && (
                        <div className="w-2 h-2 rounded-full bg-[#005A9C]" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck
                        className={`w-4 h-4 ${
                          watchedValues.complianceStatus === "yes"
                            ? "text-[#005A9C]"
                            : "text-slate-400"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          watchedValues.complianceStatus === "yes"
                            ? "text-[#005A9C]"
                            : "text-slate-700"
                        }`}
                      >
                        Yes, we are compliant
                      </span>
                    </div>
                  </Button>

                  {/* No Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setValue("complianceStatus", "no", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className={`flex items-center gap-2 flex-1 h-[var(--dash-input-height)] px-3 rounded-lg border cursor-pointer transition-all duration-200 text-left text-xs font-medium inline-flex justify-start whitespace-nowrap ${
                      watchedValues.complianceStatus === "no"
                        ? "border-amber-500 bg-amber-50 text-amber-700 ring-1 ring-amber-500/30"
                        : errors.complianceStatus &&
                            !watchedValues.complianceStatus
                          ? "border-rose-300 bg-rose-50/20 text-slate-700 hover:border-rose-400 hover:bg-rose-50/30"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        watchedValues.complianceStatus === "no"
                          ? "border-amber-500 bg-amber-100"
                          : errors.complianceStatus &&
                              !watchedValues.complianceStatus
                            ? "border-rose-400 bg-white"
                            : "border-slate-300 bg-white"
                      }`}
                    >
                      {watchedValues.complianceStatus === "no" && (
                        <div className="w-2 h-2 rounded-full bg-amber-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck
                        className={`w-4 h-4 ${
                          watchedValues.complianceStatus === "no"
                            ? "text-amber-600"
                            : "text-slate-400"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          watchedValues.complianceStatus === "no"
                            ? "text-amber-900"
                            : "text-slate-700"
                        }`}
                      >
                        No, need assistance
                      </span>
                    </div>
                  </Button>
                </div>

                {errors.complianceStatus?.message && (
                  <p className="text-xs text-rose-500 font-medium flex items-start gap-1.5 mt-1 leading-4">
                    <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                      <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                    </span>
                    <span className="leading-4">
                      {errors.complianceStatus.message}
                    </span>
                  </p>
                )}

                <AnimatePresence>
                  {watchedValues.complianceStatus === "yes" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-4 pt-4 border-t border-[var(--ob-divider)] space-y-6"
                    >
                      {/* Section: Legal Docs */}
                      <div className="space-y-2" id="field-legalDocs">
                        {errors.legalDocs?.message && (
                          <div
                            id="error-legalDocs"
                            className="flex items-start gap-2 p-3 mb-2 rounded-xl border !border-red-500 bg-red-50/50 text-xs text-red-600 font-medium leading-4"
                            role="alert"
                          >
                            <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                            </span>
                            <span className="leading-4">
                              {errors.legalDocs.message}
                            </span>
                          </div>
                        )}
                        <CheckboxField
                          label="Legal Registration & Tax Documents"
                          name="toggle-all-docs"
                          checked={LEGAL_REGISTRATION_DOCS.every((d) =>
                            (watchedValues.legalDocs || []).includes(d.id),
                          )}
                          onChange={toggleAllDocs}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-8">
                          {LEGAL_REGISTRATION_DOCS.map((doc) => (
                            <CheckboxField
                              key={doc.id}
                              label={doc.label}
                              name={`doc-${doc.id}`}
                              checked={(watchedValues.legalDocs || []).includes(
                                doc.id,
                              )}
                              onChange={() => toggleDoc(doc.id)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Section: Insurance */}
                      <div
                        className="space-y-2"
                        id="field-insuranceOptions"
                        data-field="insuranceOptions"
                      >
                        <CheckboxField
                          label="Insurance"
                          name="toggle-all-insurance"
                          checked={INSURANCE_OPTIONS.every((i) =>
                            (watchedValues.insuranceOptions || []).includes(
                              i.id,
                            ),
                          )}
                          onChange={toggleAllInsurance}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-8">
                          {INSURANCE_OPTIONS.map((ins) => (
                            <CheckboxField
                              key={ins.id}
                              label={ins.label}
                              name={`ins-${ins.id}`}
                              checked={(
                                watchedValues.insuranceOptions || []
                              ).includes(ins.id)}
                              onChange={() => toggleInsurance(ins.id)}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FormCard>
          </div>

          {/* ═══════ Section 7: Digital Presence ═══════ */}
          <div id="section-social-links">
            <FormCard>
              <SectionHeading
                title="Digital Presence"
                icon={<Globe className="w-5 h-5 text-[#005A9C]" />}
                description="Add your company's social media profiles"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SocialCard
                  platform={SOCIAL_PLATFORMS[0]}
                  required
                  value={watchedValues.linkedinUrl || ""}
                  error={errors.linkedinUrl?.message}
                  {...register("linkedinUrl")}
                />
                <SocialCard
                  platform={SOCIAL_PLATFORMS[1]}
                  value={watchedValues.twitterUrl || ""}
                  error={errors.twitterUrl?.message}
                  {...register("twitterUrl")}
                />
                <SocialCard
                  platform={SOCIAL_PLATFORMS[2]}
                  value={watchedValues.instagramUrl || ""}
                  error={errors.instagramUrl?.message}
                  {...register("instagramUrl")}
                />
              </div>
            </FormCard>
          </div>

          {/* ═══════ Section 8: Declaration ═══════ */}
          <div id="section-declaration">
            <FormCard
              className={`!p-4 sm:!py-3.5 sm:!px-6 transition-all duration-200 ${
                errors.declarationAccepted?.message
                  ? "!border-red-500 bg-red-50/10"
                  : ""
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
                      checked={!!watchedValues.declarationAccepted}
                      onChange={(e) =>
                        setValue("declarationAccepted", e.target.checked, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      className={`h-4 w-4 rounded border-slate-300 accent-primary accent-[#005A9C] text-[#005A9C] focus:ring-[#005A9C] cursor-pointer flex-shrink-0 ${
                        errors.declarationAccepted?.message
                          ? "!border-red-500"
                          : ""
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-900">
                      Declaration
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    I confirm that the information provided is accurate and that
                    the above documents and corporate credentials are authentic
                    and will be provided to the Company upon request. I
                    understand that failure to provide the required documents or
                    providing false details may result in rejection or
                    suspension of vendor registration.
                  </p>
                </label>
              </div>
              {errors.declarationAccepted?.message && (
                <div
                  id="error-declarationAccepted"
                  className="flex items-start gap-1.5 text-xs text-red-500 font-medium mt-2 pl-1 leading-4"
                  role="alert"
                >
                  <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                  </span>
                  <span className="leading-4">
                    {errors.declarationAccepted.message}
                  </span>
                </div>
              )}
            </FormCard>
          </div>

          {/* Sticky footer actions */}
          <StickyFooterActions
            isFirstStep={true}
            isLastStep={true}
            onPrevious={() => {}}
            onNext={handleSubmit as any}
            isValidating={isValidating}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {(isSubmitting || isEnriching) && (
          <LoadingOverlay
            variant="light"
            message={isEnriching ? "" : "Submitting your registration..."}
            loaderText={isSubmitting ? "Submitting" : "Fetching"}
          />
        )}
      </AnimatePresence>

      {/* Helpful focus-driven field guide mascot */}
      <OnboardingGuideMascot formRef={formRef} role="vendor" errors={errors} />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </form>
  );
}
