"use client";

import { forwardRef } from "react";
import { Input } from "@/app/components/ui/input";
import { Phone, AlertCircle } from "lucide-react";

interface PhoneInputProps {
  label: string;
  name: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      name,
      placeholder = "+91 98765 43210",
      helperText,
      error,
      required = false,
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const inputId = `field-${name}`;
    const errorId = `error-${name}`;
    const helperId = `helper-${name}`;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="inline-flex items-center text-sm font-medium text-[var(--ob-text-secondary)]"
        >
          <span>{label}</span>
          {required && (
            <span className="text-[var(--ob-error)] text-xs" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <div className="relative">
          {/* Country code prefix */}
          <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pr-3 border-r border-[var(--ob-border)] pointer-events-none gap-1.5">
            <Phone className="w-4 h-4 text-[var(--ob-text-muted)]" />
            <span className="text-sm text-[var(--ob-text-secondary)] font-medium">+91</span>
          </div>

          <Input
            ref={ref}
            id={inputId}
            name={name}
            type="tel"
            placeholder={placeholder}
            disabled={disabled}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            aria-invalid={!!error}
            aria-required={required}
            className={`
              h-[var(--dash-input-height)] w-full rounded-xl border bg-[var(--ob-card-bg)] text-[var(--ob-text)] text-sm
              pl-[105px]
              placeholder:text-[var(--ob-text-placeholder)]
              transition-all duration-200
              focus:border-[var(--ob-border-focus)] focus:ring-2 focus:ring-[var(--ob-primary)]/10
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error
                ? "border-[var(--ob-error)] focus:border-[var(--ob-error)] focus:ring-[var(--ob-error)]/10"
                : "border-[var(--ob-border)]"
              }
            `}
            {...rest}
          />
        </div>

        {error && (
          <div
            id={errorId}
            className="flex items-start gap-1.5 text-xs leading-4 text-red-500 font-medium"
            role="alert"
          >
            <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            </span>
            <span className="leading-4 text-red-500">{error}</span>
          </div>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-xs text-[var(--ob-text-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
