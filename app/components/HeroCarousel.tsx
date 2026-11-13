"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const SLIDES = [
  {
    id: "marketing",
    eyebrow: "Growth Marketing",
    title: "Launch Campaigns That Convert",
    subtitle:
      "Spin up high-performing landing pages, ad variations, and email flows in minutes — not weeks.",
    personImage: "/person-marketing.png",
    bubble: "Bulk create 5,000 retail product pages",
    stat: "+218%",
    statLabel: "campaign reach",
  },
  {
    id: "engineering",
    eyebrow: "Engineering",
    title: "Ship Production Apps Faster",
    subtitle:
      "Onboard pre-vetted React and Next.js specialists to deploy scalable, edge-ready products in days.",
    personImage: "/person-eng.png",
    bubble: "Deploy edge-ready apps across 18 regions",
    stat: "99.9%",
    statLabel: "deploy uptime",
  },
  {
    id: "design",
    eyebrow: "Product Design",
    title: "Build Premium Design Systems",
    subtitle:
      "Sync tokens, components, and layouts between Figma and code with designers who think in systems.",
    personImage: "/person-design.png",
    bubble: "Sync 148 design tokens straight to code",
    stat: "+100%",
    statLabel: "design parity",
  },
];

const AUTOPLAY_MS = 5000;

// Jasper-style collage palette
const C = {
  cream: "#f1f0ec",
  yellow: "#ffe24d",
  grid: "#36b3d6",
  pink: "#f6a8d8",
  magenta: "#e6298a",
  magentaDark: "#b01a6b",
  coral: "#ff6b4a",
  olive: "#9a8c1a",
  ink: "#16151f",
};

