"use client";

import { Button } from "@/app/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, ShieldCheck } from "lucide-react";

interface StickyFooterActionsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrevious: () => void;
  onNext: () => void;
  isValidating?: boolean;
  isSubmitting?: boolean;
  className?: string;
}

export function StickyFooterActions({
  isFirstStep,
  isLastStep,
  onPrevious,
  onNext,
  isValidating = false,
  isSubmitting = false,
  className = "",
}: StickyFooterActionsProps) {
  return (
    <div
      className={`
        w-full bg-white border border-[#cee1f1]
        rounded-2xl p-4 sm:p-5
        shadow-card text-slate-900
        transition-all duration-300 relative
        ${className}
      `}
      role="navigation"
      aria-label="Form navigation"
    >
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-slate-200/60 to-transparent pointer-events-none" />
      <div className="w-full flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Previous or Security Notice */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {isFirstStep && isLastStep ? (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="hidden sm:inline">
                All information is securely encrypted & ISO 27001 compliant
              </span>
            </div>
          ) : !isFirstStep ? (
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              className="h-[var(--dash-input-height)] px-4 rounded-xl border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-semibold whitespace-nowrap transition-all duration-200 shadow-sm"
              aria-label="Go to previous step"
            >
              <ChevronLeft className="w-4 h-4 mr-1 text-slate-400" />
              Previous
            </Button>
          ) : null}
        </div>

        {/* Right: Next / Submit */}
        <div>
          {!isLastStep ? (
            <Button
              type="button"
              onClick={onNext}
              disabled={isValidating}
              className="h-[var(--dash-input-height)] px-5 sm:px-6 rounded-xl bg-gradient-to-r from-[#005A9C] to-cyan-400 hover:from-[#004A82] hover:to-cyan-500 text-white text-xs font-bold tracking-tight whitespace-nowrap transition-all duration-200 shadow-md shadow-[#005A9C]/25 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              aria-label="Go to next step"
            >
              {isValidating ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : null}
              <span>Next</span>
              {!isValidating && <ChevronRight className="w-4 h-4 ml-1.5" />}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-[var(--dash-input-height)] px-5 sm:px-6 rounded-xl bg-gradient-to-r from-[#005A9C] to-cyan-400 hover:from-[#004A82] hover:to-cyan-500 text-white text-xs font-bold tracking-tight whitespace-nowrap transition-all duration-200 shadow-md shadow-[#005A9C]/25 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              aria-label="Submit registration"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
