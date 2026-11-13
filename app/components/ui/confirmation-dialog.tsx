"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive" | "success" | "info";
  isLoading?: boolean;
  theme?: "light" | "dark";
}

export function ConfirmationDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  isLoading = false,
  theme,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onOpenChange(false);
  };

  // Determine styles and icon based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          icon: <AlertCircle className="w-8 h-8 text-red-500" />,
          iconBg: "bg-red-500/10",
          buttonClass: "bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/20",
          gradient: "from-red-500/10",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-500" />,
          iconBg: "bg-emerald-500/10",
          buttonClass: "bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/20",
          gradient: "from-emerald-500/10",
        };
      case "info":
        return {
          icon: <Info className="w-8 h-8 text-blue-500" />,
          iconBg: "bg-blue-500/10",
          buttonClass: "bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-lg shadow-blue-500/20",
          gradient: "from-blue-500/10",
        };
      default:
        return {
          icon: <Info className="w-8 h-8 text-indigo-500" />,
          iconBg: "bg-indigo-500/10",
          buttonClass: "bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg shadow-indigo-600/20",
          gradient: "from-indigo-500/10",
        };
    }
  };

  const styles = getVariantStyles();

  const customStyle =
    theme === "dark"
      ? ({
          "--dash-card-bg-solid": "#0E1524",
          "--dash-card-border": "rgba(255, 255, 255, 0.1)",
          "--dash-text-primary": "#FFFFFF",
          "--dash-text-secondary": "#CBD5E1",
          "--dash-card-hover": "rgba(255, 255, 255, 0.05)",
          colorScheme: "dark",
        } as React.CSSProperties)
      : theme === "light"
        ? ({
            "--dash-card-bg-solid": "#FFFFFF",
            "--dash-card-border": "#E2E8F0",
            "--dash-text-primary": "#0F172A",
            "--dash-text-secondary": "#475569",
            "--dash-card-hover": "rgba(0, 0, 0, 0.04)",
            colorScheme: "light",
          } as React.CSSProperties)
        : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        data-lenis-prevent
        style={customStyle}
        className="sm:max-w-[400px] md:max-w-[400px] p-0 border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-[var(--dash-text-primary)] rounded-xl shadow-2xl overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} to-transparent opacity-50 pointer-events-none`} />
        
        <div className="relative p-6 sm:p-8">
          <DialogHeader className="flex flex-col items-center text-center sm:text-center space-y-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${styles.iconBg} mb-2 ring-8 ring-[var(--dash-card-bg-solid)]`}>
              {styles.icon}
            </div>
            
            <div className="space-y-2">
              <DialogTitle className="text-xl font-bold tracking-tight">
                {title}
              </DialogTitle>
              <DialogDescription className="text-[var(--dash-text-secondary)] text-sm leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-center">
            <Button
              onClick={handleCancel}
              disabled={isLoading}
              variant="ghost"
              className="w-full sm:w-auto min-w-[130px] rounded-lg border border-[var(--dash-card-border)] bg-transparent hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-primary)] transition-colors h-11 font-medium"
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`w-full sm:w-auto min-w-[130px] rounded-lg transition-all h-11 font-medium ${styles.buttonClass}`}
            >
              {isLoading ? "Processing..." : confirmText}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
