"use client";

import { motion } from "framer-motion";
import ShinyText from "@/app/components/ShinyText";
import MagneticCTA from "@/app/components/MagneticCTA";
import { HeroCursor } from "@/app/components/ui/HeroCursor";
import { useIsMobile } from "@/app/hooks/use-mobile";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
// No next-video imports to prevent remote Mux requirements and sync warning overlays


type HeroSectionProps = {
  onGetStartedClick?: () => void;
};

const HeroSection = ({ onGetStartedClick }: HeroSectionProps) => {
  const isMobile = useIsMobile();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);

    // Heuristic low-power detection: low core count or device memory
    const nav = navigator as Navigator & { deviceMemory?: number };
    const cores = nav.hardwareConcurrency ?? 8;
    const memory = nav.deviceMemory ?? 8;
    if (cores <= 4 || memory <= 4) setLowPower(true);

    return () => mq.removeEventListener("change", handler);
  }, []);

  const enableParticles = !isMobile && !reducedMotion && !lowPower;

  // Skip the heavy hero video on mobile, low-power, and reduced-motion devices.
  // The side/top/bottom gradients already cover ~70% of the video area on
  // narrow viewports, so dropping it has near-zero visual cost and big LCP win.
  const enableHeroVideo = !isMobile && !reducedMotion && !lowPower;

  return (
    <section
      id="hero-section"
      className="relative w-full overflow-hidden pb-32 md:pb-44 lg:pb-52 bg-brand-section-hero cursor-pointer"
    >
      <HeroCursor text="Play Intro" onClick={() => {}} />

      {/* Video Background — desktop / capable devices only */}
      {enableHeroVideo ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            src="/videos/thumbnail.mp4"
          />
        </div>
      ) : (
        // Static, GPU-cheap stand-in: deep navy gradient that matches the video tint.
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, hsl(220 60% 12%) 0%, hsl(220 60% 7%) 60%, hsl(232 55% 5%) 100%)",
          }}
        />
      )}

      {/* Brand-tinted overlays — keep video readable while staying on-palette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(220 60% 7% / 0.55) 0%, hsl(232 55% 11% / 0.45) 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 left-0  w-[25%]"
        style={{
          background:
            "linear-gradient(90deg,  hsl(220 60% 7%) 0%, hsl(220 60% 7% / 0.92) 30%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[25%]"
        style={{
          background:
            "linear-gradient(-90deg, hsl(220 60% 7%) 0%, hsl(220 60% 7% / 0.92) 30%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[30%]"
        style={{
          background:
            "linear-gradient(0deg,   hsl(232 55% 11%) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-0    left-0 right-0 h-[20%]"
        style={{
          background:
            "linear-gradient(180deg, hsl(220 60% 7% / 0.8) 0%, transparent 100%)",
        }}
      />

      {/* Ambient brand glows — navy + purple depth, soft gold highlight */}
      <div
        className="absolute top-1/4 left-[10%]    w-[400px] h-[400px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: "hsl(var(--brand-blue-core) / 0.10)" }}
      />
      <div
        className="absolute bottom-1/4 right-[10%] w-[350px] h-[350px] rounded-full blur-[130px] pointer-events-none"
        style={{ background: "hsl(var(--brand-purple-core) / 0.10)" }}
      />
      <div
        className="absolute top-[55%] left-[55%]   w-[260px] h-[260px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "hsl(var(--brand-gold-core) / 0.06)" }}
      />

      {/* Subtle drifting particle accents — disabled on mobile/low-power/reduced-motion */}
      {enableParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          {Array.from({ length: 14 }).map((_, i) => {
            const left = (i * 37) % 100;
            const top = (i * 53) % 100;
            const delay = (i * 0.7) % 8;
            const duration = 9 + (i % 5) * 2;
            const width = 1 + (i % 3) * 0.5;
            const height = 18 + (i % 4) * 10;
            const opacity = 0.15 + (i % 5) * 0.05;
            return (
              <motion.span
                key={i}
                className="absolute block rounded-[2px]"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${width}px`,
                  height: `${height}px`,
                  background: `linear-gradient(180deg, transparent 0%, hsl(213 95% 75% / ${opacity}) 50%, transparent 100%)`,
                  filter: "blur(0.5px)",
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
          {/* Tiny dust dots */}
          {Array.from({ length: 18 }).map((_, i) => {
            const left = (i * 23 + 7) % 100;
            const top = (i * 41 + 11) % 100;
            const delay = (i * 0.5) % 6;
            const duration = 6 + (i % 4) * 1.5;
            const size = 1 + (i % 2);
            return (
              <motion.span
                key={`d-${i}`}
                className="absolute block rounded-[1px]"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  background: "hsl(213 90% 80% / 0.5)",
                  boxShadow: "0 0 6px hsl(213 95% 70% / 0.6)",
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  x: [0, 12, 0],
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Content layer */}
      <div
        className="relative z-10 flex flex-col min-h-screen"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-24 md:pt-32">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center"
            style={{ lineHeight: 1.1, letterSpacing: "-0.04em" }}
          >
            <span className="block text-white font-medium text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
              Stop Chasing Talent.
            </span>
            <ShinyText
              text="Start Hiring Smarter."
              className=" pb-3 block font-medium text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mt-1"
              speed={3}
            />
          </motion.h1>

          {/* CTA Buttons — Premium impactful style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 md:mt-12 flex flex-row items-center gap-2.5 sm:gap-4 relative z-10"
          >
            <MagneticCTA
              onClick={onGetStartedClick}
              variant="primary"
              size="lg"
            >
              Book a Demo
            </MagneticCTA>
            <MagneticCTA
              onClick={onGetStartedClick}
              variant="secondary"
              size="lg"
              icon={<Play className="w-4 h-4 fill-current" />}
            >
              See How It Works
            </MagneticCTA>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
