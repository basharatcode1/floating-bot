"use client";

import * as React from "react";
import { Check } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";

interface CertificatePopoverProps {
  certificates?: string[] | null;
  singleCertificate?: string | null;
  maxVisible?: number;
}

export function CertificatePopover({
  certificates,
  singleCertificate,
  maxVisible = 1,
}: CertificatePopoverProps) {
  const list: string[] = React.useMemo(() => {
    if (certificates && certificates.length > 0) {
      return certificates;
    }
    if (singleCertificate) {
      return [singleCertificate];
    }
    return [];
  }, [certificates, singleCertificate]);

  if (list.length === 0) {
    return (
      <span className="text-[11px] text-[var(--dash-text-muted)]">None</span>
    );
  }

  const visibleList = list.slice(0, maxVisible);
  const remainingList = list.slice(maxVisible);
  const remainingCount = remainingList.length;

  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
        <span
          className="truncate text-xs font-semibold text-[var(--dash-text-primary)]"
          title={visibleList[0]}
        >
          {visibleList[0]}
        </span>
      </div>

      {remainingCount > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--req-card-badge-blue-bg)] text-[var(--req-card-badge-blue-text)] border border-[var(--req-card-badge-blue-border)] cursor-pointer hover:opacity-80 transition-opacity select-none whitespace-nowrap flex-shrink-0"
            >
              +{remainingCount} more
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-64 p-3 bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] shadow-xl z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between pb-1 border-b border-[var(--dash-divider)]">
                <span className="text-[10px] font-bold tracking-wider text-[var(--req-card-label-color)]">
                  All Certifications
                </span>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                  {list.length} Total
                </span>
              </div>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {list.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-xs font-medium"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-tight text-[var(--dash-text-primary)]">
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
