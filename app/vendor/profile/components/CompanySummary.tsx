"use client";

import { FileText } from "lucide-react";
import { Textarea } from "@/app/components/ui/textarea";

export default function CompanySummary({ isEditing }: { isEditing?: boolean }) {
  return (
    <div className="profile-section profile-full-width" id="company-summary-section">
      <div className="profile-section-title">
        <span className="profile-section-title-icon">
          <FileText size={18} />
        </span>
        Company Summary
      </div>
      {isEditing ? (
        <Textarea 
          defaultValue="TechHire Solutions is a growing IT staffing firm specializing in placing mid to senior-level tech talent. Strong in React, Java, and DevOps placements. 92% success rate with an average response time of 2.3 days. Trusted by 15+ enterprise clients across India and Southeast Asia."
          placeholder="Enter company summary..."
          className="rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs p-3 focus-visible:ring-1 focus-visible:ring-sky-500/60 w-full min-h-[120px]"
        />
      ) : (
        <p className="profile-summary-text" style={{ color: "var(--dash-text-secondary)", lineHeight: 1.6 }}>
          TechHire Solutions is a growing IT staffing firm specializing in placing mid to senior-level tech talent. Strong in React, Java, and DevOps placements. 92% success rate with an average response time of 2.3 days. Trusted by 15+ enterprise clients across India and Southeast Asia.
        </p>
      )}
    </div>
  );
}
