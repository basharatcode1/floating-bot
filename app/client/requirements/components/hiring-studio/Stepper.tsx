"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/app/lib/utils";

export function Stepper({
  step,
  onGo,
  canReview,
}: {
  step: 1 | 2;
  onGo: (s: 1 | 2) => void;
  canReview: boolean;
}) {
  const items = [
    { n: 1 as const, label: "Build Job Description" },
    { n: 2 as const, label: "Review & Publish" },
  ];

  return (
    <ol className="flex items-center gap-1.5 sm:gap-2" aria-label="Progress">
      {items.map((it, i) => {
        const active = step === it.n;
        const done = step > it.n;
        const disabled = it.n === 2 && !canReview;

        return (
          <li key={it.n} className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onGo(it.n)}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                active
                  ? "border-[#005A9C] bg-[#005A9C] text-white shadow-sm font-semibold"
                  : done
                    ? "bg-white text-slate-700 border-slate-300 hover:border-[#005A9C]/40 font-semibold"
                    : "bg-white text-slate-400 border-slate-200 cursor-not-allowed font-semibold"
              )}
            >
              <span
                className={cn(
                  "grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold",
                  active
                    ? "bg-white text-[#005A9C]"
                    : done
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                )}
              >
                {done ? <Check className="h-3 w-3 stroke-[2.5]" /> : it.n}
              </span>
              <span className="hidden sm:inline font-semibold">{it.label}</span>
              <span className="sm:hidden font-semibold">{it.n === 1 ? "Build" : "Review"}</span>
            </button>
            {i === 0 && (
              <span
                className="h-px w-4 sm:w-6 bg-slate-200"
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

