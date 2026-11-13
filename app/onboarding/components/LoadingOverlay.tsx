"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import styles from "./Loader.module.css";

interface LoadingOverlayProps {
  message?: string;
  loaderText?: string;
  hideBorder?: boolean;
  variant?: "default" | "light" | "auto";
}

export function LoadingOverlay({
  message = "Submitting your registration…",
  loaderText = "Fetching",
  hideBorder = false,
  variant = "auto",
}: LoadingOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateTheme = () => {
      if (typeof document !== "undefined") {
        const theme = document.documentElement.getAttribute(
          "data-dashboard-theme",
        );
        const hasLightClass =
          document.documentElement.classList.contains("light") ||
          document.body.classList.contains("light");
        setIsLight(theme === "light" || hasLightClass);
      }
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-dashboard-theme", "class"],
      });
    }

    return () => observer.disconnect();
  }, []);

  const effectiveVariant =
    variant === "auto" ? (isLight ? "light" : "default") : variant;
  const isLightMode = effectiveVariant === "light";

  const letters = loaderText.split("");

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden backdrop-blur-md transition-colors duration-300 ${
        isLightMode ? "bg-slate-900/35" : "bg-slate-950/80"
      }`}
      aria-live="polite"
      role="status"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={`flex flex-col items-center justify-center gap-2 px-8 py-8 sm:px-12 sm:py-10 w-full max-w-[480px] text-center relative z-10 transition-all duration-300 bg-transparent shadow-none border-none ${
          isLightMode ? "text-slate-900" : "text-white"
        }`}
      >
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
          <div className={styles.loader}>
            <p>{loaderText}</p>
            <div className={styles.words}>
              <span className={styles.word}>Data</span>
              <span className={styles.word}>Info</span>
              <span className={styles.word}>Records</span>
              <span className={styles.word}>Details</span>
              <span className={styles.word}>Data</span>
            </div>
          </div>
        </div>

        <p
          className={`text-sm sm:text-base font-semibold leading-relaxed max-w-[320px] ${
            isLightMode ? "text-slate-800" : "text-white"
          }`}
        >
          {message}
        </p>
      </motion.div>
    </motion.div>
  );

  if (!mounted) return null;

  return createPortal(content, document.body);
}
