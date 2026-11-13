"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Search, ChevronDown, Check, Plus, X } from "lucide-react";

interface CertificationSelectSearchProps {
  name?: string;
  value?: string | string[];
  selectedValues?: string[];
  onChange?: (value: string) => void;
  onValuesChange?: (values: string[]) => void;
  placeholder?: string;
  error?: string;
  showCheckboxes?: boolean;
}

export const CERTIFICATIONS = [
  "AWS Certified Cloud Practitioner",
  "AWS Certified Solutions Architect - Associate",
  "AWS Certified Developer - Associate",
  "AWS Certified Solutions Architect - Professional",
  "AWS Certified DevOps Engineer - Professional",
  "Microsoft Certified: Azure Fundamentals",
  "Microsoft Certified: Azure Administrator Associate",
  "Microsoft Certified: Azure Solutions Architect Expert",
  "Google Cloud Certified Associate Cloud Engineer",
  "Google Cloud Certified Professional Cloud Architect",
  "Certified ScrumMaster (CSM)",
  "Professional Scrum Master (PSM I)",
  "Project Management Professional (PMP)",
  "Certified Information Systems Security Professional (CISSP)",
  "Salesforce Certified Administrator",
  "Salesforce Certified Platform App Builder",
  "Oracle Certified Associate, Java SE 8 Programmer",
  "Cisco Certified Network Associate (CCNA)",
  "ISTQB Certified Tester",
];

export function CertificationSelectSearch({
  name,
  value,
  selectedValues,
  onChange,
  onValuesChange,
  placeholder = "Select or enter certification…",
  error,
  showCheckboxes = true,
}: CertificationSelectSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedList = useMemo(() => {
    if (selectedValues) return selectedValues;
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.trim()) return [value.trim()];
    return [];
  }, [selectedValues, value]);

  const allOptions = useMemo(() => {
    const customList = selectedList.filter(
      (item) => !CERTIFICATIONS.includes(item)
    );
    return [...customList, ...CERTIFICATIONS];
  }, [selectedList]);

  const filtered = allOptions.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const exactMatchExists = allOptions.some(
    (opt) => opt.toLowerCase() === search.trim().toLowerCase()
  );

  const handleToggle = useCallback(
    (option: string) => {
      const isSelected = selectedList.includes(option);
      const nextList = isSelected
        ? selectedList.filter((item) => item !== option)
        : [...selectedList, option];

      if (onValuesChange) {
        onValuesChange(nextList);
      }
      if (onChange) {
        onChange(option);
      }
      if (!showCheckboxes && !onValuesChange) {
        setIsOpen(false);
      }
      setSearch("");
    },
    [selectedList, onChange, onValuesChange, showCheckboxes]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (search.trim()) {
        const targetOption =
          filtered.length > 0 ? filtered[0] : search.trim();
        handleToggle(targetOption);
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

  /* Focus search on open */
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      className="relative w-full"
      ref={containerRef}
      id={name ? `field-${name}` : undefined}
      data-field={name}
    >
      {/* Trigger Box */}
      <div
        id={name ? `trigger-${name}` : undefined}
        onClick={() => setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        className={`
          h-[var(--dash-input-height)] w-full rounded-xl border bg-white ${selectedList.length > 0 ? "pl-2 pr-3.5" : "px-3.5"}
          flex items-center justify-between cursor-pointer
          transition-all duration-200
          ${
            isOpen
              ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-white"
              : error
                ? "!border-red-500"
                : "border-slate-300 hover:border-slate-400"
          }
        `}
      >
        {selectedList.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-shrink overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:!hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {selectedList.map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-100 whitespace-nowrap flex-shrink-0"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-slate-400 truncate flex-1">{placeholder}</span>
        )}
        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 flex flex-col rounded-xl border border-slate-200 bg-white p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95">
          <div className="relative mb-2 flex items-center rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-1.5 flex-shrink-0">
            <Search className="mr-2 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type to search or enter custom..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none"
            />
          </div>

          {/* Selected Tags Box inside dropdown (as in MultiSelect) */}
          {selectedList.length > 0 && (
            <div className="px-2.5 py-2 mb-2 rounded-lg border border-slate-100 bg-indigo-50/50">
              <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                {selectedList.map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200"
                  >
                    <span className="max-w-[200px] truncate">{tag}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(tag);
                      }}
                      className="hover:bg-indigo-100 rounded-sm p-0.5 transition-colors cursor-pointer text-indigo-400 hover:text-indigo-700"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="max-h-56 overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
            {search.trim() && !exactMatchExists && (
              <button
                type="button"
                onClick={() => handleToggle(search.trim())}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-indigo-600 hover:bg-slate-100 flex items-center justify-between gap-1.5 font-medium transition-colors border-b border-slate-100 pb-2 mb-1"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Plus className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">Add "{search.trim()}"</span>
                </div>
                {showCheckboxes && (
                  <div className="w-3.5 h-3.5 rounded border border-dashed border-indigo-400 flex items-center justify-center flex-shrink-0 text-indigo-600">
                    <Plus className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            )}

            {filtered.map((option) => {
              const isSelected = selectedList.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleToggle(option)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-xs transition-colors duration-150 flex items-center justify-between gap-2
                    ${
                      isSelected
                        ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }
                  `}
                >
                  <span className="truncate">{option}</span>
                  {showCheckboxes && (
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-500 !text-white text-white shadow-sm"
                          : "border-slate-300 bg-white"
                      }`}
                      style={isSelected ? { color: "#ffffff", backgroundColor: "#4f46e5", borderColor: "#6366f1" } : undefined}
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
                </button>
              );
            })}

            {!search.trim() && filtered.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-500">
                No matching options
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
