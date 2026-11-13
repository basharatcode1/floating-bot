"use client";

import * as React from "react";
import { FolderOpen, LucideIcon, RotateCcw } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/app/lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  actionText,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-6 sm:p-12 rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg)] w-full my-8 duration-300 animate-in fade-in-50 slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--dash-badge-bg)] text-[var(--accent-primary)] mb-5">
        <div className="absolute inset-0 rounded-2xl bg-[var(--accent-primary)] opacity-10 blur-md" />
        <Icon className="w-8 h-8 relative z-10" />
      </div>
      <h3 className="text-lg font-bold text-[var(--dash-text-primary)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--dash-text-secondary)] max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          className="h-10 px-5 py-2.5 text-xs font-semibold rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all duration-300 flex items-center gap-1.5 shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {actionText}
        </Button>
      )}
    </div>
  );
}
