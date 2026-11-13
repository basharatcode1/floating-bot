"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ShinyText from "./ShinyText";
import LightningTabs from "./LightningTabs";

export default function ProblemSolutionVideo() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Dual video references for instant tab crossfading
  const clientVideoRef = useRef<HTMLVideoElement>(null);
  const clientGlowVideoRef = useRef<HTMLVideoElement>(null);
  const vendorVideoRef = useRef<HTMLVideoElement>(null);
  const vendorGlowVideoRef = useRef<HTMLVideoElement>(null);

  const isInView = useInView(containerRef, { amount: 0.3 });

  const isPlaying = true;
  const [isMuted] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("company");

  // Play/pause and tab switching logic: play active videos, pause inactive ones
  useEffect(() => {
    const activeVideo =
      activeTab === "company" ? clientVideoRef.current : vendorVideoRef.current;
    const activeGlow =
      activeTab === "company"
        ? clientGlowVideoRef.current
        : vendorGlowVideoRef.current;
    const inactiveVideo =
      activeTab === "company" ? vendorVideoRef.current : clientVideoRef.current;
    const inactiveGlow =
      activeTab === "company"
        ? vendorGlowVideoRef.current
        : clientGlowVideoRef.current;

    // Immediately pause inactive videos to save CPU/GPU decoding cycles
    if (inactiveVideo) inactiveVideo.pause();
    if (inactiveGlow) inactiveGlow.pause();

    if (isInView) {
      if (activeVideo) {
        activeVideo.play().catch(() => {});
      }
      if (activeGlow) {
        activeGlow.play().catch(() => {});
      }
    } else {
      if (activeVideo) activeVideo.pause();
      if (activeGlow) activeGlow.pause();
    }
  }, [activeTab, isInView]);

  // Synchronize glow video with main video dynamically for both tabs
  useEffect(() => {
    const sync = (v: HTMLVideoElement | null, g: HTMLVideoElement | null) => {
      if (!v || !g) return;
      if (
        !v.paused &&
        Math.abs((g.currentTime ?? 0) - (v.currentTime ?? 0)) > 0.3
      ) {
        g.currentTime = v.currentTime;
      }
    };

    const syncInterval = setInterval(() => {
      const activeVideo =
        activeTab === "company"
          ? clientVideoRef.current
          : vendorVideoRef.current;
      const activeGlow =
        activeTab === "company"
          ? clientGlowVideoRef.current
          : vendorGlowVideoRef.current;
      sync(activeVideo, activeGlow);
    }, 500);

    const onPlayClient = () => {
      const v = clientVideoRef.current;
      const g = clientGlowVideoRef.current;
      if (!v || !g) return;
      if (g.readyState >= 3) {
        g.play().catch(() => {});
      } else {
        g.load();
        g.addEventListener(
          "canplay",
          () => {
            g.currentTime = v.currentTime;
            g.play().catch(() => {});
          },
          { once: true },
        );
      }
    };
    const onPauseClient = () => {
      if (clientGlowVideoRef.current && !clientGlowVideoRef.current.paused) {
        clientGlowVideoRef.current.pause();
      }
    };

    const onPlayVendor = () => {
      const v = vendorVideoRef.current;
      const g = vendorGlowVideoRef.current;
      if (!v || !g) return;
      if (g.readyState >= 3) {
        g.play().catch(() => {});
      } else {
        g.load();
        g.addEventListener(
          "canplay",
          () => {
            g.currentTime = v.currentTime;
            g.play().catch(() => {});
          },
          { once: true },
        );
      }
    };
    const onPauseVendor = () => {
      if (vendorGlowVideoRef.current && !vendorGlowVideoRef.current.paused) {
        vendorGlowVideoRef.current.pause();
      }
    };

    const cv = clientVideoRef.current;
    const vv = vendorVideoRef.current;
    if (cv) {
      cv.addEventListener("play", onPlayClient);
      cv.addEventListener("pause", onPauseClient);
    }
    if (vv) {
      vv.addEventListener("play", onPlayVendor);
      vv.addEventListener("pause", onPauseVendor);
    }

    return () => {
      clearInterval(syncInterval);
      if (cv) {
        cv.removeEventListener("play", onPlayClient);
        cv.removeEventListener("pause", onPauseClient);
      }
      if (vv) {
        vv.removeEventListener("play", onPlayVendor);
        vv.removeEventListener("pause", onPauseVendor);
      }
    };
  }, [activeTab]);

  return (
    <section
      ref={containerRef}
      id="problem-solution-video"
      className="relative w-full overflow-hidden py-12 md:py-16 animate-fade-in"
      style={{ background: "var(--dark-bg)" }}
    >
      {/* Background Glow Elements */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full blur-[140px] pointer-events-none opacity-40 z-0"
        style={{
          background:
            "radial-gradient(circle, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,13,23,0)_0%,rgba(8,13,23,0.85)_100%)] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        {/* Subtle, Professional Showcase Box wrapping all contents */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl mx-auto rounded-3xl md:rounded-[36px] border border-white/[0.08] bg-gradient-to-b from-white/[0.025] via-white/[0.01] to-transparent backdrop-blur-md p-6 sm:p-10 md:p-12 lg:p-16 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.6)] overflow-hidden group/box flex flex-col items-center"
        >
          {/* Top Edge Light Reflection */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* Soft Ambient Inner Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-indigo-500/[0.06] to-transparent blur-2xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-8 relative z-10">
            <h2 className="max-w-5xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight md:whitespace-nowrap animate-theme-transition">
              How We Solve Hiring For <ShinyText text="Clients & Vendors" />
            </h2>

            <p className="mt-4 max-w-2xl text-center text-base text-white/60 md:text-lg font-light leading-relaxed">
              Watch a quick walk-through of the flow that accelerates
              recruitment, ensures elite quality, and establishes transparent
              partnerships.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="mb-10 relative z-20">
            <LightningTabs
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl aspect-video rounded-2xl md:rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-visible group shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10"
          >
            {/* Dual Ambient Glow Videos with CSS Opacity transition */}
            <div
              className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-out pointer-events-none z-0"
              style={{
                opacity: activeTab === "company" ? 1 : 0,
                willChange: "opacity",
              }}
            >
              <video
                ref={clientGlowVideoRef}
                src="/videos/thumbnail.mp4"
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 z-0"
                style={{
                  transform: "scale(1.05)",
                  filter: "blur(48px) saturate(1.5) brightness(1.5)",
                  opacity: isPlaying && activeTab === "company" ? 0.8 : 0,
                }}
              />
            </div>

            <div
              className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-out pointer-events-none z-0"
              style={{
                opacity: activeTab === "vendor" ? 1 : 0,
                willChange: "opacity",
              }}
            >
              <video
                ref={vendorGlowVideoRef}
                src="/videos/thumbnail2.mp4"
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 z-0"
                style={{
                  transform: "scale(1.05)",
                  filter: "blur(48px) saturate(1.5) brightness(1.5)",
                  opacity: isPlaying && activeTab === "vendor" ? 0.8 : 0,
                }}
              />
            </div>

            {/* Inner Video Player Container with rounded corners and clipping */}
            <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden z-10">
              {/* Subtle gradient highlights inside container */}
              <div className="absolute inset-0 pointer-events-none z-10 border border-white/5 rounded-2xl md:rounded-3xl" />

              {/* Client Video Player */}
              <div
                className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-out"
                style={{
                  opacity: activeTab === "company" ? 1 : 0,
                  pointerEvents: activeTab === "company" ? "auto" : "none",
                  willChange: "opacity",
                }}
              >
                <video
                  ref={clientVideoRef}
                  src="/videos/thumbnail.mp4"
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover block cursor-default select-none"
                />
              </div>

              {/* Vendor Video Player */}
              <div
                className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-out"
                style={{
                  opacity: activeTab === "vendor" ? 1 : 0,
                  pointerEvents: activeTab === "vendor" ? "auto" : "none",
                  willChange: "opacity",
                }}
              >
                <video
                  ref={vendorVideoRef}
                  src="/videos/thumbnail2.mp4"
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover block cursor-default select-none"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
