"use client";

import {
  Building2,
  Phone,
  UserCircle,
  ShieldCheck,
  FileText,
  Globe,
  Mail,
  MapPin,
  Network,
  Users,
  Calendar,
  Award,
  Briefcase,
  ExternalLink,
  Star,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { LocationAutocomplete } from "@/app/components/LocationAutocomplete";
import { DomainSelectSearch } from "@/app/client/requirements/components/DomainSelectSearch";
import { DashMultiSelect } from "@/app/client/requirements/components/DashMultiSelect";
import { CertificationSelectSearch } from "@/app/client/requirements/components/CertificationSelectSearch";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import { PhoneNumberField } from "@/app/onboarding/components/PhoneNumberField";
import { PhoneOtpVerification } from "@/app/onboarding/components/PhoneOtpVerification";
import { formatPhoneDisplay } from "@/app/onboarding/utils/phone";
import type { CountryCode } from "libphonenumber-js";

const VENDOR_CATEGORIES = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development",
  "Database & Storage",
  "DevOps & Cloud",
  "Data Science & AI",
  "UI/UX Design",
  "Cybersecurity",
  "Game Development",
  "Web3 & Blockchain",
  "QA & Testing",
];

const COMPANY_SIZE_OPTIONS = [
  "1–10",
  "11–50",
  "51–200",
  "201–500",
  "501–1,000",
  "1,000+",
];

const companyData = [
  { label: "Company Name", value: "TechHire Solutions", icon: Building2 },
  {
    label: "Website",
    value: "techhire.in",
    isLink: true,
    href: "https://techhire.in",
    icon: Globe,
  },
  { label: "HQ Location", value: "Mumbai, Maharashtra, India", icon: MapPin },
  { label: "Company Email", value: "contact@techhire.in", icon: Mail },
  { label: "Company Size", value: "51-200", icon: Users },
  { label: "GST", value: "27XYZAB5678C1D9", icon: ShieldCheck },
  { label: "CIN", value: "U72900MH2019PTC3456", icon: FileText },
  {
    label: "Vendor Categories",
    value: "Frontend Development, Backend Development, DevOps & Cloud",
    icon: Network,
  },
  { label: "Certifications", value: "ISO 9001, MSME Registered", icon: Award },
  { label: "Founded Year", value: "2019", icon: Calendar },
];

const pocData = [
  { label: "POC Name", value: "Sarah Wilson", icon: UserCircle },
  { label: "Email", value: "sarah@techhire.in", icon: Mail },
  { label: "Phone", value: "+918765432109", icon: Phone },
  { label: "Designation", value: "CEO", icon: Briefcase },
];

