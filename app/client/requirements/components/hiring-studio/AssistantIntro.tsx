"use client";

import React from "react";
import { ArrowRight, FileUp, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";
import { WelcomeRobot } from "./WelcomeRobot";

export type Path = "upload" | "create";

interface ChoiceCard {
  id: Path;
  icon: typeof FileUp;
  title: string;
  desc: string;
  meta: string;
  primary?: boolean;
}

const CARDS: ChoiceCard[] = [
  {
    id: "create",
    icon: Sparkles,
    title: "Create a JD with AI",
    desc: "Answer a few quick questions and I'll assemble a structured job description tailored for your team.",
    meta: "~3 minutes",
    primary: true,
  },
  {
    id: "upload",
    icon: FileUp,
    title: "Upload an existing JD",
    desc: "Drop a file or paste text you already have, then review and refine it before publishing.",
    meta: "PDF or TXT · max 10 MB",
  },
];

const GREETING = "Hey! I’m StaffSync AI 👋";
const SUPPORT =
  "I’m here to help you create a great job description. How would you like to get started?";

export function AssistantIntro({ onPick }: { onPick: (p: Path) => void }) {
  return (
    <section
      className="requirements-welcome relative"
      aria-label="StaffSync AI welcome"
    >
      <div className="welcome-stage relative mx-auto max-w-[880px]">
        <div className="welcome-mascot relative md:absolute">
          <div className="welcome-ground" aria-hidden="true" />
          <WelcomeRobot />
        </div>

        <div className="welcome-greeting welcome-speech relative md:absolute rounded-2xl border border-[var(--dash-card-border,#e2e8f0)] bg-[var(--dash-card-bg-solid,#ffffff)] px-5 py-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--dash-accent-text,#005A9C)]">
            StaffSync AI
          </p>
          <h2 className="mt-1.5 text-lg sm:text-xl font-semibold tracking-tight text-[var(--dash-text-primary,#0f172a)]">
            {GREETING}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--dash-text-secondary,#475569)]">
            {SUPPORT}
          </p>
        </div>
      </div>

      <div className="welcome-choices mt-3 grid gap-3.5 sm:gap-4 md:grid-cols-2">
        {CARDS.map((c) => (
          <Button
            variant="outline"
            key={c.id}
            type="button"
            onClick={() => onPick(c.id)}
            className={cn(
              "welcome-choice group relative flex h-auto min-w-0 flex-col items-stretch justify-between whitespace-normal !rounded-2xl border bg-[var(--dash-card-bg-solid,#ffffff)] p-4 sm:p-5 text-left font-normal hover:-translate-y-0.5 hover:bg-[var(--dash-card-bg-solid,#ffffff)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-accent-text,#005A9C)]",
              c.primary
                ? "border-[var(--dash-accent-text,#005A9C)]/50 ring-1 ring-[var(--dash-accent-text,#005A9C)]/20 hover:border-[var(--dash-accent-text,#005A9C)]"
                : "border-[var(--dash-card-border,#e2e8f0)] hover:border-[var(--dash-accent-text,#005A9C)]/45",
            )}
          >
            <div>
              <c.icon
                className={cn(
                  "h-5 w-5 stroke-[1.75]",
                  c.primary
                    ? "text-[var(--dash-accent-text,#005A9C)]"
                    : "text-[var(--dash-text-secondary,#475569)]",
                )}
              />
              <h3 className="mt-3 text-base font-semibold tracking-tight text-[var(--dash-text-primary,#0f172a)]">
                {c.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm font-normal leading-relaxed text-[var(--dash-text-secondary,#475569)]">
                {c.desc}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-medium text-[var(--dash-text-muted,#64748b)]">
              <span>{c.meta}</span>
              <ArrowRight className="h-4 w-4 text-[var(--dash-accent-text,#005A9C)] transition-transform group-hover:translate-x-1" />
            </div>
          </Button>
        ))}
      </div>
    </section>
  );
}
