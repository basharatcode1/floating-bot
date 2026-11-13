"use client";

import React, { useSyncExternalStore } from "react";

export type ToastType = "success" | "error" | "warning" | "info" | "default";

export interface ToastData {
  id: string;
  type: ToastType;
  title: React.ReactNode;
  message?: React.ReactNode;
  description?: React.ReactNode;
  duration?: number;
}

export type ToastInputOptions = {
  description?: React.ReactNode;
  message?: React.ReactNode;
  duration?: number;
  type?: ToastType;
  title?: React.ReactNode;
};

type Listener = () => void;
let memoryToasts: ToastData[] = [];
const listeners: Set<Listener> = new Set();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export const toastStore = {
  getToasts(): ToastData[] {
    return memoryToasts;
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  add(input: Partial<ToastData> & { title?: React.ReactNode; message?: React.ReactNode }): string {
    const id = input.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastData = {
      id,
      type: input.type || "default",
      title: input.title ?? (input.message || ""),
      message: input.message || input.description,
      description: input.description || input.message,
      duration: input.duration ?? 4000,
    };

    memoryToasts = [...memoryToasts, newToast];
    emitChange();
    return id;
  },
  remove(id: string) {
    memoryToasts = memoryToasts.filter((t) => t.id !== id);
    emitChange();
  },
  clear() {
    memoryToasts = [];
    emitChange();
  },
};

function parseArgs(
  defaultType: ToastType,
  titleOrOptions: React.ReactNode | (Partial<ToastData> & ToastInputOptions),
  options?: ToastInputOptions | string
): Partial<ToastData> {
  // If first argument is an object config (and not a React node like JSX element / string / number)
  if (
    typeof titleOrOptions === "object" &&
    titleOrOptions !== null &&
    !("$$typeof" in (titleOrOptions as any))
  ) {
    const obj = titleOrOptions as Partial<ToastData> & ToastInputOptions;
    return {
      type: obj.type || defaultType,
      title: obj.title || (obj.message ? "" : obj.title),
      message: obj.message || obj.description,
      duration: obj.duration,
    };
  }

  let message: React.ReactNode = undefined;
  let duration: number | undefined = undefined;

  if (typeof options === "string") {
    message = options;
  } else if (options && typeof options === "object") {
    message = options.message || options.description;
    duration = options.duration;
  }

  return {
    type: defaultType,
    title: titleOrOptions as React.ReactNode,
    message,
    duration,
  };
}

export function toast(
  titleOrOptions: React.ReactNode | (Partial<ToastData> & ToastInputOptions),
  options?: ToastInputOptions | string
) {
  return toastStore.add(parseArgs("default", titleOrOptions, options));
}

toast.success = (
  titleOrOptions: React.ReactNode | (Partial<ToastData> & ToastInputOptions),
  options?: ToastInputOptions | string
) => {
  return toastStore.add(parseArgs("success", titleOrOptions, options));
};

toast.error = (
  titleOrOptions: React.ReactNode | (Partial<ToastData> & ToastInputOptions),
  options?: ToastInputOptions | string
) => {
  return toastStore.add(parseArgs("error", titleOrOptions, options));
};

toast.warning = (
  titleOrOptions: React.ReactNode | (Partial<ToastData> & ToastInputOptions),
  options?: ToastInputOptions | string
) => {
  return toastStore.add(parseArgs("warning", titleOrOptions, options));
};

toast.info = (
  titleOrOptions: React.ReactNode | (Partial<ToastData> & ToastInputOptions),
  options?: ToastInputOptions | string
) => {
  return toastStore.add(parseArgs("info", titleOrOptions, options));
};

toast.dismiss = (id?: string) => {
  if (id) {
    toastStore.remove(id);
  } else {
    toastStore.clear();
  }
};

toast.clear = () => {
  toastStore.clear();
};

const EMPTY_TOASTS: ToastData[] = [];
function getServerSnapshot(): ToastData[] {
  return EMPTY_TOASTS;
}

export function useToast() {
  const toasts = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getToasts,
    getServerSnapshot
  );

  return {
    toasts,
    toast,
    addToast: (t: Partial<ToastData>) => toastStore.add(t),
    removeToast: (id: string) => toastStore.remove(id),
    dismiss: (id?: string) => toast.dismiss(id),
  };
}
