"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Building2, MapPin, Calendar, FileText, Loader2 } from "lucide-react";
import type { CompanyVerificationResult } from "@/app/onboarding/schemas/types";

interface CompanyVerificationCardProps {
  verification: CompanyVerificationResult;
  onEditField?: (field: string, value: string) => void;
}

export function CompanyVerificationCard({
  verification,
}: CompanyVerificationCardProps) {
  const { status, data } = verification;

  if (status === "idle") return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 12, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -8, height: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        {/* Loading State */}
        {status === "loading" && (
          <div className="rounded-xl border border-[var(--ob-border)] bg-[var(--ob-bg-alt)] p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Loader2 className="w-5 h-5 text-[var(--ob-primary)] animate-spin" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--ob-text)]">
                  Verifying company details…
                </p>
                <p className="text-xs text-[var(--ob-text-muted)] mt-0.5">
                  This may take a few seconds
                </p>
              </div>
            </div>

            {/* Skeleton fields */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="ob-skeleton h-3 w-20" />
                  <div className="ob-skeleton h-8 w-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success State */}
        {status === "success" && data && (
          <div className="rounded-xl border border-[var(--ob-success)]/30 bg-[var(--ob-success-light)] p-6">
            {/* Badge */}
            <motion.div
              className="flex items-center gap-2 mb-5"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--ob-success)]/15 border border-[var(--ob-success)]/25">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--ob-success)]" />
                <span className="text-xs font-semibold text-[var(--ob-success)]">
                  Company Verified
                </span>
              </div>
              <span className="text-xs text-[var(--ob-text-muted)]">
                Auto-filled • Editable
              </span>
            </motion.div>

            {/* Auto-filled fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                className="space-y-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="flex items-center gap-1.5 text-xs text-[var(--ob-text-muted)]">
                  <Building2 className="w-3 h-3" />
                  Company Name
                </div>
                <p className="text-sm font-medium text-[var(--ob-text)]">{data.companyName}</p>
              </motion.div>

              <motion.div
                className="space-y-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-1.5 text-xs text-[var(--ob-text-muted)]">
                  <MapPin className="w-3 h-3" />
                  Headquarters
                </div>
                <p className="text-sm font-medium text-[var(--ob-text)]">{data.headquarters}</p>
              </motion.div>

              <motion.div
                className="space-y-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="flex items-center gap-1.5 text-xs text-[var(--ob-text-muted)]">
                  <Calendar className="w-3 h-3" />
                  Founded Year
                </div>
                <p className="text-sm font-medium text-[var(--ob-text)]">{data.foundedYear}</p>
              </motion.div>

              <motion.div
                className="space-y-1 sm:col-span-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-1.5 text-xs text-[var(--ob-text-muted)]">
                  <FileText className="w-3 h-3" />
                  About Company
                </div>
                <p className="text-sm text-[var(--ob-text-secondary)] leading-relaxed line-clamp-3">
                  {data.aboutCompany}
                </p>
              </motion.div>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="rounded-xl border border-[var(--ob-warning)]/30 bg-[var(--ob-warning-light)] p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--ob-warning)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[var(--ob-text)]">
                  Unable to verify company
                </p>
                <p className="text-xs text-[var(--ob-text-muted)] mt-1">
                  We couldn&apos;t find matching records. Please fill in the details manually below.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
