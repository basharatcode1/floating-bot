"use client";

import { AlertCircle } from "lucide-react";

interface CheckboxFieldProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helperText?: string;
  error?: string;
  disabled?: boolean;
}

export function CheckboxField({
  label,
  name,
  checked,
  onChange,
  helperText,
  error,
  disabled = false,
}: CheckboxFieldProps) {
  const inputId = `checkbox-${name}`;

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className={`
          flex items-center gap-3 p-2.5 rounded-lg cursor-pointer
          transition-colors duration-150
          ${checked
            ? "bg-[#005A9C]/5 text-[#005A9C]"
            : "hover:bg-slate-100 text-slate-700"
          }
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
              w-4 h-4 rounded-md border flex items-center justify-center
              transition-all duration-200
              ${checked
                ? "bg-[#005A9C] border-[#005A9C] text-white shadow-sm shadow-[#005A9C]/20"
                : "border-slate-300 bg-white hover:border-slate-400"
              }
            `}
          >
            {checked && (
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                className="text-white"
              >
                <path
                  d="M2 6L5 9L10 3"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>

        <span
          className={`text-xs transition-colors ${
            checked ? "text-slate-900 font-medium" : "text-slate-700"
          }`}
        >
          {label}
        </span>
      </label>

      {error && (
        <div
          id={`error-${name}`}
          className="flex items-start gap-1.5 text-xs leading-4 text-red-500 font-medium pl-3"
          role="alert"
        >
          <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          </span>
          <span className="leading-4 text-red-500">{error}</span>
        </div>
      )}

      {!error && helperText && (
        <p className="text-xs text-[var(--ob-text-muted)] pl-3">{helperText}</p>
      )}
    </div>
  );
}
