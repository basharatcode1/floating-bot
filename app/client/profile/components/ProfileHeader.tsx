import { useState } from "react";
import {
  User,
  ShieldCheck,
  Mail,
  Globe,
  Camera,
  Pencil,
  Users,
  Building2,
  Award,
  Star,
  StarHalf,
  FileCheck,
  Upload,
  Check,
  RefreshCw,
  Trash2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { useToast, ToastContainer } from "@/app/onboarding/components/Toast";

interface ProfileHeaderProps {
  isEditing?: boolean;
  onEditClick?: () => void;
  type?: "client" | "vendor";
}

const renderStars = (rating: number, size: number = 9) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const remainder = rating - fullStars;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star
          key={i}
          size={size}
          fill="currentColor"
          className="text-yellow-400"
        />,
      );
    } else if (i === fullStars + 1 && remainder >= 0.25) {
      if (remainder >= 0.75) {
        stars.push(
          <Star
            key={i}
            size={size}
            fill="currentColor"
            className="text-yellow-400"
          />,
        );
      } else {
        stars.push(
          <StarHalf
            key={i}
            size={size}
            fill="currentColor"
            className="text-yellow-400"
          />,
        );
      }
    } else {
      stars.push(
        <Star
          key={i}
          size={size}
          fill="currentColor"
          style={{ color: "var(--dash-divider)" }}
        />,
      );
    }
  }
  return stars;
};

