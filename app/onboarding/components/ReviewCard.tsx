"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Pencil } from "lucide-react";

interface ReviewCardProps {
  title: string;
  icon?: ReactNode;
  onEdit?: () => void;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ReviewCard({
  title,
  icon,
  onEdit,
  children,
  defaultOpen = false,
}: ReviewCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-[var(--ob-border)] bg-[var(--ob-card-bg)] overflow-hidden transition-shadow duration-200 hover:shadow-[var(--ob-card-shadow-hover)]">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--ob-bg-alt)] transition-colors duration-150 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-[var(--ob-primary-lighter)] flex items-center justify-center text-[var(--ob-primary)]">
              {icon}
            </div>
          )}
          <span className="text-sm font-semibold text-[var(--ob-text)]">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--ob-primary)] hover:bg-[var(--ob-primary-ghost)] transition-colors cursor-pointer"
              aria-label={`Edit ${title}`}
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          )}

          <ChevronDown
            className={`w-4 h-4 text-[var(--ob-text-muted)] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-[var(--ob-divider)]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Review field helper */
interface ReviewFieldProps {
  label: string;
  value?: string | string[];
}

export function ReviewField({ label, value }: ReviewFieldProps) {
  const displayValue = Array.isArray(value)
    ? value.length > 0
      ? value.join(", ")
      : "—"
    : value || "—";

  return (
    <div className="py-2">
      <dt className="text-xs text-[var(--ob-text-muted)]">{label}</dt>
      <dd className="text-sm text-[var(--ob-text)] mt-0.5">{displayValue}</dd>
    </div>
  );
}
