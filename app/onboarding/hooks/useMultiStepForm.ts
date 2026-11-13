"use client";

import { useState, useCallback, useMemo } from "react";
import { useFormik } from "formik";
import type { ZodSchema } from "zod";

interface UseMultiStepFormOptions<T extends Record<string, any>> {
  totalSteps: number;
  schema: ZodSchema<T>;
  stepSchemas: readonly ZodSchema[];
  defaultValues?: T;
  savedValues?: Partial<T>;
  stepGates?: Record<number, boolean | (() => boolean)>;
  onGateFailed?: (step: number) => void;
}

interface UseMultiStepFormReturn<T extends Record<string, any>> {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  direction: "forward" | "backward";
  form: {
    register: (name: keyof T & string) => {
      name: string;
      value: any;
      onChange: (e: React.ChangeEvent<any>) => void;
      onBlur: (e: React.FocusEvent<any>) => void;
    };
    formState: {
      errors: Record<string, { message?: string } | undefined>;
      isDirty: boolean;
    };
    watch: () => T;
    setValue: (name: keyof T & string, value: any, options?: { shouldDirty?: boolean; shouldValidate?: boolean }) => void;
    getValues: () => T;
  };
  goToStep: (step: number) => void;
  goNext: () => Promise<boolean>;
  goPrevious: () => void;
  isValidating: boolean;
  validateCurrentStep: () => boolean;
}

export function findFieldErrorElement(errorPath: string): HTMLElement | null {
  if (!errorPath || typeof document === "undefined") return null;

  const rootField = errorPath.split(".")[0];
  const candidates: (HTMLElement | null)[] = [
    // 1. Exact field container IDs
    document.getElementById(`field-${errorPath}`),
    document.getElementById(`field-${rootField}`),
    // 2. Element by raw ID
    document.getElementById(errorPath),
    document.getElementById(rootField),
    // 3. Custom component triggers and inputs
    document.getElementById(`trigger-${errorPath}`),
    document.getElementById(`trigger-${rootField}`),
    document.getElementById(`select-trigger-${errorPath}`),
    document.getElementById(`select-trigger-${rootField}`),
    document.getElementById(`input-${errorPath}`),
    document.getElementById(`input-${rootField}`),
    document.getElementById(`location-input-${errorPath}`),
    document.getElementById(`location-input-${rootField}`),
    // 4. Name attribute
    document.querySelector<HTMLElement>(`[name="${errorPath}"]`),
    document.querySelector<HTMLElement>(`[name="${rootField}"]`),
    // 5. Data-field attribute
    document.querySelector<HTMLElement>(`[data-field="${errorPath}"]`),
    document.querySelector<HTMLElement>(`[data-field="${rootField}"]`),
    // 6. Direct error message element
    document.getElementById(`error-${errorPath}`),
    document.getElementById(`error-${rootField}`),
    // 7. Aria-describedby containing error
    document.querySelector<HTMLElement>(`[aria-describedby*="${errorPath}"]`),
    document.querySelector<HTMLElement>(`[aria-describedby*="${rootField}"]`),
  ];

  let target: HTMLElement | null = null;
  for (const c of candidates) {
    if (c) {
      target = c;
      break;
    }
  }

  if (!target) return null;

  // If target is an error message div, target its parent wrapper so the whole field is visible
  if (target.id?.startsWith("error-") && target.parentElement) {
    target = target.parentElement;
  }

  return target;
}

export function scrollToFieldError(errorPath: string) {
  const target = findFieldErrorElement(errorPath);
  if (!target) return;

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
          parent.scrollTop + relativeTop - parent.clientHeight / 2 + targetRect.height / 2;
        parent.scrollTo({ top: Math.max(0, targetScrollTop), behavior: "smooth" });
        break;
      }
      parent = parent.parentElement;
    }
  } catch {
    target.scrollIntoView();
  }

  const focusable =
    target.matches("input, select, textarea, button, [tabindex]")
      ? target
      : target.querySelector<HTMLElement>("input, select, textarea, button, [tabindex]");
  focusable?.focus?.({ preventScroll: true });
}

