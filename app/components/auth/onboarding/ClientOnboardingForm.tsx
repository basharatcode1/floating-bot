"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  UserCircle,
  Briefcase,
  Mail,
  Calendar,
  Sparkles,
  Phone,
  Hash,
  Globe,
  FileText,
  Users,
  AlertCircle,
} from "lucide-react";

import { StickyFooterActions } from "@/app/onboarding/components/StickyFooterActions";
import {
  SectionNavSidebar,
  NavSection,
  hasSectionError,
} from "@/app/onboarding/components/SectionNavSidebar";
import { FormCard } from "@/app/onboarding/components/FormCard";
import { OnboardingPageHeader } from "@/app/onboarding/components/OnboardingPageHeader";
import { InputField } from "@/app/onboarding/components/InputField";
import { PhoneNumberField } from "@/app/onboarding/components/PhoneNumberField";
import { TextareaField } from "@/app/onboarding/components/TextareaField";
import { TagInputField } from "@/app/onboarding/components/TagInputField";
import { SingleSelectSearch } from "@/app/onboarding/components/SingleSelectSearch";
import { SocialCard } from "@/app/onboarding/components/SocialCard";
import { LocationAutocomplete } from "@/app/components/LocationAutocomplete";

import { SuccessPage } from "@/app/onboarding/components/SuccessPage";
import { LoadingOverlay } from "@/app/onboarding/components/LoadingOverlay";
import { ToastContainer, useToast } from "@/app/onboarding/components/Toast";
import { OnboardingGuideMascot } from "@/app/onboarding/components/OnboardingGuideMascot";
import { PhoneOtpVerification } from "@/app/onboarding/components/PhoneOtpVerification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { SectionHeading } from "@/app/components/ui/section-heading";

/* ── Hooks ── */
import { useMultiStepForm } from "@/app/onboarding/hooks/useMultiStepForm";
import { useAutoSave } from "@/app/onboarding/hooks/useAutoSave";
import { useUnsavedChanges } from "@/app/onboarding/hooks/useUnsavedChanges";
import { useSignup } from "@/app/components/auth/SignupContext";

/* ── Schemas & data ── */
import {
  clientFormSchema,
  clientStepSchemas,
  clientStep1Schema,
} from "@/app/onboarding/schemas/client.schema";
import type { ClientFormData } from "@/app/onboarding/schemas/client.schema";
import { fetchMockCompanyProfile } from "@/app/onboarding/utils/mockCompanyFetcher";
import {
  CLIENT_STEPS,
  INDUSTRIES,
  COMPANY_SIZES,
  SOCIAL_PLATFORMS,
  CERTIFICATION_OPTIONS,
} from "@/app/onboarding/data/constants";

/* ── Slide animation variants ── */
const slideVariants = {
  enter: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? -40 : 40,
    opacity: 0,
  }),
};

/* ── Default values ── */
const defaultValues: ClientFormData = {
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
  domain: "",
  headquarters: "",
  headquartersCoordinates: undefined,
  companySize: "",
  foundedYear: "",
  certifications: [],
  aboutCompany: "",
  linkedinUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  declarationAccepted: false,
};

