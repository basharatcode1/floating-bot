"use client";

import { motion, MotionValue } from "framer-motion";

interface FloatingElement {
  shape: string;
  size: number;
  x: string | number;
  y: string | number;
  opacity: number;
  delay?: number;
  depth: "bg" | "mid" | "fg";
  animation: string;
}

interface FloatingElementsProps {
  elements?: FloatingElement[];
  bgLayer?: { x?: MotionValue<number> | number; y?: MotionValue<number> | number } | any;
  midLayer?: { x?: MotionValue<number> | number; y?: MotionValue<number> | number } | any;
  fgLayer?: { x?: MotionValue<number> | number; y?: MotionValue<number> | number } | any;
}

export default function FloatingElements({
  elements = [],
  bgLayer,
  midLayer,
  fgLayer,
}: FloatingElementsProps) {
  const getLayerMotion = (depth: string) => {
    switch (depth) {
      case "bg":
        return bgLayer;
      case "mid":
        return midLayer;
      case "fg":
        return fgLayer;
      default:
        return bgLayer;
    }
  };

  const getAnimation = (animation: string) => {
    switch (animation) {
      case "float":
        return {
          animate: { y: [0, -12, 0], x: [0, 4, 0] },
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case "pulse":
        return {
          animate: { scale: [1, 1.15, 1], opacity: [1, 0.7, 1] },
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case "rotate":
        return {
          animate: { rotate: [0, 180, 360] },
          transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          },
        };
      case "sway":
        return {
          animate: { rotate: [-5, 5, -5], x: [0, 8, 0] },
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      default:
        return {
          animate: { y: [0, -8, 0] },
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
    }
  };

  const renderShape = (shape: string, size: number) => {
    switch (shape) {
      case "circle":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="var(--accent-primary)"
              opacity="0.6"
            />
          </svg>
        );
      case "ring":
        return (
          <svg width={size} height={size} viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <circle
              cx="24"
              cy="24"
              r="12"
              fill="none"
              stroke="var(--accent-secondary)"
              strokeWidth="1"
              opacity="0.3"
              strokeDasharray="4 4"
            />
          </svg>
        );
      case "diamond":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24">
            <rect
              x="5"
              y="5"
              width="14"
              height="14"
              rx="2"
              fill="var(--accent-secondary)"
              opacity="0.5"
              transform="rotate(45 12 12)"
            />
          </svg>
        );
      case "hexagon":
        return (
          <svg width={size} height={size} viewBox="0 0 48 48">
            <polygon
              points="24,2 44,14 44,34 24,46 4,34 4,14"
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth="1.5"
              opacity="0.4"
            />
          </svg>
        );
      case "plus":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24">
            <path
              d="M12 4v16M4 12h16"
              stroke="var(--accent-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
        );
      case "dots":
        return (
          <svg width={size} height={size} viewBox="0 0 80 80">
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={10 + col * 20}
                  cy={10 + row * 20}
                  r="2"
                  fill="var(--accent-primary)"
                  opacity="0.4"
                />
              ))
            )}
          </svg>
        );
      case "line":
        return (
          <svg width={size} height="2" viewBox={`0 0 ${size} 2`}>
            <line
              x1="0"
              y1="1"
              x2={size}
              y2="1"
              stroke="var(--accent-primary)"
              strokeWidth="1"
              opacity="0.3"
              strokeDasharray="8 6"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {elements.map((el, i) => {
        const layer = getLayerMotion(el.depth);
        const anim = getAnimation(el.animation);
        return (
          <motion.div
            key={`float-${i}`}
            className="absolute"
            style={{
              left: el.x,
              top: el.y,
              opacity: el.opacity,
              x: layer?.x,
              y: layer?.y,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: el.opacity,
              scale: 1,
              ...anim.animate,
            }}
            transition={{
              opacity: { duration: 0.8, delay: el.delay || 0 },
              scale: { duration: 0.6, delay: el.delay || 0 },
              ...anim.transition,
              delay: el.delay || 0,
            } as any}
          >
            {renderShape(el.shape, el.size)}
          </motion.div>
        );
      })}
    </div>
  );
}
