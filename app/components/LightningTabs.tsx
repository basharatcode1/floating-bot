"use client";

import { motion } from "framer-motion";

interface LightningTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function LightningTabs({ activeTab, onTabChange }: LightningTabsProps) {
  const tabs = [
    { id: "company", label: "Clients" },
    { id: "vendor", label: "Vendors" },
  ];

  return (
    <div className="relative inline-flex items-center gap-1.5 rounded-full p-1 bg-white/[0.02] border border-white/[0.06] backdrop-blur-md shadow-inner">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative z-10 rounded-full px-6 py-2 text-sm font-medium transition-colors duration-150 select-none cursor-pointer"
            style={{
              color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.45)",
              outline: "none",
            }}
          >
            {isActive && (
              <motion.span
                layoutId="lightning-tab-indicator"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 p-[1px] shadow-[0_0_24px_rgba(99,102,241,0.35)]"
                style={{ willChange: "transform" }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                }}
              >
                {/* Inner tab fill to create a premium gradient border outline */}
                <span className="block h-full w-full rounded-full bg-[#080d17]/90" />
              </motion.span>
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
