"use client";

import React, { useRef, useEffect } from "react";

interface VideoBackgroundProps {
  children?: React.ReactNode;
  videoUrl: string;
}

export function VideoBackground({ children, videoUrl }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay playback error:", err);
      });
    }
  }, [videoUrl]);

  const handleEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="relative w-full min-h-screen text-white flex flex-col bg-slate-950 overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onEnded={handleEnded}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-80"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Brand-tinted multi-directional dark overlays for video contrast & readability */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(220 60% 7% / 0.55) 0%, hsl(232 55% 11% / 0.45) 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 left-0 w-full z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, hsl(220 60% 7%) 0%, hsl(220 60% 7% / 0.85) 10%, hsl(220 60% 7% / 0.4) 20%, transparent 40%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-full z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(-90deg, hsl(220 60% 7%) 0%, hsl(220 60% 7% / 0.85) 10%, hsl(220 60% 7% / 0.4) 20%, transparent 40%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-full z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, hsl(232 55% 11%) 0%, hsl(232 55% 11% / 0.7) 10%, hsl(232 55% 11% / 0.3) 22%, transparent 40%)",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-full z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(220 60% 7% / 0.8) 0%, hsl(220 60% 7% / 0.4) 10%, transparent 30%)",
        }}
      />

      {/* Content wrapper */}
      <div 
        className="relative z-10 w-full flex-1 flex flex-col justify-between overflow-y-auto overflow-x-hidden hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none !important;
          }
        `}</style>
        {children}
      </div>
    </div>
  );
}
