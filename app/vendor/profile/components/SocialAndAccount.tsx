"use client";

import { ComponentType, Suspense } from "react";
import { Globe, CircleDot, ShieldCheck, Calendar, Clock } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import AccountActions from "./AccountActions";

const LinkedinIcon = ({
  size,
  ...props
}: { size?: number | string } & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#0A66C2"
    width={size || 24}
    height={size || 24}
    {...props}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = ({
  size,
  ...props
}: { size?: number | string } & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#1DA1F2"
    width={size || 24}
    height={size || 24}
    {...props}
  >
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

const InstagramIcon = ({
  size,
  ...props
}: { size?: number | string } & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size || 24}
    height={size || 24}
    {...props}
  >
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <path
      fill="url(#ig-grad)"
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 01-2.882 0 1.441 1.441 0 012.882 0z"
    />
  </svg>
);

interface SocialLink {
  platform: string;
  icon: ComponentType<any>;
  value: string;
  href: string;
  extra?: string;
}

const socialLinks: SocialLink[] = [
  {
    platform: "LinkedIn",
    icon: LinkedinIcon,
    value: "linkedin.com/company/techhire",
    href: "https://linkedin.com/company/techhire",
  },
  {
    platform: "Twitter",
    icon: TwitterIcon,
    value: "@techhire_in",
    href: "https://twitter.com/techhire_in",
  },
  {
    platform: "Instagram",
    icon: InstagramIcon,
    value: "@techhiresolutions",
    href: "https://instagram.com/techhiresolutions",
  },
];

const accountInfo = [
  {
    label: "Account Status",
    value: "Active",
    isBadge: true,
    icon: ShieldCheck,
  },
  { label: "Joined Date", value: "March 10, 2024", icon: Calendar },
  { label: "Last Login", value: "Today, 10:15 AM", icon: Clock },
];

export default function SocialAndAccount({
  isEditing,
  onEditClick,
}: {
  isEditing?: boolean;
  onEditClick?: () => void;
}) {
  return (
    <div className="profile-three-col" id="social-account-section">
      {/* Social Media */}
      <div className="profile-section">
        <div className="profile-section-title">
          <span className="profile-section-title-icon">
            <Globe size={18} />
          </span>
          Social Media
        </div>
        <div>
          {socialLinks.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                className="profile-social-row flex items-center gap-4"
                key={item.platform}
              >
                <div className="profile-social-label flex items-center gap-2.5 w-[100px] flex-shrink-0">
                  <span className="profile-social-label-icon">
                    <IconComp size={16} />
                  </span>
                  <span className="text-[11px] font-medium text-[var(--dash-text-primary)] tracking-wide">
                    {item.platform}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: isEditing ? "100%" : "auto",
                    flex: 1,
                    justifyContent: isEditing ? "flex-start" : "flex-end",
                  }}
                >
                  {isEditing ? (
                    <Input
                      defaultValue={item.value}
                      placeholder={`Enter ${item.platform}`}
                      className="h-[var(--dash-input-height)] rounded-xl bg-[var(--dash-input-bg)] border-[var(--dash-input-border)] text-[var(--dash-text-primary)] text-xs px-3 focus-visible:ring-1 focus-visible:ring-sky-500/60 w-full"
                    />
                  ) : (
                    <a
                      href={item.href}
                      className="profile-kv-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.value}
                    </a>
                  )}
                  {item.extra && !isEditing && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--dash-text-muted)",
                      }}
                    >
                      {item.extra}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Information */}
      <div className="profile-section">
        <div className="profile-section-title">
          <span className="profile-section-title-icon">
            <CircleDot size={18} />
          </span>
          Account Information
        </div>
        <div className="profile-kv-list">
          {accountInfo.map((item) => {
            const IconComp = item.icon;
            return (
              <div className="profile-kv-row" key={item.label}>
                <span className="profile-kv-label flex items-center gap-2">
                  {IconComp && (
                    <IconComp
                      size={15}
                      className="text-[var(--dash-text-muted)] shrink-0"
                    />
                  )}
                  {item.label}
                </span>
                {item.isBadge ? (
                  <span
                    className="profile-verified-badge"
                    style={{
                      background: "var(--dash-success-bg)",
                      color: "var(--dash-success-text)",
                    }}
                  >
                    {item.value}
                  </span>
                ) : (
                  <span className="profile-kv-value">{item.value}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Actions */}
      <Suspense fallback={null}>
        <AccountActions isEditing={isEditing} onEditClick={onEditClick} />
      </Suspense>
    </div>
  );
}
