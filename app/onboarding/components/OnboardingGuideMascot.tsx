"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motion } from "framer-motion";
import { AlertCircle, Lightbulb, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  StrobiAvatar,
  type StrobiAnimation,
} from "@/app/onboarding/components/StrobiAvatar";
import { findFieldErrorElement } from "@/app/onboarding/hooks/useMultiStepForm";
import { getFieldGuidance } from "@/app/onboarding/data/field-guidance";

interface OnboardingGuideMascotProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  role: "client" | "vendor";
  errors?: Record<string, { message?: string } | undefined>;
}

interface FloatingCoords {
  x: number;
  y: number;
  placement: "right" | "left" | "corner";
}

const AVATAR_SIZE_DOCKED = 52;
const AVATAR_SIZE_FIELD = 58;
const BUBBLE_MAX_WIDTH = 276;
const VIEWPORT_PADDING = 16;

const CLIENT_FIELD_ORDER = [
  "companyName",
  "cin",
  "gstNumber",
  "companyEmail",
  "companyPhone",
  "alternativePhone",
  "websiteUrl",
  "contactName",
  "designation",
  "contactEmail",
  "mobileNumber",
  "headquarters",
  "domain",
  "foundedYear",
  "certifications",
  "aboutCompany",
  "linkedinUrl",
  "twitterUrl",
  "instagramUrl",
  "declarationAccepted",
];

const VENDOR_FIELD_ORDER = [
  "companyName",
  "cin",
  "gstNumber",
  "companyEmail",
  "companyPhone",
  "alternativePhone",
  "websiteUrl",
  "contactName",
  "designation",
  "contactEmail",
  "mobileNumber",
  "headquarters",
  "foundedYear",
  "vendorModels",
  "certifications",
  "categories",
  "aboutCompany",
  "complianceStatus",
  "legalDocs",
  "insuranceOptions",
  "linkedinUrl",
  "twitterUrl",
  "instagramUrl",
  "declarationAccepted",
];

