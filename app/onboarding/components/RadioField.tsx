"use client";

import { AlertCircle } from "lucide-react";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioFieldProps {
  label: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function RadioField({
  label,
  name,
  options,
  value,
  onChange,
  error,
  helperText,
  required = false,
}: RadioFieldProps) {
  return (
    <fieldset className="space-y-3" aria-required={required}>
      <legend className="inline-flex items-center text-sm font-medium text-[var(--ob-text-secondary)]">
        <span>{label}</span>
        {required && (
          <span className="text-[var(--ob-error)] text-xs">*</span>
        )}
      </legend>

      <div className="flex flex-col sm:flex-row gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              className={`
                flex items-center gap-3 flex-1 p-4 rounded-xl border-2 cursor-pointer
                transition-all duration-200
                ${isSelected
                  ? "border-[var(--ob-primary)] bg-[var(--ob-primary-lighter)] shadow-[0_0_0_3px_var(--ob-primary-light)]"
                  : "border-[var(--ob-border)] bg-[var(--ob-card-bg)] hover:border-[var(--ob-text-muted)]/40"
                }
              `}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />

              {/* Custom radio indicator */}
              <div
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  transition-all duration-200
                  ${isSelected
                    ? "border-[var(--ob-primary)]"
                    : "border-[var(--ob-border)]"
                  }
                `}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--ob-primary)]" />
                )}
              </div>

              <div>
                <span
                  className={`text-sm font-medium ${
                    isSelected ? "text-[var(--ob-primary)]" : "text-[var(--ob-text)]"
                  }`}
                >
                  {option.label}
                </span>
                {option.description && (
                  <p className="text-xs text-[var(--ob-text-muted)] mt-0.5">
                    {option.description}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {error && (
        <div className="flex items-start gap-1.5 text-xs leading-4 text-red-500 font-medium" role="alert">
          <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          </span>
          <span className="leading-4 text-red-500">{error}</span>
        </div>
      )}

      {!error && helperText && (
        <p className="text-xs text-[var(--ob-text-muted)]">{helperText}</p>
      )}
    </fieldset>
  );
}
