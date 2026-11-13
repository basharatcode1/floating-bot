"use client";

import { forwardRef, type ReactNode } from "react";
import { Input } from "@/app/components/ui/input";
import { AlertCircle } from "lucide-react";

interface InputFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  type?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      name,
      placeholder,
      helperText,
      error,
      required = false,
      type = "text",
      leftIcon,
      rightIcon,
      disabled = false,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const inputId = `field-${name}`;
    const helperId = `helper-${name}`;
    const errorId = `error-${name}`;

    return (
      <div className={`space-y-1.5 ${className}`}>
        {/* Label */}
        <label
          htmlFor={inputId}
          className="inline-flex items-center form-label text-xs font-medium text-slate-700"
        >
          <span className="flex gap-1  ">
            {label}{" "}
            {!error && helperText && (
              <p id={helperId} className="form-helper-text text-xs text-slate-500 font-normal">
                ({helperText})
              </p>
            )}{" "}
          </span>
          {required && (
            <span
              className="form-label-required text-rose-500 font-bold text-xs"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>

        {/* Input wrapper */}
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            aria-invalid={!!error}
            aria-required={required}
            className={`
              h-[var(--dash-input-height)] w-full rounded-xl border bg-white form-input-text text-slate-900 font-medium text-xs
              placeholder:text-slate-400
              transition-all duration-200
              focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20 focus:bg-white
              disabled:opacity-50 disabled:cursor-not-allowed
              px-4
              ${rightIcon ? "pr-11" : ""}
              ${
                error
                  ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                  : "border-slate-300 hover:border-slate-400"
              }
            `}
            {...rest}
          />

          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div
            id={errorId}
            className="flex items-start gap-1.5 form-error-text text-xs leading-4 text-red-500 font-medium"
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

InputField.displayName = "InputField";
