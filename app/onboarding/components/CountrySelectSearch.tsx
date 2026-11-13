"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { getCountryCallingCode, type CountryCode } from "libphonenumber-js";
import { Search, ChevronDown, Check, X } from "lucide-react";

export interface CustomCountrySelectProps {
  value?: CountryCode;
  onChange: (value?: CountryCode) => void;
  options: { value?: CountryCode; label: string }[];
  iconComponent: React.ComponentType<{ country: CountryCode; label: string }>;
  disabled?: boolean;
  name?: string;
}

export const CountrySelectSearch: React.FC<CustomCountrySelectProps> = ({
  value,
  onChange,
  options,
  iconComponent: IconComponent,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">("bottom");
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Pre-calculate dial codes and filter options
  const formattedOptions = useMemo(() => {
    return options
      .filter((opt) => opt.value) // filter out international wildcard if present
      .map((opt) => {
        const countryCode = opt.value as CountryCode;
        let callingCode = "";
        try {
          callingCode = getCountryCallingCode(countryCode);
        } catch {
          callingCode = "";
        }
        return {
          value: countryCode,
          label: opt.label,
          callingCode,
        };
      });
  }, [options]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return formattedOptions;
    const q = searchQuery.toLowerCase().trim();
    return formattedOptions.filter((opt) => {
      const matchName = opt.label.toLowerCase().includes(q);
      const matchCode = opt.value.toLowerCase().includes(q);
      const matchDial = opt.callingCode.includes(q.replace("+", ""));
      return matchName || matchCode || matchDial;
    });
  }, [formattedOptions, searchQuery]);

  const handleSelect = useCallback(
    (countryCode: CountryCode) => {
      onChange(countryCode);
      setIsOpen(false);
      setSearchQuery("");
    },
    [onChange]
  );

  const selectedCountry = useMemo(() => {
    return formattedOptions.find((opt) => opt.value === value);
  }, [formattedOptions, value]);

  return (
    <div ref={containerRef} className="relative inline-block h-full">
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (!isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            // If space below is less than dropdown height (approx 300px) and there is more space above, open upwards
            if (spaceBelow < 300 && spaceAbove > spaceBelow) {
              setDropdownPosition("top");
            } else {
              setDropdownPosition("bottom");
            }
          }

          setIsOpen((prev) => {
            if (prev) {
              setSearchQuery("");
            }
            return !prev;
          });
        }}
        className="PhoneInputCountry flex items-center gap-1.5 h-full px-3 py-2 cursor-pointer focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-l-xl"
        aria-label="Select country"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {value && IconComponent ? (
          <div className="PhoneInputCountryIcon">
            <IconComponent country={value} label={selectedCountry?.label || value} />
          </div>
        ) : (
          <span className="text-xs text-slate-700 font-medium">Select</span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Popover Dropdown (Positioned Dynamically) */}
      {isOpen && (
        <div
          role="listbox"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className={`absolute left-0 z-50 w-64 max-w-[calc(100vw-2rem)] flex flex-col rounded-xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 ${
            dropdownPosition === "top" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
          }`}
        >
          {/* Search Bar */}
          <div className="relative mb-2 flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 flex-shrink-0">
            <Search className="mr-2 h-4 w-4 flex-shrink-0 text-slate-500" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search country or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-400 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Options List with Max Height & Scrollbar */}
          <div className="max-h-44 overflow-y-auto space-y-0.5 pr-1 text-xs select-country-scroll flex-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No country found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelect(opt.value);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#EFF6FF] text-[#005A9C] font-semibold border border-[#DBEAFE]"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="PhoneInputCountryIcon flex-shrink-0">
                        <IconComponent country={opt.value} label={opt.label} />
                      </div>
                      <span className="truncate text-left">{opt.label}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {opt.callingCode && (
                        <span className="font-mono text-[11px] text-slate-500">
                          +{opt.callingCode}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-[#005A9C]" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
