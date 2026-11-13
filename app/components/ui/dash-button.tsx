import * as React from "react";
import { cn } from "@/app/lib/utils";

export interface DashButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const DashButton = React.forwardRef<HTMLButtonElement, DashButtonProps>(
  ({ className, variant = "primary", size, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "dash-btn",
          variant === "primary" && "dash-btn-primary",
          variant === "ghost" && "dash-btn-ghost",
          variant === "secondary" && "bg-[var(--dash-input-bg)] text-[var(--dash-text-primary)] hover:bg-[var(--dash-card-hover)] border border-[var(--dash-card-border)]",
          variant === "outline" && "border border-[var(--dash-card-border)] text-[var(--dash-text-primary)] hover:bg-[var(--dash-card-hover)] bg-transparent",
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "lg" && "px-6 py-3 text-base",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DashButton.displayName = "DashButton";
