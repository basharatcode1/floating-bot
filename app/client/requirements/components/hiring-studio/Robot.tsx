"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

export function Robot({
  size = 56,
  animate = false,
  className,
}: {
  size?: number;
  animate?: boolean;
  className?: string;
}) {
  return (
    <img
      src="/images/robot-mascot.png"
      alt="StaffSync AI Mascot"
      width={size}
      height={size}
      className={cn(
        "select-none object-contain drop-shadow-[0_8px_16px_rgba(0,90,156,0.22)]",
        animate && "animate-robot",
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}

export function DemoBadge({ label = "Demo" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
      {label}
    </span>
  );
}

export function SourceTag({ source }: { source: "user" | "ai" }) {
  return source === "ai" ? (
    <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
      AI suggestion
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      Your input
    </span>
  );
}

export function Typing() {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-[var(--dash-card-border,#e2e8f0)] bg-[var(--dash-card-bg-solid,#ffffff)] px-4 py-3 shadow-sm"
      aria-label="StaffSync AI is typing"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary,#005A9C)] animate-typing"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

