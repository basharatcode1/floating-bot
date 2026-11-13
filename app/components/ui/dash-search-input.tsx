import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/app/lib/utils";

export interface DashSearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
  showClear?: boolean;
}

export const DashSearchInput = React.forwardRef<HTMLInputElement, DashSearchInputProps>(
  (
    {
      value,
      onChange,
      placeholder = "Search...",
      className,
      wrapperClassName,
      showClear = true,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative flex-1 max-w-full md:max-w-md", wrapperClassName)}>
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] w-4 h-4 pointer-events-none z-10" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-[var(--dash-input-height)] pl-10 pr-9 rounded-xl bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] text-[var(--dash-text-primary)] placeholder:text-[var(--dash-text-muted)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors text-xs min-w-0",
            className
          )}
          {...props}
        />
        {showClear && value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] p-0.5 rounded transition-colors focus:outline-none"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

DashSearchInput.displayName = "DashSearchInput";
