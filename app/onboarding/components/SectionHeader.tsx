"use client";

import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: ReactNode;
}

export function SectionHeader({ title, subtitle, icon, badge }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3.5 mb-6 sm:mb-8">
      {icon && (
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#005A9C] flex-shrink-0 shadow-sm">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-[0.9rem] font-semibold text-black tracking-tight">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-1 font-normal">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
