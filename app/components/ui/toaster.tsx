"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useToast, toast, ToastData, ToastType } from "./toast";

export { toast, useToast };
export type { ToastData, ToastType };

interface ToasterProps {
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  richColors?: boolean; // backwards compatibility with sonner props
  closeButton?: boolean; // backwards compatibility with sonner props
}

const ICON_MAP: Record<ToastType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  default: Info,
};

const COLOR_MAP: Record<
  ToastType,
  { bg: string; border: string; icon: string; bar: string }
> = {
  success: {
    bg: "bg-white",
    border: "border-emerald-200",
    icon: "text-emerald-500",
    bar: "bg-emerald-500",
  },
  error: {
    bg: "bg-white",
    border: "border-rose-200",
    icon: "text-rose-500",
    bar: "bg-rose-500",
  },
  warning: {
    bg: "bg-white",
    border: "border-amber-200",
    icon: "text-amber-500",
    bar: "bg-amber-500",
  },
  info: {
    bg: "bg-white",
    border: "border-indigo-200",
    icon: "text-indigo-500",
    bar: "bg-indigo-500",
  },
  default: {
    bg: "bg-white",
    border: "border-slate-200",
    icon: "text-slate-600",
    bar: "bg-indigo-600",
  },
};

const POSITION_CLASSES: Record<NonNullable<ToasterProps["position"]>, string> = {
  "top-right": "top-6 right-6 items-end",
  "top-left": "top-6 left-6 items-start",
  "bottom-right": "bottom-6 right-6 items-end",
  "bottom-left": "bottom-6 left-6 items-start",
  "top-center": "top-6 left-1/2 -translate-x-1/2 items-center",
  "bottom-center": "bottom-6 left-1/2 -translate-x-1/2 items-center",
};

export function Toaster({ position = "top-right" }: ToasterProps) {
  const { toasts, removeToast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const positionClass = POSITION_CLASSES[position] || POSITION_CLASSES["top-right"];

  return createPortal(
    <div
      className={`fixed ${positionClass} z-[99999] flex flex-col gap-2 max-w-[320px] sm:max-w-[340px] w-full pointer-events-none px-3 sm:px-0`}
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((item) => (
          <ToastItem key={item.id} toast={item} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

function ToastItem({
  toast: item,
  onRemove,
}: {
  toast: ToastData;
  onRemove: (id: string) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);
  const duration = item.duration || 4000;

  const handleRemove = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onRemove(item.id), 200);
  }, [onRemove, item.id]);

  useEffect(() => {
    const timer = setTimeout(handleRemove, duration);
    return () => clearTimeout(timer);
  }, [duration, handleRemove]);

  const Icon = ICON_MAP[item.type] || ICON_MAP.default;
  const colors = COLOR_MAP[item.type] || COLOR_MAP.default;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={
        isExiting
          ? { opacity: 0, y: -20, scale: 0.95 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`
        pointer-events-auto relative overflow-hidden rounded-xl border ${colors.border} ${colors.bg}
        shadow-lg shadow-slate-900/10
        px-3.5 py-2.5 w-full text-slate-900
      `}
      role="alert"
    >
      <div className={`flex ${item.message ? "items-start" : "items-center"} gap-2`}>
        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${colors.icon} ${item.message ? "mt-0.5" : ""}`} />
        <div className="flex-1 min-w-0 pr-1">
          {item.title && (
            <p className="text-[12px] font-semibold text-slate-900 tracking-normal leading-snug">
              {item.title}
            </p>
          )}
          {item.message && (
            <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
              {item.message}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0 p-1 -mr-1 rounded-lg hover:bg-slate-100"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100">
        <motion.div
          className={`h-full ${colors.bar}`}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

export default Toaster;