export default function CompanyInfo({ isEditing }: { isEditing?: boolean }) {
  const [localCompanyData, setLocalCompanyData] = useState(companyData);
  const [localPocData, setLocalPocData] = useState(pocData);

  const savedCompanyDataRef = useRef(companyData);
  const savedPocDataRef = useRef(pocData);

  useEffect(() => {
    const handleSave = () => {
      savedCompanyDataRef.current = localCompanyData;
      savedPocDataRef.current = localPocData;
    };
    const handleCancel = () => {
      setLocalCompanyData(savedCompanyDataRef.current);
      setLocalPocData(savedPocDataRef.current);
    };

    window.addEventListener("profile-save", handleSave);
    window.addEventListener("profile-cancel", handleCancel);
    return () => {
      window.removeEventListener("profile-save", handleSave);
      window.removeEventListener("profile-cancel", handleCancel);
    };
  }, [localCompanyData, localPocData]);

  const [pocPhoneCountry, setPocPhoneCountry] = useState<CountryCode>("IN");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const leftCompanyData = localCompanyData.slice(0, 5);
  const rightCompanyData = localCompanyData.slice(5);

  return (
    <div className="profile-two-col-3to1" id="company-info-section">
      {/* Company Information */}
      <div className="profile-section">
        <div className="profile-section-title">
          <span className="profile-section-title-icon">
            <Building2 size={18} />
          </span>
          Company Information
        </div>

        <div className="profile-section-inner-grid">
          <div className="profile-kv-list">
            {leftCompanyData.map((item) => (
              <div
                className="profile-kv-row"
                key={item.label}
                style={
                  isEditing
                    ? {
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "8px",
                      }
                    : {}
                }
              >
                <span className="profile-kv-label flex items-center gap-2">
                  {item.icon && (
                    <item.icon
                      size={15}
                      className="text-[var(--dash-text-muted)] shrink-0"
                    />
                  )}
                  {item.label}
                </span>
                {isEditing ? (
                  item.label === "HQ Location" ? (
                    <LocationAutocomplete
                      label=""
                      labelClassName="hidden"
                      name="hqLocation"
                      value={item.value}
                      onChange={(val) => {
                        const newData = [...localCompanyData];
                        const idx = newData.findIndex(d => d.label === item.label);
                        if (idx !== -1) newData[idx] = { ...newData[idx], value: val };
                        setLocalCompanyData(newData);
                      }}
                      placeholder="Enter HQ Location"
                      className="w-full space-y-0"
                      hideIcon
                      inputClassName="h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 focus:outline-none focus:ring-1 focus:ring-sky-500/60 w-full placeholder:text-[var(--dash-text-muted)]"
                    />
                  ) : item.label === "Domain" ? (
                    <DomainSelectSearch
                      value={item.value}
                      onChange={(val) => {
                        const newData = [...localCompanyData];
                        const idx = newData.findIndex(d => d.label === item.label);
                        if (idx !== -1) newData[idx] = { ...newData[idx], value: val };
                        setLocalCompanyData(newData);
                      }}
                      placeholder="Select domain"
                    />
                  ) : item.label === "Company Size" ? (
                    <Select value={item.value} onValueChange={(val) => {
                      const newData = [...localCompanyData];
                      const idx = newData.findIndex(d => d.label === item.label);
                      if (idx !== -1) newData[idx] = { ...newData[idx], value: val };
                      setLocalCompanyData(newData);
                    }}>
                      <SelectTrigger className="h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 focus:ring-1 focus:ring-sky-500/60 w-full">
                        <SelectValue placeholder="Select Company Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPANY_SIZE_OPTIONS.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={item.value}
                      onChange={(e) => {
                        const newData = [...localCompanyData];
                        const idx = newData.findIndex(d => d.label === item.label);
                        if (idx !== -1) newData[idx] = { ...newData[idx], value: e.target.value };
                        setLocalCompanyData(newData);
                      }}
                      placeholder={`Enter ${item.label}`}
                      className="h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 focus-visible:ring-1 focus-visible:ring-sky-500/60 w-full"
                    />
                  )
                ) : item.isLink ? (
                  <a
                    href={item.href}
                    className="profile-kv-link flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.value}
                    <ExternalLink size={12} className="inline shrink-0" />
                  </a>
                ) : (
                  <span className="profile-kv-value">{item.value}</span>
                )}
              </div>
            ))}
          </div>

          <div className="profile-section-inner-divider" />

          <div className="profile-kv-list">
            {rightCompanyData.map((item) => (
              <div
                className="profile-kv-row"
                key={item.label}
                style={
                  isEditing
                    ? {
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "8px",
                      }
                    : {}
                }
              >
                <span className="profile-kv-label flex items-center gap-2">
                  {item.icon && (
                    <item.icon
                      size={15}
                      className="text-[var(--dash-text-muted)] shrink-0"
                    />
                  )}
                  {item.label}
                </span>
                {isEditing ? (
                  item.label === "HQ Location" ? (
                    <LocationAutocomplete
                      label=""
                      labelClassName="hidden"
                      name="hqLocation"
                      value={item.value}
                      onChange={(val) => {
                        const newData = [...localCompanyData];
                        const idx = newData.findIndex(d => d.label === item.label);
                        if (idx !== -1) newData[idx] = { ...newData[idx], value: val };
                        setLocalCompanyData(newData);
                      }}
                      placeholder="Enter HQ Location"
                      className="w-full space-y-0"
                      hideIcon
                      inputClassName="h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 focus:outline-none focus:ring-1 focus:ring-sky-500/60 w-full placeholder:text-[var(--dash-text-muted)]"
                    />
                  ) : item.label === "Domain" ? (
                    <DomainSelectSearch
                      value={item.value}
                      onChange={(val) => {
                        const newData = [...localCompanyData];
                        const idx = newData.findIndex(d => d.label === item.label);
                        if (idx !== -1) newData[idx] = { ...newData[idx], value: val };
                        setLocalCompanyData(newData);
                      }}
                      placeholder="Select domain"
                    />
                  ) : item.label === "Company Size" ? (
                    <Select value={item.value} onValueChange={(val) => {
                        const newData = [...localCompanyData];
                        const idx = newData.findIndex(d => d.label === item.label);
                        if (idx !== -1) newData[idx] = { ...newData[idx], value: val };
                        setLocalCompanyData(newData);
                      }}>
                      <SelectTrigger className="h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 focus:ring-1 focus:ring-sky-500/60 w-full">
                        <SelectValue placeholder="Select Company Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPANY_SIZE_OPTIONS.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : item.label === "Vendor Categories" ? (
                    <DashMultiSelect
                      label=""
                      className="max-w-[323.69px]"
                      name="vendorCategories"
                      options={VENDOR_CATEGORIES}
                      value={item.value ? item.value.split(", ").filter(Boolean) : []}
                      onChange={(val) => {
                        const newData = [...localCompanyData];
                        const idx = newData.findIndex(d => d.label === item.label);
                        if (idx !== -1) newData[idx] = { ...newData[idx], value: val.join(", ") };
                        setLocalCompanyData(newData);
                      }}
                      placeholder="Select Categories"
                    />
                  ) : item.label === "Certifications" ? (
                    <div className="w-full max-w-[323.69px]">
                      <CertificationSelectSearch
                        selectedValues={item.value ? item.value.split(", ").filter(Boolean) : []}
                        onValuesChange={(val) => {
                          const newData = [...localCompanyData];
                          const idx = newData.findIndex(d => d.label === item.label);
                          if (idx !== -1) newData[idx] = { ...newData[idx], value: val.join(", ") };
                          setLocalCompanyData(newData);
                        }}
                        placeholder="Select Certifications"
                      />
                    </div>
                  ) : (
                    <Input
                      value={item.value}
                      onChange={(e) => {
                        const newData = [...localCompanyData];
                        const idx = newData.findIndex(d => d.label === item.label);
                        if (idx !== -1) newData[idx] = { ...newData[idx], value: e.target.value };
                        setLocalCompanyData(newData);
                      }}
                      placeholder={`Enter ${item.label}`}
                      className="h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 focus-visible:ring-1 focus-visible:ring-sky-500/60 w-full"
                    />
                  )
                ) : item.isLink ? (
                  <a
                    href={item.href}
                    className="profile-kv-link flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.value}
                    <ExternalLink size={12} className="inline shrink-0" />
                  </a>
                ) : item.label === "Vendor Categories" || item.label === "Certifications" ? (
                  (() => {
                    const items = item.value.split(", ");
                    const visibleItems = items.slice(0, 1).join(", ");
                    const remainingCount = items.length - 1;
                    return (
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="profile-kv-value truncate max-w-[150px]">{visibleItems}</span>
                        {remainingCount > 0 && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[var(--dash-badge-bg)] text-[var(--dash-badge-text)] hover:opacity-80 cursor-pointer transition-opacity"
                              >
                                +{remainingCount}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] shadow-lg z-50">
                              <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-[var(--dash-text-muted)] capitalize tracking-wider">
                                  All {item.label}
                                </h4>
                                <div className="text-xs font-medium text-[var(--dash-text-primary)]">
                                  {items.join(", ")}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <span className="profile-kv-value">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Point of Contact */}
      <div className="profile-section">
        <div className="profile-section-title">
          <span className="profile-section-title-icon">
            <Phone size={18} />
          </span>
          Point of Contact
        </div>
        <div className="profile-kv-list">
          {pocData.map((item) => (
            <div
              className="profile-kv-row"
              key={item.label}
              style={
                isEditing
                  ? {
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "8px",
                    }
                  : {}
              }
            >
              <span className="profile-kv-label flex items-center gap-2">
                {item.icon && (
                  <item.icon
                    size={15}
                    className="text-[var(--dash-text-muted)] shrink-0"
                  />
                )}
                {item.label}
              </span>
              {isEditing ? (
                item.label === "Phone" ? (
                  <PhoneOtpVerification
                    phoneNumber={item.value}
                    isVerified={isPhoneVerified}
                    onVerified={() => setIsPhoneVerified(true)}
                    onOtpSentChange={setIsOtpSent}
                    inline
                    hasLabel={false}
                  >
                    <PhoneNumberField
                      name="pocPhone"
                      value={item.value}
                      countryValue={pocPhoneCountry}
                      disabled={isPhoneVerified || isOtpSent}
                      onChange={(val) => {
                        if (val === item.value) return;
                        const newData = [...localPocData];
                        const idx = newData.findIndex(d => d.label === item.label);
                        if (idx !== -1) newData[idx] = { ...newData[idx], value: val || "" };
                        setLocalPocData(newData);
                        if (isPhoneVerified) setIsPhoneVerified(false);
                      }}
                      onCountryChange={(c) => {
                        setPocPhoneCountry(c);
                        if (isPhoneVerified) setIsPhoneVerified(false);
                      }}
                      className="w-full space-y-0"
                    />
                  </PhoneOtpVerification>
                ) : (
                  <Input
                    value={item.value}
                    onChange={(e) => {
                      const newData = [...localPocData];
                      const idx = newData.findIndex(d => d.label === item.label);
                      if (idx !== -1) newData[idx] = { ...newData[idx], value: e.target.value };
                      setLocalPocData(newData);
                    }}
                    placeholder={`Enter ${item.label}`}
                    className="h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 focus-visible:ring-1 focus-visible:ring-sky-500/60 w-full"
                  />
                )
              ) : (
                <span className="profile-kv-value">
                  {item.label === "Phone" ? formatPhoneDisplay(item.value, pocPhoneCountry) : item.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
