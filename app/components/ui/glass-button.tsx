"use client";

import React from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import "./glass-button.css";

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  size?: "hero" | "form" | "sm" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  showArrow?: boolean;
}

export function GlassButton({
  children = "Sign Up",
  className = "",
  size = "form",
  isLoading = false,
  icon,
  showArrow = true,
  disabled,
  ...props
}: GlassButtonProps) {
  const sizeClass =
    size === "hero"
      ? "glass-button-size"
      : size === "sm"
      ? "glass-button-sm"
      : size === "lg"
      ? "glass-button-lg"
      : "glass-button-form";

  return (
    <button
      className={`glass-button ${sizeClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="glass-button-content">
        <span className="glass-button-label">{children}</span>
        {showArrow && (
          <span className="glass-arrow" aria-hidden="true">
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin text-white" />
            ) : (
              icon || <ArrowRight />
            )}
          </span>
        )}
      </span>
    </button>
  );
}

export default GlassButton;