export function useMultiStepForm<T extends Record<string, any>>({
  totalSteps,
  schema,
  stepSchemas,
  defaultValues,
  savedValues,
  stepGates,
  onGateFailed,
}: UseMultiStepFormOptions<T>): UseMultiStepFormReturn<T> {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isValidating, setIsValidating] = useState(false);

  const mergedDefaults = useMemo(() => ({
    ...defaultValues,
    ...savedValues,
  }) as T, [defaultValues, savedValues]);

  // Formik setup
  const formik = useFormik<T>({
    initialValues: mergedDefaults,
    enableReinitialize: true,
    validate: (values) => {
      const errors: Record<string, string> = {};

      // 1. Validate current step schema
      const currentSchema = stepSchemas[currentStep];
      if (currentSchema) {
        const stepResult = currentSchema.safeParse(values);
        if (!stepResult.success) {
          for (const issue of stepResult.error.issues) {
            const path = issue.path.join(".");
            errors[path] = issue.message;
          }
        }
      }

      // 2. Validate full schema
      const result = schema.safeParse(values);
      if (!result.success) {
        for (const issue of result.error.issues) {
          const path = issue.path.join(".");
          if (!errors[path]) {
            errors[path] = issue.message;
          }
        }
      }

      // 3. Explicit duplicate email check for both client and vendor onboarding
      const companyEmail = (values as any)?.companyEmail;
      const contactEmail = (values as any)?.contactEmail;
      if (
        companyEmail &&
        contactEmail &&
        typeof companyEmail === "string" &&
        typeof contactEmail === "string" &&
        companyEmail.trim().toLowerCase() === contactEmail.trim().toLowerCase()
      ) {
        const duplicateMsg = "Company Official Email and Point of Contact Email cannot be the same";
        errors["companyEmail"] = duplicateMsg;
        errors["contactEmail"] = duplicateMsg;
      }

      return errors;
    },
    onSubmit: () => {},
    validateOnBlur: true,
    validateOnChange: true,
  });

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        // If going forward, check gates for all steps between currentStep and targeted step
        if (step > currentStep) {
          for (let i = currentStep; i < step; i++) {
            const gate = stepGates?.[i];
            const isGatePassed = typeof gate === "function" ? gate() : gate ?? true;
            if (!isGatePassed) {
              onGateFailed?.(i);
              return;
            }
          }
        }
        setDirection(step > currentStep ? "forward" : "backward");
        setCurrentStep(step);
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    },
    [currentStep, totalSteps, stepGates, onGateFailed]
  );

  const goNext = useCallback(async (): Promise<boolean> => {
    if (currentStep >= totalSteps - 1) return false;

    setIsValidating(true);

    try {
      const currentSchema = stepSchemas[currentStep];
      if (currentSchema) {
        const values = formik.values;
        const result = currentSchema.safeParse(values);

        if (!result.success) {
          // Set fields as touched and set errors in Formik
          const errors: Record<string, string> = {};
          const touched: Record<string, boolean> = {};
          let firstErrorPath: string | null = null;
          
          for (const issue of result.error.issues) {
            const path = issue.path.join(".");
            if (!firstErrorPath) firstErrorPath = path;
            errors[path] = issue.message;
            touched[path] = true;
          }

          formik.setTouched({
            ...formik.touched,
            ...touched,
          });

          formik.setErrors({
            ...formik.errors,
            ...errors,
          });

          if (firstErrorPath) {
            setTimeout(() => {
              scrollToFieldError(firstErrorPath);
            }, 100);
          }

          setIsValidating(false);
          return false;
        }
      }

      // Check step gate only after form fields pass schema validation
      const gate = stepGates?.[currentStep];
      const isGatePassed = typeof gate === "function" ? gate() : gate ?? true;
      if (!isGatePassed) {
        onGateFailed?.(currentStep);
        setIsValidating(false);
        return false;
      }

      setDirection("forward");
      setCurrentStep((s) => s + 1);
      setIsValidating(false);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return true;
    } catch {
      setIsValidating(false);
      return false;
    }
  }, [currentStep, totalSteps, stepSchemas, formik, stepGates, onGateFailed]);

  const goPrevious = useCallback(() => {
    if (currentStep > 0) {
      setDirection("backward");
      setCurrentStep((s) => s - 1);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [currentStep]);

  const validateCurrentStep = useCallback((): boolean => {
    const currentSchema = stepSchemas[currentStep];
    if (!currentSchema) return true;

    const values = formik.values;
    const result = currentSchema.safeParse(values);

    if (!result.success) {
      const errors: Record<string, string> = {};
      const touched: Record<string, boolean> = {};
      let firstErrorPath: string | null = null;

      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (!firstErrorPath) firstErrorPath = path;
        errors[path] = issue.message;
        touched[path] = true;
      }

      formik.setTouched({
        ...formik.touched,
        ...touched,
      });

      formik.setErrors({
        ...formik.errors,
        ...errors,
      });

      if (firstErrorPath) {
        setTimeout(() => {
          scrollToFieldError(firstErrorPath);
        }, 100);
      }

      return false;
    }

    return true;
  }, [currentStep, stepSchemas, formik]);

  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  // Map formik errors to { message: string } structure expected by pages (only for touched fields)
  const mappedErrors = useMemo(() => {
    const errors: Record<string, { message?: string } | undefined> = {};

    for (const [key, value] of Object.entries(formik.errors)) {
      const shouldShowError = (formik.touched as any)[key];

      if (typeof value === "string" && shouldShowError) {
        errors[key] = { message: value };
      }
    }
    return errors;
  }, [
    formik.errors,
    formik.touched,
  ]);

  // Compatibility Form object
  const form = useMemo(() => ({
    register: (name: keyof T & string) => ({
      name,
      value: (formik.values as any)[name] ?? "",
      onChange: (e: React.ChangeEvent<any>) => {
        if (name === "gstNumber" || name === "cin") {
          e.target.value = e.target.value.toUpperCase();
        }
        formik.handleChange(e);
      },
      onBlur: (e: React.FocusEvent<any>) => {
        formik.handleBlur(e);
      },
    }),
    formState: {
      errors: mappedErrors,
      isDirty: formik.dirty,
    },
    watch: () => formik.values,
    setValue: (name: keyof T & string, value: any, options?: { shouldDirty?: boolean; shouldValidate?: boolean }) => {
      formik.setFieldValue(name, value, options?.shouldValidate ?? true);
    },
    getValues: () => formik.values,
  }), [formik, mappedErrors]);

  return {
    currentStep,
    totalSteps,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress,
    direction,
    form,
    goToStep,
    goNext,
    goPrevious,
    isValidating,
    validateCurrentStep,
  };
}
