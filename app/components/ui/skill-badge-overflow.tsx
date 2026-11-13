"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/app/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";

export interface SkillBadgeOverflowProps {
  skills: string[] | undefined | null;
  visibleCount?: number;
  className?: string;
  title?: string;
}

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
} as const;

export function SkillBadgeOverflow({
  skills = [],
  visibleCount = 10, // Default to 10 (approx 2 lines)
  className,
  title,
}: SkillBadgeOverflowProps) {
  if (!skills || skills.length === 0) {
    return null;
  }

  const showOverflow = skills.length > visibleCount;
  const visibleSkills = showOverflow ? skills.slice(0, visibleCount) : skills;
  const overflowSkills = showOverflow ? skills.slice(visibleCount) : [];

  return (
    <motion.div
      layout
      transition={springTransition}
      className={cn("inline-flex flex-wrap items-center gap-1.5", className)}
    >
      {visibleSkills.map((skill, index) => (
        <motion.div key={index} layout transition={springTransition}>
          <Badge
            variant="outline"
            className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20 px-2 py-0.5 text-[10px] rounded-full font-medium theme-transition whitespace-nowrap"
          >
            {skill}
          </Badge>
        </motion.div>
      ))}

      {showOverflow && (
        <Popover>
          <PopoverTrigger asChild>
            <motion.div layout transition={springTransition} className="cursor-pointer">
              <Badge
                variant="outline"
                className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20 px-2 py-0.5 text-[10px] rounded-full font-medium theme-transition whitespace-nowrap hover:bg-[var(--accent-primary)]/20"
              >
                +{overflowSkills.length} more
              </Badge>
            </motion.div>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto max-w-sm p-4 bg-[var(--dash-bg)] border-[var(--dash-border)] z-[100]" 
            align="start"
          >
            {title && (
              <h4 className="mb-3 text-sm font-semibold text-[var(--dash-text)]">{title}</h4>
            )}
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20 px-2 py-0.5 text-[10px] rounded-full font-medium theme-transition whitespace-nowrap"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </motion.div>
  );
}