export default function ProfileHeader({
  isEditing,
  onEditClick,
  type = "client",
}: ProfileHeaderProps) {
  const [customCertName, setCustomCertName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { toasts, addToast, removeToast } = useToast();

  const isVendor = type === "vendor";
  const name = isVendor ? "Sarah Wilson" : "John Smith";
  const role = isVendor ? "CEO at TechHire Solutions" : "CTO at TechCorp India";
  const email = isVendor ? "sarah@techhire.in" : "john@techcorp.in";
  const website = isVendor
    ? "https://www.techhire.in"
    : "https://www.techcorp.in";

  return (
    <div
      className="rounded-[16px] border border-[var(--dash-card-border)] overflow-hidden mb-6 shadow-sm"
      style={{
        background: "var(--dash-header-bg)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      {/* Top Half - Profile Info with Gradient Background */}
      <div
        className="relative py-3 px-5 sm:py-4 sm:px-6"
        style={{
          background:
            "linear-gradient(120deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
        }}
      >
        {/* Abstract subtle background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 100% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 40%), radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 30%)",
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center text-white p-[3px] bg-[var(--dash-card-bg)] shadow-sm border border-[var(--dash-card-border)]">
              <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                <User size={36} />
              </div>
            </div>
            <button className="absolute bottom-1 right-1 w-7 h-7 bg-[var(--dash-card-bg)] rounded-full flex items-center justify-center shadow-md border border-[var(--dash-card-border)] text-[var(--dash-text-muted)] hover:text-[var(--dash-badge-text)] transition-colors">
              <Camera size={13} />
            </button>
          </div>

          {/* Info */}
          {isEditing ? (
            <div className="flex-1 flex flex-col gap-3 w-full max-w-[400px]">
              <Input
                defaultValue={name}
                placeholder="Enter name"
                className="h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 focus-visible:ring-1 focus-visible:ring-sky-500/60"
              />
              <Input
                defaultValue={role}
                placeholder="Enter role"
                className="h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 focus-visible:ring-1 focus-visible:ring-sky-500/60"
              />
            </div>
          ) : (
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-1">
                <h1 className="profile-text-name text-[var(--dash-text-primary)]">
                  {name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--dash-success-bg)] text-[var(--dash-success-text)] text-[11px] font-semibold">
                  <ShieldCheck size={12} />
                  Verified
                </span>
                <button
                  type="button"
                  onClick={onEditClick}
                  className="text-[var(--dash-text-muted)] hover:text-indigo-500 transition-colors ml-1 cursor-pointer"
                  title="Edit Profile"
                >
                  <Pencil size={14} />
                </button>
              </div>
              <div className="text-[11px] text-[var(--dash-text-secondary)] mb-1 font-medium">
                {role}
              </div>
              <div className="flex flex-col gap-1.5 text-[13px] text-[var(--dash-text-muted)] font-medium">
                <div className="flex items-center gap-1.5">
                  <Globe size={14} className="text-[var(--dash-text-muted)]" />
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-kv-link"
                  >
                    {website.replace("https://", "")}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Reviews & Ratings in Header */}
          <div className="shrink-0 sm:ml-auto w-full sm:w-auto mt-4 sm:mt-0">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Glassdoor Card */}
              <div className="group relative overflow-hidden bg-white dark:bg-white/5 border border-[var(--dash-card-border)] hover:border-emerald-500/30 p-2.5 rounded-xl flex items-center justify-between gap-4 min-w-[160px] transition-all duration-300">
                <div className="space-y-0.5">
                  <span className="font-bold text-[11px] text-slate-900 dark:text-[var(--dash-text-primary)] flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center shrink-0 p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/glassdoor-icon.svg"
                        alt="Glassdoor"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    Glassdoor
                  </span>
                  <span className="block text-[9px] text-slate-500 dark:text-[var(--dash-text-muted)]">
                    53,385 reviews
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                    <Star
                      size={10}
                      className="text-emerald-600 dark:text-emerald-400"
                      fill="currentColor"
                    />
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      3.5
                    </span>
                  </div>
                  <div className="flex gap-0.5">{renderStars(3.5, 9)}</div>
                </div>
              </div>

              {/* AmbitionBox Card */}
              <div className="group relative overflow-hidden bg-white dark:bg-white/5 border border-[var(--dash-card-border)] hover:border-indigo-500/30 p-2.5 rounded-xl flex items-center justify-between gap-4 min-w-[160px] transition-all duration-300">
                <div className="space-y-0.5">
                  <span className="font-bold text-[11px] text-slate-900 dark:text-[var(--dash-text-primary)] flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center shrink-0 p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/ambitionbox-icon.svg"
                        alt="AmbitionBox"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    AmbitionBox
                  </span>
                  <span className="block text-[9px] text-slate-500 dark:text-[var(--dash-text-muted)]">
                    47.6k reviews
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md">
                    <Star
                      size={10}
                      className="text-indigo-600 dark:text-indigo-400"
                      fill="currentColor"
                    />
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      3.4
                    </span>
                  </div>
                  <div className="flex gap-0.5">{renderStars(3.4, 9)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] w-full bg-[var(--dash-divider)]" />

      {/* Bottom Half - Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--dash-divider)] bg-transparent">
        {/* Stat 1: Profile Completeness */}
        <div className="p-4 flex items-center gap-4">
          <div
            className="relative shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background:
                "conic-gradient(#6366F1 85%, var(--dash-progress-track) 85%)",
            }}
          >
            <div className="w-9 h-9 bg-[var(--dash-card-bg)] rounded-full flex items-center justify-center shadow-sm">
              <span className="text-[12px] font-bold text-[var(--dash-text-primary)]">
                85%
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <span className="profile-text-stat-label text-[var(--dash-text-primary)] mb-1">
              Profile Completeness
            </span>
            <span className="text-[11px] text-[var(--dash-text-muted)] mb-2">
              Almost there! Keep it up.
            </span>
            <div className="w-full h-1 bg-[var(--dash-progress-track)] rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stat 3: Company Status */}
        <div className="p-4 flex items-center gap-4">
          <div className="shrink-0 text-indigo-500 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[11px] text-[var(--dash-text-secondary)] mb-1 font-medium">
              Company Status
            </span>
            <span className="profile-text-stat-value text-[13px] font-semibold text-[var(--dash-text-primary)] mb-1">
              Verified
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--dash-success-text)]"></div>
              <span className="text-[11px] text-[var(--dash-text-muted)]">
                Trusted Partner
              </span>
            </div>
          </div>
        </div>

        {/* Upload Verification */}
        <Dialog
          onOpenChange={(open) => {
            if (!open) {
              setCustomCertName("");
              setSelectedFile(null);
              setError(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors rounded-xl">
              <div className="shrink-0 text-indigo-500 flex items-center justify-center">
                <FileCheck size={20} />
              </div>
              <div className="flex flex-col justify-center text-left">
                <span className="text-[11px] text-[var(--dash-text-secondary)] mb-1 font-medium">
                  Certification
                </span>
                <span className="profile-text-stat-value text-[13px] font-semibold text-[var(--dash-text-primary)] mb-1 leading-tight">
                  Upload Verification
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-indigo-500 font-medium">
                    Click to upload
                  </span>
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-[var(--dash-text-primary)]">
                Upload Certification
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--dash-card-border)] bg-transparent hover:bg-[var(--dash-card-hover)] transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[var(--dash-text-primary)]">
                      ISO 9001 Certificate
                    </span>
                    <span className="text-[11px] text-[var(--dash-text-muted)] mt-0.5">
                      Uploaded: Mar 10, 2024
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--dash-success-bg)] text-[var(--dash-success-text)] text-[11px] font-semibold">
                      <Check size={13} /> Verified
                    </span>
                    <div className="flex items-center gap-3 text-[var(--dash-text-muted)]">
                      <label className="cursor-pointer hover:text-[var(--dash-text-primary)] transition-colors flex items-center">
                        <Upload size={15} />
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              addToast({
                                title: "File Uploaded",
                                message: `Successfully uploaded ${e.target.files[0].name} for ISO 9001 Certificate`,
                                type: "success",
                              });
                            }
                          }}
                        />
                      </label>
                      <button className="hover:text-[var(--dash-text-primary)] transition-colors">
                        <RefreshCw size={15} />
                      </button>
                      <button className="hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--dash-card-border)] bg-transparent hover:bg-[var(--dash-card-hover)] transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[var(--dash-text-primary)]">
                      MSME Registration
                    </span>
                    <span className="text-[11px] text-[var(--dash-text-muted)] mt-0.5">
                      Uploaded: Feb 5, 2024
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--dash-success-bg)] text-[var(--dash-success-text)] text-[11px] font-semibold">
                      <Check size={13} /> Verified
                    </span>
                    <div className="flex items-center gap-3 text-[var(--dash-text-muted)]">
                      <label className="cursor-pointer hover:text-[var(--dash-text-primary)] transition-colors flex items-center">
                        <Upload size={15} />
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              addToast({
                                title: "File Uploaded",
                                message: `Successfully uploaded ${e.target.files[0].name} for MSME Registration`,
                                type: "success",
                              });
                            }
                          }}
                        />
                      </label>
                      <button className="hover:text-[var(--dash-text-primary)] transition-colors">
                        <RefreshCw size={15} />
                      </button>
                      <button className="hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--dash-card-border)] bg-transparent hover:bg-[var(--dash-card-hover)] transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[var(--dash-text-primary)]">
                      GST Certificate
                    </span>
                    <span className="text-[11px] text-[var(--dash-text-muted)] mt-0.5">
                      Uploaded: Mar 15, 2024
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[11px] font-semibold">
                      <Clock size={13} /> Under Review
                    </span>
                    <div className="flex items-center gap-3 text-[var(--dash-text-muted)]">
                      <label className="cursor-pointer hover:text-[var(--dash-text-primary)] transition-colors flex items-center">
                        <Upload size={15} />
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              addToast({
                                title: "File Uploaded",
                                message: `Successfully uploaded ${e.target.files[0].name} for GST Certificate`,
                                type: "success",
                              });
                            }
                          }}
                        />
                      </label>
                      <button className="hover:text-[var(--dash-text-primary)] transition-colors">
                        <RefreshCw size={15} />
                      </button>
                      <button className="hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--dash-card-border)] bg-transparent hover:bg-[var(--dash-card-hover)] transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[var(--dash-text-primary)]">
                      PAN Verification
                    </span>
                    <span className="text-[11px] text-[var(--dash-text-muted)] mt-0.5">
                      Uploaded: --
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--dash-warning-bg)] text-[var(--dash-warning-text)] text-[11px] font-semibold">
                      <AlertTriangle size={13} /> Missing Documents
                    </span>
                    <div className="flex items-center gap-3 text-[var(--dash-text-muted)]">
                      <label className="cursor-pointer hover:text-[var(--dash-text-primary)] transition-colors flex items-center">
                        <Upload size={15} />
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              addToast({
                                title: "File Uploaded",
                                message: `Successfully uploaded ${e.target.files[0].name} for PAN Verification`,
                                type: "success",
                              });
                            }
                          }}
                        />
                      </label>
                      <button className="hover:text-[var(--dash-text-primary)] transition-colors">
                        <RefreshCw size={15} />
                      </button>
                      <button className="hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-[var(--dash-card-border)] my-2" />

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-[var(--dash-text-primary)]">
                    Add Custom Certificate
                  </h3>
                  {error && (
                    <span className="text-[11px] text-red-500 font-medium animate-pulse">
                      {error}
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 flex flex-col gap-1 w-full">
                    <span className="text-[11px] text-[var(--dash-text-muted)] font-medium">
                      Certificate Name *
                    </span>
                    <Input
                      placeholder="Enter certificate name (e.g. ISO 27001)"
                      value={customCertName}
                      onChange={(e) => {
                        setCustomCertName(e.target.value);
                        if (e.target.value.trim()) {
                          setError(null);
                        }
                      }}
                      className={`h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] placeholder:text-[var(--dash-text-muted)] text-xs px-3 focus-visible:ring-1 focus-visible:ring-sky-500/60 ${error && !customCertName.trim() ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto justify-end items-center">
                    {selectedFile && (
                      <span
                        className="text-[11px] text-[var(--dash-text-muted)] truncate max-w-[150px] mr-1"
                        title={selectedFile.name}
                      >
                        {selectedFile.name}
                      </span>
                    )}
                    <label className="cursor-pointer bg-[var(--dash-input-bg)] border border-[var(--dash-card-border)] text-[var(--dash-text-primary)] px-3 h-[var(--dash-input-height)] rounded-xl hover:bg-[var(--dash-card-hover)] transition-colors flex items-center gap-1.5 text-xs font-medium shrink-0">
                      <Upload size={14} />
                      Select File
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium h-[var(--dash-input-height)] rounded-xl px-4"
                      onClick={() => {
                        if (!customCertName.trim()) {
                          setError("Certificate name is required");
                          return;
                        }
                        if (!selectedFile) {
                          setError("Please select a file to upload");
                          return;
                        }
                        addToast({
                          title: "Certificate Added",
                          message: `Successfully uploaded "${customCertName}" (${selectedFile.name})`,
                          type: "success",
                        });
                        setCustomCertName("");
                        setSelectedFile(null);
                        setError(null);
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  );
}
