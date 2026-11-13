"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import TabSwitcher from "@/app/components/TabSwitcher";
import JasperSlideRenderer from "@/app/components/JasperSlideRenderer";
import { companySlides } from "@/app/data/companySlides";
import { vendorSlides } from "@/app/data/vendorSlides";

const AUTOPLAY_MS = 5000;

const slideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 60 : -60,
    scale: 0.97,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -60 : 60,
    scale: 0.97,
  }),
};

const tabContentVariants = {
  enter: { opacity: 0, y: 16, scale: 0.98 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.98 },
};

/**
 * PlatformBenefitsDark — Dark version of the Jasper.ai-inspired collage carousel.
 */
export default function PlatformBenefitsDark() {
  const [activeTab, setActiveTab] = useState("company");
  const [[slideIndex, direction], setSlide] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });

  const slides = activeTab === "company" ? companySlides : vendorSlides;
  const currentIndex = slideIndex >= slides.length ? 0 : slideIndex;
  const activeSlide = slides[currentIndex] || slides[0];

  useEffect(() => {
    if (slideIndex >= slides.length) {
      setSlide([0, 0]);
    }
  }, [slides.length, slideIndex]);

  // ── Navigation ──────────────────────────────────────────────────
  const paginate = useCallback(
    (dir: number) => {
      setSlide(([prev]) => {
        const next = (prev + dir + slides.length) % slides.length;
        return [next, dir];
      });
    },
    [slides.length],
  );

  const goTo = useCallback((target: number) => {
    setSlide(([prev]) => [target, target > prev ? 1 : -1]);
  }, []);

  // ── Tab switch → reset to slide 0 ──────────────────────────────
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setSlide([0, 0]);
  }, []);

  // ── Autoplay ──────────────────────────────────────────────────
  useEffect(() => {
    if (paused || !isInView) return;
    const t = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, isInView, slideIndex, paginate]);

  // ── Keyboard navigation ────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      else if (e.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [paginate]);

  // ── Touch swipe ────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      paginate(diff > 0 ? 1 : -1);
    }
    setPaused(false);
  };

  return (
    <section
      ref={sectionRef}
      id="why-choose-us-dark"
      className="relative overflow-hidden py-8 md:py-12"
      style={{ background: "var(--dark-bg)" }}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <motion.div
          className="mb-10 flex flex-col items-center text-center md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="mb-4 max-w-3xl text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
            style={{ color: "var(--text-on-dark)" }}
          >
            Why Companies and Talent Partners{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Choose Our Platform
            </span>
          </h2>

          <p
            className="max-w-xl text-sm leading-relaxed md:text-base"
            style={{ color: "var(--text-on-dark-muted)" }}
          >
            Discover how our platform accelerates hiring for companies and
            unlocks new opportunities for talent vendors.
          </p>
        </motion.div>

        {/* ── Tab Switcher ── */}
        <div className="mb-8 flex justify-center md:mb-12">
          <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} theme="dark" />
        </div>

        {/* ── Carousel Stage ── */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative select-none"
        >
          {/* Main slide area — Jasper-style bold color background */}
          <div className="relative overflow-hidden rounded-3xl md:rounded-[32px]">
            {/* Animated background color */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id + "-bg"}
                className="absolute inset-0"
                style={{ background: activeSlide.bgColor }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>

            {/* Slide content */}
            <div
              className="relative"
              style={{
                minHeight: "680px",
                height: "clamp(680px, 75vh, 860px)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-content`}
                  variants={tabContentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={`${activeTab}-${currentIndex}`}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        duration: 0.55,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="absolute inset-0"
                    >
                      <JasperSlideRenderer slide={activeSlide} />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Progress Indicators ── */}
        <div className="mt-8 flex flex-col items-center gap-4 md:mt-10">
          {/* Dots / progress bars */}
          <div className="flex items-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => {
                  goTo(idx);
                  setPaused(true);
                  setTimeout(() => setPaused(false), 1000);
                }}
                aria-label={`Go to slide: ${slide.title}`}
                className="group relative"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 0",
                }}
              >
                <span
                  className="block h-1.5 overflow-hidden rounded-full transition-all duration-300"
                  style={{
                    width: idx === currentIndex ? "48px" : "24px",
                    background: "rgba(255,255,255,0.15)",
                  }}
                >
                  {idx === currentIndex && !paused && (
                    <motion.span
                      key={`progress-${slide.id}-${currentIndex}`}
                      className="block h-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--gradient-from), var(--gradient-to))",
                      }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: AUTOPLAY_MS / 1000,
                        ease: "linear",
                      }}
                    />
                  )}
                  {idx === currentIndex && paused && (
                    <span
                      className="block h-full w-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--gradient-from), var(--gradient-to))",
                      }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* Slide title indicator */}
          <AnimatePresence mode="wait">
            <motion.span
              key={activeSlide.id}
              className="text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--text-on-dark-muted)" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {currentIndex + 1} / {slides.length} — {activeSlide.title}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
