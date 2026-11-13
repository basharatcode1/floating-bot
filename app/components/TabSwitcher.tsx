"use client";

import { motion } from "framer-motion";

interface TabSwitcherProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme?: "light" | "dark";
}

export default function TabSwitcher({ activeTab, onTabChange, theme = "light" }: TabSwitcherProps) {
  const tabs = [
    { id: "company", label: "Clients", icon: CompanyIcon },
    { id: "vendor", label: "Vendors", icon: VendorIcon },
  ];

  return (
    <div
      className="relative mx-auto inline-flex items-center gap-1 rounded-full p-1"
      style={{
        background: theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
      }}
      role="tablist"
      aria-label="Platform user type"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className="relative z-10 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 md:px-7 md:py-3 md:text-base"
            style={{
              color: isActive
                ? "#FFFFFF"
                : theme === "dark"
                ? "var(--text-on-dark-muted)"
                : "var(--text-on-light-muted)",
              cursor: "pointer",
              background: "transparent",
              border: "none",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = theme === "dark" ? "var(--text-on-dark)" : "var(--text-on-light)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = theme === "dark" ? "var(--text-on-dark-muted)" : "var(--text-on-light-muted)";
              }
            }}
          >
            {isActive && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                  boxShadow:
                    "0 4px 24px -4px rgba(var(--accent-primary-rgb, 59,130,246), 0.4)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon size={16} />
              <span>{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CompanyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 3H8l-2 4h12l-2-4z" />
      <path d="M12 12v3" />
      <path d="M8 12v3" />
      <path d="M16 12v3" />
    </svg>
  );
}

function VendorIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
