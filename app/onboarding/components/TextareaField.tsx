"use client";

import { forwardRef } from "react";
import { Textarea } from "@/app/components/ui/textarea";
import { AlertCircle } from "lucide-react";

interface TextareaFieldProps {
  label?: string;
  name: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  minWords?: number;
  maxWords?: number;
  countType?: "characters" | "words";
  resizable?: boolean;
  rows?: number;
  className?: string;
  value?: string;
  leftIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    {
      label,
      name,
      placeholder,
      helperText,
      error,
      required = false,
      disabled = false,
      maxLength = 1000,
      minWords,
      maxWords,
      countType = "characters",
      resizable = false,
      rows = 6,
      className = "",
      value = "",
      leftIcon,
      ...rest
    },
    ref
  ) => {
    const inputId = `field-${name}`;
    const errorId = `error-${name}`;
    const helperId = `helper-${name}`;
    const charCount = value?.length || 0;
    const words = value?.trim() ? value.trim().split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;

    const isWordCountMode = countType === "words" || !!maxWords || !!minWords;

    let counterText = "";
    let counterColorClass = "text-slate-400";

    if (isWordCountMode) {
      const targetMax = maxWords || 150;
      const targetMin = minWords || 100;

      if (wordCount === 0) {
        counterText = `0 / ${targetMax} words`;
        counterColorClass = "text-slate-400";
      } else if (wordCount < targetMin) {
        counterText = `${wordCount} / ${targetMax} words (${targetMin - wordCount} more needed)`;
        counterColorClass = "text-amber-500 font-medium";
      } else if (wordCount <= targetMax) {
        counterText = `${wordCount} / ${targetMax} words`;
        counterColorClass = "text-emerald-600 font-medium";
      } else {
        counterText = `${wordCount} / ${targetMax} words (${wordCount - targetMax} over limit)`;
        counterColorClass = "text-red-500 font-semibold";
      }
    } else {
      counterText = `${charCount}/${maxLength}`;
      counterColorClass = charCount > maxLength * 0.9 ? "text-amber-500 font-bold" : "text-slate-400";
    }

    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="inline-flex items-center form-label text-xs font-medium text-slate-700"
            >
              <span>{label}</span>
              {required && (
                <span className="form-label-required text-rose-500 font-bold text-xs" aria-hidden="true">
                  *
                </span>
              )}
            </label>
          </div>
        )}

        <Textarea
          ref={ref}
          id={inputId}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={isWordCountMode ? undefined : maxLength}
          rows={rows}
          value={value}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          aria-invalid={!!error}
          aria-required={required}
          className={`
            w-full rounded-xl border bg-white form-input-text text-slate-900 text-xs
            px-4 py-3 ${resizable ? "resize-y" : "!resize-none resize-none"}
            min-h-[140px] ${!resizable ? "max-h-[160px] overflow-y-auto" : ""}
            placeholder:text-slate-400
            transition-all duration-200
            focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20 focus:bg-white
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
              : "border-slate-300 hover:border-slate-400"
            }
          `}
          style={!resizable ? { resize: "none" } : undefined}
          {...rest}
        />

        <div className="flex items-center justify-between text-xs min-h-[1.25rem]">
          {error ? (
            <div
              id={errorId}
              className="flex items-start gap-1.5 form-error-text leading-4 text-red-500 font-medium"
              role="alert"
            >
              <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              </span>
              <span className="leading-4">{error}</span>
            </div>
          ) : helperText ? (
            <p id={helperId} className="text-slate-500">
              {helperText}
            </p>
          ) : (
            <div />
          )}

          {/* Counter */}
          <span
            className={`font-mono tabular-nums transition-colors duration-200 ml-auto ${counterColorClass}`}
          >
            {counterText}
          </span>
        </div>
      </div>
    );
  }
);

TextareaField.displayName = "TextareaField";
