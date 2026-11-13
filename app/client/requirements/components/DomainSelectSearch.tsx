"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, ChevronDown, Check, Plus } from "lucide-react";

interface DomainSelectSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  name?: string;
}

export const INDUSTRIES = [
  "Information Technology",
  "Software Development",
  "Financial Services",
  "Healthcare & Life Sciences",
  "E-Commerce & Retail",
  "Manufacturing",
  "Telecommunications",
  "Education & EdTech",
  "Logistics & Supply Chain",
  "Real Estate & PropTech",
  "Energy & Utilities",
  "Media & Entertainment",
  "Consulting",
  "Automotive",
  "Aerospace & Defense",
  "Agriculture & AgriTech",
  "Government & Public Sector",
  "Insurance",
  "Legal & RegTech",
  "Non-Profit & NGO",
];

export function DomainSelectSearch({
  value,
  onChange,
  placeholder = "Select or enter industry…",
  error,
  name,
}: DomainSelectSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = INDUSTRIES.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const exactMatchExists = INDUSTRIES.some(
    (opt) => opt.toLowerCase() === search.trim().toLowerCase()
  );

  const handleSelect = useCallback(
    (option: string) => {
      onChange(option);
      setIsOpen(false);
      setSearch("");
    },
    [onChange]
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
      id={`field-${name}`}
      data-field={name}
    >
      {/* Trigger Box */}
      <div
        id={`trigger-${name}`}
        onClick={() => setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        className={`
          h-[var(--dash-input-height)] w-full rounded-xl border bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] px-3.5
          flex items-center justify-between cursor-pointer
          transition-all duration-200
          ${isOpen ? "border-indigo-500/80 ring-2 ring-indigo-500/10" : error ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : "hover:border-[var(--dash-text-secondary)]/50"}
        `}
      >
        <span className={`text-xs ${value ? "text-[var(--dash-text-primary)] font-medium" : "text-[var(--dash-text-secondary)]/70"}`}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-[var(--dash-text-secondary)] flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 flex flex-col rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] p-2 shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95">
          <div className="relative mb-2 flex items-center rounded-lg border border-[var(--dash-input-border)] bg-[var(--dash-input-bg)] px-2.5 py-1.5 flex-shrink-0">
            <Search className="mr-2 h-3.5 w-3.5 flex-shrink-0 text-[var(--dash-text-secondary)]/70" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type to search or enter custom..."
              className="w-full bg-transparent text-xs text-[var(--dash-text-primary)] placeholder:text-[var(--dash-text-secondary)]/50 outline-none"
            />
          </div>

          <div className="max-h-56 overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
            {search.trim() && !exactMatchExists && (
              <button
                type="button"
                onClick={() => handleSelect(search.trim())}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-indigo-400 hover:bg-[var(--dash-input-bg)] flex items-center gap-1.5 font-medium transition-colors border-b border-[var(--dash-input-border)]/50 pb-2 mb-1"
              >
                <Plus className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Add "{search.trim()}"</span>
              </button>
            )}

            {filtered.map((option, index) => {
              const isSelected = value === option;
              return (
                <button
                  key={`${option}-${index}`}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between
                    ${isSelected ? "bg-indigo-500/20 text-indigo-400 font-medium" : "text-[var(--dash-text-primary)] hover:bg-[var(--dash-input-bg)]"}
                  `}
                >
                  <span>{option}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                </button>
              );
            })}

            {!search.trim() && filtered.length === 0 && (
              <div className="py-6 text-center text-xs text-[var(--dash-text-secondary)]/60">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
