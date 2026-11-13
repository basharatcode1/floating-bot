"use client";

import { useToast, toast, Toaster, ToastData } from "@/app/components/ui/toaster";
import type { ToastMessage, ToastType } from "@/app/onboarding/schemas/types";

export { useToast, toast, Toaster };
export type { ToastMessage, ToastType };

interface ToastContainerProps {
  toasts?: (ToastMessage | ToastData | any)[];
  onRemove?: (id: string) => void;
}

/**
 * ToastContainer is maintained for backwards compatibility.
 * Since the global <Toaster /> is mounted at root in app/layout.tsx,
 * local ToastContainer returns null to prevent duplicate rendering.
 */
export function ToastContainer(_props: ToastContainerProps) {
  return null;
}
