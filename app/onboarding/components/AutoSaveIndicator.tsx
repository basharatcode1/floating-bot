"use client";

import { Cloud, Check, AlertCircle, Loader2 } from "lucide-react";
import type { AutoSaveState } from "@/app/onboarding/schemas/types";

interface AutoSaveIndicatorProps {
  saveState: AutoSaveState;
}

export function AutoSaveIndicator({ saveState }: AutoSaveIndicatorProps) {
  const { status, lastSavedAt } = saveState;

  if (status === "idle" && !lastSavedAt) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex items-center gap-1.5 text-xs">
      {status === "saving" && (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-[var(--ob-text-muted)]" />
          <span className="text-[var(--ob-text-muted)]">Saving…</span>
        </>
      )}

      {status === "saved" && (
        <>
          <Check className="w-3 h-3 text-[var(--ob-success)]" />
          <span className="text-[var(--ob-success)]">Saved</span>
        </>
      )}

      {status === "idle" && lastSavedAt && (
        <>
          <Cloud className="w-3 h-3 text-[var(--ob-text-muted)]" />
          <span className="text-[var(--ob-text-muted)]">
            Last saved {formatTime(lastSavedAt)}
          </span>
        </>
      )}

      {status === "error" && (
        <>
          <AlertCircle className="w-3 h-3 text-[var(--ob-error)]" />
          <span className="text-[var(--ob-error)]">Save failed</span>
        </>
      )}
    </div>
  );
}
