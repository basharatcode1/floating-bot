"use client";

import {
  Building2,
  UserCircle,
  ShieldCheck,
  FileText,
  Mail,
  MapPin,
  Network,
  Users,
  Calendar,
  ExternalLink,
  Phone,
  Briefcase,
  Star,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { LocationAutocomplete } from "@/app/components/LocationAutocomplete";
import { DomainSelectSearch } from "@/app/client/requirements/components/DomainSelectSearch";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { PhoneNumberField } from "@/app/onboarding/components/PhoneNumberField";
import { PhoneOtpVerification } from "@/app/onboarding/components/PhoneOtpVerification";
import { formatPhoneDisplay } from "@/app/onboarding/utils/phone";
import type { CountryCode } from "libphonenumber-js";

const COMPANY_SIZE_OPTIONS = [
  "1–10",
  "11–50",
  "51–200",
  "201–500",
  "501–1,000",
  "1,000+",
];

type CompanyInfoItem = {
  label: string;
  value: string;
  icon: any;
  isLink?: boolean;
  href?: string;
};

const companyData: CompanyInfoItem[] = [
  { label: "Company Name", value: "TechCorp India", icon: Building2 },
  { label: "GST Number", value: "29ABCDE1234F1Z5", icon: ShieldCheck },
  { label: "CIN", value: "U74999DL2020PTC1234", icon: FileText },
  { label: "Company Email", value: "info@techcorp.in", icon: Mail },
  { label: "HQ Location", value: "Bangalore, Karnataka, India", icon: MapPin },
  { label: "Domain", value: "Enterprise SaaS", icon: Network },
  { label: "Company Size", value: "201–500", icon: Users },
  { label: "Founded Year", value: "2018", icon: Calendar },
];

const pocData = [
  { label: "POC Name", value: "John Smith", icon: UserCircle },
  { label: "Email", value: "john@techcorp.in", icon: Mail },
  { label: "Phone", value: "+919876543210", icon: Phone },
  { label: "Designation", value: "CTO", icon: Briefcase },
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

  const leftCompanyData = localCompanyData.slice(0, 4);
  const rightCompanyData = localCompanyData.slice(4);

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
                      inputClassName="h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-sky-500/60 w-full placeholder:text-[var(--dash-text-muted)]"
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
        </div>
      </div>

      {/* Point of Contact */}
      <div className="profile-section">
        <div className="profile-section-title">
          <span className="profile-section-title-icon">
            <UserCircle size={18} />
          </span>
          Point of Contact
        </div>
        <div className="profile-kv-list">
          {localPocData.map((item) => (
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
