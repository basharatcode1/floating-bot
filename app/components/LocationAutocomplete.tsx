import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { LocationSuggestion } from "@/app/types/location";
import { useLocationSearch } from "@/app/hooks/useLocationSearch";
import { resolveCoordinates } from "@/app/services/location";

interface LocationAutocompleteProps {
  label: string;
  name: string;
  value: string; // The text value (e.g. headquarters string)
  onChange: (value: string, suggestion?: LocationSuggestion) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  onlyCity?: boolean;
  theme?: "light" | "dark";
  hideIcon?: boolean;
}

export function LocationAutocomplete({
  label,
  name,
  value,
  onChange,
  placeholder = "Search location...",
  helperText,
  error,
  required = false,
  disabled = false,
  className = "",
  inputClassName = "",
  labelClassName = "",
  onlyCity = false,
  theme = "light",
  hideIcon = false,
}: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [localInputValue, setLocalInputValue] = useState(value);
  const [isResolving, setIsResolving] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom",
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setSearch, suggestions, isLoading } = useLocationSearch(value);

  // Sync internal input value with prop value if prop value changes externally
  useEffect(() => {
    setLocalInputValue(value);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 250 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalInputValue(val);
    setSearch(val);

    // Clear parent value if input is cleared
    if (!val.trim()) {
      onChange("", undefined);
    }

    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelectSuggestion = async (suggestion: LocationSuggestion) => {
    setIsOpen(false);

    // Format visual display text
    const displayValue =
      onlyCity || !suggestion.subtitle
        ? suggestion.title
        : `${suggestion.title}, ${suggestion.subtitle}`;

    setLocalInputValue(displayValue);
    setSearch(displayValue);
    setIsResolving(true);

    try {
      // Resolve coordinates if Google Place ID is used
      const resolved = await resolveCoordinates(suggestion);
      onChange(displayValue, resolved);
    } catch (err) {
      console.error("Error resolving location coordinates:", err);
      // Fallback: still notify parent of selection even if geocoding fails
      onChange(displayValue, suggestion);
    } finally {
      setIsResolving(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const inputId = `location-input-${name}`;
  const listboxId = `location-listbox-${name}`;
  const errorId = `location-error-${name}`;
  const helperId = `location-helper-${name}`;

  return (
    <div
      className={`space-y-1.5 relative w-full ${className}`}
      ref={containerRef}
      id={`field-${name}`}
      data-field={name}
    >
      <label
        htmlFor={inputId}
        className={
          labelClassName
            ? labelClassName
            : theme === "dark"
              ? "inline-flex items-center text-xs font-semibold text-slate-200 tracking-wider uppercase"
              : "inline-flex items-center text-xs font-medium text-slate-700"
        }
      >
        <span>{label}</span>
        {required && (
          <span
            className="text-rose-500 font-bold text-xs"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      {/* Input Field Container */}
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="text"
          value={localInputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled || isResolving}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={
            highlightedIndex >= 0
              ? `${name}-suggestion-${highlightedIndex}`
              : undefined
          }
          aria-haspopup="listbox"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`${
            inputClassName
              ? inputClassName
              : theme === "dark"
                ? `
                h-[var(--dash-input-height)] w-full rounded-xl border border-white/15 bg-slate-900/60 text-white text-xs px-4 pr-9
                placeholder:text-slate-500
                transition-all duration-200 outline-none
                focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-slate-900/90
                disabled:opacity-50 disabled:cursor-not-allowed
              `
                : `
                h-[var(--dash-input-height)] w-full rounded-xl border bg-white text-slate-900 text-xs px-4 pr-9
                placeholder:text-slate-400
                transition-all duration-200 outline-none
                focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white
                disabled:opacity-50 disabled:cursor-not-allowed
              `
          } ${
            error
              ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
              : inputClassName
                ? ""
                : theme === "dark"
                  ? "border-white/15 hover:border-white/25"
                  : "border-slate-300 hover:border-slate-400"
          }`}
        />

        {/* Status Indicators (Loading / Spinner) */}
        {(isLoading || isResolving) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && localInputValue.trim().length >= 3 && (
        <div
          id={listboxId}
          role="listbox"
          className={`absolute z-50 left-0 right-0 rounded-xl shadow-2xl max-h-60 overflow-y-auto p-1.5 space-y-0.5
            ${dropdownPosition === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"}
            ${
              theme === "dark"
                ? "bg-slate-900/95 border border-white/15 backdrop-blur-xl text-white"
                : "bg-[var(--dash-card-bg-solid,#0E1524)] border border-[var(--dash-card-border,rgba(255,255,255,0.1))]"
            }
          `}
        >
          {isLoading ? (
            <div
              className={`px-3 py-3 text-center text-xs flex items-center justify-center gap-2 ${theme === "dark" ? "text-slate-400" : "text-[var(--dash-text-secondary,var(--ob-text-muted))]"}`}
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Fetching suggestions...</span>
            </div>
          ) : suggestions.length === 0 ? (
            <div
              className={`px-3 py-3 text-center text-xs ${theme === "dark" ? "text-slate-400" : "text-[var(--dash-text-secondary,var(--ob-text-muted))]"}`}
            >
              No locations found
            </div>
          ) : (
            suggestions.map((suggestion, index) => {
              const isHighlighted = index === highlightedIndex;
              const itemId = `${name}-suggestion-${index}`;

              return (
                <div
                  key={`${suggestion.id}-${index}`}
                  id={itemId}
                  role="option"
                  aria-selected={isHighlighted}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors flex flex-col text-left
                    ${
                      theme === "dark"
                        ? isHighlighted
                          ? "bg-primary/20 text-white font-semibold border border-primary/30"
                          : "text-slate-200 hover:bg-white/[0.08] hover:text-white"
                        : isHighlighted
                          ? "bg-[var(--dash-card-hover,rgba(255,255,255,0.1))] text-[var(--dash-text-primary,#ffffff)] font-medium"
                          : "text-[var(--dash-text-secondary,rgba(255,255,255,0.8))] hover:bg-[var(--dash-card-hover,rgba(255,255,255,0.05))]"
                    }
                  `}
                >
                  <span
                    className={`text-xs font-medium truncate ${theme === "dark" ? "text-white" : "text-[var(--dash-text-primary,#ffffff)]"}`}
                  >
                    {suggestion.title}
                  </span>
                  {suggestion.subtitle && (
                    <span
                      className={`text-[10px] leading-tight mt-0.5 truncate ${theme === "dark" ? "text-slate-400" : "text-[var(--dash-text-secondary,var(--ob-text-muted))]"}`}
                    >
                      {suggestion.subtitle}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          id={errorId}
          className="text-xs text-red-500 font-medium flex items-start gap-1.5 mt-1 leading-4"
        >
          <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          </span>
          <span className="leading-4">{error}</span>
        </div>
      )}
    </div>
  );
}
