"use client";

import { forwardRef } from "react";
import { AlertCircle, ExternalLink } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/app/lib/utils";
import type { SocialPlatformConfig } from "@/app/onboarding/schemas/types";

interface SocialCardProps extends React.InputHTMLAttributes<HTMLInputElement> {
  platform: SocialPlatformConfig;
  value?: string;
  error?: string;
  required?: boolean;
}

/* Official brand logo SVGs in rounded app icon containers */
function LinkedinIcon() {
  return (
    <div className="w-7 h-7 rounded-md bg-[#0A66C2] flex items-center justify-center text-white flex-shrink-0 shadow-xs">
      <svg className="w-[24px] h-[24px] fill-white" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
      </svg>
    </div>
  );
}

function TwitterIcon() {
  return (
    <div className="w-7 h-7 rounded-md bg-black flex items-center justify-center text-white flex-shrink-0 shadow-xs">
      <svg className="w-[20px] h-[20px] fill-white" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </div>
  );
}

function InstagramIcon() {
  return (
    <div
      className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 shadow-xs"
      style={{
        background:
          "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
      }}
    >
      <svg
        className="w-[20px] h-[20px] text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    </div>
  );
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Linkedin: LinkedinIcon,
  linkedin: LinkedinIcon,
  Twitter: TwitterIcon,
  twitter: TwitterIcon,
  Instagram: InstagramIcon,
  instagram: InstagramIcon,
};

export const SocialCard = forwardRef<HTMLInputElement, SocialCardProps>(
  (
    { platform, value = "", error, required = false, className, ...rest },
    ref,
  ) => {
    const Icon =
      ICON_MAP[platform.icon] || ICON_MAP[platform.id] || ExternalLink;
    const fieldIdentifier = (rest as any).name || platform.id;
    const inputId = `field-${fieldIdentifier}`;

    const isLinkedin =
      platform.id === "linkedin" ||
      platform.icon?.toLowerCase().includes("linkedin");
    const isFieldRequired = required || isLinkedin;
    const displayLabel = platform.id === "twitter" ? "X" : platform.label;

    return (
      <div
        id={`field-${fieldIdentifier}`}
        data-field={fieldIdentifier}
        className="space-y-2"
      >
        {/* Header row: Logo icon + Label */}
        <div className="flex items-center gap-2">
          <div
            className="shrink-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <Icon />
          </div>
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-800 cursor-pointer select-none inline-flex items-center"
          >
            <span>{displayLabel}</span>
            {isFieldRequired && (
              <span
                className="text-red-500 font-bold ml-1 text-xs"
                aria-hidden="true"
              >
                *
              </span>
            )}
          </label>
        </div>

        {/* Input field */}
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type="url"
            placeholder={platform.placeholder}
            value={value}
            aria-label={`${displayLabel} URL`}
            aria-invalid={!!error}
            aria-required={isFieldRequired}
            className={cn(
              "h-[var(--dash-input-height)] w-full rounded-xl border bg-white text-slate-900 font-medium text-small-xs",
              "placeholder:text-slate-400 transition-all duration-200",
              "focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20 focus:bg-white",
              "disabled:opacity-50 disabled:cursor-not-allowed px-3.5",
              error
                ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                : "border-slate-300 hover:border-slate-400",
              className,
            )}
            {...rest}
          />
        </div>

        {/* Error message */}
        {error && (
          <div
            id={`error-${inputId}`}
            className="flex items-start gap-1.5 text-xs leading-4 text-red-500 font-medium pt-0.5"
            role="alert"
          >
            <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            </span>
            <span className="leading-4 text-red-500">{error}</span>
          </div>
        )}
      </div>
    );
  },
);

SocialCard.displayName = "SocialCard";
