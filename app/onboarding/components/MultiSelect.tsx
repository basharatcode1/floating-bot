"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, ChevronDown, AlertCircle, Plus, Check } from "lucide-react";

interface MultiSelectProps {
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
  leftIcon?: React.ReactNode;
}

export function MultiSelect({
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
  showCheckboxes = false,
  leftIcon,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">("bottom");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const errorId = `error-${name}`;
  const helperId = `helper-${name}`;

  const filtered = options.filter(
    (opt) =>
      opt.toLowerCase().includes(search.toLowerCase())
  );

  const exactMatchExists = options.some(
    (opt) => opt.toLowerCase() === search.trim().toLowerCase()
  );

  const handleSelect = useCallback(
    (option: string) => {
      if (maxSelections && value.length >= maxSelections) return;
      const isCustom = !options.includes(option) && !option.endsWith(" (Others)");
      const formattedOption = isCustom ? `${option} (Others)` : option;
      if (!value.includes(formattedOption)) {
        const nextValue = [...value, formattedOption];
        onChange(nextValue);

        const remainingCount = options.filter((opt) => !nextValue.includes(opt)).length;
        if (closeOnSelect || (maxSelections && nextValue.length >= maxSelections) || remainingCount === 0) {
          setIsOpen(false);
        }
      }
      setSearch("");
    },
    [value, onChange, maxSelections, options, closeOnSelect]
  );

  const handleRemove = useCallback(
    (option: string) => {
      onChange(value.filter((v) => v !== option));
    },
    [value, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (search.trim()) {
        const targetOption = filtered.length > 0 ? filtered[0] : search.trim();
        handleSelect(targetOption);
      }
    }
  };

  /* Close on outside click */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
      className="space-y-1.5"
      ref={containerRef}
      id={`field-${name}`}
      data-field={name}
    >
      <label className="inline-flex items-center text-xs font-medium text-slate-700">
        <span>{label}</span>
        {required && (
          <span className="text-rose-500 font-bold text-xs">*</span>
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
            relative h-[var(--dash-input-height)] w-full rounded-xl border bg-white ${value.length > 0 ? "pl-2" : "px-4"} pr-4
            flex items-center cursor-text
            transition-all duration-200 gap-1.5 overflow-hidden
            ${isOpen
              ? "border-[#005A9C] ring-2 ring-[#005A9C]/20 bg-white"
              : error
                ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                : "border-slate-300 hover:border-slate-400"
            }
          `}
        >
          {value.length > 0 ? (
            <div className="flex items-center gap-1.5 flex-shrink overflow-x-auto no-scrollbar">
              {value.map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-[#EFF6FF] text-[#005A9C] text-[10px] font-semibold border border-[#DBEAFE] whitespace-nowrap flex-shrink-0"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-400 truncate flex-1">{placeholder}</span>
          )}
          <ChevronDown
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 cursor-pointer ml-auto ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className={`absolute z-50 left-0 right-0 rounded-xl bg-white backdrop-blur-xl shadow-2xl overflow-hidden border border-slate-200 ${dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"}`}>
            
            {/* Search Input inside Dropdown */}
            <div className="p-2 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
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
                  className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Selected Tags Box */}
            {value.length > 0 && (
              <div className="px-3 py-2.5 border-b border-slate-100 bg-[#EFF6FF]/50">
                <div className="flex flex-wrap items-center gap-1.5">
                  {value.map((tag, idx) => (
                    <span
                      key={`${tag}-${idx}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#005A9C] text-xs font-medium border border-[#DBEAFE]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(tag);
                        }}
                        className="hover:bg-[#DBEAFE] rounded-sm p-0.5 transition-colors cursor-pointer text-[#005A9C]/60 hover:text-[#005A9C]"
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
              {search.trim() && !exactMatchExists && (
                <li
                  onClick={() => handleSelect(search.trim())}
                  className="px-3 py-2 rounded-lg text-xs text-[#005A9C] hover:bg-slate-100 cursor-pointer flex items-center gap-2 font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add &quot;{search.trim()}&quot; (Others)</span>
                </li>
              )}

              {filtered.length === 0 && !search.trim() ? (
                <li className="px-3 py-6 text-center text-xs text-slate-500">
                  No matching options
                </li>
              ) : (
                filtered.map((option, idx) => {
                  const isSelected = value.includes(option);
                  return (
                    <li
                      key={`${option}-${idx}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => isSelected ? handleRemove(option) : handleSelect(option)}
                      className={`px-3 py-2 rounded-lg text-xs cursor-pointer flex items-center justify-between transition-colors duration-150 ${
                        isSelected 
                          ? "bg-[#EFF6FF] text-[#005A9C] font-semibold border border-[#DBEAFE]" 
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span>{option}</span>
                      {showCheckboxes && (
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected 
                              ? "bg-[#005A9C] border-[#005A9C] !text-white text-white shadow-sm" 
                              : "border-slate-300 bg-white"
                          }`}
                          style={isSelected ? { color: "#ffffff", backgroundColor: "#005A9C", borderColor: "#005A9C" } : undefined}
                        >
                          {isSelected && (
                            <Check
                              className="w-3 h-3 !text-white"
                              stroke="#ffffff"
                              color="#ffffff"
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
              <div className="px-3 py-2 border-t border-[var(--ob-divider)] text-xs text-[var(--ob-text-muted)]">
                {value.length}/{maxSelections} selected
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div id={errorId} className="flex items-start gap-1.5 text-xs leading-4 text-red-500 font-medium" role="alert">
          <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          </span>
          <span className="leading-4">{error}</span>
        </div>
      )}
    </div>
  );
}
