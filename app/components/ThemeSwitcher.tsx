"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/app/ThemeContext";
import type { ThemeKey } from "@/app/ThemeContext";
import { X, Check, Palette } from "lucide-react";

export default function ThemeSwitcher() {
  const { currentTheme, setCurrentTheme, allThemes } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const themeKeys = Object.keys(allThemes) as ThemeKey[];

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        panelRef.current &&
        e.target instanceof Node &&
        !panelRef.current.contains(e.target)
      ) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isExpanded]);

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded panel */}
      <div
        className={`transition-all duration-300 origin-bottom-right ${
          isExpanded
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        <div
          className="rounded-2xl border shadow-2xl backdrop-blur-2xl overflow-hidden"
          style={{
            backgroundColor: "rgba(8,8,12,0.92)",
            borderColor: "rgba(255,255,255,0.08)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
            width: "360px",
          }}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white/90">Theme Palette</h3>
              <p className="text-[11px] text-white/35 mt-0.5">{themeKeys.length} color combinations</p>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Theme grid */}
          <div
            className="px-4 pb-4 max-h-[380px] overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.12) transparent",
            }}
          >
            <div className="grid grid-cols-2 gap-2">
              {themeKeys.map((key) => {
                const theme = allThemes[key];
                const isActive = key === currentTheme;
                return (
                  <button
                    key={key}
                    onClick={() => setCurrentTheme(key)}
                    className={`relative flex items-start gap-2.5 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left group ${
                      isActive ? "ring-1" : "hover:bg-white/[0.04]"
                    }`}
                    style={{
                      backgroundColor: isActive ? `${theme.previewColor}15` : "transparent",
                      boxShadow: isActive ? `0 0 0 1px ${theme.previewColor}50` : "none",
                    }}
                  >
                    {/* Color swatch */}
                    <div className="shrink-0 mt-0.5">
                      <div
                        className={`w-5 h-5 rounded-md transition-all duration-200 ${
                          isActive ? "scale-110" : "group-hover:scale-110"
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${theme.previewColor}, ${theme.vars["--gradient-to"]})`,
                          boxShadow: isActive ? `0 0 12px ${theme.previewColor}40` : "none",
                        }}
                      />
                    </div>
                    {/* Label */}
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-[13px] font-medium truncate transition-colors duration-200"
                        style={{ color: isActive ? theme.previewColor : "rgba(255,255,255,0.8)" }}
                      >
                        {theme.name}
                      </div>
                      <div className="text-[10px] text-white/30 truncate leading-tight mt-0.5">
                        {theme.label}
                      </div>
                    </div>
                    {/* Active check */}
                    {isActive && (
                      <Check
                        className="shrink-0 mt-1"
                        size={13}
                        stroke={theme.previewColor}
                        strokeWidth={3}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer with current theme indicator */}
          <div
            className="px-5 py-3 border-t flex items-center gap-3"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${allThemes[currentTheme].previewColor}, ${allThemes[currentTheme].vars["--gradient-to"]})`,
                boxShadow: `0 0 8px ${allThemes[currentTheme].previewColor}40`,
              }}
            />
            <span className="text-[11px] text-white/40">
              Active: <span className="text-white/70 font-medium">{allThemes[currentTheme].name}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group relative w-14 h-14 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer overflow-hidden"
        style={{
          backgroundColor: "rgba(8,8,12,0.85)",
          borderColor: "rgba(255,255,255,0.1)",
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${allThemes[currentTheme].previewColor}15`,
        }}
        title="Switch theme palette"
      >
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-35"
          style={{
            background: `radial-gradient(circle at center, ${allThemes[currentTheme].previewColor}, transparent 70%)`,
          }}
        />
        {/* Palette icon */}
        <Palette
          className="relative z-10 transition-transform duration-300 group-hover:rotate-12"
          size={22}
          color={allThemes[currentTheme].previewColor}
        />
      </button>
    </div>
  );
}
