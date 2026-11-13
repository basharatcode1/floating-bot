"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

type ActiveModal = "login" | "signup" | "onboarding" | null;

interface AuthModalContextValue {
  activeModal: ActiveModal;
  openLogin: () => void;
  openSignup: () => void;
  openOnboarding: () => void;
  closeAuth: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem("staffsync-active-modal") as ActiveModal;
      if (saved) {
        setActiveModal(saved);
      }
    } catch (e) {}
  }, []);

  const openLogin = useCallback(() => {
    setActiveModal("login");
    sessionStorage.setItem("staffsync-active-modal", "login");
  }, []);

  const openSignup = useCallback(() => {
    setActiveModal("signup");
    sessionStorage.setItem("staffsync-active-modal", "signup");
  }, []);

  const openOnboarding = useCallback(() => {
    setActiveModal("onboarding");
    sessionStorage.setItem("staffsync-active-modal", "onboarding");
  }, []);

  const closeAuth = useCallback(() => {
    setActiveModal(null);
    sessionStorage.removeItem("staffsync-active-modal");
  }, []);

  const value = useMemo(
    () => ({
      activeModal,
      openLogin,
      openSignup,
      openOnboarding,
      closeAuth,
    }),
    [activeModal, openLogin, openSignup, openOnboarding, closeAuth]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
