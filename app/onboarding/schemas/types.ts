export type RegistrationType = "client" | "vendor";

export interface StepConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SelectableCardOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SocialPlatformConfig {
  id: string;
  label: string;
  placeholder: string;
  icon: string;
  baseUrl: string;
  color: string;
}

export interface AutoSaveState {
  status: "idle" | "saving" | "saved" | "error";
  lastSavedAt: Date | null;
}

export interface CompanyVerificationResult {
  status: "idle" | "loading" | "success" | "error";
  data?: {
    companyName: string;
    headquarters: string;
    foundedYear: string;
    aboutCompany: string;
  };
}

export type ToastType = "success" | "error" | "warning" | "info" | "default";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}
