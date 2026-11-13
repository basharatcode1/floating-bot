"use client";

import React, { useEffect } from "react";
import Image from "next/image";

interface ImageBackgroundProps {
  children?: React.ReactNode;
  imageUrl?: string;
}

export function ImageBackground({
  children,
  imageUrl = "/images/get-started-bg.png",
}: ImageBackgroundProps) {
  useEffect(() => {
    // Bulletproof scrollbar hider: hides scrollbars completely across all browsers while preserving full scrolling functionality
    const style = document.createElement("style");
    style.setAttribute("data-get-started-scrollbar-hider", "true");
    style.innerHTML = `
      html, body, #__next, * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      ::-webkit-scrollbar, *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        background: transparent !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen text-white flex flex-col bg-slate-950 overflow-hidden">
      {/* SSR style injection to prevent initial paint scrollbar flash */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html, body, * {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            ::-webkit-scrollbar, *::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
              background: transparent !important;
            }
          `,
        }}
      />

      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <Image
          src={imageUrl}
          alt="StaffSync Talent Network Background"
          fill
          priority
          sizes="100vw"
          quality={95}
          className="object-cover object-bottom pointer-events-none"
        />
      </div>

      {/* Brand-tinted multi-directional dark overlays for image contrast & readability */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(220 60% 7% / 0.5) 0%, hsl(232 55% 11% / 0.25) 50%, hsl(220 60% 7% / 0.4) 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 left-0 w-full z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, hsl(220 60% 7% / 0.85) 0%, hsl(220 60% 7% / 0.6) 15%, hsl(220 60% 7% / 0.25) 30%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-full z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(-90deg, hsl(220 60% 7% / 0.75) 0%, hsl(220 60% 7% / 0.45) 15%, hsl(220 60% 7% / 0.15) 30%, transparent 50%)",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-44 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(220 60% 7% / 0.85) 0%, hsl(220 60% 7% / 0.4) 30%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, hsl(232 55% 11% / 0.7) 0%, hsl(232 55% 11% / 0.3) 40%, transparent 100%)",
        }}
      />

      {/* Content wrapper: full vertical scrolling functionality preserved, scrollbars hidden */}
      <div
        className="relative z-10 w-full flex-1 flex flex-col justify-between overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </div>
  );
}
