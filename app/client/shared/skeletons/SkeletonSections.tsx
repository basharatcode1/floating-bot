import React from "react";
import {
  SkeletonLine,
  SkeletonBlock,
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonContainer,
} from "./SkeletonBase";

/* ─────────────────────────────────────────────────────────────
   Reusable Section-Level Skeleton Compositions
───────────────────────────────────────────────────────────── */

/** Generic card with a title bar + n body lines */
export function SkeletonCard({
  lines = 3,
  showIcon = false,
  height,
  style,
}: {
  lines?: number;
  showIcon?: boolean;
  height?: number | string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="sk-card" style={{ height, ...style }}>
      <div className="sk-card-header">
        {showIcon && <SkeletonAvatar size={28} />}
        <SkeletonLine style={{ width: "45%", height: 16 }} />
      </div>
      <div className="sk-card-body">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine
            key={i}
            style={{
              width: i === lines - 1 ? "60%" : "100%",
              height: 13,
              marginBottom: 10,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Mimics a stat card: icon bubble + big number + label + mini chart */
export function SkeletonStatCard() {
  return (
    <div className="sk-card sk-stat-card">
      <div className="sk-stat-top">
        <SkeletonAvatar size={40} />
        <div style={{ flex: 1 }}>
          <SkeletonLine style={{ width: "55%", height: 28, marginBottom: 6 }} />
          <SkeletonLine style={{ width: "70%", height: 13 }} />
        </div>
        <SkeletonBadge width={52} />
      </div>
      <SkeletonBlock style={{ height: 64, marginTop: 14, borderRadius: 8 }} />
    </div>
  );
}

/** Table row: avatar + two lines + badge on right */
export function SkeletonTableRow({ index = 0 }: { index?: number }) {
  return (
    <div className="sk-table-row" style={{ animationDelay: `${index * 0.06}s` }}>
      <SkeletonAvatar size={36} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <SkeletonLine style={{ width: "45%", height: 13 }} />
        <SkeletonLine style={{ width: "30%", height: 11 }} />
      </div>
      <SkeletonBadge width={72} />
    </div>
  );
}

/** Profile hero: large avatar + name + sub-info rows + stats strip */
export function SkeletonProfileHeader({ columns = 4 }: { columns?: number }) {
  return (
    <div className="sk-card sk-profile-header" style={{ marginBottom: 24, padding: 0, overflow: 'hidden' }}>
      {/* Top Half */}
      <div className="sk-profile-hero" style={{ padding: '16px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
        <SkeletonAvatar size={80} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SkeletonLine style={{ width: "30%", height: 22 }} />
          <SkeletonLine style={{ width: "40%", height: 14 }} />
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <SkeletonLine style={{ width: 140, height: 13 }} />
            <SkeletonLine style={{ width: 120, height: 13 }} />
          </div>
        </div>
        <SkeletonBadge width={120} style={{ height: 36 }} />
      </div>

      {/* Divider */}
      <div style={{ height: 1, width: "100%", background: "var(--dash-divider)" }} />

      {/* Bottom Half - Stats Strip */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 0, 
        borderTop: "none"
      }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} style={{ 
            padding: 16, 
            display: "flex", 
            alignItems: "center", 
            gap: 16,
            borderRight: i < columns - 1 ? "1px solid var(--dash-divider)" : "none"
          }}>
            <SkeletonAvatar size={48} />
            <div style={{ flex: 1 }}>
              <SkeletonLine style={{ width: "60%", height: 12, marginBottom: 8 }} />
              <SkeletonLine style={{ width: "40%", height: 20, marginBottom: 8 }} />
              <SkeletonLine style={{ width: "80%", height: 10 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Requirement accordion card: title + meta chips + collapsed body */
export function SkeletonRequirementCard({ index = 0 }: { index?: number }) {
  return (
    <div
      className="sk-card sk-req-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Accordion trigger row */}
      <div className="sk-req-trigger">
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <SkeletonLine style={{ width: "38%", height: 16 }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <SkeletonBadge width={80} />
            <SkeletonBadge width={100} />
            <SkeletonBadge width={70} />
          </div>
        </div>
        <SkeletonBadge width={64} />
      </div>
      {/* Collapsed body hint */}
      <div className="sk-req-body">
        <SkeletonLine style={{ width: "100%", height: 12, marginBottom: 8 }} />
        <SkeletonLine style={{ width: "80%", height: 12 }} />
      </div>
    </div>
  );
}

/** Certification row: name + date + status badge */
export function SkeletonCertRow({ index = 0 }: { index?: number }) {
  return (
    <div
      className="sk-table-row"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <SkeletonLine style={{ width: "50%", height: 13 }} />
        <SkeletonLine style={{ width: "30%", height: 11 }} />
      </div>
      <SkeletonBadge width={80} />
    </div>
  );
}

/** Section wrapper with optional title placeholder */
export function SkeletonSection({
  children,
  showTitle = true,
  fullWidth = false,
  className = "",
}: {
  children: React.ReactNode;
  showTitle?: boolean;
  fullWidth?: boolean;
  className?: string;
}) {
  return (
    <SkeletonContainer
      className={`sk-section${fullWidth ? " sk-full-width" : ""}${className ? ` ${className}` : ""}`}
    >
      {showTitle && (
        <div className="sk-section-title-row">
          <SkeletonAvatar size={22} style={{ borderRadius: 6 }} />
          <SkeletonLine style={{ width: 160, height: 15 }} />
        </div>
      )}
      {children}
    </SkeletonContainer>
  );
}

/** Candidate submission card: name + metadata + skills + match score and actions */
export function SkeletonCandidateCard({ index = 0 }: { index?: number }) {
  return (
    <div
      className="sk-card mb-6"
      style={{
        animationDelay: `${index * 0.08}s`,
        padding: "24px",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left Side Info */}
        <div style={{ flex: 1 }}>
          <SkeletonLine style={{ width: "35%", height: 20, marginBottom: 8 }} />
          <SkeletonLine style={{ width: "55%", height: 12, marginBottom: 16 }} />
          {/* Skill tags */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <SkeletonBadge width={60} style={{ height: 22 }} />
            <SkeletonBadge width={70} style={{ height: 22 }} />
            <SkeletonBadge width={65} style={{ height: 22 }} />
          </div>
        </div>

        {/* Right Side Match Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, alignSelf: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Progress bar */}
              <SkeletonBlock style={{ width: 64, height: 8, borderRadius: 4 }} />
              <SkeletonLine style={{ width: 28, height: 12, marginBottom: 0 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SkeletonBadge width={70} style={{ height: 20 }} />
              <SkeletonBadge width={60} style={{ height: 24 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
