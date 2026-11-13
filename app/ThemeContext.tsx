"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { themes, applyTheme } from "@/app/themes";

export type ThemeKey = keyof typeof themes;

type ThemeContextValue = {
  currentTheme: ThemeKey;
  setCurrentTheme: Dispatch<SetStateAction<ThemeKey>>;
  themeData: (typeof themes)[ThemeKey];
  allThemes: typeof themes;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("deep-space");

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setCurrentTheme,
        themeData: themes[currentTheme],
        allThemes: themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
