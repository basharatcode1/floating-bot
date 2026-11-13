import React from "react";

/* ─────────────────────────────────────────────────────────────
   Skeleton Primitive Components
   All accept className and style for easy composition.
   Uses CSS variables from dashboard.css automatically.
───────────────────────────────────────────────────────────── */

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

/** Animated shimmer line — use for text placeholders */
export function SkeletonLine({
  className = "",
  style,
}: SkeletonProps) {
  return (
    <span
      className={`sk-line ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/** Rectangular block — use for images, charts, banners */
export function SkeletonBlock({
  className = "",
  style,
}: SkeletonProps) {
  return (
    <div
      className={`sk-block ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/** Circular avatar placeholder */
export function SkeletonAvatar({
  size = 48,
  className = "",
  style,
}: SkeletonProps & { size?: number }) {
  return (
    <div
      className={`sk-avatar ${className}`}
      style={{ width: size, height: size, borderRadius: "50%", ...style }}
      aria-hidden="true"
    />
  );
}

/** Small pill badge placeholder */
export function SkeletonBadge({
  width = 64,
  className = "",
  style,
}: SkeletonProps & { width?: number | string }) {
  return (
    <span
      className={`sk-badge ${className}`}
      style={{ width, ...style }}
      aria-hidden="true"
    />
  );
}

/** Wrapper that marks a region as loading for a11y */
export function SkeletonContainer({
  children,
  className = "",
  style,
}: SkeletonProps & { children: React.ReactNode }) {
  return (
    <div
      className={`sk-container ${className}`}
      style={style}
      aria-busy="true"
      aria-label="Loading…"
    >
      {children}
    </div>
  );
}
