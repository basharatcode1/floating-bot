"use client";

import React from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import "./glass-button-2.css";

export const buttonVariants2 = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors",
  {
    variants: {
      variant: {
        glass: "glass-button-2",
      },
      size: {
        glass: "glass-button-2-size",
        hero: "glass-button-2-size",
        form: "glass-button-2-form",
        sm: "glass-button-2-sm",
        lg: "glass-button-2-lg",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "form",
    },
  }
);

export interface GlassButton2Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants2> {
  children?: React.ReactNode;
  size?: "hero" | "form" | "sm" | "lg" | "glass";
  isLoading?: boolean;
  icon?: React.ReactNode;
  showArrow?: boolean;
}

export function GlassButton2({
  children = "Sign In",
  className = "",
  size = "form",
  variant = "glass",
  isLoading = false,
  icon,
  showArrow = true,
  disabled,
  ...props
}: GlassButton2Props) {
  const sizeClass =
    size === "hero" || size === "glass"
      ? "glass-button-2-size"
      : size === "sm"
      ? "glass-button-2-sm"
      : size === "lg"
      ? "glass-button-2-lg"
      : "glass-button-2-form";

  return (
    <button
      className={`glass-button-2 ${sizeClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="glass-button-2-content glass-button-content">
        <span className="glass-button-2-label glass-button-label">{children}</span>
        {showArrow && (
          <span className="glass-button-2-arrow glass-arrow" aria-hidden="true">
            {isLoading ? (
              <Loader2
                className={
                  size === "hero" || size === "glass"
                    ? "w-8 h-8 animate-spin text-white"
                    : "w-3 h-3 animate-spin text-white"
                }
              />
            ) : (
              icon || <ArrowRight />
            )}
          </span>
        )}
      </span>
    </button>
  );
}

export default GlassButton2;
