"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// ── Animation variants ──────────────────────────────────────────────
const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const popIn: any = {
  hidden: { opacity: 0, scale: 0.6, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const personRise: any = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

interface GeometricShapeData {
  type: string;
  color: string;
  x: string | number;
  y: string | number;
  size: number;
  rotation?: number;
}

interface GeometricShapeProps {
  shape: GeometricShapeData;
}

interface StatBadgeData {
  x: string | number;
  y: string | number;
  value: string | number;
  label: string;
}

interface StatBadgeProps {
  stat: StatBadgeData;
}

interface FeatureCalloutData {
  icon: string;
  text: string;
}

interface FeatureCalloutProps {
  callout: FeatureCalloutData;
}

interface ProblemCardWidgetData {
  x: string | number;
  y: string | number;
  title: string;
  text: string;
}

interface ProblemCardWidgetProps {
  widget: ProblemCardWidgetData;
}

// ── Geometric Shape Components ──────────────────────────────────────
function GeometricShape({ shape }: GeometricShapeProps) {
  const { type, color, x, y, size, rotation = 0 } = shape;

  const baseStyle: any = {
    position: "absolute",
    left: x,
    top: y,
    width: size,
    height: size,
    transform: `rotate(${rotation}deg)`,
  };

  if (type === "circle") {
    return (
      <motion.div
        variants={scaleIn}
        style={{
          ...baseStyle,
          borderRadius: "50%",
          background: color,
        } as any}
      />
    );
  }

  if (type === "triangle") {
    return (
      <motion.div
        variants={scaleIn}
        style={{
          ...baseStyle,
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid ${color}`,
          background: "transparent",
        } as any}
      />
    );
  }

  if (type === "rect") {
    return (
      <motion.div
        variants={scaleIn}
        style={{
          ...baseStyle,
          borderRadius: size * 0.2,
          background: color,
        } as any}
      />
    );
  }

  return null;
}

// ── Stat Badge Component ────────────────────────────────────────────
function StatBadge({ stat }: StatBadgeProps) {
  return (
    <motion.div
      variants={popIn}
      className="absolute z-20"
      style={{ left: stat.x, top: stat.y }}
    >
      <div
        className="rounded-xl px-4 py-2.5 shadow-lg"
        style={{
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="text-lg font-extrabold leading-tight text-white md:text-xl">
          {stat.value}
        </div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-white/70">
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

// ── Feature Callout Component ───────────────────────────────────────
const iconPaths = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  chart: "M18 20V10M12 20V4M6 20v-6",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  message: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  workflow: "M22 12h-4l-3 9L9 3l-3 9H2",
  broadcast:
    "M4.93 4.93l4.24 4.24M19.07 4.93l-4.24 4.24M12 2v4M2 12h4M18 12h4M4.93 19.07l4.24-4.24M19.07 19.07l-4.24-4.24M12 18v4",
  briefcase:
    "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  dollar: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
};

function FeatureCallout({ callout }: FeatureCalloutProps) {
  const iconPath = iconPaths[callout.icon] || iconPaths.zap;

  return (
    <motion.div
      variants={popIn}
      className="absolute bottom-[8%] left-[5%] z-20 md:bottom-[10%] md:left-[6%]"
    >
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg md:px-5"
        style={{
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
          style={{
            background:
              "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={iconPath} />
          </svg>
        </div>
        <span
          className="text-xs font-bold md:text-sm"
          style={{ color: "var(--text-on-light)" }}
        >
          {callout.text}
        </span>
      </div>
    </motion.div>
  );
}

function ProblemCardWidget({ widget }: ProblemCardWidgetProps) {
  return (
    <motion.div
      variants={popIn}
      className="absolute z-20 hidden md:block"
      style={{ left: widget.x, top: widget.y }}
    >
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3.5 shadow-lg"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(239,68,68,0.12)",
          maxWidth: 240,
        }}
      >
        <div
          className="mt-0.5 h-3 w-3 flex-shrink-0 rounded-full"
          style={{ background: "#EF4444", boxShadow: "0 0 6px rgba(239,68,68,0.4)" }}
        />
        <div>
          <div
            className="text-sm font-bold leading-tight"
            style={{ color: "#1E293B" }}
          >
            {widget.title}
          </div>
          <div
            className="mt-1 text-xs leading-tight"
            style={{ color: "#64748B" }}
          >
            {widget.text}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TrustBadgeWidget() { return null; }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function NotificationWidget(props: any) { return null; }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PipelineMiniWidget(props: any) { return null; }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function QuickStatWidget(props: any) { return null; }

const widgetComponents: Record<string, React.ComponentType<any>> = {
  "trust-badge": TrustBadgeWidget,
  notification: NotificationWidget,
  "pipeline-mini": PipelineMiniWidget,
  "quick-stat": QuickStatWidget,
  "problem-card": ProblemCardWidget,
};

interface FloatingWidgetProps {
  widget: any;
}

function FloatingWidget({ widget }: FloatingWidgetProps) {
  const WidgetComp = widgetComponents[widget.type];
  if (!WidgetComp) return null;
  return <WidgetComp widget={widget} />;
}

// ══════════════════════════════════════════════════════════════════════
//  UI PREVIEW CARD COMPONENTS (one per uiPreview.type)
// ══════════════════════════════════════════════════════════════════════

const cardStyle = {
  background: "#FFFFFF",
  borderRadius: 16,
  boxShadow:
    "0 20px 60px -15px rgba(0,0,0,0.12), 0 4px 20px -4px rgba(0,0,0,0.06)",
  overflow: "hidden",
};

function PartnerNetworkCard({ data }: { data: any }) {
  return (
    <div
      style={{ ...cardStyle, padding: "20px", width: "100%", maxWidth: 300 }}
    >
      <div
        className="mb-3 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--text-on-light-muted)" }}
      >
        Verified Partners
      </div>
      <div className="flex flex-col gap-2.5">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border px-3 py-2.5"
            style={{ borderColor: "#F1F5F9" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: "var(--accent-primary)" }}
              >
                {item.name.charAt(0)}
              </div>
              <div>
                <div
                  className="text-xs font-bold"
                  style={{ color: "var(--text-on-light)" }}
                >
                  {item.name}
                </div>
                <div
                  className="text-[10px]"
                  style={{ color: "var(--text-on-light-muted)" }}
                >
                  ★ {item.rating}
                </div>
              </div>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
              style={{ background: item.color }}
            >
              {item.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsChartCard({ data }: { data: any }) {
  return (
    <div
      style={{ ...cardStyle, padding: "20px", width: "100%", maxWidth: 300 }}
    >
      <div
        className="mb-1 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--text-on-light-muted)" }}
      >
        {data.title}
      </div>
      <div className="mb-3 flex items-end gap-1.5" style={{ height: 80 }}>
        {data.bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t"
            style={{
              background: i === 3 ? "var(--accent-primary)" : "#E2E8F0",
            }}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{
              duration: 0.7,
              delay: 0.3 + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {data.metrics.map((m, i) => (
          <div
            key={i}
            className="flex-1 rounded-lg border p-2 text-center"
            style={{ borderColor: "#F1F5F9" }}
          >
            <div
              className="text-sm font-extrabold"
              style={{ color: "var(--text-on-light)" }}
            >
              {m.value}
            </div>
            <div
              className="text-[9px]"
              style={{ color: "var(--text-on-light-muted)" }}
            >
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CandidateListCard({ data }: { data: any }) {
  return (
    <div
      style={{ ...cardStyle, padding: "20px", width: "100%", maxWidth: 300 }}
    >
      <div
        className="mb-3 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--text-on-light-muted)" }}
      >
        Top Candidates
      </div>
      <div className="flex flex-col gap-2">
        {data.candidates.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border px-3 py-2"
            style={{ borderColor: "#F1F5F9" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: `hsl(${i * 60 + 200}, 70%, 55%)` }}
              >
                {c.avatar}
              </div>
              <div>
                <div
                  className="text-xs font-bold"
                  style={{ color: "var(--text-on-light)" }}
                >
                  {c.name}
                </div>
                <div
                  className="text-[10px]"
                  style={{ color: "var(--text-on-light-muted)" }}
                >
                  {c.role}
                </div>
              </div>
            </div>
            <div
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background: "#DCFCE7", color: "#16A34A" }}
            >
              {c.score}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagingCard({ data }: { data: any }) {
  return (
    <div
      style={{ ...cardStyle, padding: "20px", width: "100%", maxWidth: 300 }}
    >
      <div
        className="mb-3 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--text-on-light-muted)" }}
      >
        Messages
      </div>
      <div className="flex flex-col gap-2">
        {data.messages.map((m, i) => (
          <div
            key={i}
            className="rounded-xl px-3 py-2.5"
            style={{
              background:
                m.type === "sent"
                  ? "#EFF6FF"
                  : m.type === "received"
                    ? "#F0FDF4"
                    : "#F8FAFC",
              borderLeft: `3px solid ${m.type === "sent" ? "#3B82F6" : m.type === "received" ? "#22C55E" : "#94A3B8"}`,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-bold"
                style={{ color: "var(--text-on-light)" }}
              >
                {m.from}
              </span>
              <span
                className="text-[9px]"
                style={{ color: "var(--text-on-light-muted)" }}
              >
                {m.time}
              </span>
            </div>
            <div
              className="mt-0.5 text-[11px]"
              style={{ color: "var(--text-on-light-muted)" }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PipelineCard({ data }: { data: any }) {
  return (
    <div
      style={{ ...cardStyle, padding: "20px", width: "100%", maxWidth: 300 }}
    >
      <div
        className="mb-3 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--text-on-light-muted)" }}
      >
        Hiring Pipeline
      </div>
      <div className="flex flex-col gap-2">
        {data.stages.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="h-2 flex-1 overflow-hidden rounded-full"
              style={{ background: "#F1F5F9" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: s.color }}
                initial={{ width: "0%" }}
                animate={{ width: `${(s.count / 12) * 100}%` }}
                transition={{
                  duration: 0.8,
                  delay: 0.3 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
            <span
              className="w-16 text-right text-[10px] font-bold"
              style={{ color: "var(--text-on-light)" }}
            >
              {s.name}
            </span>
            <span
              className="w-6 text-right text-[11px] font-extrabold"
              style={{ color: s.color }}
            >
              {s.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DistributionCard({ data }: { data: any }) {
  return (
    <div
      style={{ ...cardStyle, padding: "20px", width: "100%", maxWidth: 300 }}
    >
      <div
        className="mb-3 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--text-on-light-muted)" }}
      >
        Requirement Broadcast
      </div>
      <div
        className="mb-3 rounded-xl border p-3"
        style={{ borderColor: "#F1F5F9" }}
      >
        <div
          className="text-sm font-bold"
          style={{ color: "var(--text-on-light)" }}
        >
          {data.requirement}
        </div>
        <div
          className="text-[11px]"
          style={{ color: "var(--text-on-light-muted)" }}
        >
          {data.location}
        </div>
      </div>
      <div className="flex gap-3">
        <div
          className="flex-1 rounded-lg p-2.5 text-center"
          style={{ background: "#EFF6FF" }}
        >
          <div className="text-lg font-extrabold" style={{ color: "#3B82F6" }}>
            {data.vendors}
          </div>
          <div
            className="text-[9px] font-medium"
            style={{ color: "var(--text-on-light-muted)" }}
          >
            Vendors
          </div>
        </div>
        <div
          className="flex-1 rounded-lg p-2.5 text-center"
          style={{ background: "#F0FDF4" }}
        >
          <div className="text-lg font-extrabold" style={{ color: "#22C55E" }}>
            {data.responses}
          </div>
          <div
            className="text-[9px] font-medium"
            style={{ color: "var(--text-on-light-muted)" }}
          >
            Responses
          </div>
        </div>
        <div
          className="flex-1 rounded-lg p-2.5 text-center"
          style={{ background: "#FEF3C7" }}
        >
          <div
            className="text-[11px] font-extrabold"
            style={{ color: "#F59E0B" }}
          >
            {data.status}
          </div>
          <div
            className="text-[9px] font-medium"
            style={{ color: "var(--text-on-light-muted)" }}
          >
            Status
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Vendor-specific UI cards ────────────────────────────────────────

function OpportunityBoardCard({ data }: { data: any }) {
  return (
    <div
      style={{ ...cardStyle, padding: "20px", width: "100%", maxWidth: 300 }}
    >
      <div
        className="mb-3 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--text-on-light-muted)" }}
      >
        Open Opportunities
      </div>
      <div className="flex flex-col gap-2">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border px-3 py-2.5"
            style={{ borderColor: "#F1F5F9" }}
          >
            <div>
              <div
                className="text-xs font-bold"
                style={{ color: "var(--text-on-light)" }}
              >
                {item.role}
              </div>
              <div
                className="text-[10px]"
                style={{ color: "var(--text-on-light-muted)" }}
              >
                {item.company} · {item.budget}
              </div>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-bold"
              style={{
                background: item.urgency === "High" ? "#FEE2E2" : "#FEF3C7",
                color: item.urgency === "High" ? "#DC2626" : "#D97706",
              }}
            >
              {item.urgency}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReputationCard({ data }: { data: any }) {
  return (
    <div
      style={{ ...cardStyle, padding: "20px", width: "100%", maxWidth: 300 }}
    >
      <div
        className="mb-1 text-sm font-bold"
        style={{ color: "var(--text-on-light)" }}
      >
        {data.company}
      </div>
      <div className="mb-3 flex items-center gap-1">
        <span className="text-lg font-extrabold" style={{ color: "#F59E0B" }}>
          {"★".repeat(Math.floor(data.rating))}
        </span>
        <span
          className="text-xs"
          style={{ color: "var(--text-on-light-muted)" }}
        >
          {data.rating} ({data.reviews} reviews)
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {data.metrics.map((m, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border px-3 py-2"
            style={{ borderColor: "#F1F5F9" }}
          >
            <span
              className="text-[10px]"
              style={{ color: "var(--text-on-light-muted)" }}
            >
              {m.label}
            </span>
            <span
              className="text-xs font-bold"
              style={{ color: "var(--text-on-light)" }}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationFeedCard({ data }: { data: any }) {
  return (
    <div
      style={{ ...cardStyle, padding: "20px", width: "100%", maxWidth: 300 }}
    >
      <div
        className="mb-3 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--text-on-light-muted)" }}
      >
        Requirement Alerts
      </div>
      <div className="flex flex-col gap-2">
        {data.notifications.map((n, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border px-3 py-2.5"
            style={{
              borderColor: n.urgent ? "#FEE2E2" : "#F1F5F9",
              background: n.urgent ? "#FFF7ED" : "white",
            }}
          >
            <div>
              <div
                className="text-xs font-bold"
                style={{ color: "var(--text-on-light)" }}
              >
                {n.title}
              </div>
              <div
                className="text-[10px]"
                style={{ color: "var(--text-on-light-muted)" }}
              >
                {n.time}
              </div>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-bold"
              style={{ background: "#DCFCE7", color: "#16A34A" }}
            >
              {n.match}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityTimelineCard({ data }: { data: any }) {
  return (
    <div
      style={{ ...cardStyle, padding: "20px", width: "100%", maxWidth: 300 }}
    >
      <div
        className="mb-3 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--text-on-light-muted)" }}
      >
        Activity Feed
      </div>
      <div className="relative flex flex-col gap-3 pl-4">
        <div
          className="absolute bottom-2 left-[5px] top-2 w-0.5"
          style={{ background: "#E2E8F0" }}
        />
        {data.events.map((e, i) => (
          <div key={i} className="relative flex items-start gap-3">
            <div
              className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full border-2 border-white"
              style={{
                background:
                  e.type === "success"
                    ? "#22C55E"
                    : e.type === "warning"
                      ? "#F59E0B"
                      : "#3B82F6",
              }}
            />
            <div>
              <div
                className="text-xs font-bold"
                style={{ color: "var(--text-on-light)" }}
              >
                {e.status}
              </div>
              <div
                className="text-[10px]"
                style={{ color: "var(--text-on-light-muted)" }}
              >
                {e.candidate} · {e.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubmissionFlowCard({ data }: { data: any }) {
  return (
    <div
      style={{ ...cardStyle, padding: "20px", width: "100%", maxWidth: 300 }}
    >
      <div
        className="mb-3 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--text-on-light-muted)" }}
      >
        Quick Submit
      </div>
      <div className="flex flex-col gap-2">
        {data.steps.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border px-3 py-2.5"
            style={{ borderColor: "#F1F5F9" }}
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: s.done ? "#22C55E" : "#E2E8F0" }}
            >
              {s.done ? "✓" : i + 1}
            </div>
            <span
              className="text-xs font-medium"
              style={{
                color: s.done
                  ? "var(--text-on-light)"
                  : "var(--text-on-light-muted)",
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InvoiceTrackerCard({ data }: { data: any }) {
  return (
    <div
      style={{ ...cardStyle, padding: "20px", width: "100%", maxWidth: 300 }}
    >
      <div
        className="mb-3 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--text-on-light-muted)" }}
      >
        Recent Invoices
      </div>
      <div className="flex flex-col gap-2">
        {data.invoices.map((inv, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border px-3 py-2.5"
            style={{ borderColor: "#F1F5F9" }}
          >
            <div>
              <div
                className="text-xs font-bold"
                style={{ color: "var(--text-on-light)" }}
              >
                {inv.id}
              </div>
              <div
                className="text-sm font-extrabold"
                style={{ color: "var(--text-on-light)" }}
              >
                {inv.amount}
              </div>
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
              style={{ background: inv.color }}
            >
              {inv.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VendorDashboardCard({ data }: { data: any }) {
  return (
    <div
      style={{ ...cardStyle, padding: "20px", width: "100%", maxWidth: 300 }}
    >
      {/* Pending Actions */}
      <div
        className="mb-2.5 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--text-on-light-muted)" }}
      >
        Pending Actions
      </div>
      <div className="mb-4 flex flex-col gap-2">
        {data.pendingActions.map((a, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-xl border px-3 py-2"
            style={{ borderColor: "#F1F5F9" }}
          >
            <div
              className="h-2 w-2 flex-shrink-0 rounded-full"
              style={{ background: a.color }}
            />
            <span
              className="text-[11px] font-semibold"
              style={{ color: "var(--text-on-light)" }}
            >
              {a.text}
            </span>
          </div>
        ))}
      </div>

      {/* Pain Points */}
      <div
        className="mb-2 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--text-on-light-muted)" }}
      >
        Pain Points
      </div>
      <div className="flex flex-col gap-1.5">
        {data.painPoints.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
            style={{ background: "#FFF7ED" }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
            <span
              className="text-[10px] font-semibold"
              style={{ color: "#9A3412" }}
            >
              {p}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── UI Preview type → component map ─────────────────────────────────
const uiComponents = {
  "partner-network": PartnerNetworkCard,
  "analytics-chart": AnalyticsChartCard,
  "candidate-list": CandidateListCard,
  messaging: MessagingCard,
  pipeline: PipelineCard,
  distribution: DistributionCard,
  "opportunity-board": OpportunityBoardCard,
  "reputation-card": ReputationCard,
  "notification-feed": NotificationFeedCard,
  "activity-timeline": ActivityTimelineCard,
  "submission-flow": SubmissionFlowCard,
  "invoice-tracker": InvoiceTrackerCard,
  "vendor-dashboard": VendorDashboardCard,
};

// ══════════════════════════════════════════════════════════════════════
//  MAIN RENDERER
// ══════════════════════════════════════════════════════════════════════

/**
 * JasperSlideRenderer — Renders a Jasper.ai-inspired bold collage slide
 * with geometric shapes, stat badges, feature callout, and product UI card.
 */
function FloatingProblemCard({ widget, delay = 0 }: { widget: any; delay?: number }) {
  return (
    <motion.div
      variants={popIn}
      className="absolute z-20 hidden md:block"
      style={{ left: widget.x, top: widget.y }}
      animate={{
        y: [0, -6, 0],
        scale: 1,
      }}
      transition={{
        y: {
          duration: 3 + delay,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
        scale: { duration: 0 },
      }}
      whileHover={{ scale: 1.04, zIndex: 30 }}
    >
      <div
        className="flex items-start gap-3.5 rounded-2xl px-6 py-4 shadow-lg transition-shadow duration-300 hover:shadow-xl cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.6)",
          maxWidth: 295,
          boxShadow: "0 8px 30px rgba(15,23,42,0.06)",
        }}
      >
        <div
          className="mt-1.5 h-3.5 w-3.5 flex-shrink-0 rounded-full"
          style={{
            background: widget.variant === "success" ? "#10B981" : "#EF4444",
            boxShadow:
              widget.variant === "success"
                ? "0 0 8px rgba(16,185,129,0.6)"
                : "0 0 8px rgba(239,68,68,0.6)",
          }}
        />
        <div>
          <div
            className="text-[16px] font-bold leading-tight"
            style={{ color: "#0F172A" }}
          >
            {widget.title}
          </div>
          <div
            className="mt-1.5 text-[13px] leading-tight"
            style={{ color: "#475569" }}
          >
            {widget.text}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CenteredIllustrationSlide({ slide }: { slide: any }) {
  return (
    <motion.div
      className="relative flex h-full w-full overflow-hidden"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* ── Grid pattern overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage: `linear-gradient(${slide.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${slide.gridColor} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Geometric shapes layer ── */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        {slide.shapes?.map((shape, i) => (
          <GeometricShape key={i} shape={shape} />
        ))}
      </div>

      {/* ── Header: Top Center ── */}
      <div className="absolute top-[6%] left-1/2 -translate-x-1/2 text-center z-10 w-full px-6 flex flex-col items-center pointer-events-none">
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{
            background: "rgba(234, 88, 12, 0.06)",
            color: "#EA580C",
            border: "1px solid rgba(234, 88, 12, 0.12)",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
          {slide.badge || "Common Bottlenecks"}
        </motion.span>
        <motion.h3
          variants={fadeUp}
          className="mt-2 text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#1E293B] max-w-xl"
        >
          {slide.title}
        </motion.h3>
      </div>

      {/* ── Human figure (Exactly Center, bottom-aligned) ── */}
      {slide.personImage && (
        <div
          className="pointer-events-none absolute z-[5] hidden md:block"
          style={{
            bottom: 0,
            left: "50%",
            width: "56%",
            maxWidth: 580,
            height: "92%",
            transform: "translateX(-50%)",
          }}
        >
          <motion.div variants={personRise} className="relative h-full w-full">
            <Image
              src={slide.personImage}
              alt=""
              fill
              sizes="580px"
              className="object-contain object-bottom"
              priority
            />
          </motion.div>
        </div>
      )}

      {/* ── Floating problem cards — positioned around the man's head area ── */}
      {slide.floatingWidgets?.map((widget, i) => (
        <FloatingProblemCard key={i} widget={widget} delay={i * 0.4} />
      ))}

      {/* ── Bottom story callout ── */}
      {slide.bottomStory ? (
        <motion.div
          variants={popIn}
          className="absolute bottom-[5%] left-1/2 -translate-x-1/2 z-20 w-auto max-w-[88%]"
        >
          <div
            className="flex items-center gap-3 rounded-full px-5 py-3 shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(234, 88, 12, 0.12)",
              boxShadow: "0 10px 30px rgba(234, 88, 12, 0.05)",
            }}
          >
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
              style={{ background: "linear-gradient(135deg, #FF6B4A, #FF4500)" }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="text-xs font-bold text-[#1E293B]">
              {slide.bottomStory}
            </span>
          </div>
        </motion.div>
      ) : slide.featureCallout ? (
        <motion.div
          variants={popIn}
          className="absolute bottom-[6%] left-1/2 -translate-x-1/2 z-20 w-auto max-w-[90%]"
        >
          <div
            className="flex items-center gap-3 rounded-full px-5 py-3 shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(234, 88, 12, 0.12)",
              boxShadow: "0 10px 30px rgba(234, 88, 12, 0.05)",
            }}
          >
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
              style={{ background: "linear-gradient(135deg, #FF6B4A, #FF4500)" }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="text-xs font-bold text-[#1E293B]">
              {slide.featureCallout.text}
            </span>
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  SOLUTIONS BENTO GRID LAYOUT
//  Premium bento-grid with frosted-glass cards, colour-coded accents,
//  ambient gradient orbs, and staggered entrance animations.
// ══════════════════════════════════════════════════════════════════════

const bentoCardVariant: any = {
  hidden: { opacity: 0, y: 28, scale: 0.92 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      delay: 0.18 + i * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

function SolutionsBentoSlide({ slide }: { slide: any }) {
  const solutions = slide.solutions || [];
  const isClient = slide.id === "client-solutions";
  
  // Dynamic color configuration based on slide type (indigo for client, sky-blue for vendor)
  const badgeBg = isClient ? "rgba(99, 102, 241, 0.08)" : "rgba(14, 165, 233, 0.08)";
  const badgeColor = isClient ? "#4F46E5" : "#0284C7";
  const badgeBorder = isClient ? "1px solid rgba(99, 102, 241, 0.18)" : "1px solid rgba(14, 165, 233, 0.18)";
  const dotColor = isClient ? "#6366F1" : "#0EA5E9";
  const orbBg = isClient ? "rgba(99, 102, 241, 0.14)" : "rgba(14, 165, 233, 0.14)";
  const bottomBorder = isClient ? "1px solid rgba(99, 102, 241, 0.15)" : "1px solid rgba(14, 165, 233, 0.15)";
  const bottomShadow = isClient ? "0 6px 24px rgba(99, 102, 241, 0.06)" : "0 6px 24px rgba(14, 165, 233, 0.06)";
  const checkBg = isClient ? "linear-gradient(135deg, #6366F1, #4F46E5)" : "linear-gradient(135deg, #0EA5E9, #0284C7)";

  return (
    <motion.div
      className="relative flex h-full w-full flex-col overflow-hidden"
      initial="hidden"
      animate="visible"
    >
      {/* ── Subtle grid pattern ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage: `linear-gradient(${slide.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${slide.gridColor} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />

      {/* ── Ambient gradient orbs (soft, blurred) ── */}
      <div
        className="pointer-events-none absolute z-[2]"
        style={{
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            `radial-gradient(circle, ${orbBg} 0%, transparent 70%)`,
          top: "-8%",
          left: "-8%",
          filter: "blur(60px)",
        }}
      />
      <div
        className="pointer-events-none absolute z-[2]"
        style={{
          width: 340,
          height: 340,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
          bottom: "-6%",
          right: "-5%",
          filter: "blur(50px)",
        }}
      />
      <div
        className="pointer-events-none absolute z-[2]"
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)",
          top: "30%",
          right: "15%",
          filter: "blur(40px)",
        }}
      />

      {/* ── Geometric background shapes ── */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        {slide.shapes?.map((shape, i) => (
          <GeometricShape key={i} shape={shape} />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-4 md:px-8 md:py-6 lg:px-12">
        {/* ── Header (Positioned absolutely to match Slide 1) ── */}
        <motion.div
          className="absolute top-[6%] left-1/2 -translate-x-1/2 text-center z-10 w-full px-6 flex flex-col items-center pointer-events-none"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <span
            className="mb-1.5 inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider"
            style={{
              background: badgeBg,
              color: badgeColor,
              border: badgeBorder,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: dotColor }}
            />
            {slide.badge}
          </span>
          <h3 className="mt-1 text-2xl font-extrabold leading-tight tracking-tight md:text-3xl lg:text-4xl"
            style={{ color: "#0F172A" }}
          >
            {slide.title}
          </h3>
          {slide.description && (
            <p
              className="mx-auto mt-1 max-w-lg text-[11px] leading-relaxed md:text-xs"
              style={{ color: "#64748B" }}
            >
              {slide.description}
            </p>
          )}
        </motion.div>

        {/* ── Bento Grid ── */}
        <div className="flex md:grid w-full max-w-[1040px] md:grid-cols-3 gap-4 md:gap-6 mt-16 md:mt-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory no-scrollbar px-6 md:px-0 py-4">
          {solutions.map((sol, i) => {
            const iconPath = iconPaths[sol.icon] || iconPaths.zap;
            return (
              <motion.div
                key={i}
                custom={i}
                variants={bentoCardVariant}
                initial="hidden"
                animate="visible"
                whileHover={{
                  y: -3,
                  scale: 1.02,
                  boxShadow:
                    "0 8px 30px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)",
                }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="group relative cursor-default overflow-hidden rounded-2xl p-5 md:p-[26px] snap-center shrink-0 w-[280px] md:w-auto"
                style={{
                  background: "rgba(255, 255, 255, 0.72)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255, 255, 255, 0.85)",
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.02), 0 3px 18px rgba(0,0,0,0.01)",
                }}
              >
                {/* Coloured top accent bar */}
                <div
                  className="absolute left-0 right-0 top-0 h-[2px] transition-all duration-300 group-hover:h-[3px]"
                  style={{ background: sol.gradient }}
                />

                {/* Subtle tinted bg on hover */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: sol.bgTint }}
                />

                {/* Accent glow on hover (top-left) */}
                <div
                  className="pointer-events-none absolute -left-4 -top-4 h-20 w-20 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-60"
                  style={{
                    background: `radial-gradient(circle, ${sol.accent}22 0%, transparent 70%)`,
                    filter: "blur(14px)",
                  }}
                />

                {/* Icon */}
                <div
                  className="relative mb-3 flex h-10 w-10 items-center justify-center rounded-lg shadow-sm md:h-12 md:w-12"
                  style={{
                    background: sol.gradient,
                    boxShadow: `0 3px 10px ${sol.accent}25`,
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={iconPath} />
                  </svg>
                </div>

                {/* Title */}
                <div
                  className="relative text-base font-extrabold leading-snug md:text-[17px] lg:text-[18px]"
                  style={{ color: "#0F172A" }}
                >
                  {sol.title}
                </div>

                {/* Description */}
                <div
                  className="relative mt-1.5 text-xs leading-relaxed md:text-[13px] lg:text-[14px]"
                  style={{ color: "#64748B" }}
                >
                  {sol.text}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Bottom story callout (Positioned absolutely to match Slide 1) ── */}
        {slide.bottomStory && (
          <motion.div
            className="absolute bottom-[5%] left-1/2 -translate-x-1/2 z-20 w-auto max-w-[88%]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 shadow-md md:py-2"
              style={{
                background: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: bottomBorder,
                boxShadow: bottomShadow,
              }}
            >
              <div
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                style={{
                  background: checkBg,
                }}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-[#1E293B] md:text-xs">
                {slide.bottomStory}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}


export default function JasperSlideRenderer({ slide }: { slide: any }) {
  if (slide.layout === "centered-illustration") {
    return <CenteredIllustrationSlide slide={slide} />;
  }

  if (slide.layout === "solutions-bento") {
    return <SolutionsBentoSlide slide={slide} />;
  }

  const UiCard = uiComponents[slide.uiPreview?.type];

  return (
    <motion.div
      className="relative flex h-full w-full overflow-hidden"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* ── Grid pattern overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage: `linear-gradient(${slide.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${slide.gridColor} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Geometric shapes layer ── */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        {slide.shapes?.map((shape, i) => (
          <GeometricShape key={i} shape={shape} />
        ))}
      </div>

      {/* ── Content: left side (text) ── */}
      <motion.div
        className="relative z-10 flex w-full flex-col justify-center px-6 py-8 md:w-[40%] md:px-10 md:py-12 lg:w-[38%]"
        variants={stagger}
      >
        <motion.h3
          variants={fadeUp}
          className="mb-3 text-2xl font-extrabold leading-tight tracking-tight md:text-3xl lg:text-4xl"
          style={{ color: "var(--text-on-light)" }}
        >
          {slide.title}
        </motion.h3>
        {slide.description && (
          <motion.p
            variants={fadeUp}
            className="max-w-sm text-sm leading-relaxed md:text-base"
            style={{ color: "var(--text-on-light-muted)" }}
          >
            {slide.description}
          </motion.p>
        )}
      </motion.div>

      {/* ── Human figure (center, Jasper-style) ── */}
      {slide.personImage && (
        <div
          className="pointer-events-none absolute z-[5] hidden md:block"
          style={{
            bottom: 0,
            left: "50%",
            width: "58%",
            maxWidth: 600,
            height: "88%",
            transform: "translateX(-50%)",
          }}
        >
          <motion.div variants={personRise} className="relative h-full w-full">
            <Image
              src={slide.personImage}
              alt=""
              fill
              sizes="600px"
              className="object-contain object-bottom"
              priority
            />
          </motion.div>
        </div>
      )}

      {/* ── UI Preview card (right side) ── */}
      {UiCard && (
        <motion.div
          variants={fadeUp}
          className="absolute right-[4%] top-1/2 z-10 hidden w-[36%] max-w-[300px] -translate-y-1/2 md:block lg:w-[32%]"
        >
          <UiCard data={slide.uiPreview} />
        </motion.div>
      )}

      {/* ── Stat badges ── */}
      {slide.stats?.map((stat, i) => (
        <StatBadge key={i} stat={stat} />
      ))}

      {/* ── Floating widgets (SaaS UI elements) ── */}
      {slide.floatingWidgets?.map((widget, i) => (
        <FloatingWidget key={i} widget={widget} />
      ))}

      {/* ── Feature callout ── */}
      {slide.featureCallout && (
        <FeatureCallout callout={slide.featureCallout} />
      )}
    </motion.div>
  );
}
