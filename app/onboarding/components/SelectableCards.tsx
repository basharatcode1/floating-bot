"use client";

import { motion } from "framer-motion";
import {
  Check,
  AlertCircle,
  Sprout,
  Users,
  Building,
  Building2,
  Landmark,
  Globe,
  FileText,
  UserCheck,
  BadgeCheck,
} from "lucide-react";
import type { SelectableCardOption } from "@/app/onboarding/schemas/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sprout,
  Users,
  Building,
  Building2,
  Landmark,
  Globe,
  FileText,
  UserCheck,
  BadgeCheck,
};

interface SelectableCardsProps {
  label: string;
  options: SelectableCardOption[];
  value: string | string[];
  onChange: (selected: string | string[]) => void;
  multiple?: boolean;
  error?: string;
  helperText?: string;
  columns?: 2 | 3;
}

export function SelectableCards({
  label,
  options,
  value,
  onChange,
  multiple = false,
  error,
  helperText,
  columns = 3,
}: SelectableCardsProps) {
  const selectedArray = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (id: string) => {
    if (multiple) {
      const arr = Array.isArray(value) ? value : [];
      const newVal = arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id];
      onChange(newVal);
    } else {
      onChange(id);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = ICON_MAP[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  const gridClass =
    columns === 2
      ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3";

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-[var(--ob-text-secondary)]">
        {label}
      </label>

      <div className={gridClass}>
        {options.map((option) => {
          const isSelected = selectedArray.includes(option.id);

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              whileTap={{ scale: 0.97 }}
              className={`
                relative flex flex-col items-center text-center p-5 rounded-xl border-2
                transition-all duration-250 cursor-pointer group
                ${isSelected
                  ? "border-[var(--ob-primary)] bg-[var(--ob-primary-lighter)] shadow-[0_0_0_3px_var(--ob-primary-light)]"
                  : "border-[var(--ob-border)] bg-[var(--ob-card-bg)] hover:border-[var(--ob-text-muted)]/40 hover:shadow-[var(--ob-card-shadow-hover)]"
                }
              `}
              aria-pressed={isSelected}
              aria-label={`${option.title}: ${option.description}`}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[var(--ob-primary)] flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center mb-3
                  transition-colors duration-200
                  ${isSelected
                    ? "bg-[var(--ob-primary)]/15 text-[var(--ob-primary)]"
                    : "bg-[var(--ob-bg-subtle)] text-[var(--ob-text-muted)] group-hover:text-[var(--ob-text-secondary)]"
                  }
                `}
              >
                {getIcon(option.icon)}
              </div>

              <p
                className={`text-sm font-semibold transition-colors ${
                  isSelected ? "text-[var(--ob-primary)]" : "text-[var(--ob-text)]"
                }`}
              >
                {option.title}
              </p>
              <p className="text-xs text-[var(--ob-text-muted)] mt-1 leading-relaxed">
                {option.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {error && (
        <div className="flex items-start gap-1.5 text-xs leading-4 text-red-500 font-medium" role="alert">
          <span className="h-4 flex items-center justify-center flex-shrink-0 -translate-y-px">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          </span>
          <span className="leading-4 text-red-500">{error}</span>
        </div>
      )}

      {!error && helperText && (
        <p className="text-xs text-[var(--ob-text-muted)]">{helperText}</p>
      )}
    </div>
  );
}
