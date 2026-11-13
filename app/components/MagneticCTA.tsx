import type { MouseEventHandler, ReactNode, MouseEvent } from "react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

type MagneticCTAProps = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "secondary";
  size?: "lg" | "md";
  icon?: ReactNode;
};

export default function MagneticCTA({
  children,
  onClick,
  variant = "primary",
  size = "lg",
  icon,
}: MagneticCTAProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    // Limit displacement to keep it controlled and premium
    setPosition({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-xl cursor-pointer select-none whitespace-nowrap";
  const sizeStyles = size === "lg"
    ? "px-5 py-3 text-base sm:px-8 sm:py-4 sm:text-lg"
    : "px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base";
  
  const variantStyles = variant === "primary"
    ? "text-white shadow-2xl hover:brightness-110"
    : "text-white border hover:bg-white/10";

  const styleObj = variant === "primary" ? {
    background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
    boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
  } : {
    borderColor: "var(--ghost-btn-border)",
    backgroundColor: "transparent",
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`${baseStyles} ${sizeStyles} ${variantStyles}`}
      style={styleObj}
    >
      {children}
      {icon && <span className="flex items-center justify-center">{icon}</span>}
    </motion.button>
  );
}
