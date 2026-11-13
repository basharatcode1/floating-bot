"use client";

import { useRef, useMemo } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const SPRING_CONFIG = { stiffness: 50, damping: 20, mass: 0.8 };

/**
 * Custom hook for mouse-driven 3D parallax effect.
 * Returns parallax motion values for three depth layers.
 *
 * @param {{ bg?: number, mid?: number, fg?: number }} depths
 * @returns {{ containerRef, bgLayer, midLayer, fgLayer, handlers }}
 */
export function useMouseParallax(
  depths: { bg?: number; mid?: number; fg?: number } = {}
) {
  const { bg = 15, mid = 30, fg = 50 } = depths;
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Raw mouse position normalized to -0.5 ... 0.5
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Smooth spring values
  const springX = useSpring(mx, SPRING_CONFIG);
  const springY = useSpring(my, SPRING_CONFIG);

  // Background layer — subtle movement
  const bgX = useTransform(springX, [-0.5, 0.5], [bg, -bg]);
  const bgY = useTransform(springY, [-0.5, 0.5], [bg * 0.7, -bg * 0.7]);

  // Midground layer — moderate movement
  const midX = useTransform(springX, [-0.5, 0.5], [-mid, mid]);
  const midY = useTransform(springY, [-0.5, 0.5], [-mid * 0.6, mid * 0.6]);

  // Foreground layer — strong movement
  const fgX = useTransform(springX, [-0.5, 0.5], [-fg, fg]);
  const fgY = useTransform(springY, [-0.5, 0.5], [-fg * 0.5, fg * 0.5]);

  const bgLayer = useMemo(() => ({ x: bgX, y: bgY }), [bgX, bgY]);
  const midLayer = useMemo(() => ({ x: midX, y: midY }), [midX, midY]);
  const fgLayer = useMemo(() => ({ x: fgX, y: fgY }), [fgX, fgY]);

  const handlers = useMemo(
    () => ({
      onMouseMove: (e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
      },
      onMouseLeave: () => {
        mx.set(0);
        my.set(0);
      },
    }),
    [mx, my]
  );

  return { containerRef, bgLayer, midLayer, fgLayer, handlers };
}
