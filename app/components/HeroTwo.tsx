"use client";

import { motion } from "framer-motion";
import ShinyText from "@/app/components/ShinyText";
import FluidGlassButton from "@/app/components/FluidGlassButton";
import FluidButton from "@/app/components/FluidButton";
import { Play } from "lucide-react";

const HeroTwo = () => {
  return (
    <section
      id="hero-two-section"
      className="relative w-full overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
      style={{
        background: "#0b0f19",
      }}
    >
      {/* Ambient brand glows */}
      <div
        className="absolute top-1/4 left-[10%] w-[350px] h-[350px] rounded-full blur-[130px] pointer-events-none"
        style={{ background: "hsl(var(--brand-blue-core) / 0.08)" }}
      />
      <div
        className="absolute bottom-1/4 right-[10%] w-[300px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "hsl(var(--brand-purple-core) / 0.08)" }}
      />

      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-left"
              style={{ lineHeight: 1.1, letterSpacing: "-0.04em" }}
            >
              <span className="block text-white font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl whitespace-nowrap">
                Stop Chasing Talent.
              </span>
              <ShinyText
                text="Start Hiring Smarter."
                className="pb-3 block font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl mt-1 whitespace-nowrap"
                speed={3}
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg md:text-xl text-white/70 max-w-xl font-light leading-relaxed"
            >
              Streamline your hiring process with AI-driven matching, vetting,
              and onboarding. Get top talent matched within hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-row items-center gap-2.5 sm:gap-4"
            >
              <FluidGlassButton text="Book a Demo" />
              <FluidButton
                text="See How It Works"
                icon={<Play className="w-4 h-4 fill-current" />}
              />
            </motion.div>
          </div>

          {/* Right Column — Floating glass panel */}
          <div className="lg:col-span-6 relative w-full">
            {/* Shimmer keyframes */}
            <style>{`
              @keyframes hero-shimmer {
                0%, 100% { opacity: 0.07; }
                50% { opacity: 0.18; }
              }
            `}</style>

            {/* Floor shadow — wider & more colorful for floating feel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="absolute -bottom-8 left-[6%] right-[6%] h-20 pointer-events-none z-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, hsl(var(--brand-blue-core) / 0.35) 0%, hsl(var(--brand-purple-core) / 0.15) 50%, transparent 80%)",
                filter: "blur(35px)",
                borderRadius: "50%",
              }}
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 30,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
              className="relative w-full z-10"
            >
              {/* Glow effect — separate div so clipPath doesn't interfere with video rounding */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow:
                    "30px 0 80px -10px color-mix(in srgb, var(--accent-primary) 22%, transparent)",
                  borderTopRightRadius: "1rem",
                  borderBottomRightRadius: "1rem",
                  clipPath: "inset(-100px -100px -100px 0px)",
                  WebkitClipPath: "inset(-100px -100px -100px 0px)",
                }}
              />
              {/* Gradient border overlay (fades out on the left) */}
              <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  borderTop: "1px solid var(--accent-primary)",
                  borderRight: "1px solid var(--accent-primary)",
                  borderBottom: "1px solid var(--accent-primary)",
                  borderTopRightRadius: "1rem",
                  borderBottomRightRadius: "1rem",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 50%)",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, black 50%)",
                }}
              />
              <div className="relative w-full rounded-r-2xl overflow-hidden">
                {/* Video — natural aspect ratio, fills container width */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="block w-full h-auto select-none pointer-events-none rounded-r-2xl"
                  src="/videos/thumbnail2.mp4"
                />

                {/* Top specular highlight — light catching a tilted surface */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background:
                      "linear-gradient(170deg, hsl(0 0% 100% / 0.12) 0%, hsl(0 0% 100% / 0.04) 12%, transparent 30%)",
                  }}
                />

                {/* Diagonal shine streak — the key 3D glass cue */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 20%, hsl(0 0% 100% / 0.08) 35%, hsl(0 0% 100% / 0.03) 50%, transparent 65%)",
                    animation: "hero-shimmer 6s ease-in-out infinite",
                  }}
                />

                {/* Right-edge light — simulates light wrapping around curved edge */}
                <div
                  className="absolute inset-y-0 right-0 w-[8%] pointer-events-none z-10"
                  style={{
                    background:
                      "linear-gradient(270deg, hsl(var(--brand-blue-core) / 0.12) 0%, transparent 100%)",
                  }}
                />

                {/* LEFT edge blend — preserved exactly */}
                <div
                  className="absolute inset-y-0 left-0 w-[20%] pointer-events-none z-10"
                  style={{
                    background:
                      "linear-gradient(90deg, rgb(11 15 25) 0%, rgb(11 15 25 / 0.55) 40%, transparent 100%)",
                  }}
                />

                {/* Radial vignette — darkened edges sell the curvature */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 70% at 55% 48%, transparent 30%, rgb(11 15 25 / 0.5) 65%, rgb(11 15 25) 100%)",
                  }}
                />

                {/* Bottom shadow — heavier to ground the surface */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background:
                      "linear-gradient(0deg, rgb(11 15 25 / 0.5) 0%, rgb(11 15 25 / 0.15) 12%, transparent 25%)",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroTwo;
