"use client";

import React from "react";
import HeroMatchMesh from "@/app/components/HeroMatchMesh";

interface AuroraBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export function AuroraBackground({
  className = "",
  children,
}: AuroraBackgroundProps) {
  return (
    <div
      className={`relative w-full min-h-screen text-white flex flex-col justify-between ${className}`}
      style={{
        background: "#0b0f19",
      }}
    >
      {/* Background layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Grid mesh background & Ambient glows matching Hero section */}
        <HeroMatchMesh showHorizonLine={false} fullPageGrid={true} />

        <div
          className="absolute top-1/4 left-[10%] w-[450px] h-[450px] rounded-full blur-[140px] z-0"
          style={{ background: "hsla(221, 83%, 53%, 0.12)" }}
        />
        <div
          className="absolute bottom-1/4 right-[10%] w-[400px] h-[400px] rounded-full blur-[130px] z-0"
          style={{ background: "hsla(262, 83%, 53%, 0.12)" }}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}

