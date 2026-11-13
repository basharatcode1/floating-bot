"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface FluidButtonProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  firstTextColor?: string;
  secondTextColor?: string;
  overlayColor?: string;
  borderColor?: string;
  scaleOnHover?: boolean;
  scaleAmount?: number;
  className?: string;
}

export default function FluidButton({
  text,
  onClick,
  icon,
  firstTextColor = "#FFFFFF",
  secondTextColor = "#080D17", // dark background matching deep space
  overlayColor = "#FFFFFF",
  borderColor = "rgba(255, 255, 255, 0.18)",
  scaleOnHover = true,
  scaleAmount = 1.05,
  className = "",
}: FluidButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.96 }}
      animate={{
        scale: isHovered && scaleOnHover ? scaleAmount : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      }}
      className={`relative inline-flex items-center justify-center font-semibold select-none whitespace-nowrap cursor-pointer overflow-hidden px-4 py-3 text-base sm:px-6 sm:py-4 sm:text-lg transition-colors duration-300 ${className}`}
      style={{
        borderRadius: "12px",
        border: `2px solid ${borderColor}`,
        backgroundColor: "transparent",
        outline: "none",
      }}
    >
      {/* Background Bubble Overlay */}
      <motion.div
        className="absolute left-0 right-0 z-0 pointer-events-none"
        initial={{ top: "100%", height: "110%", borderRadius: "50%" }}
        animate={{
          top: isHovered ? "0%" : "100%",
          borderRadius: isHovered ? "0%" : "50%",
        }}
        transition={{
          duration: 0.45,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          backgroundColor: overlayColor,
        }}
      />

      {/* Button Content Label Stack (handles sliding text) */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[1.5em] overflow-hidden pointer-events-none">
        {/* Upper Text Stack */}
        <motion.div
          animate={{
            y: isHovered ? "-100%" : "0%",
          }}
          transition={{
            duration: 0.45,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="flex items-center gap-2"
          style={{ color: firstTextColor }}
        >
          <span>{text}</span>
          {icon && (
            <span className="flex items-center justify-center">{icon}</span>
          )}
        </motion.div>

        {/* Lower Text Stack */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{
            y: isHovered ? "0%" : "100%",
          }}
          transition={{
            duration: 0.45,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="absolute inset-0 flex items-center justify-center gap-2"
          style={{ color: secondTextColor }}
        >
          <span>{text}</span>
          {icon && (
            <span className="flex items-center justify-center">{icon}</span>
          )}
        </motion.div>
      </div>
    </motion.button>
  );
}
