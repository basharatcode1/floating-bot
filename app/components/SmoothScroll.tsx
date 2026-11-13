"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      prevent: (node) => {
        return (
          node instanceof HTMLElement && (
            node.closest("[data-radix-dialog-content]") !== null ||
            node.closest("[role='dialog']") !== null ||
            node.closest(".auth-modal-root") !== null ||
            node.closest("[data-lenis-prevent]") !== null ||
            node.closest(".dash-sidebar") !== null ||
            node.closest(".dash-main") !== null
          )
        );
      },
    });

    function raf(time) {
      const isLocked =
        document.body.hasAttribute("data-radix-scroll-locked") ||
        document.body.style.overflow === "hidden";

      if (isLocked) {
        lenis.stop();
      } else {
        lenis.start();
      }

      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
