"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { AutoSaveState } from "@/app/onboarding/schemas/types";

interface UseAutoSaveOptions {
  key: string;
  data: unknown;
  debounceMs?: number;
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  saveState: AutoSaveState;
  clearDraft: () => void;
  loadDraft: <T>() => T | null;
  saveDraft: () => void;
}

export function useAutoSave({
  key,
  data,
  debounceMs = 2000,
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [saveState, setSaveState] = useState<AutoSaveState>({
    status: "idle",
    lastSavedAt: null,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevDataRef = useRef<string>("");

  const storageKey = `onboarding-draft-${key}`;

  const saveDraft = useCallback(() => {
    if (!enabled) return;

    try {
      setSaveState({ status: "saving", lastSavedAt: saveState.lastSavedAt });

      const serialized = JSON.stringify(data);
      sessionStorage.setItem(storageKey, serialized);
      sessionStorage.setItem(`${storageKey}-timestamp`, new Date().toISOString());

      const now = new Date();
      setSaveState({ status: "saved", lastSavedAt: now });

      /* Reset to idle after 3 seconds */
      setTimeout(() => {
        setSaveState((prev) =>
          prev.status === "saved" ? { ...prev, status: "idle" } : prev
        );
      }, 3000);
    } catch {
      setSaveState((prev) => ({ ...prev, status: "error" }));
    }
  }, [data, enabled, storageKey, saveState.lastSavedAt]);

  /* Debounced auto-save on data change */
  useEffect(() => {
    if (!enabled) return;

    const serialized = JSON.stringify(data);
    if (serialized === prevDataRef.current) return;
    prevDataRef.current = serialized;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      saveDraft();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data, debounceMs, enabled, saveDraft]);

  const clearDraft = useCallback(() => {
    sessionStorage.removeItem(storageKey);
    sessionStorage.removeItem(`${storageKey}-timestamp`);
    setSaveState({ status: "idle", lastSavedAt: null });
  }, [storageKey]);

  const loadDraft = useCallback(<T,>(): T | null => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }, [storageKey]);

  return { saveState, clearDraft, loadDraft, saveDraft };
}
