"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

type DashboardMode = "dark" | "light";

type DashboardThemeContextValue = {
  mode: DashboardMode;
  toggleMode: () => void;
  mounted: boolean;
};

const DashboardThemeContext = createContext<DashboardThemeContextValue | null>(null);

const STORAGE_KEY = "staffsync-dashboard-mode";

export function DashboardThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DashboardMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
    }
    return "light";
  });
  const [mounted, setMounted] = useState(false);

  // Once mounted on client, grab from localStorage to ensure synchronization
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        setMode(saved);
        document.documentElement.setAttribute("data-dashboard-theme", saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  /* Persist changes */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
      document.documentElement.setAttribute("data-dashboard-theme", mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <DashboardThemeContext.Provider value={{ mode, toggleMode, mounted }}>
      <div className="dashboard-wrapper">
        {children}
      </div>
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  const ctx = useContext(DashboardThemeContext);
  if (!ctx)
    throw new Error("useDashboardTheme must be used within DashboardThemeProvider");
  return ctx;
}
