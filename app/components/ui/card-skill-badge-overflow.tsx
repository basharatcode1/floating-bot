"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
} as const;

export interface CardSkillBadgeOverflowProps {
  skills: string[] | null | undefined;
  visibleCount?: number;
  title?: string;
  variant?: "primary" | "secondary";
}

export function CardSkillBadgeOverflow({
  skills = [],
  visibleCount = 7,
  title,
  variant = "primary",
}: CardSkillBadgeOverflowProps) {
  if (!skills || skills.length === 0) {
    return null;
  }

  const showOverflow = skills.length > visibleCount;
  const visibleSkills = showOverflow ? skills.slice(0, visibleCount) : skills;

  const badgeClass =
    variant === "primary"
      ? "bg-[var(--req-card-badge-blue-bg)] text-[var(--req-card-badge-blue-text)] border border-[var(--req-card-badge-blue-border)]"
      : "bg-[var(--req-card-badge-purple-bg)] text-[var(--req-card-badge-purple-text)] border border-[var(--req-card-badge-purple-border)]";

  return (
    <motion.div
      layout
      transition={springTransition}
      className="inline-flex flex-wrap items-center gap-1"
    >
      {visibleSkills.map((skill, index) => (
        <motion.div key={index} layout transition={springTransition}>
          <span
            className={`flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-semibold whitespace-nowrap ${badgeClass}`}
          >
            {skill}
          </span>
        </motion.div>
      ))}

      {showOverflow && (
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <motion.button
                layout
                transition={springTransition}
                onClick={(e) => e.stopPropagation()}
                className={`flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-semibold cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap ${badgeClass}`}
              >
                +more
              </motion.button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side="top"
              onClick={(e) => e.stopPropagation()}
              className="w-64 p-3 border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-[var(--dash-text-primary)] shadow-xl rounded-xl z-50"
            >
              <div className="flex flex-col gap-2">
                {title && (
                  <span className="text-[11px] font-semibold text-[var(--dash-text-muted)] capitalize tracking-wider">
                    {title}
                  </span>
                )}
                <div className="flex flex-wrap gap-1 mt-1">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-semibold whitespace-nowrap ${badgeClass}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </motion.div>
  );
}
