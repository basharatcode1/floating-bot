"use client";

import { useState, useEffect } from "react";
import Sidebar from "../dashboard/components/Sidebar";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import { DashButton } from "@/app/components/ui/dash-button";
import BillingSkeleton from "./components/BillingSkeleton";
import {
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Receipt,
  Zap,
  Shield,
  Star,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

const invoices = [
  {
    id: "INV-2024-008",
    date: "Aug 01, 2024",
    period: "August 2024",
    amount: "$499.00",
    status: "Due",
  },
  {
    id: "INV-2024-007",
    date: "Jul 01, 2024",
    period: "July 2024",
    amount: "$499.00",
    status: "Paid",
  },
  {
    id: "INV-2024-006",
    date: "Jun 01, 2024",
    period: "June 2024",
    amount: "$499.00",
    status: "Paid",
  },
  {
    id: "INV-2024-005",
    date: "May 01, 2024",
    period: "May 2024",
    amount: "$499.00",
    status: "Paid",
  },
  {
    id: "INV-2024-004",
    date: "Apr 01, 2024",
    period: "April 2024",
    amount: "$349.00",
    status: "Paid",
  },
];

const planFeatures = [
  "Unlimited job requirements",
  "Up to 10 active vendor partners",
  "AI-powered candidate matching",
  "Priority support (24hr SLA)",
  "Advanced analytics & reporting",
  "Sub-user management (5 seats)",
];

export default function ClientBillingPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleExportCSV = () => {
    setDownloading(true);
    const headers = [
      "Invoice ID",
      "Billing Period",
      "Date",
      "Amount",
      "Status",
    ];
    const rows = invoices.map((inv) => [
      `"${inv.id}"`,
      `"${inv.period}"`,
      `"${inv.date}"`,
      `"${inv.amount}"`,
      `"${inv.status}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `client_invoices_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 800);
  };

  const handleDownloadInvoice = (inv: (typeof invoices)[0]) => {
    const receiptContent = `================================================
              INVOICE STATEMENT
================================================
Invoice ID:     ${inv.id}
Period:         ${inv.period}
Billing Date:   ${inv.date}
Amount:         ${inv.amount}
Status:         ${inv.status}
================================================
Plan:           Enterprise Client ($499/month)
Billed To:      John Smith, TechCorp India
Payment Method: VISA ending •••• 4242
================================================
Thank you for partnering with StaffSync.
================================================`;
    const blob = new Blob([receiptContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `invoice_${inv.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        loading={loading}
      />

      <main
        className={`dash-main ${sidebarCollapsed ? "dash-main-collapsed" : ""}`}
      >
        <DashboardHeader onMobileToggle={() => setMobileOpen((p) => !p)} />

        <div className="dash-content">
          {loading ? (
            <BillingSkeleton />
          ) : (
            <div className="sk-page-content-enter">
              {/* ─── Page Header ─── */}
              <div className="dash-page-header">
                <div>
                  <h1 className="dash-page-title">
                    Billing &amp; Subscription
                  </h1>
                  <p className="dash-page-subtitle">
                    Manage your plan, payment methods, and invoices.
                  </p>
                </div>
                <div className="dash-page-actions">
                  <DashButton
                    variant="ghost"
                    onClick={handleExportCSV}
                    disabled={downloading}
                  >
                    <Download className="w-4 h-4" />
                    {downloading ? "Exporting..." : "Export All"}
                  </DashButton>
                </div>
              </div>

              {/* ─── Stat Summary Row ─── */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 20,
                  marginBottom: 24,
                }}
              >
                {[
                  {
                    icon: <Receipt size={20} />,
                    color: "#6366F1",
                    bg: "rgba(99,102,241,0.12)",
                    label: "Next Payment",
                    value: "$499.00",
                    sub: "Due Aug 01, 2024",
                    subColor: "#6366F1",
                  },
                  {
                    icon: <TrendingUp size={20} />,
                    color: "#10B981",
                    bg: "rgba(16,185,129,0.12)",
                    label: "Total Spent YTD",
                    value: "$2,845.00",
                    sub: "+$499 last month",
                    subColor: "#10B981",
                  },
                  {
                    icon: <CalendarDays size={20} />,
                    color: "#06B6D4",
                    bg: "rgba(6,182,212,0.12)",
                    label: "Member Since",
                    value: "Apr 2024",
                    sub: "Active for 4 months",
                    subColor: "#06B6D4",
                  },
                ].map((stat) => (
                  <div key={stat.label} className="billing-stat-card">
                    <div
                      className="billing-stat-top-accent"
                      style={{
                        background: `linear-gradient(90deg, ${stat.color}, transparent)`,
                      }}
                    />
                    <div className="billing-stat-header">
                      <div
                        className="billing-stat-icon-box"
                        style={{
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </div>
                      <span className="billing-stat-label">{stat.label}</span>
                    </div>
                    <div className="billing-stat-value">{stat.value}</div>
                    <div
                      className="billing-stat-subtext"
                      style={{ color: stat.subColor }}
                    >
                      {stat.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* ─── Main 2-col grid ─── */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  marginBottom: 20,
                }}
              >
                {/* ── Current Plan ── */}
                <div
                  className="dash-card"
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  {/* Decorative gradient blob */}
                  <div
                    style={{
                      position: "absolute",
                      top: -60,
                      right: -60,
                      width: 200,
                      height: 200,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)",
                      pointerEvents: "none",
                    }}
                  />
                  <div className="dash-card-header">
                    <h2 className="dash-card-title">
                      <span className="dash-card-title-icon" />
                      Current Plan
                    </h2>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: "rgba(16,185,129,0.12)",
                        color: "#34D399",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#34D399",
                          animation: "pulse-dot 2s ease-in-out infinite",
                        }}
                      />
                      Active
                    </span>
                  </div>

                  {/* Plan badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "16px 20px",
                      background:
                        "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.06))",
                      border: "1px solid rgba(99,102,241,0.2)",
                      borderRadius: 12,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "var(--dash-text-primary)",
                        flexShrink: 0,
                      }}
                    >
                      <Star size={22} className="text-indigo-500" />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--dash-text-primary)",
                        }}
                      >
                        Enterprise Client
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--dash-text-muted)",
                          marginTop: 2,
                        }}
                      >
                        Renews on{" "}
                        <strong
                          style={{
                            color: "var(--dash-text-secondary)",
                            fontWeight: 500,
                          }}
                        >
                          Aug 01, 2024
                        </strong>
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          color: "var(--dash-text-primary)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        $499
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--dash-text-muted)",
                        }}
                      >
                        /month
                      </div>
                    </div>
                  </div>

                  {/* Features list */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      marginBottom: 20,
                    }}
                  >
                    {planFeatures.map((f) => (
                      <div
                        key={f}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <CheckCircle2
                          size={15}
                          style={{ color: "#34D399", flexShrink: 0 }}
                        />
                        <span
                          style={{
                            fontSize: 13,
                            color: "var(--dash-text-secondary)",
                          }}
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  <DashButton variant="ghost" style={{ width: "100%" }}>
                    <ChevronRight className="w-4 h-4" />
                    View All Plans
                  </DashButton>
                </div>

                {/* ── Payment Method ── */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h2 className="dash-card-title">
                      <span className="dash-card-title-icon" />
                      Payment Method
                    </h2>
                    <button
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--accent-primary)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      + Add New
                    </button>
                  </div>

                  {/* Card display */}
                  <div
                    style={{
                      borderRadius: 14,
                      padding: "22px 24px",
                      background: "linear-gradient(135deg, #1a1f3a, #0e1524)",
                      border: "1px solid rgba(99,102,241,0.25)",
                      marginBottom: 20,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Card shimmer lines */}
                    <div
                      style={{
                        position: "absolute",
                        top: -40,
                        right: -40,
                        width: 150,
                        height: 150,
                        borderRadius: "50%",
                        background:
                          "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 28,
                      }}
                    >
                      <div style={{ display: "flex", gap: 6 }}>
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.3)",
                            }}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#fff",
                          letterSpacing: "0.05em",
                        }}
                      >
                        VISA
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.9)",
                        letterSpacing: "0.15em",
                        marginBottom: 20,
                      }}
                    >
                      •••• •••• •••• 4242
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.4)",
                            marginBottom: 2,
                            textTransform: "capitalize",
                            letterSpacing: "0.08em",
                          }}
                        >
                          Card holder
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.85)",
                          }}
                        >
                          John Smith
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.4)",
                            marginBottom: 2,
                            textTransform: "capitalize",
                            letterSpacing: "0.08em",
                          }}
                        >
                          Expires
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.85)",
                          }}
                        >
                          12/26
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security badges */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "12px 14px",
                      background: "var(--dash-card-hover)",
                      borderRadius: 10,
                      border: "1px solid var(--dash-card-border)",
                      marginBottom: 16,
                    }}
                  >
                    <Shield size={14} style={{ color: "#34D399" }} />
                    <span
                      style={{ fontSize: 12, color: "var(--dash-text-muted)" }}
                    >
                      Secured by 256-bit SSL encryption. PCI DSS compliant.
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <DashButton variant="ghost" size="sm" style={{ flex: 1 }}>
                      Edit Card
                    </DashButton>
                    <DashButton variant="ghost" size="sm" style={{ flex: 1 }}>
                      Remove
                    </DashButton>
                  </div>
                </div>
              </div>

              {/* ─── Invoices Table ─── */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <h2 className="dash-card-title">
                    <span className="dash-card-title-icon" />
                    Invoice History
                  </h2>
                  <DashButton
                    variant="ghost"
                    size="sm"
                    onClick={handleExportCSV}
                    disabled={downloading}
                  >
                    <Download className="w-3.5 h-3.5" />
                    {downloading ? "Downloading..." : "Download All"}
                  </DashButton>
                </div>

                <div className="billing-table-container">
                  <table className="billing-table">
                    <thead>
                      <tr>
                        {[
                          "Invoice ID",
                          "Period",
                          "Date",
                          "Amount",
                          "Status",
                          "Action",
                        ].map((h) => (
                          <th
                            key={h}
                            className="billing-table-th"
                            style={{
                              textAlign: h === "Action" ? "center" : "left",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => {
                        const isPaid = inv.status === "Paid";
                        const isDue = inv.status === "Due";
                        return (
                          <tr key={inv.id} className="billing-table-tr">
                            <td className="billing-table-td">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="billing-table-icon-badge"
                                  style={{
                                    color: "#6366F1",
                                  }}
                                >
                                  <CreditCard size={15} />
                                </div>
                                <span className="font-semibold text-xs text-[var(--dash-text-primary)]">
                                  {inv.id}
                                </span>
                              </div>
                            </td>
                            <td className="billing-table-td text-[var(--dash-text-secondary)] font-medium">
                              {inv.period}
                            </td>
                            <td className="billing-table-td text-[var(--dash-text-muted)]">
                              {inv.date}
                            </td>
                            <td className="billing-table-td font-bold text-xs text-[var(--dash-text-primary)]">
                              {inv.amount}
                            </td>
                            <td className="billing-table-td">
                              <span
                                className={
                                  isPaid
                                    ? "billing-badge-success"
                                    : isDue
                                      ? "billing-badge-warning"
                                      : "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-500"
                                }
                              >
                                {isPaid ? (
                                  <CheckCircle2 size={11} />
                                ) : isDue ? (
                                  <Clock size={11} />
                                ) : (
                                  <AlertCircle size={11} />
                                )}
                                {inv.status}
                              </span>
                            </td>
                            <td className="billing-table-td text-center">
                              <button
                                onClick={() => handleDownloadInvoice(inv)}
                                className="billing-action-btn"
                              >
                                <Download size={13} />
                                Invoice
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
