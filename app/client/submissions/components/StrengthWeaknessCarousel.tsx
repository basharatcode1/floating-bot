"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CarouselItem = {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  colorLight: string;
  content: string[];
};

interface Props {
  items: CarouselItem[];
}

export function StrengthWeaknessCarousel({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use all provided carousel items (SUMMARY, STRENGTHS, WEAKNESSES, IMPROVEMENTS)
  const validItems = items;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % validItems.length);
  }, [validItems.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + validItems.length) % validItems.length,
    );
  }, [validItems.length]);

  // Wheel debounce
  const isWheeling = useRef(false);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      // Only intercept if scrolling over the carousel horizontally
      // For vertical we can leave it if we want, but user said "Scrolling downward/right -> next"
      if (isWheeling.current) {
        e.preventDefault();
        return;
      }

      const deltaX = e.deltaX;
      const deltaY = e.deltaY;

      // Determine if it's an intentional scroll
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        e.preventDefault();
        isWheeling.current = true;

        // Right or Down = Next
        if (deltaX > 0 || deltaY > 0) {
          handleNext();
        } else {
          handlePrev();
        }

        if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
        wheelTimeout.current = setTimeout(() => {
          isWheeling.current = false;
        }, 400); // 400ms debounce to prevent multiple accidental scrolls
      }
    },
    [handleNext, handlePrev],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleNativeWheel = (e: WheelEvent) => {
      // Prevent page scrolling while hovering over carousel to ensure deliberate tab switching
      e.preventDefault();
      onWheel(e as any);
    };

    el.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleNativeWheel);
    };
  }, [onWheel]);

  const activeItem = validItems[activeIndex];
  const ActiveIcon = activeItem?.icon;

  if (!validItems || validItems.length === 0) return null;

  return (
    <div
      className="w-full flex flex-col items-center gap-3 sm:gap-4 my-4 relative outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          handlePrev();
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          handleNext();
        }
      }}
      aria-label="Strengths, Weaknesses, and Improvements Carousel"
    >
      {/* Container for the pill shape and arrows */}
      <div className="relative w-full flex items-center justify-center max-w-4xl px-2 sm:px-0 mx-auto">
        {/* Carousel Viewport */}
        <div
          ref={containerRef}
          className="relative w-full h-[40px] sm:h-[46px] bg-[var(--dash-bg)] border border-[var(--dash-card-border)] rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.02),0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden [clip-path:inset(0_round_9999px)] isolate flex items-center"
          style={{ touchAction: "none" }} // prevent default touch actions to allow our swipe
        >
          {/* Edge Gradients for Blending */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 z-10 pointer-events-none rounded-l-full" 
            style={{ 
              background: "linear-gradient(to right, var(--dash-bg) 25%, transparent)",
            }} 
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-24 sm:w-36 z-10 pointer-events-none rounded-r-full" 
            style={{ 
              background: "linear-gradient(to left, var(--dash-bg) 25%, transparent)",
            }} 
          />

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous tab"
            className="absolute left-2 sm:left-3 z-30 w-8 h-8 sm:w-9 sm:h-9 bg-transparent border-none shadow-none flex items-center justify-center text-[var(--dash-text-secondary)] hover:text-[#6366F1] hover:scale-110 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Items Track */}
          <div className="absolute inset-0 flex items-center justify-center">
            {validItems.map((item, i) => {
              const len = validItems.length;
              let offset = (i - activeIndex) % len;
              if (offset > len / 2) offset -= len;
              if (offset < -len / 2) offset += len;

              const isActive = offset === 0;
              const isVisible = Math.abs(offset) <= 1;

              return (
                <motion.div
                  key={item.id}
                  initial={false}
                  animate={{
                    x: `${offset * 102}%`,
                    scale: isActive ? 1 : 0.85,
                    opacity: isActive ? 1 : isVisible ? 0.7 : 0,
                    rotateY: offset === -1 ? 8 : offset === 1 ? -8 : 0,
                    zIndex: isActive ? 25 : isVisible ? 20 : 0,
                    pointerEvents: isVisible ? "auto" : "none",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 35,
                    mass: 1,
                  }}
                  className="absolute flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer px-3 select-none"
                  style={{
                    width: "clamp(115px, 22%, 190px)",
                    height: "80%",
                    borderRadius: "9999px",
                    background: isActive ? "var(--dash-card-bg-solid)" : "transparent",
                    boxShadow: isActive
                      ? "0 3px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)"
                      : "none",
                    border: isActive
                      ? `1px solid ${item.color}35`
                      : "1px solid transparent",
                    perspective: 1000,
                  }}
                  onClick={() => setActiveIndex(i)}
                  aria-selected={isActive}
                  role="tab"
                >
                  <item.icon
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
                    style={{ color: item.color }}
                  />
                  <span
                    className={`text-[10px] sm:text-[11px] whitespace-nowrap ${isActive ? "font-semibold" : "font-medium"}`}
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next tab"
            className="absolute right-2 sm:right-3 z-30 w-8 h-8 sm:w-9 sm:h-9 bg-transparent border-none shadow-none flex items-center justify-center text-[var(--dash-text-secondary)] hover:text-[#6366F1] hover:scale-110 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Invisible drag overlay to capture swipes smoothly */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -40) handleNext();
              else if (info.offset.x > 40) handlePrev();
            }}
            className="absolute inset-0 z-5 cursor-grab active:cursor-grabbing"
          />
        </div>
      </div>

      {/* Content Card below */}
      <div className="w-full max-w-4xl px-2 sm:px-0 mt-1">
        <div className="w-full bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.02)] p-4 sm:p-5 min-h-[90px] flex items-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 w-full"
            >
              <div className="flex flex-col gap-1 sm:gap-1.5 w-full">
                {activeItem.content.map((para, i) => (
                  <p
                    key={i}
                    className="text-[var(--dash-text-primary)] leading-relaxed text-[11px] sm:text-xs font-normal"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
