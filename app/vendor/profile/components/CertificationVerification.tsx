"use client";

import { useRef, useState } from "react";
import {
  ShieldCheck,
  Upload,
  Check,
  Pencil,
  Clock,
  AlertTriangle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { ConfirmationDialog } from "@/app/components/ui/confirmation-dialog";
import { useVendorDashboardTheme } from "../../dashboard/VendorDashboardThemeContext";
import { Button } from "@/app/components/ui/button";

export type CertStatus = "verified" | "review" | "missing";

export const certificates: {
  name: string;
  date: string;
  status: CertStatus;
  statusLabel: string;
}[] = [
  {
    name: "ISO 9001 Certificate",
    date: "Uploaded: Mar 10, 2024",
    status: "verified",
    statusLabel: "Verified",
  },
  {
    name: "MSME Registration",
    date: "Uploaded: Feb 5, 2024",
    status: "verified",
    statusLabel: "Verified",
  },
  {
    name: "GST Certificate",
    date: "Uploaded: Mar 15, 2024",
    status: "review",
    statusLabel: "Under Review",
  },
  {
    name: "PAN Verification",
    date: "Uploaded: --",
    status: "missing",
    statusLabel: "Missing Documents",
  },
];

export const statusIcon: Record<CertStatus, React.ReactNode> = {
  verified: <Check size={12} />,
  review: <Clock size={12} />,
  missing: <AlertTriangle size={12} />,
};

export default function CertificationVerification() {
  const { mode } = useVendorDashboardTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [certList, setCertList] = useState(certificates);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log("Selected file:", files[0].name);
      // Logic for upload can be integrated here
    }
  };

  const handleDeleteClick = (name: string) => {
    setCertToDelete(name);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (certToDelete) {
      setCertList((prev) => prev.filter((c) => c.name !== certToDelete));
      setCertToDelete(null);
    }
  };

  return (
    <div
      className="profile-section profile-full-width"
      id="certification-section"
    >
      {/* Header */}
      <div className="profile-cert-header">
        <div className="profile-section-title" style={{ marginBottom: 0 }}>
          <span className="profile-section-title-icon">
            <ShieldCheck size={18} />
          </span>
          Certification Verification
        </div>
      </div>

      {/* Stepper */}
      <div className="profile-stepper">
        <div className="profile-step profile-step--done">
          <span className="profile-step-icon">
            <Check size={14} />
          </span>
          <span className="profile-step-label">Documents Uploaded</span>
        </div>
        <div className="profile-step-connector profile-step-connector--done" />
        <div className="profile-step profile-step--active">
          <span className="profile-step-icon">
            <Pencil size={14} />
          </span>
          <span className="profile-step-label">Review in Progress</span>
        </div>
        <div className="profile-step-connector profile-step-connector--active" />
        <div className="profile-step profile-step--pending">
          <span className="profile-step-icon">
            <Clock size={14} />
          </span>
          <span className="profile-step-label">Approved / Rejected</span>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className="profile-upload-zone"
        onClick={() => fileInputRef.current?.click()}
        style={{ cursor: "pointer" }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <div className="profile-upload-icon">
          <Upload size={24} />
        </div>
        <div className="profile-upload-text">
          Click to upload or drag &amp; drop certificate
        </div>
        <div className="profile-upload-hint">PDF, DOC, JPG, PNG</div>
      </div>

      {/* Certificate List */}
      <div>
        {certList.map((cert) => (
          <div className="profile-cert-item" key={cert.name}>
            <div className="profile-cert-info">
              <span className="profile-cert-name">{cert.name}</span>
              <span className="profile-cert-date">{cert.date}</span>
            </div>
            <div className="profile-cert-actions">
              <span
                className={`profile-cert-status profile-cert-status--${cert.status}`}
              >
                {statusIcon[cert.status]}
                {cert.statusLabel}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="profile-cert-icon-btn h-[30px] w-[30px] p-0 rounded-lg"
                aria-label="Refresh"
              >
                <RefreshCw size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="profile-cert-icon-btn h-[30px] w-[30px] p-0 rounded-lg"
                aria-label="Delete"
                onClick={() => handleDeleteClick(cert.name)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Certification"
        description={
          certToDelete
            ? `Are you sure you want to delete "${certToDelete}"? This action cannot be undone.`
            : "Are you sure you want to delete this certification? This action cannot be undone."
        }
        confirmText="Delete"
        variant="destructive"
        theme={mode as "light" | "dark"}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
