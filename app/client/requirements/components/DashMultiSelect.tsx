"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, ChevronDown, AlertCircle, Plus, Check } from "lucide-react";

interface DashMultiSelectProps {
  label: string;
  name: string;
  options: string[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  maxSelections?: number;
  closeOnSelect?: boolean;
  showCheckboxes?: boolean;
  allowCustom?: boolean;
  selectAllOption?: {
    name: string;
    targets: string[];
  };
  className?: string;
}

export function DashMultiSelect({
  label,
  name,
  options,
  value = [],
  onChange,
  placeholder = "Search and select…",
  helperText,
  error,
  required = false,
  maxSelections,
  closeOnSelect = false,
  showCheckboxes = true,
  allowCustom = true,
  selectAllOption,
  className,
}: DashMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom",
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const errorId = `error-${name}`;
  const helperId = `helper-${name}`;

  // Use a fallback empty array if options is undefined
  const safeOptions = options || [];

  const filtered = safeOptions.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase()),
  );

  const exactMatchExists = safeOptions.some(
    (opt) => opt.toLowerCase() === search.trim().toLowerCase(),
  );

  const isOptionActive = useCallback(
    (option: string) => {
      if (
        selectAllOption &&
        option.toLowerCase() === selectAllOption.name.toLowerCase()
      ) {
        return (
          selectAllOption.targets.length > 0 &&
          selectAllOption.targets.every((t) => value.includes(t))
        );
      }
      return value.includes(option);
    },
    [selectAllOption, value],
  );

  const handleRemove = useCallback(
    (option: string) => {
      onChange(value.filter((v) => v !== option));
    },
    [value, onChange],
  );

  const handleToggleOption = useCallback(
    (option: string) => {
      if (
        selectAllOption &&
        option.toLowerCase() === selectAllOption.name.toLowerCase()
      ) {
        const allSelected =
          selectAllOption.targets.length > 0 &&
          selectAllOption.targets.every((t) => value.includes(t));
        if (allSelected) {
          onChange(value.filter((v) => !selectAllOption.targets.includes(v)));
        } else {
          const newSet = new Set([...value, ...selectAllOption.targets]);
          onChange(Array.from(newSet));
        }
        setSearch("");
        return;
      }

      if (value.includes(option)) {
        handleRemove(option);
      } else {
        if (maxSelections && value.length >= maxSelections) return;
        const isCustom =
          !safeOptions.includes(option) && !option.endsWith(" (Others)");
        if (isCustom && !allowCustom) return;
        const formattedOption = isCustom ? `${option} (Others)` : option;
        if (!value.includes(formattedOption)) {
          const nextValue = [...value, formattedOption];
          onChange(nextValue);

          const remainingCount = safeOptions.filter(
            (opt) => !nextValue.includes(opt),
          ).length;
          if (
            closeOnSelect ||
            (maxSelections && nextValue.length >= maxSelections) ||
            remainingCount === 0
          ) {
            setIsOpen(false);
          }
        }
      }
      setSearch("");
    },
    [
      selectAllOption,
      value,
      onChange,
      handleRemove,
      maxSelections,
      safeOptions,
      allowCustom,
      closeOnSelect,
    ],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (search.trim()) {
        const targetOption =
          filtered.length > 0
            ? filtered[0]
            : allowCustom
              ? search.trim()
              : null;
        if (targetOption) {
          handleToggleOption(targetOption);
        }
      }
    }
  };

  /* Close on outside click */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* Focus search input when dropdown opens */
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  /* Calculate position synchronously before opening */
  const handleToggle = useCallback(() => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 150 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <div
      className={`space-y-1.5 w-full ${className || ""}`}
      ref={containerRef}
      id={`field-${name}`}
      data-field={name}
    >
      <label className="flex items-center gap-1 text-xs font-medium text-[var(--dash-text-primary)]">
        {label}
        {required && (
          <span className="text-rose-500 font-bold text-xs ml-0.5">*</span>
        )}
      </label>

      <div className="relative">
        {/* Trigger Box / Search Input */}
        <div
          id={`trigger-${name}`}
          onClick={() => {
            if (!isOpen) handleToggle();
            searchRef.current?.focus();
          }}
          className={`
            h-[var(--dash-input-height)] w-full rounded-xl border bg-[var(--dash-input-bg)] ${value.length > 0 ? "pl-2 pr-4" : "px-4"}
            flex items-center cursor-text
            transition-all duration-200 gap-1.5 overflow-hidden
            ${
              isOpen
                ? "border-indigo-500 ring-2 ring-indigo-500/20"
                : error
                  ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                  : "border-[var(--dash-input-border)] hover:border-[var(--dash-text-secondary)]/50"
            }
          `}
        >
          {value.length > 0 ? (
            <div className="flex items-center gap-1.5 flex-shrink overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:!hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {value.map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-[var(--dash-badge-bg)] text-[var(--dash-badge-text)] text-[10px] font-semibold border border-[var(--dash-input-border)] whitespace-nowrap flex-shrink-0"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-[var(--dash-text-muted)] truncate flex-1">
              {placeholder}
            </span>
          )}
          <ChevronDown
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className={`w-4 h-4 text-[var(--dash-text-secondary)] flex-shrink-0 transition-transform duration-200 cursor-pointer ml-auto ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            className={`absolute z-50 left-0 right-0 rounded-xl bg-[var(--dash-card-bg-solid)] backdrop-blur-xl shadow-2xl overflow-hidden border border-[var(--dash-card-border)] ${dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"}`}
          >
            {/* Search Input inside Dropdown */}
            <div className="p-2 border-b border-[var(--dash-card-border)] bg-[var(--dash-card-bg)]">
              <div className="flex items-center gap-2 rounded-lg border border-[var(--dash-input-border)] bg-[var(--dash-input-bg)] px-3 py-1.5">
                <Search className="w-4 h-4 text-[var(--dash-text-secondary)] flex-shrink-0" />
                <input
                  ref={searchRef}
                  id={`input-${name}`}
                  name={name}
                  type="text"
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-haspopup="listbox"
                  aria-controls="multi-select-dropdown"
                  aria-label={label}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type to search..."
                  className="flex-1 bg-transparent text-xs text-[var(--dash-text-primary)] placeholder:text-[var(--dash-text-muted)] outline-none"
                />
              </div>
            </div>

            {/* Selected Tags Box */}
            {value.length > 0 && (
              <div className="px-3 py-2.5 border-b border-[var(--dash-card-border)] bg-indigo-500/5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {value.map((tag, idx) => (
                    <span
                      key={`${tag}-${idx}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--dash-badge-bg)] text-[var(--dash-badge-text)] text-xs font-medium border border-[var(--dash-input-border)]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(tag);
                        }}
                        className="hover:bg-[var(--dash-card-hover)] rounded-sm p-0.5 transition-colors cursor-pointer text-[var(--dash-text-secondary)] hover:text-rose-400"
                        aria-label={`Remove ${tag}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Options */}
            <ul
              id="multi-select-dropdown"
              className="max-h-48 overflow-y-auto p-1.5 space-y-0.5"
              role="listbox"
              aria-label={`${label} options`}
              onWheel={(e) => e.stopPropagation()}
            >
              {allowCustom && search.trim() && !exactMatchExists && (
                <li
                  onClick={() => handleToggleOption(search.trim())}
                  className="px-3 py-2 rounded-lg text-xs text-indigo-400 hover:bg-[var(--dash-card-hover)] cursor-pointer flex items-center gap-2 font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add &quot;{search.trim()}&quot; (Others)</span>
                </li>
              )}

              {filtered.length === 0 &&
              (!allowCustom || !search.trim() || exactMatchExists) ? (
                <li className="px-3 py-6 text-center text-xs text-[var(--dash-text-muted)]">
                  No matching options
                </li>
              ) : (
                filtered.map((option, idx) => {
                  const isSelected = isOptionActive(option);
                  return (
                    <li
                      key={`${option}-${idx}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleToggleOption(option)}
                      className={`px-3 py-2 rounded-lg text-xs cursor-pointer flex items-center justify-between transition-colors duration-150 ${
                        isSelected
                          ? "bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20"
                          : "text-[var(--dash-text-primary)] hover:bg-[var(--dash-card-hover)] hover:text-[var(--dash-text-primary)]"
                      }`}
                    >
                      <span>{option}</span>
                      {showCheckboxes && (
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-500 text-white"
                              : "border-[var(--dash-input-border)] bg-[var(--dash-input-bg)]"
                          }`}
                        >
                          {isSelected && (
                            <Check
                              className="w-3 h-3"
                              color="white"
                              stroke="white"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                      )}
                    </li>
                  );
                })
              )}
            </ul>

            {maxSelections && (
              <div className="px-3 py-2 border-t border-[var(--dash-card-border)] text-xs text-[var(--dash-text-muted)]">
                {value.length}/{maxSelections} selected
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div
          id={errorId}
          className="flex items-start gap-1.5 text-xs text-red-500 font-medium leading-4"
          role="alert"
        >
          <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
          </span>
          <span className="leading-4 text-red-500">{error}</span>
        </div>
      )}

      {!error && helperText && (
        <p id={helperId} className="text-xs text-[var(--dash-text-muted)]">
          {helperText}
        </p>
      )}
    </div>
  );
}
