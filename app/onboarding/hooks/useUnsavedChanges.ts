"use client";

import { useEffect, useCallback } from "react";

interface UseUnsavedChangesOptions {
  hasUnsavedChanges: boolean;
  message?: string;
}

export function useUnsavedChanges({
  hasUnsavedChanges,
  message = "You have unsaved changes. Are you sure you want to leave?",
}: UseUnsavedChangesOptions): void {
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = message;
      return message;
    },
    [hasUnsavedChanges, message]
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload]);
}
