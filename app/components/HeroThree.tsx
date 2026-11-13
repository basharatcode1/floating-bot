"use client";

import { motion } from "framer-motion";
import ShinyText from "./ShinyText";
import FluidGlassButton from "./FluidGlassButton";
import FluidButton from "./FluidButton";
import { Play } from "lucide-react";
import HeroMatchMesh from "./HeroMatchMesh";

const HeroThree = () => {
  return (
    <section
      id="hero-three-section"
      className="relative w-full overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
      style={{
        background: "#0b0f19",
      }}
    >
      <HeroMatchMesh />

      <div
        className="absolute top-1/4 left-[10%] w-[350px] h-[350px] rounded-full blur-[130px] pointer-events-none"
        style={{ background: "hsla(221, 83%, 53%, 0.08)" }}
      />
      <div
        className="absolute bottom-1/4 right-[10%] w-[300px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "hsla(262, 83%, 53%, 0.08)" }}
      />

      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 lg:gap-8 items-center">
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
              <FluidGlassButton
                text="Book a Demo"
                onClick={() => {
                  window.location.hash = "#contact";
                }}
              />
              <FluidButton
                text="See How It Works"
                icon={<Play className="w-4 h-4 fill-current" />}
                onClick={() => {
                  window.location.hash = "#how-it-works";
                }}
              />
            </motion.div>
          </div>

          <div className="lg:col-span-6 relative w-full">
            <style>{`
              @keyframes hero-shimmer {
                0%, 100% { opacity: 0.07; }
                50% { opacity: 0.18; }
              }
            `}</style>

            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="absolute -bottom-8 left-[6%] right-[6%] h-20 pointer-events-none z-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, hsla(221, 83%, 53%, 0.35) 0%, hsla(262, 83%, 53%, 0.15) 50%, transparent 80%)",
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
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow:
                    "30px 0 80px -10px color-mix(in srgb, var(--accent-primary) 22%, transparent)",
                  borderTopRightRadius: "1rem",
                  borderBottomRightRadius: "1rem",
                  clipPath: "inset(-100px)",
                  WebkitClipPath: "inset(-100px)",
                }}
              />
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
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="block w-full h-auto select-none pointer-events-none rounded-r-2xl"
                  src="/videos/thumbnail2.mp4"
                />

                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background:
                      "linear-gradient(170deg, hsl(0 0% 100% / 0.12) 0%, hsl(0 0% 100% / 0.04) 12%, transparent 30%)",
                  }}
                />

                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 20%, hsl(0 0% 100% / 0.08) 35%, hsl(0 0% 100% / 0.03) 50%, transparent 65%)",
                    animation: "hero-shimmer 6s ease-in-out infinite",
                  }}
                />

                <div
                  className="absolute inset-y-0 right-0 w-[8%] pointer-events-none z-10"
                  style={{
                    background:
                      "linear-gradient(270deg, hsla(221, 83%, 53%, 0.12) 0%, transparent 100%)",
                  }}
                />

                <div
                  className="absolute inset-y-0 left-0 w-[20%] pointer-events-none z-10"
                  style={{
                    background:
                      "linear-gradient(90deg, rgb(11 15 25) 0%, rgb(11 15 25 / 0.55) 40%, transparent 100%)",
                  }}
                />

                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 70% at 55% 48%, transparent 30%, rgb(11 15 25 / 0.5) 65%, rgb(11 15 25) 100%)",
                  }}
                />

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

export default HeroThree;
