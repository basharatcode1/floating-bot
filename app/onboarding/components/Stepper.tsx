"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { StepConfig } from "@/app/onboarding/schemas/types";

interface StepperProps {
  steps: StepConfig[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <nav aria-label="Registration progress" className="w-full">
      {/* 2-Part Full Width Header with Vertical Partition Divider */}
      <div className="grid grid-cols-2 w-full divide-x divide-slate-200">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => isCompleted && onStepClick?.(index)}
              disabled={isUpcoming}
              className={`
                relative flex items-center justify-center gap-3 py-3.5 px-4 transition-all duration-200 text-xs sm:text-sm font-semibold w-full
                ${
                  isActive
                    ? "bg-[#EFF6FF] text-[#005A9C] font-bold border-b-2 border-[#005A9C]"
                    : isCompleted
                    ? "text-slate-700 hover:bg-slate-50 cursor-pointer"
                    : "text-slate-400 cursor-not-allowed hover:bg-transparent"
                }
              `}
              aria-label={`Step ${index + 1}: ${step.title}`}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
                  ${
                    isActive
                      ? "bg-gradient-to-br from-[#005A9C] to-[#004A82] text-white shadow-md shadow-[#005A9C]/30"
                      : isCompleted
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="truncate font-semibold tracking-tight">{step.title}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