export function ClientOnboardingForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const { toasts, addToast, removeToast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /* ── Load saved draft ── */
  const [savedDraft, setSavedDraft] = useState<Partial<ClientFormData> | null>(
    null,
  );
  useEffect(() => {
    try {
      const raw = localStorage.getItem("onboarding-draft-client");
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

  useEffect(() => {
    if (isOtpSent && scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [isOtpSent]);

  const {
    currentStep,
    isFirstStep,
    isLastStep,
    direction,
    form,
    goToStep,
    goNext,
    goPrevious,
    isValidating,
    validateCurrentStep,
  } = useMultiStepForm<ClientFormData>({
    totalSteps: 1,
    schema: clientFormSchema,
    stepSchemas: [clientFormSchema],
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
          message: "Please complete the mobile verification before proceeding.",
        });
      }
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

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
    key: "client",
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
  }, [clearDraft]);

  const handleNextWithEnrichment = useCallback(async () => {
    if (currentStep === 0) {
      // 1. Validate Form Schema for Step 1
      const values = getValues();
      const step1Result = clientStep1Schema.safeParse(values);
      if (!step1Result.success) {
        await goNext();
        return;
      }

      // 2. Check if Step 1 Gate (Phone verification) is satisfied
      if (!isPhoneVerified) {
        await goNext(); // This will trigger gate failure and fire the phone verification warning toast
        return;
      }

      // 3. Only enrich if form validation and step gates pass
      setIsEnriching(true);
      try {
        const enriched = await fetchMockCompanyProfile(
          values.companyName || "",
          values.websiteUrl || "",
        );

        if (!values.domain)
          setValue("domain", enriched.domain, {
            shouldValidate: false,
            shouldDirty: true,
          });
        if (!values.headquarters)
          setValue("headquarters", enriched.headquarters, {
            shouldValidate: false,
            shouldDirty: true,
          });
        if (!values.foundedYear)
          setValue("foundedYear", enriched.foundedYear, {
            shouldValidate: false,
            shouldDirty: true,
          });
        if (!values.aboutCompany)
          setValue("aboutCompany", enriched.aboutCompany, {
            shouldValidate: false,
            shouldDirty: true,
          });
        if (!values.linkedinUrl)
          setValue("linkedinUrl", enriched.linkedinUrl, {
            shouldValidate: false,
            shouldDirty: true,
          });
        if (!values.twitterUrl)
          setValue("twitterUrl", enriched.twitterUrl, {
            shouldValidate: false,
            shouldDirty: true,
          });
        if (!values.instagramUrl)
          setValue("instagramUrl", enriched.instagramUrl, {
            shouldValidate: false,
            shouldDirty: true,
          });

        addToast({
          type: "success",
          title: "Company Profile Enriched",
          message:
            "Successfully fetched company information and social profiles.",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsEnriching(false);
      }
    }

    await goNext();
  }, [currentStep, getValues, goNext, setValue, addToast, isPhoneVerified]);

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
        <SuccessPage type="client" companyName={watchedValues.companyName} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  const CLIENT_SECTION_FIELDS: Record<string, string[]> = {
    "company-details": ["companyName", "cin", "gstNumber"],
    "company-contact": [
      "companyEmail",
      "companyPhone",
      "alternativePhone",
      "websiteUrl",
    ],
    "primary-contact": [
      "contactName",
      "designation",
      "contactEmail",
      "mobileNumber",
    ],
    "company-other-details": [
      "headquarters",
      "domain",
      "companySize",
      "foundedYear",
      "certifications",
    ],
    "company-summary": ["aboutCompany"],
    "social-links": ["linkedinUrl", "twitterUrl", "instagramUrl"],
    declaration: ["declarationAccepted"],
  };

  const CLIENT_NAV_SECTIONS: NavSection[] = [
    {
      id: "company-details",
      label: "Company Registration Details",
      fields: CLIENT_SECTION_FIELDS["company-details"],
      hasError: hasSectionError(
        errors,
        CLIENT_SECTION_FIELDS["company-details"],
      ),
    },
    {
      id: "company-contact",
      label: "Company Contact Details",
      fields: CLIENT_SECTION_FIELDS["company-contact"],
      hasError: hasSectionError(
        errors,
        CLIENT_SECTION_FIELDS["company-contact"],
      ),
    },
    {
      id: "primary-contact",
      label: "POC ( Point of Contact ) Details",
      fields: CLIENT_SECTION_FIELDS["primary-contact"],
      hasError: hasSectionError(
        errors,
        CLIENT_SECTION_FIELDS["primary-contact"],
      ),
    },
    {
      id: "company-other-details",
      label: "Company Other Details",
      fields: CLIENT_SECTION_FIELDS["company-other-details"],
      hasError: hasSectionError(
        errors,
        CLIENT_SECTION_FIELDS["company-other-details"],
      ),
    },
    {
      id: "company-summary",
      label: "Company Summary",
      fields: CLIENT_SECTION_FIELDS["company-summary"],
      hasError: hasSectionError(
        errors,
        CLIENT_SECTION_FIELDS["company-summary"],
      ),
    },
    {
      id: "social-links",
      label: "Digital Presence",
      fields: CLIENT_SECTION_FIELDS["social-links"],
      hasError: hasSectionError(errors, CLIENT_SECTION_FIELDS["social-links"]),
    },
    {
      id: "declaration",
      label: "Declaration",
      fields: CLIENT_SECTION_FIELDS["declaration"],
      hasError: hasSectionError(errors, CLIENT_SECTION_FIELDS["declaration"]),
    },
  ];

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 auth-modal-root text-[var(--ob-text)]"
    >
      {/* ── Page Header (Full Width at Top) ── */}
      <OnboardingPageHeader role="client" />

      {/* ── Body: Floating Sidebar + Scrollable Form ── */}
      <div className="flex flex-1 relative items-start gap-8 px-4 sm:px-6 lg:px-8 py-2">
        {/* ── Left sidebar nav (Sticky to left side on scroll) ── */}
        <aside className="hidden lg:block flex-shrink-0 w-[19.5rem] z-20 self-start sticky top-6">
          <SectionNavSidebar
            sections={CLIENT_NAV_SECTIONS}
            errors={errors}
            scrollContainerRef={scrollContainerRef}
          />
        </aside>

        {/* ── Form content ── */}
        <div
          ref={scrollContainerRef}
          className="flex-1 min-w-0 w-full space-y-6"
        >
          <div id="section-company-details">
            <FormCard>
              <SectionHeading
                title="Company Registration Details"
                icon={<Building2 className="w-5 h-5" />}
                description="Official organization registration and identity"
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

          <div id="section-company-contact">
            <FormCard>
              <SectionHeading
                title="Company Contact Details"
                icon={<Phone className="w-5 h-5" />}
                description="Official company communication and reachability channels"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Company Email"
                  placeholder="e.g. contact@example.com"
                  required
                  type="email"
                  error={errors.companyEmail?.message}
                  {...register("companyEmail")}
                />

                <PhoneNumberField
                  label="Company Contact Number"
                  name="companyPhone"
                  required
                  placeholder="98765 43210"
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
                  error={errors.websiteUrl?.message}
                  {...register("websiteUrl")}
                />
              </div>

              {/* ── Section Divider ── */}
              <div className="border-t border-slate-200 my-8" />

              {/* ── Section: POC (Point of Contact) Details ── */}
              <div id="section-primary-contact" className="scroll-mt-6">
                <SectionHeading
                  title="POC ( Point of Contact ) Details"
                  icon={<UserCircle className="w-5 h-5" />}
                  description="Authorized representative for contracts and account correspondence"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name"
                    placeholder="Your full name"
                    required
                    error={errors.contactName?.message}
                    {...register("contactName")}
                  />

                  <InputField
                    label="Designation"
                    placeholder="e.g. Director, HR Lead"
                    required
                    error={errors.designation?.message}
                    {...register("designation")}
                  />

                  <InputField
                    label="Official Email"
                    placeholder="you@company.com"
                    type="email"
                    required
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

          <div id="section-company-other-details">
            <FormCard>
              <SectionHeading
                title="Company Other Details"
                icon={<Building2 className="w-5 h-5" />}
                description="General company scale, establishment, and profile details"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LocationAutocomplete
                  required
                  theme="light"
                  label="Headquarter"
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

                <SingleSelectSearch
                  label="Industry"
                  name="domain"
                  options={INDUSTRIES}
                  value={watchedValues.domain || ""}
                  onChange={(val) =>
                    setValue("domain", val, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  placeholder="Select or enter industry…"
                  error={errors.domain?.message}
                  leftIcon={<Briefcase className="w-4 h-4" />}
                />

                <div
                  className="space-y-1.5"
                  id="field-companySize"
                  data-field="companySize"
                >
                  <label className="inline-flex items-center text-xs font-medium text-slate-700">
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

                <InputField
                  label="Founded Year"
                  required
                  placeholder="e.g. 2018"
                  leftIcon={<Calendar className="w-4 h-4" />}
                  error={errors.foundedYear?.message}
                  {...register("foundedYear")}
                />

                <div className="col-span-1 md:col-span-2">
                  <TagInputField
                    label="Company Certification"
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
              </div>

              {/* ── Section Divider ── */}
              <div className="border-t border-slate-200 my-8" />

              {/* ── Section: Company Summary ── */}
              <div id="section-company-summary" className="scroll-mt-6">
                <SectionHeading
                  title="Company Summary"
                  icon={<FileText className="w-5 h-5" />}
                  description="Brief overview of your company's mission, background, and culture"
                />
                <TextareaField
                  name="aboutCompany"
                  placeholder="Tell us about your company's mission, products, and culture (100–150 words)…"
                  minWords={100}
                  maxWords={150}
                  countType="words"
                  resizable={false}
                  rows={6}
                  value={watchedValues.aboutCompany || ""}
                  error={errors.aboutCompany?.message}
                  {...register("aboutCompany")}
                />
              </div>
            </FormCard>
          </div>

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
                    all submitted documents and corporate credentials are
                    authentic. I agree to the platform Terms of Service and
                    Privacy Policy, and understand that providing false or
                    misleading details may result in rejection or suspension of
                    client onboarding privileges.
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
      <OnboardingGuideMascot formRef={formRef} role="client" errors={errors} />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </form>
  );
}
