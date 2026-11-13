"use client";

import { AlertCircle } from "lucide-react";

interface DashCheckboxFieldProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helperText?: string;
  error?: string;
  disabled?: boolean;
}

export function DashCheckboxField({
  label,
  name,
  checked,
  onChange,
  helperText,
  error,
  disabled = false,
}: DashCheckboxFieldProps) {
  const inputId = `checkbox-${name}`;

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className={`
          flex items-center gap-3 p-2.5 rounded-lg cursor-pointer
          transition-colors duration-150
          hover:bg-[var(--dash-card-hover)]
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <div className="relative flex-shrink-0">
          <input
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only peer"
            aria-describedby={error ? `error-${name}` : undefined}
          />
          <div
            className={`
              w-4 h-4 rounded border flex items-center justify-center
              transition-all duration-200
              ${checked
                ? "border-[var(--accent-primary)] bg-transparent"
                : "border-[var(--dash-text-secondary)] bg-transparent"
              }
            `}
          >
            {checked && (
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                className="text-[var(--accent-primary)]"
              >
                <path
                  d="M2 6L5 9L10 3"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>

        <span
          className={`text-xs ${
            checked
              ? "text-[var(--dash-text-primary)] font-medium"
              : "text-[var(--dash-text-secondary)]"
          }`}
        >
          {label}
        </span>
      </label>

      {error && (
        <div
          id={`error-${name}`}
          className="flex items-start gap-1.5 text-xs text-red-500 font-medium pl-3 leading-4"
          role="alert"
        >
          <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
          </span>
          <span className="leading-4 text-red-500">{error}</span>
        </div>
      )}

      {!error && helperText && (
        <p className="text-xs text-[var(--dash-text-secondary)] pl-3">{helperText}</p>
      )}
    </div>
  );
}