const gridStyle = {
  backgroundColor: C.yellow,
  backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`,
  backgroundSize: "26px 26px",
};

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 70 : -70 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -70 : 70 }),
};

export default function HeroCarousel() {
  const [[index, direction], setState] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const active = SLIDES[index];

  // Mouse-driven parallax (normalized -0.5..0.5)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 60, damping: 18 });
  const springY = useSpring(my, { stiffness: 60, damping: 18 });

  // Layered depth transforms
  const bgX = useTransform(springX, [-0.5, 0.5], [18, -18]);
  const bgY = useTransform(springY, [-0.5, 0.5], [14, -14]);
  const personX = useTransform(springX, [-0.5, 0.5], [-22, 22]);
  const personY = useTransform(springY, [-0.5, 0.5], [-12, 12]);
  const shapeX = useTransform(springX, [-0.5, 0.5], [44, -44]);
  const shapeY = useTransform(springY, [-0.5, 0.5], [34, -34]);
  const cardX = useTransform(springX, [-0.5, 0.5], [-46, 46]);
  const cardY = useTransform(springY, [-0.5, 0.5], [-26, 26]);
  const cardXInverse = useTransform(cardX, (v) => -v);

  const paginate = useCallback((dir) => {
    setState(([prev]) => {
      const next = (prev + dir + SLIDES.length) % SLIDES.length;
      return [next, dir];
    });
  }, []);

  const goTo = useCallback((target) => {
    setState(([prev]) => [target, target > prev ? 1 : -1]);
  }, []);

  // Infinite autoplay
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, index, paginate]);

  const handleMouseMove = (e) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
    setPaused(false);
  };

  return (
    <section
      data-section-theme="light"
      className="relative w-full overflow-hidden py-20 md:py-28 select-none"
      style={{ backgroundColor: C.cream }}
    >
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4">
        {/* Eyebrow */}
        <AnimatePresence mode="wait">
          <motion.span
            key={active.eyebrow}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest"
            style={{ backgroundColor: C.ink, color: C.cream }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: C.coral }} />
            {active.eyebrow}
          </motion.span>
        </AnimatePresence>

        {/* Header copy */}
        <div className="mb-10 flex min-h-[150px] flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={active.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl text-balance font-serif text-3xl font-bold tracking-tight md:text-5xl"
              style={{ color: C.ink }}
            >
              {active.title}
            </motion.h2>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={active.subtitle}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed md:text-base"
              style={{ color: "rgba(22,21,31,0.65)" }}
            >
              {active.subtitle}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Stage */}
      <div className="relative w-full">
        <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setPaused(true)}
            className="relative mx-auto aspect-[16/12] w-full md:aspect-[16/9]"
          >
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={active.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <div
                  className="relative h-full w-full overflow-hidden rounded-none"
                  style={{ backgroundColor: C.cream }}
                >
                  {/* ---- Yellow graph-paper grid block behind the portrait (parallax) ---- */}
                  <motion.div
                    style={{ x: bgX, y: bgY }}
                    className="pointer-events-none absolute inset-0 flex items-end justify-center"
                  >
                    <div className="relative flex h-[78%] w-[72%] items-end justify-center">
                      {/* stepped grid panels */}
                      <div className="absolute bottom-0 left-0 h-[62%] w-[34%]" style={gridStyle} />
                      <div className="absolute bottom-0 left-1/2 h-full w-[46%] -translate-x-1/2" style={gridStyle} />
                      <div className="absolute bottom-0 right-0 h-[48%] w-[30%]" style={gridStyle} />
                    </div>
                  </motion.div>

                  {/* ---- Flat collage shapes (deep parallax layer) ---- */}
                  <motion.div
                    style={{ x: shapeX, y: shapeY }}
                    className="pointer-events-none absolute inset-0"
                  >
                    {/* Pink triangle behind left shoulder */}
                    <motion.svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute left-[20%] top-[34%] h-[34%] w-[20%]"
                      animate={{ rotate: [0, 4, 0], y: [0, -8, 0] }}
                      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <polygon points="50,0 100,100 0,100" fill={C.pink} />
                    </motion.svg>

                    {/* Olive vertical bars at the base */}
                    <div className="absolute bottom-0 left-[26%] flex items-end gap-2 md:gap-3">
                      {[64, 92, 50].map((h, i) => (
                        <motion.span
                          key={i}
                          className="block w-3 md:w-4"
                          style={{ height: h, backgroundColor: C.olive }}
                          animate={{ scaleY: [1, 1.12, 1] }}
                          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                        />
                      ))}
                    </div>

                    {/* Light-pink diamond + coral circle cluster, right side */}
                    <motion.div
                      className="absolute bottom-[8%] right-[6%] h-[26%] w-[26%] rotate-45"
                      style={{ backgroundColor: C.pink, opacity: 0.55 }}
                      animate={{ rotate: [45, 52, 45] }}
                      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.svg
                      viewBox="0 0 100 100"
                      className="absolute bottom-[6%] right-[4%] h-[30%] w-[30%]"
                      animate={{ rotate: [0, -8, 0] }}
                      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <circle cx="36" cy="34" r="22" fill={C.coral} />
                      <circle cx="68" cy="58" r="16" fill={C.coral} />
                      <circle cx="40" cy="74" r="13" fill={C.coral} />
                    </motion.svg>
                  </motion.div>

                  {/* ---- Central portrait cutout (parallax) ---- */}
                  <motion.img
                    style={{ x: personX, y: personY }}
                    src={active.personImage}
                    alt={active.title}
                    className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-[94%] -translate-x-1/2 object-contain"
                  />

                  {/* ---- Floating speech-bubble card (white, serif) ---- */}
                  <motion.div
                    style={{ x: cardX, y: cardY }}
                    className="absolute left-[2%] top-[26%] z-20 w-[180px] md:left-[4%] md:w-[240px]"
                  >
                    <motion.div
                      animate={{ y: [0, -12, 0], rotate: [-1.5, 0.5, -1.5] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="relative rounded-2xl bg-white p-4 text-left shadow-[0_24px_50px_-18px_rgba(0,0,0,0.35)] md:p-5"
                    >
                      {/* pointer cursor */}
                      <svg className="absolute -top-3 -left-2 h-5 w-5" viewBox="0 0 24 24" fill={C.ink}>
                        <path d="M3 2l7 18 2.5-7L20 10 3 2z" />
                      </svg>
                      <div className="flex items-start gap-2.5">
                        <span
                          className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px] font-bold italic text-white"
                          style={{ backgroundColor: C.coral }}
                        >
                          i
                        </span>
                        <p
                          className="font-serif text-base font-semibold leading-snug md:text-xl"
                          style={{ color: C.ink }}
                        >
                          {active.bubble}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* ---- Floating magenta stat block ---- */}
                  <motion.div
                    style={{ x: cardXInverse, y: cardY }}
                    className="absolute right-[2%] top-[18%] z-20 w-[150px] md:right-[4%] md:w-[200px]"
                  >
                    <motion.div
                      animate={{ y: [0, 12, 0], rotate: [1.5, -0.5, 1.5] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                      className="overflow-hidden rounded-xl shadow-[0_24px_50px_-18px_rgba(0,0,0,0.4)]"
                    >
                      <div
                        className="px-5 py-3 text-center md:py-4"
                        style={{ backgroundColor: C.magenta }}
                      >
                        <span className="font-serif text-3xl font-bold tracking-tight text-white md:text-5xl">
                          {active.stat}
                        </span>
                      </div>
                      <div
                        className="px-4 py-2.5 text-left md:py-3"
                        style={{ backgroundColor: C.magentaDark }}
                      >
                        <p className="text-[11px] font-bold leading-snug text-white md:text-sm">
                          {active.statLabel}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4">
        {/* Progress indicators */}
        <div
          className="mt-8 flex items-center gap-3"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => goTo(idx)}
              aria-label={`Go to ${slide.eyebrow} slide`}
              className="group flex flex-col items-center gap-1.5"
            >
              <span className="relative block h-1.5 w-12 overflow-hidden rounded-full" style={{ backgroundColor: "rgba(22,21,31,0.15)" }}>
                {idx === index && !paused && (
                  <motion.span
                    key={`${slide.id}-${index}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: C.magenta }}
                  />
                )}
                {idx === index && paused && (
                  <span className="absolute inset-0 rounded-full" style={{ backgroundColor: C.magenta }} />
                )}
              </span>
              <span
                className="text-[9px] font-bold uppercase tracking-wider transition-opacity md:text-[10px]"
                style={{ color: C.ink, opacity: idx === index ? 1 : 0.45 }}
              >
                {slide.id}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
