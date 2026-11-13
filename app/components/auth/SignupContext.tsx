"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";

export interface SignupState {
  accountType: "client" | "vendor" | null;
  email: string;
  companyName: string;
  companyWebsite: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  sessionId: string | null;
}

interface SignupContextValue extends SignupState {
  setAccountType: (type: "client" | "vendor") => void;
  setEmail: (email: string) => void;
  setCompanyName: (companyName: string) => void;
  setCompanyWebsite: (companyWebsite: string) => void;
  setEmailVerified: (verified: boolean) => void;
  setPhoneVerified: (verified: boolean) => void;
  setSessionId: (sessionId: string) => void;
  reset: () => void;
}

const defaultState: SignupState = {
  accountType: null,
  email: "",
  companyName: "",
  companyWebsite: "",
  isEmailVerified: false,
  isPhoneVerified: false,
  sessionId: null,
};

const SignupContext = createContext<SignupContextValue | null>(null);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SignupState>(defaultState);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("staffsync-signup-state");
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const setAccountType = useCallback(
    (type: "client" | "vendor") =>
      setState((prev) => {
        const next = { ...prev, accountType: type };
        sessionStorage.setItem("staffsync-signup-state", JSON.stringify(next));
        return next;
      }),
    [],
  );

  const setEmail = useCallback(
    (email: string) =>
      setState((prev) => {
        const next = { ...prev, email };
        sessionStorage.setItem("staffsync-signup-state", JSON.stringify(next));
        return next;
      }),
    [],
  );

  const setCompanyName = useCallback(
    (companyName: string) =>
      setState((prev) => {
        const next = { ...prev, companyName };
        sessionStorage.setItem("staffsync-signup-state", JSON.stringify(next));
        return next;
      }),
    [],
  );

  const setCompanyWebsite = useCallback(
    (companyWebsite: string) =>
      setState((prev) => {
        const next = { ...prev, companyWebsite };
        sessionStorage.setItem("staffsync-signup-state", JSON.stringify(next));
        return next;
      }),
    [],
  );

  const setEmailVerified = useCallback(
    (verified: boolean) =>
      setState((prev) => {
        const next = { ...prev, isEmailVerified: verified };
        sessionStorage.setItem("staffsync-signup-state", JSON.stringify(next));
        return next;
      }),
    [],
  );

  const setPhoneVerified = useCallback(
    (verified: boolean) =>
      setState((prev) => {
        const next = { ...prev, isPhoneVerified: verified };
        sessionStorage.setItem("staffsync-signup-state", JSON.stringify(next));
        return next;
      }),
    [],
  );

  const setSessionId = useCallback(
    (sessionId: string) =>
      setState((prev) => {
        const next = { ...prev, sessionId };
        sessionStorage.setItem("staffsync-signup-state", JSON.stringify(next));
        return next;
      }),
    [],
  );

  const reset = useCallback(() => {
    setState(defaultState);
    sessionStorage.removeItem("staffsync-signup-state");
  }, []);

  const value = useMemo<SignupContextValue>(
    () => ({
      ...state,
      setAccountType,
      setEmail,
      setCompanyName,
      setCompanyWebsite,
      setEmailVerified,
      setPhoneVerified,
      setSessionId,
      reset,
    }),
    [
      state,
      setAccountType,
      setEmail,
      setCompanyName,
      setCompanyWebsite,
      setEmailVerified,
      setPhoneVerified,
      setSessionId,
      reset,
    ],
  );

  return (
    <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
  );
}

export function useSignup(): SignupContextValue {
  const ctx = useContext(SignupContext);
  if (!ctx) {
    throw new Error("useSignup must be used within a <SignupProvider>");
  }
  return ctx;
}
