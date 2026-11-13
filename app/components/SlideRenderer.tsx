"use client";

import { motion } from "framer-motion";

// ── Animation variants ──────────────────────────────────────────────
const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideLeft: any = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// ── Glassmorphism card style helper ─────────────────────────────────
const glassCard = {
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid var(--card-light-border)",
  borderRadius: "16px",
  boxShadow: "0 10px 30px -10px rgba(15, 23, 42, 0.06)",
};

const glassCardSm = {
  ...glassCard,
  borderRadius: "12px",
  boxShadow: "0 4px 20px -8px rgba(15, 23, 42, 0.05)",
};

// ══════════════════════════════════════════════════════════════════════
//  COMPANY SLIDE SCENES (6 unique visualizations)
// ══════════════════════════════════════════════════════════════════════

/** Slide 1: Interactive network graph — nodes pulse and exchange signals */
function NetworkGraph() {
  const nodes = [
    { cx: 200, cy: 80, r: 22, label: "Tech Co" },
    { cx: 80, cy: 180, r: 18, label: "Agency A" },
    { cx: 320, cy: 160, r: 20, label: "Agency B" },
    { cx: 160, cy: 260, r: 16, label: "Startup" },
    { cx: 300, cy: 280, r: 19, label: "Corp" },
    { cx: 400, cy: 100, r: 15, label: "Firm X" },
  ];

  const edges = [
    [0, 1],
    [0, 2],
    [0, 5],
    [1, 3],
    [2, 4],
    [3, 4],
    [2, 5],
  ];

  return (
    <motion.svg
      viewBox="0 0 480 360"
      className="h-full w-full"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Connection lines */}
      {edges.map(([a, b], i) => (
        <motion.line
          key={`edge-${i}`}
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke="var(--accent-primary)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          opacity="0.3"
          variants={fadeUp}
        />
      ))}

      {/* Signal pulses along edges */}
      {edges.slice(0, 4).map(([a, b], i) => (
        <motion.circle
          key={`signal-${i}`}
          cx={nodes[a].cx}
          cy={nodes[a].cy}
          r="4"
          fill="var(--accent-primary)"
          opacity="0.8"
          animate={{
            cx: [nodes[a].cx, nodes[b].cx],
            cy: [nodes[a].cy, nodes[b].cy],
            opacity: [0.8, 0.3, 0.8],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.g key={`node-${i}`} variants={scaleIn}>
          {/* Outer glow ring */}
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r={node.r + 8}
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="1"
            opacity="0.2"
            animate={{ r: [node.r + 8, node.r + 14, node.r + 8] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
          {/* Node circle */}
          <circle
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="var(--card-light)"
            stroke="var(--accent-primary)"
            strokeWidth="2"
          />
          {/* Node icon */}
          <circle
            cx={node.cx}
            cy={node.cy}
            r={6}
            fill="var(--accent-primary)"
            opacity="0.7"
          />
          {/* Label */}
          <text
            x={node.cx}
            y={node.cy + node.r + 16}
            textAnchor="middle"
            fill="var(--text-on-light-muted)"
            fontSize="10"
            fontFamily="Inter, sans-serif"
          >
            {node.label}
          </text>
        </motion.g>
      ))}
    </motion.svg>
  );
}

/** Slide 2: Floating analytics dashboard with animated charts */
function AnalyticsDashboard() {
  const barData = [65, 82, 45, 90, 72, 58, 88];

  return (
    <motion.div
      className="relative flex h-full w-full items-center justify-center gap-4 p-4 md:gap-6"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Main chart card */}
      <motion.div
        variants={fadeUp}
        className="relative w-[55%] max-w-[280px] p-4 md:p-5"
        style={glassCard}
      >
        <div
          className="mb-3 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--text-on-light-muted)" }}
        >
          Performance Score
        </div>
        <div className="flex items-end gap-1.5" style={{ height: 100 }}>
          {barData.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                background:
                  i === 3 ? "var(--accent-primary)" : "rgba(15,23,42,0.1)",
              }}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{
                duration: 0.8,
                delay: 0.4 + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}
        </div>
        <div
          className="mt-2 flex justify-between text-[9px]"
          style={{ color: "var(--text-on-light-muted)" }}
        >
          <span>Mon</span>
          <span>Sun</span>
        </div>
      </motion.div>

      {/* Side metric cards */}
      <div className="flex w-[40%] max-w-[180px] flex-col gap-3">
        {[
          { label: "Avg Rating", value: "4.8", icon: "★" },
          { label: "On-Time", value: "96%", icon: "◷" },
          { label: "Retention", value: "89%", icon: "↻" },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            variants={slideLeft}
            className="flex items-center gap-3 p-3"
            style={glassCardSm}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
              style={{
                background: "rgba(var(--accent-primary-rgb, 59,130,246), 0.15)",
                color: "var(--accent-primary)",
              }}
            >
              {metric.icon}
            </span>
            <div>
              <div
                className="text-lg font-bold"
                style={{ color: "var(--text-on-light)" }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.15 }}
                >
                  {metric.value}
                </motion.span>
              </div>
              <div
                className="text-[9px] uppercase tracking-wider"
                style={{ color: "var(--text-on-light-muted)" }}
              >
                {metric.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/** Slide 3: Candidate cards flowing into a ranking board */
function CandidateRanking() {
  const candidates = [
    { name: "Sarah K.", role: "React Dev", score: 95, color: "#22d3ee" },
    { name: "Mike T.", role: "Node.js", score: 91, color: "#a78bfa" },
    { name: "Ava L.", role: "Full Stack", score: 88, color: "#f472b6" },
    { name: "Jay P.", role: "DevOps", score: 84, color: "#34d399" },
  ];

  return (
    <motion.div
      className="relative flex h-full w-full items-center justify-center p-4"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Floating incoming cards */}
      <div className="absolute left-[5%] top-[10%] flex flex-col gap-2 md:left-[8%]">
        {candidates.slice(0, 2).map((c, i) => (
          <motion.div
            key={c.name}
            className="flex items-center gap-2 px-3 py-2"
            style={glassCardSm}
            initial={{ opacity: 0, x: -60, rotate: -5 }}
            animate={{
              opacity: [0, 1, 1, 0.5],
              x: [-60, 0, 0, 80],
              rotate: [-5, 0, 0, 2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
              times: [0, 0.3, 0.7, 1],
            }}
          >
            <div
              className="h-6 w-6 rounded-full"
              style={{ background: c.color }}
            />
            <div>
              <div
                className="text-xs font-semibold"
                style={{ color: "var(--text-on-light)" }}
              >
                {c.name}
              </div>
              <div
                className="text-[9px]"
                style={{ color: "var(--text-on-light-muted)" }}
              >
                {c.role}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ranking board */}
      <motion.div
        variants={fadeUp}
        className="ml-auto mr-[5%] w-[55%] max-w-[260px] p-4 md:mr-[10%]"
        style={glassCard}
      >
        <div
          className="mb-3 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--text-on-light-muted)" }}
        >
          Top Matches
        </div>
        {candidates.map((c, i) => (
          <motion.div
            key={c.name}
            className="mb-2 flex items-center justify-between rounded-lg px-3 py-2"
            style={{
              background: "rgba(15,23,42,0.03)",
              border: "1px solid rgba(15,23,42,0.04)",
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.15 }}
          >
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold"
                style={{ color: "var(--text-on-light-muted)" }}
              >
                #{i + 1}
              </span>
              <div
                className="h-5 w-5 rounded-full"
                style={{ background: c.color }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-on-light)" }}
              >
                {c.name}
              </span>
            </div>
            <motion.div
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{
                background: "rgba(var(--accent-success-rgb, 16,185,129), 0.15)",
                color: "var(--accent-success)",
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.15, type: "spring" }}
            >
              {c.score}%
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/** Slide 4: Messaging timeline with sequential chat bubbles */
function MessagingTimeline() {
  const messages = [
    {
      from: "HR",
      text: "Candidate submitted for review",
      time: "9:14 AM",
      align: "left",
    },
    {
      from: "Vendor",
      text: "Profile updated with latest certs",
      time: "9:28 AM",
      align: "right",
    },
    {
      from: "HR",
      text: "Interview scheduled for Thursday",
      time: "10:05 AM",
      align: "left",
    },
    {
      from: "System",
      text: "Candidate moved to Stage 3",
      time: "10:12 AM",
      align: "center",
    },
    {
      from: "Vendor",
      text: "Availability confirmed ✓",
      time: "10:30 AM",
      align: "right",
    },
  ];

  return (
    <motion.div
      className="relative flex h-full w-full flex-col items-center justify-center gap-2 p-4 md:gap-3"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Vertical timeline rail */}
      <div
        className="absolute left-1/2 top-[10%] h-[80%] w-px -translate-x-1/2"
        style={{ background: "rgba(15,23,42,0.08)" }}
      />

      {messages.map((msg, i) => (
        <motion.div
          key={i}
          className="relative flex w-full max-w-[380px] items-center gap-3"
          style={{
            justifyContent:
              msg.align === "left"
                ? "flex-start"
                : msg.align === "right"
                  ? "flex-end"
                  : "center",
          }}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.3 + i * 0.4,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {msg.align === "center" ? (
            <div
              className="rounded-full px-4 py-1.5 text-[10px] font-medium"
              style={{
                background: "rgba(var(--accent-primary-rgb, 59,130,246), 0.15)",
                color: "var(--accent-primary)",
                border:
                  "1px solid rgba(var(--accent-primary-rgb, 59,130,246), 0.2)",
              }}
            >
              {msg.text}
            </div>
          ) : (
            <div
              className="max-w-[220px] rounded-2xl px-4 py-2.5"
              style={
                msg.align === "left"
                  ? glassCardSm
                  : {
                      ...glassCardSm,
                      background:
                        "rgba(var(--accent-primary-rgb, 59,130,246), 0.12)",
                      border:
                        "1px solid rgba(var(--accent-primary-rgb, 59,130,246), 0.2)",
                    }
              }
            >
              <div
                className="mb-1 text-[9px] font-bold uppercase tracking-wider"
                style={{ color: "var(--accent-primary)" }}
              >
                {msg.from}
              </div>
              <div
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-on-light)" }}
              >
                {msg.text}
              </div>
              <div
                className="mt-1 text-right text-[8px]"
                style={{ color: "var(--text-on-light-muted)" }}
              >
                {msg.time}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

/** Slide 5: Horizontal pipeline with candidates progressing through stages */
function PipelineDashboard() {
  const stages = [
    { name: "Submitted", count: 12, color: "var(--accent-primary)" },
    { name: "Screening", count: 8, color: "var(--accent-secondary)" },
    { name: "Interview", count: 5, color: "var(--accent-success)" },
    { name: "Offered", count: 2, color: "#f59e0b" },
  ];

  return (
    <motion.div
      className="relative flex h-full w-full flex-col items-center justify-center gap-4 p-4 md:flex-row md:gap-3"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {stages.map((stage, i) => (
        <motion.div
          key={stage.name}
          variants={fadeUp}
          className="relative flex-1"
        >
          {/* Connector arrow */}
          {i < stages.length - 1 && (
            <motion.div
              className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 md:block"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.2 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M4 2l8 6-8 6"
                  fill="none"
                  stroke="var(--text-on-light-muted)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          )}

          <div className="p-3 md:p-4" style={glassCard}>
            <div
              className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "var(--text-on-light-muted)" }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: stage.color }}
              />
              {stage.name}
            </div>
            <motion.div
              className="text-2xl font-bold md:text-3xl"
              style={{ color: "var(--text-on-light)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.15 }}
            >
              {stage.count}
            </motion.div>

            {/* Mini candidate avatars */}
            <div className="mt-2 flex -space-x-1.5">
              {Array.from({ length: Math.min(stage.count, 4) }).map((_, j) => (
                <motion.div
                  key={j}
                  className="h-5 w-5 rounded-full"
                  style={{
                    background: stage.color,
                    opacity: 0.6 + j * 0.1,
                    border: "2px solid var(--dark-bg)",
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.7 + i * 0.15 + j * 0.06,
                    type: "spring",
                  }}
                />
              ))}
            </div>

            {/* Animated progress bar */}
            <div
              className="mt-3 h-1 w-full overflow-hidden rounded-full"
              style={{ background: "rgba(15,23,42,0.06)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: stage.color }}
                initial={{ width: 0 }}
                animate={{
                  width: `${(stage.count / 12) * 100}%`,
                }}
                transition={{
                  duration: 1,
                  delay: 0.4 + i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          </div>
        </motion.div>
      ))}

      {/* Animated candidate moving through pipeline */}
      <motion.div
        className="absolute left-[5%] top-[50%] h-4 w-4 rounded-full md:left-[8%]"
        style={{
          background: "var(--accent-primary)",
          boxShadow: "0 0 12px var(--accent-primary)",
        }}
        animate={{
          x: [0, 100, 220, 340],
          opacity: [1, 0.8, 0.8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

/** Slide 6: Requirement form expanding into opportunity cards */
function RequirementExpansion() {
  const cards = [
    { title: "React Developer", loc: "Remote", urgent: true },
    { title: "Backend Engineer", loc: "NYC", urgent: false },
    { title: "DevOps Lead", loc: "SF", urgent: true },
    { title: "UI Designer", loc: "London", urgent: false },
    { title: "Data Analyst", loc: "Remote", urgent: false },
  ];

  const positions = [
    { x: -120, y: -80, rotate: -8 },
    { x: 100, y: -90, rotate: 5 },
    { x: -140, y: 60, rotate: -4 },
    { x: 120, y: 70, rotate: 7 },
    { x: 0, y: 110, rotate: -2 },
  ];

  return (
    <motion.div
      className="relative flex h-full w-full items-center justify-center p-4"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Central form */}
      <motion.div
        className="relative z-10 w-[180px] p-4 md:w-[220px]"
        style={glassCard}
        variants={scaleIn}
      >
        <div
          className="mb-3 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--accent-primary)" }}
        >
          New Requirement
        </div>
        {["Role", "Skills", "Location"].map((field, i) => (
          <motion.div
            key={field}
            className="mb-2 rounded-lg px-3 py-2"
            style={{
              background: "rgba(15,23,42,0.03)",
              border: "1px solid rgba(15,23,42,0.04)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <div
              className="text-[9px] uppercase tracking-wider"
              style={{ color: "var(--text-on-light-muted)" }}
            >
              {field}
            </div>
          </motion.div>
        ))}
        <motion.div
          className="mt-3 rounded-lg py-2 text-center text-xs font-bold"
          style={{
            background:
              "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
            color: "var(--text-on-light)",
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Publish →
        </motion.div>
      </motion.div>

      {/* Expanding opportunity cards */}
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          className="absolute px-3 py-2"
          style={{
            ...glassCardSm,
            width: "140px",
          }}
          initial={{
            opacity: 0,
            x: 0,
            y: 0,
            scale: 0.5,
            rotate: 0,
          }}
          animate={{
            opacity: [0, 1, 1, 0.6],
            x: positions[i].x,
            y: positions[i].y,
            scale: 1,
            rotate: positions[i].rotate,
          }}
          transition={{
            duration: 1.5,
            delay: 0.8 + i * 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="flex items-center justify-between">
            <div
              className="text-[10px] font-semibold"
              style={{ color: "var(--text-on-light)" }}
            >
              {card.title}
            </div>
            {card.urgent && (
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "#ef4444" }}
              />
            )}
          </div>
          <div
            className="text-[9px]"
            style={{ color: "var(--text-on-light-muted)" }}
          >
            {card.loc}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  VENDOR SLIDE SCENES (6 unique visualizations)
// ══════════════════════════════════════════════════════════════════════

/** Vendor Slide 1: Company opportunity network */
function OpportunityNetwork() {
  const companies = [
    { name: "TechVista", x: 120, y: 80, size: 26 },
    { name: "DataFlow", x: 340, y: 60, size: 22 },
    { name: "CloudPeak", x: 80, y: 200, size: 20 },
    { name: "AI Labs", x: 280, y: 180, size: 24 },
    { name: "FinCore", x: 380, y: 240, size: 18 },
    { name: "DevHub", x: 200, y: 300, size: 21 },
  ];

  const connections = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 5],
    [3, 4],
    [4, 5],
    [0, 3],
  ];

  return (
    <motion.svg
      viewBox="0 0 480 360"
      className="h-full w-full"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Dashed connection lines */}
      {connections.map(([a, b], i) => (
        <motion.line
          key={`conn-${i}`}
          x1={companies[a].x}
          y1={companies[a].y}
          x2={companies[b].x}
          y2={companies[b].y}
          stroke="var(--accent-secondary)"
          strokeWidth="1"
          strokeDasharray="8 6"
          opacity="0.25"
          variants={fadeUp}
          animate={{
            strokeDashoffset: [0, -28],
          }}
          transition={{
            strokeDashoffset: {
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />
      ))}

      {/* Company nodes */}
      {companies.map((co, i) => (
        <motion.g key={`co-${i}`} variants={scaleIn}>
          <motion.rect
            x={co.x - co.size}
            y={co.y - co.size * 0.7}
            width={co.size * 2}
            height={co.size * 1.4}
            rx="8"
            fill="var(--card-light)"
            stroke="var(--accent-secondary)"
            strokeWidth="1.5"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
          <text
            x={co.x}
            y={co.y + 3}
            textAnchor="middle"
            fill="var(--text-on-light)"
            fontSize="9"
            fontFamily="Inter, sans-serif"
            fontWeight="600"
          >
            {co.name}
          </text>
          {/* Status dot */}
          <motion.circle
            cx={co.x + co.size - 4}
            cy={co.y - co.size * 0.7 + 4}
            r="3"
            fill="var(--accent-success)"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        </motion.g>
      ))}
    </motion.svg>
  );
}

/** Vendor Slide 2: Trust and rating dashboard */
function TrustDashboard() {
  const metrics = [
    { label: "Trust Score", value: "92", suffix: "/100", icon: "◆" },
    { label: "Response Rate", value: "98", suffix: "%", icon: "◈" },
    { label: "Avg Pay Time", value: "3.2", suffix: " days", icon: "◷" },
  ];

  return (
    <motion.div
      className="relative flex h-full w-full flex-col items-center justify-center gap-3 p-4 md:flex-row md:gap-5"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Score gauge */}
      <motion.div
        variants={fadeUp}
        className="relative flex flex-col items-center p-5"
        style={glassCard}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="rgba(15,23,42,0.06)"
            strokeWidth="8"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * 100}`}
            initial={{ strokeDashoffset: Math.PI * 100 }}
            animate={{
              strokeDashoffset: Math.PI * 100 * (1 - 0.92),
            }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            transform="rotate(-90 60 60)"
          />
          <text
            x="60"
            y="55"
            textAnchor="middle"
            fill="var(--text-on-light)"
            fontSize="24"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            A+
          </text>
          <text
            x="60"
            y="72"
            textAnchor="middle"
            fill="var(--text-on-light-muted)"
            fontSize="9"
            fontFamily="Inter, sans-serif"
          >
            Trust Rating
          </text>
        </svg>
      </motion.div>

      {/* Metric cards */}
      <div className="flex flex-col gap-2.5">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            variants={slideLeft}
            className="flex items-center gap-3 px-4 py-3"
            style={glassCardSm}
          >
            <span
              className="text-lg"
              style={{ color: "var(--accent-primary)" }}
            >
              {m.icon}
            </span>
            <div>
              <motion.div
                className="text-xl font-bold"
                style={{ color: "var(--text-on-light)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.2 }}
              >
                {m.value}
                <span
                  className="text-sm font-normal"
                  style={{ color: "var(--text-on-light-muted)" }}
                >
                  {m.suffix}
                </span>
              </motion.div>
              <div
                className="text-[9px] uppercase tracking-wider"
                style={{ color: "var(--text-on-light-muted)" }}
              >
                {m.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/** Vendor Slide 3: Opportunity feed with notifications */
function OpportunityFeed() {
  const requirements = [
    {
      title: "Sr. React Engineer",
      company: "TechVista",
      match: "95%",
      isNew: true,
    },
    {
      title: "Cloud Architect",
      company: "CloudPeak",
      match: "88%",
      isNew: true,
    },
    { title: "Data Scientist", company: "AI Labs", match: "82%", isNew: false },
    {
      title: "Mobile Developer",
      company: "FinCore",
      match: "79%",
      isNew: false,
    },
    { title: "QA Lead", company: "DevHub", match: "76%", isNew: false },
  ];

  return (
    <motion.div
      className="relative flex h-full w-full flex-col items-center justify-center gap-2 p-4"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Notification bell */}
      <motion.div className="mb-2 flex items-center gap-2" variants={fadeUp}>
        <motion.div
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </motion.div>
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--accent-primary)" }}
        >
          2 New Matches
        </span>
      </motion.div>

      {/* Feed cards */}
      {requirements.map((req, i) => (
        <motion.div
          key={req.title}
          className="flex w-full max-w-[340px] items-center justify-between px-4 py-3"
          style={glassCardSm}
          initial={{ opacity: 0, y: 20, x: 10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{
            delay: 0.2 + i * 0.15,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="flex items-center gap-3">
            {req.isNew && (
              <motion.span
                className="h-2 w-2 rounded-full"
                style={{ background: "var(--accent-primary)" }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <div>
              <div
                className="text-xs font-semibold"
                style={{ color: "var(--text-on-light)" }}
              >
                {req.title}
              </div>
              <div
                className="text-[9px]"
                style={{ color: "var(--text-on-light-muted)" }}
              >
                {req.company}
              </div>
            </div>
          </div>
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold"
            style={{
              background: "rgba(var(--accent-success-rgb, 16,185,129), 0.12)",
              color: "var(--accent-success)",
            }}
          >
            {req.match}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

/** Vendor Slide 4: Live activity stream */
function ActivityStream() {
  const activities = [
    {
      status: "Submitted",
      candidate: "John D.",
      time: "2m ago",
      color: "var(--accent-primary)",
    },
    {
      status: "Screening",
      candidate: "Lisa M.",
      time: "15m ago",
      color: "var(--accent-secondary)",
    },
    {
      status: "Interview",
      candidate: "Raj P.",
      time: "1h ago",
      color: "var(--accent-success)",
    },
    {
      status: "Feedback",
      candidate: "Amy C.",
      time: "2h ago",
      color: "#f59e0b",
    },
    {
      status: "Offered",
      candidate: "Tom K.",
      time: "4h ago",
      color: "#22d3ee",
    },
  ];

  return (
    <motion.div
      className="relative flex h-full w-full items-center justify-center p-4"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <div className="relative w-full max-w-[340px]">
        {/* Timeline rail */}
        <div
          className="absolute left-5 top-0 h-full w-0.5"
          style={{ background: "rgba(15,23,42,0.06)" }}
        />

        {activities.map((act, i) => (
          <motion.div
            key={act.candidate}
            className="relative mb-3 flex items-start gap-4 pl-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.25 }}
          >
            {/* Dot on rail */}
            <motion.div
              className="absolute left-[14px] top-3 h-3 w-3 rounded-full"
              style={{
                background: act.color,
                boxShadow: `0 0 8px ${act.color}`,
              }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />

            <div className="flex-1 rounded-xl px-4 py-3" style={glassCardSm}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                    style={{
                      background: `${act.color}20`,
                      color: act.color,
                    }}
                  >
                    {act.status}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--text-on-light)" }}
                  >
                    {act.candidate}
                  </span>
                </div>
                <span
                  className="text-[9px]"
                  style={{ color: "var(--text-on-light-muted)" }}
                >
                  {act.time}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/** Vendor Slide 5: Candidate workflow pipeline */
function CandidateWorkflow() {
  const steps = [
    { label: "Match", icon: "⚡", active: true },
    { label: "Review", icon: "◎", active: true },
    { label: "Submit", icon: "↗", active: true },
    { label: "Track", icon: "◈", active: false },
  ];

  return (
    <motion.div
      className="relative flex h-full w-full items-center justify-center p-4"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col items-center gap-3 md:flex-row md:gap-2">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            variants={fadeUp}
            className="flex items-center gap-2"
          >
            <div
              className="flex flex-col items-center gap-2 p-4 md:p-5"
              style={glassCard}
            >
              <motion.span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                style={{
                  background: step.active
                    ? "rgba(var(--accent-primary-rgb, 59,130,246), 0.15)"
                    : "rgba(15,23,42,0.04)",
                  color: step.active
                    ? "var(--accent-primary)"
                    : "var(--text-on-light-muted)",
                }}
                animate={step.active ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
              >
                {step.icon}
              </motion.span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{
                  color: step.active
                    ? "var(--text-on-light)"
                    : "var(--text-on-light-muted)",
                }}
              >
                {step.label}
              </span>

              {/* Candidate card inside active step */}
              {step.active && i < 3 && (
                <motion.div
                  className="mt-1 rounded-lg px-3 py-1.5"
                  style={{
                    background: "rgba(15,23,42,0.03)",
                    border: "1px solid rgba(15,23,42,0.04)",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.2 }}
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{
                        background: `hsl(${200 + i * 40}, 70%, 60%)`,
                      }}
                    />
                    <span
                      className="text-[9px]"
                      style={{ color: "var(--text-on-light)" }}
                    >
                      Candidate {i + 1}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Arrow connector */}
            {i < steps.length - 1 && (
              <motion.div
                className="hidden text-lg md:block"
                style={{ color: "var(--text-on-light-muted)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.5 + i * 0.2 }}
              >
                →
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Animated progress line */}
      <motion.div
        className="absolute bottom-[20%] left-[10%] hidden h-0.5 md:block"
        style={{ background: "var(--accent-primary)" }}
        initial={{ width: 0 }}
        animate={{ width: "60%" }}
        transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}

/** Vendor Slide 6: Financial dashboard with invoices */
function FinancialDashboard() {
  const invoices = [
    {
      id: "INV-001",
      amount: "$12,400",
      status: "Paid",
      color: "var(--accent-success)",
    },
    {
      id: "INV-002",
      amount: "$8,750",
      status: "Processing",
      color: "var(--accent-primary)",
    },
    { id: "INV-003", amount: "$15,200", status: "Pending", color: "#f59e0b" },
  ];

  return (
    <motion.div
      className="relative flex h-full w-full items-center justify-center gap-4 p-4 md:gap-6"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Summary card */}
      <motion.div
        variants={fadeUp}
        className="w-[45%] max-w-[200px] p-4"
        style={glassCard}
      >
        <div
          className="mb-1 text-[9px] font-bold uppercase tracking-widest"
          style={{ color: "var(--text-on-light-muted)" }}
        >
          Total Earned
        </div>
        <motion.div
          className="text-2xl font-bold md:text-3xl"
          style={{ color: "var(--text-on-light)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          $36,350
        </motion.div>
        <div
          className="mt-1 text-xs"
          style={{ color: "var(--accent-success)" }}
        >
          +24% ↑
        </div>

        {/* Mini donut */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className="mx-auto mt-3"
        >
          <circle
            cx="40"
            cy="40"
            r="30"
            fill="none"
            stroke="rgba(15,23,42,0.06)"
            strokeWidth="6"
          />
          <motion.circle
            cx="40"
            cy="40"
            r="30"
            fill="none"
            stroke="var(--accent-success)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * 60 * 0.65} ${Math.PI * 60 * 0.35}`}
            initial={{ strokeDashoffset: Math.PI * 60 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            transform="rotate(-90 40 40)"
          />
          <motion.circle
            cx="40"
            cy="40"
            r="30"
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * 60 * 0.25} ${Math.PI * 60 * 0.75}`}
            strokeDashoffset={`-${Math.PI * 60 * 0.65}`}
            opacity="0.7"
            transform="rotate(-90 40 40)"
          />
        </svg>
      </motion.div>

      {/* Invoice list */}
      <div className="flex w-[50%] max-w-[240px] flex-col gap-2.5">
        {invoices.map((inv, i) => (
          <motion.div
            key={inv.id}
            variants={slideLeft}
            className="flex items-center justify-between px-4 py-3"
            style={glassCardSm}
          >
            <div>
              <div
                className="text-xs font-semibold"
                style={{ color: "var(--text-on-light)" }}
              >
                {inv.id}
              </div>
              <div
                className="text-sm font-bold"
                style={{ color: "var(--text-on-light)" }}
              >
                {inv.amount}
              </div>
            </div>
            <motion.span
              className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase"
              style={{
                background: `${inv.color}20`,
                color: inv.color,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.15 }}
            >
              {inv.status}
            </motion.span>
          </motion.div>
        ))}

        {/* Payment progress */}
        <motion.div
          variants={fadeUp}
          className="mt-1 px-4 py-3"
          style={glassCardSm}
        >
          <div className="flex justify-between">
            <span
              className="text-[9px] uppercase tracking-wider"
              style={{ color: "var(--text-on-light-muted)" }}
            >
              Payment cycle
            </span>
            <span
              className="text-[9px] font-bold"
              style={{ color: "var(--accent-primary)" }}
            >
              72%
            </span>
          </div>
          <div
            className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full"
            style={{ background: "rgba(15,23,42,0.06)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, var(--gradient-from), var(--gradient-to))",
              }}
              initial={{ width: 0 }}
              animate={{ width: "72%" }}
              transition={{
                duration: 1.2,
                delay: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  ILLUSTRATION MAP & SLIDE RENDERER
// ══════════════════════════════════════════════════════════════════════

const ILLUSTRATION_MAP = {
  // Company slides
  "network-graph": NetworkGraph,
  "analytics-dashboard": AnalyticsDashboard,
  "candidate-ranking": CandidateRanking,
  "messaging-timeline": MessagingTimeline,
  "pipeline-dashboard": PipelineDashboard,
  "requirement-expansion": RequirementExpansion,
  // Vendor slides
  "opportunity-network": OpportunityNetwork,
  "trust-dashboard": TrustDashboard,
  "opportunity-feed": OpportunityFeed,
  "activity-stream": ActivityStream,
  "candidate-workflow": CandidateWorkflow,
  "financial-dashboard": FinancialDashboard,
};

import type { MotionValue } from "framer-motion";

export interface SlideData {
  id: string;
  layoutType: string;
  illustrationType: string;
  title: string;
  description: string;
  badge?: string;
  bottomStory?: string;
  bgColor?: string;
  gridColor?: string;
  shapes?: any[];
  floatingWidgets?: any[];
  solutions?: any[];
}

interface SlideRendererProps {
  slide: SlideData;
  midLayer?:
    | { x: MotionValue<number> | number; y: MotionValue<number> | number }
    | any;
  fgLayer?:
    | { x: MotionValue<number> | number; y: MotionValue<number> | number }
    | any;
}

export default function SlideRenderer({
  slide,
  midLayer,
  fgLayer,
}: SlideRendererProps) {
  const Illustration = ILLUSTRATION_MAP[slide.illustrationType];
  if (!Illustration) return null;

  const isLeftContent = ["left-right", "timeline"].includes(slide.layoutType);
  const isRightContent = ["right-heavy"].includes(slide.layoutType);
  const isCentered = [
    "centered",
    "diagonal",
    "horizontal-workflow",
    "expansion",
    "feed",
    "analytics",
    "process",
    "vertical-timeline",
    "dashboard",
  ].includes(slide.layoutType);

  // Text reveal animation
  const textRevealContainer: any = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
  };
  const wordReveal: any = {
    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const titleWords = slide.title.split(" ");

  const contentBlock = (
    <motion.div
      className={`relative z-10 flex flex-col ${
        isCentered ? "items-center text-center" : "items-start text-left"
      }`}
      variants={textRevealContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Title with word-by-word reveal */}
      <h3
        className="mb-3 flex flex-wrap gap-x-2 text-xl font-bold leading-tight tracking-tight md:text-3xl lg:text-4xl"
        style={{ color: "var(--text-on-light)" }}
      >
        {titleWords.map((word, i) => (
          <motion.span key={i} variants={wordReveal}>
            {word}
          </motion.span>
        ))}
      </h3>

      {/* Description */}
      <motion.p
        className="max-w-md text-sm leading-relaxed md:text-base"
        style={{ color: "var(--text-on-light-muted)" }}
        variants={wordReveal}
      >
        {slide.description}
      </motion.p>
    </motion.div>
  );

  const illustrationBlock = (
    <motion.div
      className="relative"
      style={{
        x: midLayer?.x,
        y: midLayer?.y,
        width: "100%",
        height: "100%",
        willChange: "transform",
      }}
    >
      <Illustration />
    </motion.div>
  );

  // Layout rendering
  if (isLeftContent) {
    return (
      <div className="flex h-full w-full flex-col md:flex-row">
        <div className="flex flex-1 items-center justify-center p-6 md:p-10">
          {contentBlock}
        </div>
        <motion.div
          className="flex flex-1 items-center justify-center"
          style={{ x: fgLayer?.x, y: fgLayer?.y }}
        >
          {illustrationBlock}
        </motion.div>
      </div>
    );
  }

  if (isRightContent) {
    return (
      <div className="flex h-full w-full flex-col md:flex-row-reverse">
        <div className="flex flex-1 items-center justify-center p-6 md:p-10">
          {contentBlock}
        </div>
        <motion.div
          className="flex flex-1 items-center justify-center"
          style={{ x: fgLayer?.x, y: fgLayer?.y }}
        >
          {illustrationBlock}
        </motion.div>
      </div>
    );
  }

  // Centered / full-width layouts
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-center px-6 pt-6 md:px-10 md:pt-8">
        {contentBlock}
      </div>
      <motion.div
        className="flex flex-1 items-center justify-center px-4"
        style={{ x: fgLayer?.x, y: fgLayer?.y }}
      >
        {illustrationBlock}
      </motion.div>
    </div>
  );
}
