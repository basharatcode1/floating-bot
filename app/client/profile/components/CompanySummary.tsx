"use client";

import { FileText } from "lucide-react";
import { Textarea } from "@/app/components/ui/textarea";

export default function CompanySummary({ isEditing }: { isEditing?: boolean }) {
  return (
    <div
      className="profile-section profile-full-width"
      id="company-summary-section"
    >
      <div className="profile-section-title">
        <span className="profile-section-title-icon">
          <FileText size={18} />
        </span>
        Company Summary
      </div>
      {isEditing ? (
        <Textarea
          defaultValue="TechCorp India is a mid-size technology company specializing in enterprise SaaS solutions. With over 300 employees and a strong engineering culture, they consistently hire senior developers and architects. Average hiring cycle: 3-4 weeks. Primary tech stack: React, Node.js, AWS. Known for competitive compensation and excellent work culture.
          "
          placeholder="Enter company summary..."
          className="rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs p-3 focus-visible:ring-1 focus-visible:ring-sky-500/60 w-full min-h-[120px]"
        />
      ) : (
        <p className="profile-summary-text">
          TechCorp India is a mid-size technology company specializing in
          enterprise SaaS solutions. With over 300 employees and a strong
          engineering culture, they consistently hire senior developers and
          architects. Average hiring cycle: 3-4 weeks. Primary tech stack:
          React, Node.js, AWS. Known for competitive compensation and excellent
          work culture.
        </p>
      )}
    </div>
  );
}
