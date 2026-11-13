"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, ArrowRight, RefreshCw, Check } from "lucide-react";
import { useState } from "react";

interface AccountTypeStepProps {
  onSelect: (type: "client" | "vendor") => void;
}

const ROLE_CARDS = [
  {
    type: "client" as const,
    title: "Client",
    frontTitle: "Register as Client",
    hoverTitle: "Hire Top Tech Talent",
    subtitle: "Find top tech talent for your organization",
    description:
      "Access our curated network of pre-vetted developers, designers, and product managers. Scale your team on-demand.",
    icon: Building2,
    features: ["Post C-C/C-H requirements", "Review pre-vetted profiles", "Hire within 48 hours"],
    gradientFront: "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 60%, rgba(255, 255, 255, 0.95) 100%)",
    gradientHover: "linear-gradient(145deg, rgba(99, 102, 241, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)",
    accentColor: "#818cf8",
    index: "01",
  },
  {
    type: "vendor" as const,
    title: "Vendor",
    frontTitle: "Register as Vendor",
    hoverTitle: "Supply Tech Talent",
    subtitle: "Supply tech talent to top companies",
    description:
      "Partner with enterprise clients and provide your best consultants for contract (C-C) and contract-to-hire (C-H) roles.",
    icon: Users,
    features: ["Access client requirements", "Submit consultant profiles", "Track placement pipelines"],
    gradientFront: "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 60%, rgba(255, 255, 255, 0.95) 100%)",
    gradientHover: "linear-gradient(145deg, rgba(16, 185, 129, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)",
    accentColor: "#34d399",
    index: "02",
  },
];

export function AccountTypeStep({ onSelect }: AccountTypeStepProps) {
  const [selected, setSelected] = useState<"client" | "vendor" | null>(null);
  const [hoveredCard, setHoveredCard] = useState<"client" | "vendor" | null>(null);

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto py-2">
      <motion.div
        className="text-center max-w-xl mx-auto mb-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-2">
          Join the StaffSync{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Talent Network
          </span>
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
          Select your account type to begin registration.
        </p>
      </motion.div>

      {/* Role selection cards - Single Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mb-6">
        {ROLE_CARDS.map((card, index) => {
          const isSelected = selected === card.type;
          const isHovered = hoveredCard === card.type;
          const showHoveredState = isHovered || isSelected;

          return (
            <motion.div
              key={card.type}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              className="relative w-full"
              onMouseEnter={() => setHoveredCard(card.type)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <button
                type="button"
                onClick={() => setSelected(card.type)}
                className="relative w-full h-[175px] sm:h-[185px] text-left focus:outline-none rounded-[20px] p-4 flex flex-col transition-all duration-500 ease-out border group cursor-pointer"
                style={{
                  background: showHoveredState ? card.gradientHover : card.gradientFront,
                  borderColor: showHoveredState ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.08)",
                  boxShadow: showHoveredState 
                    ? `0px 20px 50px rgba(${card.type === "client" ? "99, 102, 241" : "16, 185, 129"}, 0.25)` 
                    : "0px 10px 30px rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* Header (Pinned Top) */}
                <div className="flex justify-between items-start w-full z-10 shrink-0">
                  {/* Status Pill */}
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold transition-colors duration-300"
                    style={{
                      backgroundColor: showHoveredState ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.06)",
                      borderColor: showHoveredState ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.1)",
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                      style={{ backgroundColor: card.accentColor }}
                    />
                    <span>{showHoveredState ? "How it works" : card.title}</span>
                  </div>

                  {/* Flip Icon & Selected Checkmark */}
                  <div className="flex items-center gap-1.5">
                    {isSelected && (
                      <div 
                        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: card.accentColor }}
                      >
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    <motion.div
                      animate={{ rotate: showHoveredState ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300"
                      style={{
                        backgroundColor: showHoveredState ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <RefreshCw 
                        className="w-2.5 h-2.5 transition-colors duration-300" 
                        style={{ color: card.accentColor }}
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col justify-center gap-1.5 z-10 w-full mt-1.5 relative">
                  {/* 3D Shiny Icon */}
                  <div className="relative w-8 h-8 rounded-[11px] flex items-center justify-center shrink-0 transition-all duration-300 mb-0.5"
                    style={{
                      background: card.type === "client" ? "linear-gradient(145deg, #818cf8 0%, #6366f1 45%, #4338ca 100%)" : "linear-gradient(145deg, #6ee7b7 0%, #34d399 45%, #059669 100%)",
                      boxShadow: `inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.3), 0 5px 10px ${card.type === "client" ? "rgba(99,102,241,0.35)" : "rgba(16,185,129,0.35)"}`
                    }}
                  >
                    <div className="absolute inset-0 rounded-[11px] bg-gradient-to-b from-white/30 to-transparent h-1/2 pointer-events-none" />
                    <card.icon className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] z-10" />
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold transition-colors duration-300 leading-snug tracking-tight text-slate-900">
                    {showHoveredState ? card.hoverTitle : card.frontTitle}
                  </h3>

                  <div className="relative w-full overflow-visible flex-1">
                    <AnimatePresence mode="wait">
                      {!showHoveredState ? (
                        <motion.p
                          key="front-desc"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="text-[10px] text-slate-400 leading-relaxed absolute inset-0 pr-1"
                        >
                          {card.subtitle}
                        </motion.p>
                      ) : (
                        <motion.div
                          key="back-features"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col gap-1 absolute inset-0 text-slate-900"
                        >
                          {card.features.map((feature, i) => (
                            <motion.div
                              key={feature}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-center gap-1 text-[9px] sm:text-[10px] font-medium"
                            >
                              <div className="w-2.5 h-2.5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <Check className="w-2 h-2 text-white" />
                              </div>
                              <span className="leading-tight">{feature}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="w-full mt-2">
        <button
          type="button"
          disabled={!selected}
          onClick={handleContinue}
          className={`signup-btn-main w-full ${!selected ? "locked" : ""}`}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
