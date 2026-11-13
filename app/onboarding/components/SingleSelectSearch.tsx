"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, ChevronDown, Check, Plus, AlertCircle } from "lucide-react";

interface SingleSelectSearchProps {
  label: string;
  name?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
}

export function SingleSelectSearch({
  label,
  name,
  options,
  value,
  onChange,
  placeholder = "Select option…",
  helperText,
  error,
  required = false,
  leftIcon,
}: SingleSelectSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom",
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase()),
  );

  const exactMatchExists = options.some(
    (opt) => opt.toLowerCase() === search.trim().toLowerCase(),
  );

  const handleSelect = useCallback(
    (option: string) => {
      const isCustom =
        !options.includes(option) && !option.endsWith(" (Others)");
      const formattedOption = isCustom ? `${option} (Others)` : option;
      onChange(formattedOption);
      setIsOpen(false);
      setSearch("");
    },
    [onChange, options],
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
      className="space-y-1.5"
      ref={containerRef}
      id={name ? `field-${name}` : undefined}
      data-field={name}
    >
      <label className="inline-flex items-center text-xs font-medium text-slate-700">
        <span>{label}</span>
        {required && (
          <span className="text-rose-500 font-bold text-xs">*</span>
        )}
      </label>

      <div className="relative">
        {/* Trigger Button */}
        <div
          id={name ? `trigger-${name}` : undefined}
          tabIndex={0}
          onClick={handleToggle}
          className={`
            relative h-[var(--dash-input-height)] w-full rounded-xl border bg-white px-4 pr-4 text-left
            flex items-center justify-between cursor-pointer
            transition-all duration-200
            ${
              isOpen
                ? "border-[#005A9C] ring-2 ring-[#005A9C]/20 bg-white"
                : error
                  ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
                  : "border-slate-300 hover:border-slate-400"
            }
          `}
        >
          <span
            className={`text-xs truncate ${
              value
                ? "text-slate-900 font-medium"
                : "text-slate-400"
            }`}
          >
            {value || placeholder}
          </span>

          <ChevronDown
            className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            className={`absolute z-50 left-0 right-0 rounded-xl bg-white backdrop-blur-xl shadow-2xl overflow-hidden border border-slate-200 ${dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"}`}
          >
            {/* Search Input inside Dropdown */}
            <div className="p-2 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  ref={searchRef}
                  id={name ? `input-${name}` : undefined}
                  name={name}
                  type="text"
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-haspopup="listbox"
                  aria-controls="single-select-dropdown"
                  aria-label={label}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type to search or enter custom..."
                  className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Options list */}
            <ul
              id="single-select-dropdown"
              className="max-h-52 overflow-y-auto p-1.5 space-y-0.5"
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
                <li className="px-3 py-4 text-center text-xs text-slate-500">
                  No matching options
                </li>
              ) : (
                filtered.map((option, index) => {
                  const isSelected = value === option;
                  return (
                    <li
                      key={`${option}-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(option)}
                      className={`px-3 py-2 rounded-lg text-xs cursor-pointer flex items-center justify-between transition-colors duration-150 ${
                        isSelected
                          ? "bg-[#EFF6FF] text-[#005A9C] font-semibold border border-[#DBEAFE]"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#005A9C] flex-shrink-0" />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <div id={name ? `error-${name}` : undefined} className="flex items-start gap-1.5 text-xs leading-4 text-red-500 font-medium">
          <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          </span>
          <span className="leading-4">{error}</span>
        </div>
      )}
    </div>
  );
}
