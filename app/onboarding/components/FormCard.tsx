"use client";

import type { ReactNode } from "react";

interface FormCardProps {
  children: ReactNode;
  className?: string;
}

export function FormCard({ children, className = "" }: FormCardProps) {
  return (
    <div
      className={`
        w-full bg-white border border-[#cee1f1]
        rounded-2xl p-6 sm:p-8
        shadow-card text-slate-900
        transition-all duration-300 relative
        ${className}
      `}
    >
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-slate-200/60 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