function findFirstErrorField(
  errors: Record<string, { message?: string } | undefined> | undefined,
  role: "client" | "vendor",
): string | null {
  if (!errors) return null;
  const order = role === "client" ? CLIENT_FIELD_ORDER : VENDOR_FIELD_ORDER;
  for (const field of order) {
    if (errors[field]) {
      return field;
    }
  }
  for (const key of Object.keys(errors)) {
    if (errors[key]) {
      const normalized = normalizeCandidateName(key, role);
      if (normalized) return normalized;
    }
  }
  return null;
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function subscribeViewportMobile(onStoreChange: () => void) {
  const media = window.matchMedia("(max-width: 767px)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getViewportMobileSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function getViewportMobileServerSnapshot() {
  return false;
}

function getCornerCoords(): FloatingCoords {
  if (typeof window === "undefined") {
    return { x: 0, y: 0, placement: "corner" };
  }
  return {
    x: Math.max(VIEWPORT_PADDING, window.innerWidth - AVATAR_SIZE_DOCKED - 24),
    y: Math.max(VIEWPORT_PADDING, window.innerHeight - AVATAR_SIZE_DOCKED - 24),
    placement: "corner",
  };
}

function normalizeCandidateName(
  raw: string | null | undefined,
  role: "client" | "vendor",
): string | null {
  if (!raw) return null;
  const cleaned = raw
    .replace(
      /^(field-|location-input-|select-trigger-|trigger-|input-|container-|error-|helper-)/,
      "",
    )
    .split(".")[0];

  if (cleaned.startsWith("doc-") || cleaned === "toggle-all-docs") {
    return "legalDocs";
  }
  if (cleaned.startsWith("ins-") || cleaned === "toggle-all-insurance") {
    return "insuranceOptions";
  }

  return getFieldGuidance(cleaned, role) ? cleaned : null;
}

function resolveFieldNameFromTarget(
  target: EventTarget | null,
  role: "client" | "vendor",
): string | null {
  if (!(target instanceof Element)) return null;

  const directCandidates = [
    target.getAttribute("data-field"),
    target.getAttribute("name"),
    target.getAttribute("id"),
  ];
  for (const raw of directCandidates) {
    const match = normalizeCandidateName(raw, role);
    if (match) return match;
  }

  let current: Element | null = target.parentElement;
  let depth = 0;
  while (current && depth < 10) {
    const ancestorCandidates = [
      current.getAttribute("data-field"),
      current.getAttribute("id"),
    ];
    for (const raw of ancestorCandidates) {
      const match = normalizeCandidateName(raw, role);
      if (match) return match;
    }
    if (current.tagName === "FORM") break;
    current = current.parentElement;
    depth++;
  }

  return null;
}

export function OnboardingGuideMascot({
  formRef,
  role,
  errors,
}: OnboardingGuideMascotProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const isMobile = useSyncExternalStore(
    subscribeViewportMobile,
    getViewportMobileSnapshot,
    getViewportMobileServerSnapshot,
  );

  const [activeField, setActiveField] = useState<string | null>(null);
  const [coords, setCoords] = useState<FloatingCoords>(() => getCornerCoords());
  const cardRef = useRef<HTMLDivElement>(null);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorsRef = useRef(errors);
  const dismissedFieldRef = useRef<string | null>(null);

  useEffect(() => {
    errorsRef.current = errors;
  }, [errors]);

  const activateField = useCallback((fieldName: string | null) => {
    if (blurTimerRef.current) {
      clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
    if (fieldName) {
      dismissedFieldRef.current = null;
      setActiveField(fieldName);
    }
  }, []);

  // Track user focus and clicks inside the onboarding form
  useEffect(() => {
    const formEl = formRef.current;
    if (!formEl) return;

    const handleFocusIn = (e: FocusEvent) => {
      const resolved = resolveFieldNameFromTarget(e.target, role);
      if (resolved) {
        activateField(resolved);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const resolved = resolveFieldNameFromTarget(e.target, role);
      if (resolved) {
        activateField(resolved);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const nextTarget = e.relatedTarget as Element | null;
      if (nextTarget) {
        // Keep docked when interacting with Radix dropdown portals or the mascot bubble itself
        if (
          nextTarget.closest(
            '[data-radix-popper-content-wrapper], [role="listbox"], [data-onboarding-guide-mascot="true"]',
          )
        ) {
          return;
        }
        const nextField = resolveFieldNameFromTarget(nextTarget, role);
        if (nextField) {
          activateField(nextField);
          return;
        }
      }

      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
      blurTimerRef.current = setTimeout(() => {
        const activeEl = document.activeElement;
        if (
          activeEl &&
          activeEl.closest(
            '[data-radix-popper-content-wrapper], [role="listbox"], [data-onboarding-guide-mascot="true"]',
          )
        ) {
          return;
        }
        const currentFocusedField = resolveFieldNameFromTarget(activeEl, role);
        if (currentFocusedField) {
          dismissedFieldRef.current = null;
          setActiveField(currentFocusedField);
          return;
        }

        // When focus leaves the form, check if the previously active field has a validation error!
        // Never retreat to the original corner position if a validation error exists.
        setActiveField((prev) => {
          if (prev && errorsRef.current?.[prev]) {
            return prev;
          }
          const firstErr = findFirstErrorField(errorsRef.current, role);
          if (firstErr && dismissedFieldRef.current !== firstErr) {
            return firstErr;
          }
          return null;
        });
      }, 150);
    };

    formEl.addEventListener("focusin", handleFocusIn);
    formEl.addEventListener("pointerdown", handlePointerDown);
    formEl.addEventListener("focusout", handleFocusOut);

    return () => {
      formEl.removeEventListener("focusin", handleFocusIn);
      formEl.removeEventListener("pointerdown", handlePointerDown);
      formEl.removeEventListener("focusout", handleFocusOut);
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    };
  }, [formRef, role, activateField]);

  // Whenever validation errors change (e.g. on blur, submit, or typing):
  // If there are validation errors, float to or remain at the error field!
  useEffect(() => {
    if (!errors) return;

    // If current active field has an error, remain anchored to it
    if (activeField && errors[activeField]) {
      return;
    }

    // Find the first error field in the form
    const firstErr = findFirstErrorField(errors, role);
    if (firstErr) {
      if (dismissedFieldRef.current === firstErr) {
        return;
      }
      setActiveField(firstErr);
    }
  }, [errors, activeField, role]);

  const guidance = useMemo(
    () => (activeField ? getFieldGuidance(activeField, role) : null),
    [activeField, role],
  );

  const computeCoords = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!activeField || isMobile) {
      setCoords(getCornerCoords());
      return;
    }

    const target = findFieldErrorElement(activeField);
    if (!target) {
      setCoords(getCornerCoords());
      return;
    }

    const rect = target.getBoundingClientRect();
    const widgetWidth = BUBBLE_MAX_WIDTH;
    const widgetHeight = cardRef.current?.offsetHeight ?? 160;

    // Check if the right side has enough space in the viewport
    const spaceOnRight = window.innerWidth - rect.right;
    const spaceOnLeft = rect.left;

    let chosenPlacement: "right" | "left" = "right";
    let rawX = 0;

    // In a multi-column row (like CIN Number), offsetting by 72px gives clean clearance
    // over the adjacent label if space allows, matching the user's annotated layout.
    const canFitRightGenerous =
      spaceOnRight >= widgetWidth + 72 + VIEWPORT_PADDING;
    const canFitRightCompact =
      spaceOnRight >= widgetWidth + 16 + VIEWPORT_PADDING;

    if (canFitRightGenerous) {
      chosenPlacement = "right";
      rawX = rect.right + 72;
    } else if (canFitRightCompact) {
      chosenPlacement = "right";
      rawX = rect.right + 16;
    } else if (spaceOnLeft >= widgetWidth + 16 + VIEWPORT_PADDING) {
      chosenPlacement = "left";
      rawX = rect.left - widgetWidth - 16;
    } else {
      if (spaceOnRight >= spaceOnLeft) {
        chosenPlacement = "right";
        rawX = rect.right + 12;
      } else {
        chosenPlacement = "left";
        rawX = rect.left - widgetWidth - 12;
      }
    }

    // Keep X securely inside the viewport bounds
    const maxX = Math.max(
      VIEWPORT_PADDING,
      window.innerWidth - widgetWidth - VIEWPORT_PADDING,
    );
    const clampedX = Math.min(Math.max(VIEWPORT_PADDING, rawX), maxX);

    // Circular avatar sits on top of the speech bubble card.
    // Setting card top to (rect.top - AVATAR_SIZE_FIELD - 8) places the circular avatar
    // right above the speech bubble, and the speech bubble aligns beside the input field.
    const rawY = rect.top - AVATAR_SIZE_FIELD - 8;

    const maxY = Math.max(
      VIEWPORT_PADDING,
      window.innerHeight - widgetHeight - VIEWPORT_PADDING,
    );
    const clampedY = Math.min(Math.max(VIEWPORT_PADDING, rawY), maxY);

    setCoords((prev) => {
      if (
        Math.abs(prev.x - clampedX) < 0.5 &&
        Math.abs(prev.y - clampedY) < 0.5 &&
        prev.placement === chosenPlacement
      ) {
        return prev;
      }
      return { x: clampedX, y: clampedY, placement: chosenPlacement };
    });
  }, [activeField, isMobile]);

  // Keep mascot synced to the focused field across scrolling and resizing
  useEffect(() => {
    let rafId = 0;

    if (!activeField || isMobile) {
      rafId = requestAnimationFrame(() => {
        setCoords(getCornerCoords());
      });
      const onResize = () => setCoords(getCornerCoords());
      window.addEventListener("resize", onResize, { passive: true });
      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", onResize);
      };
    }

    const target = findFieldErrorElement(activeField);
    const startTime = performance.now();

    const syncLoop = (now: number) => {
      computeCoords();
      if (now - startTime < 500) {
        rafId = requestAnimationFrame(syncLoop);
      }
    };
    rafId = requestAnimationFrame(syncLoop);

    const onScrollOrResize = () => computeCoords();
    window.addEventListener("scroll", onScrollOrResize, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    const ro = target ? new ResizeObserver(onScrollOrResize) : null;
    if (target && ro) ro.observe(target);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize, { capture: true });
      window.removeEventListener("resize", onScrollOrResize);
      ro?.disconnect();
    };
  }, [activeField, isMobile, computeCoords]);

  const hasError = Boolean(activeField && errors?.[activeField]);
  const errorMessage =
    activeField && typeof errors?.[activeField]?.message === "string"
      ? errors[activeField]?.message
      : undefined;

  const isGuiding = Boolean(activeField && guidance);
  const avatarAnimation: StrobiAnimation = isGuiding
    ? hasError
      ? coords.placement === "left" || isMobile
        ? "angry-field-right"
        : "angry-field-left"
      : coords.placement === "left" || isMobile
        ? "guide-right"
        : "guide-left"
    : "idle";

  // On mobile, only display the floating guide card when the user is actively focused on a field
  if (isMobile && !isGuiding) {
    return null;
  }

  if (isMobile && isGuiding && guidance) {
    return (
      <div
        data-onboarding-guide-mascot="true"
        className="fixed inset-x-4 bottom-20 z-30 flex justify-end pointer-events-none"
        aria-live="polite"
      >
        <motion.div
          key={activeField}
          initial={
            reducedMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.95 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={
            reducedMotion
              ? { duration: 0.01 }
              : { type: "spring", stiffness: 300, damping: 25 }
          }
          className={`pointer-events-auto flex items-start gap-2.5 max-w-full rounded-2xl border px-3 py-2.5 text-slate-900 shadow-xl backdrop-blur-md transition-colors ${
            hasError
              ? "border-rose-300 bg-white/95 shadow-rose-500/10"
              : "border-[#cee1f1] bg-white/95 shadow-slate-900/10"
          }`}
        >
          <div className="shrink-0 mt-0.5">
            <StrobiAvatar
              animation={avatarAnimation}
              size={44}
              ariaLabel={
                hasError
                  ? `Validation error for ${guidance.title}`
                  : "Onboarding field guide assistant"
              }
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Lightbulb
                className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                  hasError ? "text-rose-600" : "text-[#005A9C]"
                }`}
              />
              <span
                className={`text-[11px] font-semibold truncate transition-colors ${
                  hasError ? "text-rose-700" : "text-[#005A9C]"
                }`}
              >
                {guidance.title}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-snug mt-0.5">
              {guidance.tip}
            </p>
            {guidance.example && (
              <p className="mt-1 text-[11px] text-slate-500">
                Example:{" "}
                <span className="font-mono text-slate-700">
                  {guidance.example}
                </span>
              </p>
            )}
            {hasError && (
              <p className="mt-1.5 flex items-start gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1 leading-snug">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMessage || "Please enter a valid value"}</span>
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              if (activeField) {
                dismissedFieldRef.current = activeField;
              }
              setActiveField(null);
            }}
            aria-label="Hide field guide"
            className="h-6 w-6 shrink-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      data-onboarding-guide-mascot="true"
      className="fixed inset-0 z-30 pointer-events-none overflow-hidden"
      aria-live="polite"
    >
      <motion.div
        ref={cardRef}
        initial={false}
        animate={{
          x: coords.x,
          y: coords.y,
          scale: isGuiding ? 1 : 0.96,
          opacity: 1,
        }}
        transition={
          reducedMotion
            ? { duration: 0.01 }
            : { type: "spring", stiffness: 240, damping: 24, mass: 0.85 }
        }
        className="absolute top-0 left-0"
      >
        {!isGuiding ? (
          /* Docked Avatar in the corner */
          <div
            className="pointer-events-auto relative flex items-center justify-center rounded-full drop-shadow-[0_8px_18px_rgba(0,90,156,0.22)]"
            title="Focus any field and I'll help you fill it out"
          >
            <StrobiAvatar
              animation="idle"
              size={AVATAR_SIZE_DOCKED}
              ariaLabel="Onboarding guide assistant"
            />
          </div>
        ) : (
          /* Active Field Assistant: Strobi Avatar positioned directly on top of the speech bubble */
          <div
            className="flex flex-col items-start"
            style={{ width: BUBBLE_MAX_WIDTH }}
          >
            {/* Circular avatar ("circuler gola") on top of the speech bubble card */}
            <motion.div
              animate={
                reducedMotion
                  ? {}
                  : hasError
                    ? { rotate: [0, -7, 7, -5, 5, 0], scale: [1, 1.05, 1] }
                    : { rotate: 0, scale: 1 }
              }
              transition={
                reducedMotion
                  ? { duration: 0.01 }
                  : { duration: 0.4, ease: "easeInOut" }
              }
              className={`pointer-events-auto relative z-10 flex shrink-0 items-center justify-center rounded-full mb-1.5 transition-all ${
                hasError
                  ? "drop-shadow-[0_8px_18px_rgba(186,54,54,0.38)]"
                  : "drop-shadow-[0_8px_18px_rgba(0,90,156,0.22)]"
              } ${
                coords.placement === "left" ? "self-end mr-4" : "self-start ml-4"
              }`}
            >
              <StrobiAvatar
                animation={avatarAnimation}
                size={AVATAR_SIZE_FIELD}
                ariaLabel={
                  isGuiding
                    ? hasError
                      ? `Error on ${guidance?.title ?? "current field"}`
                      : `Helpful guide for ${guidance?.title ?? "current field"}`
                    : "Onboarding guide assistant"
                }
              />
            </motion.div>

            {/* Contextual guidance speech bubble */}
            {guidance && (
              <motion.div
                key={activeField}
                initial={
                  reducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 6, scale: 0.96 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={
                  reducedMotion ? { duration: 0.01 } : { duration: 0.18 }
                }
                style={{ width: BUBBLE_MAX_WIDTH, maxWidth: BUBBLE_MAX_WIDTH }}
                className={`pointer-events-auto relative rounded-2xl border px-3.5 py-2.5 text-slate-900 shadow-xl backdrop-blur-md transition-colors ${
                  hasError
                    ? "border-rose-300 bg-white/95 shadow-rose-500/10"
                    : "border-[#cee1f1] bg-white/95 shadow-[#005A9C]/10"
                }`}
              >
                {/* Speech bubble pointer notch pointing up towards the circular avatar */}
                <div
                  className={`absolute -top-1.5 h-3 w-3 rotate-45 border-l border-t bg-white/95 transition-colors ${
                    hasError ? "border-rose-300" : "border-[#cee1f1]"
                  } ${
                    coords.placement === "left"
                      ? "right-[39px]"
                      : "left-[39px]"
                  }`}
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Lightbulb
                      className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                        hasError ? "text-rose-600" : "text-[#005A9C]"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-semibold truncate transition-colors ${
                        hasError ? "text-rose-700" : "text-[#005A9C]"
                      }`}
                    >
                      {guidance.title}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (activeField) {
                        dismissedFieldRef.current = activeField;
                      }
                      setActiveField(null);
                    }}
                    aria-label="Park onboarding guide"
                    className="h-5 w-5 -mr-1 -mt-0.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                <p className="mt-1 text-xs leading-snug text-slate-700 break-words">
                  {guidance.tip}
                </p>

                {guidance.example && (
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    Example:{" "}
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-700">
                      {guidance.example}
                    </span>
                  </p>
                )}

                {hasError && (
                  <p className="mt-2 flex items-start gap-1.5 text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200/80 rounded-lg px-2.5 py-1.5 leading-snug">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-600" />
                    <span>{errorMessage || "Please correct this field"}</span>
                  </p>
                )}
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

