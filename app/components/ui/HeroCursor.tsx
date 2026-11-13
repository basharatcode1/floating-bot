"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Play } from "lucide-react";

interface HeroCursorProps {
  text?: string;
  targetId?: string;
  onClick?: () => void;
}

export const HeroCursor = ({
  text = "Play Intro",
  targetId = "hero-section",
  onClick,
}: HeroCursorProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Use motion values for performance (no React re-renders on mouse move)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring physics for premium feel (slight lag behind cursor)
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    const handlePointerMove = (e: PointerEvent) => {
      // Offset by half of width/height to center the cursor (180/2 = 90, 72/2 = 36)
      cursorX.set(e.clientX - 90);
      cursorY.set(e.clientY - 36);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsPressed(false);
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Don't animate press if clicking actual interactive buttons/links
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a") || target.closest("[role='button']")) {
        return;
      }
      setIsPressed(true);
    };

    const handlePointerUp = () => {
      setIsPressed(false);
    };

    const handleTargetClick = (e: MouseEvent) => {
      // Don't trigger action if clicking actual interactive buttons/links
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a") || target.closest("[role='button']")) {
        return;
      }
      onClick?.();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    
    targetElement.addEventListener("mouseenter", handleMouseEnter);
    targetElement.addEventListener("mouseleave", handleMouseLeave);
    targetElement.addEventListener("pointerdown", handlePointerDown);
    targetElement.addEventListener("click", handleTargetClick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      
      targetElement.removeEventListener("mouseenter", handleMouseEnter);
      targetElement.removeEventListener("mouseleave", handleMouseLeave);
      targetElement.removeEventListener("pointerdown", handlePointerDown);
      targetElement.removeEventListener("click", handleTargetClick);
    };
  }, [cursorX, cursorY, targetId, onClick]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[100] pointer-events-none flex items-center justify-center gap-3 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        width: 180,
        height: 72,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isVisible ? (isPressed ? 0.92 : 1) : 0, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black/5 text-black">
        <Play className="w-4 h-4 ml-0.5 fill-black" />
      </div>
      <span className="text-black font-semibold text-lg tracking-tight">
        {text}
      </span>
    </motion.div>
  );
};
