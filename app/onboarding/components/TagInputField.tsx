"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Plus, X, AlertCircle } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export interface TagInputFieldProps {
  label?: string;
  name?: string;
  value?: string[];
  onChange: (selected: string[]) => void;
  suggestions?: string[];
  options?: string[]; // Alias to support options={...}
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  maxSelections?: number;
  quickAddLabel?: string;
}

export function TagInputField({
  label,
  name = "tags",
  value = [],
  onChange,
  suggestions = [],
  options,
  placeholder = "Type and press Enter to add...",
  helperText,
  error,
  required = false,
  disabled = false,
  className = "",
  maxSelections,
  quickAddLabel = "Quick add:",
}: TagInputFieldProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const inputId = `field-${name}`;
  const helperId = `helper-${name}`;
  const errorId = `error-${name}`;

  const allSuggestions = suggestions.length > 0 ? suggestions : options || [];
  const remainingSuggestions = allSuggestions.filter(
    (item) => !value.some((v) => v.toLowerCase() === item.toLowerCase())
  );

  const handleAdd = (raw: string) => {
    if (disabled) return;
    const trimmed = raw.trim();
    if (!trimmed) return;

    // Support comma-separated tags if pasted or typed
    const itemsToAdd = trimmed
      .split(",")
      .map((item) => item.trim().slice(0, 80))
      .filter((item) => item.length > 0);

    const updated = [...value];
    let changed = false;

    for (const item of itemsToAdd) {
      const alreadyExists = updated.some(
        (v) => v.toLowerCase() === item.toLowerCase()
      );
      if (!alreadyExists) {
        if (maxSelections && updated.length >= maxSelections) {
          break;
        }
        updated.push(item);
        changed = true;
      }
    }

    if (changed) {
      onChange(updated);
    }
    setDraft("");
  };

  const handleRemove = (itemToRemove: string) => {
    if (disabled) return;
    onChange(value.filter((item) => item !== itemToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (draft.trim()) {
        handleAdd(draft);
      }
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      handleRemove(value[value.length - 1]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`} id={`container-${name}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="inline-flex items-center text-xs font-medium text-slate-700"
        >
          <span>{label}</span>
          {required && (
            <span
              className="text-rose-500 font-bold text-xs ml-0.5"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      {/* Input & Add Button Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <Input
            ref={inputRef}
            id={inputId}
            name={name}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            aria-invalid={!!error}
            className={`
              h-[var(--dash-input-height)] w-full rounded-xl border bg-white text-slate-900 font-medium text-xs
              placeholder:text-slate-400
              transition-all duration-200
              focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20 focus:bg-white
              disabled:opacity-50 disabled:cursor-not-allowed
              px-4
              ${
                error
                  ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                  : "border-slate-300 hover:border-slate-400"
              }
            `}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleAdd(draft)}
          disabled={!draft.trim() || disabled}
          className="h-[var(--dash-input-height)] px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#005A9C] hover:border-[#005A9C] text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-1.5"
          aria-label={`Add ${label || "tag"}`}
        >
          <Plus className="w-3.5 h-3.5 text-[#005A9C]" />
          <span>Add</span>
        </Button>
      </div>

      {/* Selected Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#005A9C] text-xs font-medium border border-[#DBEAFE] shadow-2xs transition-colors"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                disabled={disabled}
                className="hover:bg-[#DBEAFE] rounded-md p-0.5 transition-colors cursor-pointer text-[#005A9C]/70 hover:text-[#005A9C] focus:outline-none focus:ring-1 focus:ring-[#005A9C] disabled:cursor-not-allowed"
                aria-label={`Remove ${item}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Quick Add Suggestions */}
      {remainingSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-medium text-slate-400 select-none">
            {quickAddLabel}
          </span>
          {remainingSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleAdd(suggestion)}
              disabled={disabled}
              className="group inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 bg-slate-50/70 hover:bg-[#EFF6FF] hover:border-[#005A9C] hover:text-[#005A9C] px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#005A9C]/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-3 h-3 text-slate-400 group-hover:text-[#005A9C]" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Error Message */}
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

      {/* Helper Text */}
      {!error && helperText && (
        <p id={helperId} className="text-[11px] text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

export { TagInputField as TagInput };

