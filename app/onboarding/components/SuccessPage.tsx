"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";

interface SuccessPageProps {
  type: "client" | "vendor";
  companyName?: string;
}

/* Confetti particle data */
interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
  isRound: boolean;
  x2: number;
  x3: number;
}

const CONFETTI_COLORS = [
  "#2563EB",
  "#3B82F6",
  "#60A5FA",
  "#10B981",
  "#34D399",
  "#F59E0B",
  "#FBBF24",
  "#EF4444",
  "#F87171",
  "#8B5CF6",
  "#A78BFA",
  "#EC4899",
  "#F472B6",
];

export function SuccessPage({ type, companyName }: SuccessPageProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);

    const stateTimer = setTimeout(() => {
      setConfettiPieces(
        Array.from({ length: 50 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 0.8,
          duration: 2 + Math.random() * 2,
          color:
            CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          size: 4 + Math.random() * 8,
          rotation: Math.random() * 360,
          isRound: Math.random() > 0.5,
          x2: (Math.random() - 0.5) * 80,
          x3: (Math.random() - 0.5) * 120,
        })),
      );
    }, 0);

    return () => {
      clearTimeout(timer);
      clearTimeout(stateTimer);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] text-center px-4 overflow-hidden">
      {/* Confetti */}
      {showConfetti &&
        confettiPieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute top-0 pointer-events-none"
            style={{
              left: `${piece.x}%`,
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: piece.isRound ? "50%" : "2px",
            }}
            initial={{
              y: -20,
              rotate: piece.rotation,
              opacity: 1,
            }}
            animate={{
              y: "100vh",
              rotate: piece.rotation + 720,
              opacity: [1, 1, 0],
              x: [0, piece.x2, piece.x3],
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: "easeOut",
            }}
          />
        ))}

      {/* Success checkmark */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
      >
        {/* Pulse rings */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[var(--ob-success)]/20"
          animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
          transition={{
            duration: 1.5,
            repeat: 2,
            repeatDelay: 0.5,
            delay: 0.4,
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-[var(--ob-success)]/15"
          animate={{ scale: [1, 2], opacity: [0.4, 0] }}
          transition={{
            duration: 1.5,
            repeat: 2,
            repeatDelay: 0.5,
            delay: 0.6,
          }}
        />

        <div className="w-20 h-20 rounded-full bg-[var(--ob-success)] flex items-center justify-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.5,
            }}
          >
            <CheckCircle className="w-10 h-10 text-white" strokeWidth={2} />
          </motion.div>
        </div>
      </motion.div>

      {/* Text */}
      <motion.h2
        className="text-2xl sm:text-3xl font-bold text-[var(--ob-text)] mb-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        Registration Submitted!
      </motion.h2>

      <motion.p
        className="text-[var(--ob-text-muted)] text-sm sm:text-base max-w-md leading-relaxed mb-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95 }}
      >
        {companyName ? (
          <>
            <span className="font-semibold text-[var(--ob-text)]">
              {companyName}
            </span>{" "}
            has been successfully registered as a{" "}
            {type === "client" ? "Client" : "Vendor"}.
          </>
        ) : (
          <>
            Your {type === "client" ? "client" : "vendor"} registration has been
            successfully submitted.
          </>
        )}
      </motion.p>

      <motion.p
        className="text-[var(--ob-text-muted)] text-xs sm:text-sm max-w-md mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        Our team will review your application and get back to you within 24–48
        hours.
      </motion.p>

      {/* CTAs */}
      <motion.div
        className="flex items-center justify-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.25 }}
      >
        <Button
          disabled={isNavigating}
          onClick={() => {
            setIsNavigating(true);
            router.push(type === "client" ? "/client/dashboard" : "/vendor/subscription");
          }}
          className="h-11 px-6 rounded-xl bg-[var(--ob-primary)] text-white hover:bg-[var(--ob-primary-hover)] text-sm font-semibold whitespace-nowrap shadow-[0_1px_3px_rgba(37,99,235,0.3)] flex items-center justify-center gap-1"
        >
          {isNavigating ? (
            <>
              <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Going to {type === "client" ? "Dashboard" : "Subscription"}...
            </>
          ) : (
            <>
              Go to {type === "client" ? "Dashboard" : "Subscription"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
