"use client";

import { useState, useEffect } from "react";
import VendorSidebar from "../dashboard/components/VendorSidebar";
import VendorDashboardHeader from "../dashboard/components/VendorDashboardHeader";
import { DashButton } from "@/app/components/ui/dash-button";
import BillingSkeleton from "./components/BillingSkeleton";
import {
  ArrowDownToLine,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Wallet,
  Banknote,
  ChevronRight,
  Shield,
  CreditCard,
  BarChart3,
  CircleDollarSign,
} from "lucide-react";
import { useSidebar } from "@/app/components/SidebarContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/app/components/ui/pagination";


const transactions = [
  {
    id: "TXN-2024-018",
    description: "Placement Fee – Senior React Developer",
    date: "Aug 12, 2024",
    type: "Earning",
    amount: "+$2,200.00",
    status: "Cleared",
    positive: true,
  },
  {
    id: "TXN-2024-017",
    description: "Withdrawal to HDFC Bank ••••3310",
    date: "Aug 05, 2024",
    type: "Withdrawal",
    amount: "-$3,000.00",
    status: "Completed",
    positive: false,
  },
  {
    id: "TXN-2024-016",
    description: "Placement Fee – Full Stack Engineer",
    date: "Jul 28, 2024",
    type: "Earning",
    amount: "+$1,800.00",
    status: "Cleared",
    positive: true,
  },
  {
    id: "TXN-2024-015",
    description: "Placement Fee – DevOps Lead",
    date: "Jul 15, 2024",
    type: "Earning",
    amount: "+$2,500.00",
    status: "Pending",
    positive: true,
  },
  {
    id: "TXN-2024-014",
    description: "Platform Subscription Fee",
    date: "Jul 01, 2024",
    type: "Fee",
    amount: "-$149.00",
    status: "Completed",
    positive: false,
  },
];

const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const barValues = [3200, 2800, 4100, 3700, 5200, 4500, 6500];
const maxBar = Math.max(...barValues);

export default function VendorBillingPage() {
  const { collapsed: sidebarCollapsed, toggleCollapse, mobileOpen, setMobileOpen, toggleMobile } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleExportCSV = () => {
    setDownloading(true);
    const headers = ["Transaction ID", "Description", "Date", "Type", "Amount", "Status"];
    const rows = transactions.map((t) => [
      `"${t.id}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.date}"`,
      `"${t.type}"`,
      `"${t.amount}"`,
      `"${t.status}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendor_transactions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 800);
  };

  const handleDownloadReceipt = (txn: typeof transactions[0]) => {
    const receiptContent = `================================================
           TRANSACTION RECEIPT
================================================
Transaction ID: ${txn.id}
Date:           ${txn.date}
Description:    ${txn.description}
Type:           ${txn.type}
Amount:         ${txn.amount}
Status:         ${txn.status}
================================================
Account:        HDFC Bank ••••3310
Beneficiary:    Ravi Kumar
================================================
Thank you for using StaffSync Billing.
================================================`;
    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `receipt_${txn.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <VendorSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        loading={loading}
      />

      <main
        className={`dash-main ${sidebarCollapsed ? "dash-main-collapsed" : ""}`}
        
      >
        <VendorDashboardHeader onMobileToggle={() => toggleMobile()} />

        <div className="dash-content">
          {loading ? (
            <BillingSkeleton />
          ) : (
            <div className="sk-page-content-enter">

            {/* ─── Page Header ─── */}
            <div className="dash-page-header">
              <div>
                <h1 className="dash-page-title">
                  Earnings &amp; Billing
                </h1>
                <p className="dash-page-subtitle">
                  Track your placements revenue, withdrawals, and financial history.
                </p>
              </div>
              <div className="dash-page-actions">
                <DashButton variant="ghost" onClick={handleExportCSV}>
                  <Download className="w-4 h-4" />
                  Statement
                </DashButton>
                <DashButton variant="primary">
                  <ArrowDownToLine className="w-4 h-4" />
                  Withdraw Funds
                </DashButton>
              </div>
            </div>

            {/* ─── KPI Stat Cards ─── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 20,
                marginBottom: 24,
              }}
            >
              {[
                {
                  icon: <Wallet size={20} />,
                  color: "#6366F1",
                  bg: "rgba(99,102,241,0.12)",
                  label: "Available Balance",
                  value: "$4,250",
                  sub: "Ready to withdraw",
                  subColor: "#10B981",
                },
                {
                  icon: <Clock size={20} />,
                  color: "#F59E0B",
                  bg: "rgba(245,158,11,0.12)",
                  label: "Pending Clearance",
                  value: "$2,500",
                  sub: "Clears in ~5 days",
                  subColor: "#F59E0B",
                },
                {
                  icon: <TrendingUp size={20} />,
                  color: "#10B981",
                  bg: "rgba(16,185,129,0.12)",
                  label: "Total Earned",
                  value: "$29,200",
                  sub: "Year-to-date",
                  subColor: "#10B981",
                },
                {
                  icon: <BarChart3 size={20} />,
                  color: "#06B6D4",
                  bg: "rgba(6,182,212,0.12)",
                  label: "This Month",
                  value: "$6,500",
                  sub: "+44% vs last month",
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
                    <span className="billing-stat-label">
                      {stat.label}
                    </span>
                  </div>
                  <div className="billing-stat-value">
                    {stat.value}
                  </div>
                  <div
                    className="billing-stat-subtext"
                    style={{ color: stat.subColor }}
                  >
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* ─── 2-col: Chart + Bank Details ─── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr",
                gap: 20,
                marginBottom: 20,
              }}
            >
              {/* ── Monthly Earnings Bar Chart ── */}
              <div className="dash-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div className="dash-card-header">
                  <h2 className="dash-card-title">
                    <span className="dash-card-title-icon" />
                    Monthly Earnings
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
                    <TrendingUp size={11} />
                    +44% this month
                  </span>
                </div>

                {/* CSS bar chart */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 12,
                    flex: 1,
                    minHeight: 220,
                    padding: "16px 4px 0",
                    marginBottom: 16,
                  }}
                >
                  {barValues.map((val, idx) => {
                    const isLast = idx === barValues.length - 1;
                    const heightPct = (val / maxBar) * 100;
                    return (
                      <div
                        key={months[idx]}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 8,
                          height: "100%",
                          justifyContent: "flex-end",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: `${heightPct}%`,
                            borderRadius: "6px 6px 4px 4px",
                            background: isLast
                              ? "linear-gradient(180deg, #818CF8 0%, #6366F1 100%)"
                              : "linear-gradient(180deg, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0.15) 100%)",
                            transition: "height 0.5s ease",
                            position: "relative",
                            cursor: "pointer",
                          }}
                          title={`$${val.toLocaleString()}`}
                        />
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: isLast
                              ? "var(--dash-text-primary)"
                              : "var(--dash-text-muted)",
                          }}
                        >
                          {months[idx]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Y-axis labels */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid var(--dash-divider)",
                    paddingTop: 10,
                  }}
                >
                  {[0, 2000, 4000, 6000].map((v) => (
                    <span
                      key={v}
                      style={{ fontSize: 10, color: "var(--dash-text-muted)" }}
                    >
                      ${v.toLocaleString()}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Bank / Payout Details ── */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <h2 className="dash-card-title">
                    <span className="dash-card-title-icon" />
                    Payout Account
                  </h2>
                  <button
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--accent-primary)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </div>

                {/* Bank card visual */}
                <div
                  style={{
                    borderRadius: 14,
                    padding: "20px 22px",
                    background: "linear-gradient(135deg, #0f172a, #1e293b)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    marginBottom: 16,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -30,
                      right: -30,
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent)",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 18,
                    }}
                  >
                    <Banknote size={20} style={{ color: "#22D3EE" }} />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.4)",
                        textTransform: "capitalize",
                        letterSpacing: "0.08em",
                      }}
                    >
                      HDFC Bank
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.85)",
                      letterSpacing: "0.1em",
                      marginBottom: 14,
                    }}
                  >
                    ••••  ••••  ••••  3310
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 2, textTransform: "capitalize", letterSpacing: "0.08em" }}>Account holder</div>
                      <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>Ravi Kumar</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 2, textTransform: "capitalize", letterSpacing: "0.08em" }}>IFSC</div>
                      <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>HDFC0001234</div>
                    </div>
                  </div>
                </div>

                {/* Security note */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    background: "var(--dash-card-hover)",
                    borderRadius: 8,
                    border: "1px solid var(--dash-card-border)",
                    marginBottom: 14,
                  }}
                >
                  <Shield size={13} style={{ color: "#34D399" }} />
                  <span style={{ fontSize: 11, color: "var(--dash-text-muted)" }}>
                    Bank details are encrypted and secure.
                  </span>
                </div>

                {/* Withdraw CTA */}
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 10,
                    background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.06))",
                    border: "1px solid rgba(99,102,241,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--dash-text-primary)" }}>
                      $4,250 available
                    </div>
                    <div style={{ fontSize: 11, color: "var(--dash-text-muted)" }}>
                      Estimated arrival: 2-3 business days
                    </div>
                  </div>
                  <DashButton variant="primary" size="sm">
                    Withdraw
                    <ChevronRight className="w-3.5 h-3.5" />
                  </DashButton>
                </div>
              </div>
            </div>

            {/* ─── Transaction History ─── */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h2 className="dash-card-title">
                  <span className="dash-card-title-icon" />
                  Transaction History
                </h2>
                <DashButton
                  variant="ghost"
                  size="sm"
                  onClick={handleExportCSV}
                  disabled={downloading}
                >
                  <Download className="w-3.5 h-3.5" />
                  {downloading ? "Exporting..." : "Export CSV"}
                </DashButton>
              </div>

              <div className="billing-table-container">
                <table className="billing-table">
                  <thead>
                    <tr>
                      {["Transaction", "Date", "Type", "Amount", "Status", "Action"].map((h) => (
                        <th
                          key={h}
                          className="billing-table-th"
                          style={{ textAlign: h === "Action" ? "center" : "left" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => {
                      const isEarning = txn.type === "Earning";
                      const isCleared = txn.status === "Cleared" || txn.status === "Completed";
                      const isPending = txn.status === "Pending";

                      const iconBg = isEarning
                        ? "rgba(16,185,129,0.12)"
                        : txn.type === "Fee"
                        ? "rgba(239,68,68,0.1)"
                        : "rgba(99,102,241,0.12)";
                      const iconColor = isEarning
                        ? "#10B981"
                        : txn.type === "Fee"
                        ? "#EF4444"
                        : "#6366F1";

                      return (
                        <tr key={txn.id} className="billing-table-tr">
                          <td className="billing-table-td">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="billing-table-icon-badge"
                                style={{
                                  color: iconColor,
                                }}
                              >
                                {isEarning ? (
                                  <CircleDollarSign size={16} />
                                ) : txn.type === "Fee" ? (
                                  <CreditCard size={16} />
                                ) : (
                                  <ArrowDownToLine size={16} />
                                )}
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-[var(--dash-text-primary)]">
                                  {txn.description}
                                </div>
                                <div className="text-[11px] text-[var(--dash-text-muted)] mt-0.5">
                                  {txn.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="billing-table-td text-[var(--dash-text-secondary)] font-medium">
                            {txn.date}
                          </td>
                          <td className="billing-table-td">
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold"
                              style={{
                                background: iconBg,
                                color: iconColor,
                              }}
                            >
                              {txn.type}
                            </span>
                          </td>
                          <td className="billing-table-td font-bold text-xs">
                            <span style={{ color: txn.positive ? "#10B981" : "var(--dash-text-primary)" }}>
                              {txn.amount}
                            </span>
                          </td>
                          <td className="billing-table-td">
                            <span className={isCleared ? "billing-badge-success" : isPending ? "billing-badge-warning" : "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-500"}>
                              {isCleared ? (
                                <CheckCircle2 size={11} />
                              ) : isPending ? (
                                <Clock size={11} />
                              ) : (
                                <AlertCircle size={11} />
                              )}
                              {txn.status}
                            </span>
                          </td>
                          <td className="billing-table-td text-center">
                            <button
                              onClick={() => handleDownloadReceipt(txn)}
                              className="billing-action-btn"
                            >
                              <Download size={13} />
                              Receipt
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-[var(--dash-divider)]">
                <Pagination>
                  <PaginationContent className="w-full justify-between">
                    <PaginationItem>
                      <PaginationPrevious href="#" className="border-[var(--dash-divider)] border hover:bg-[var(--dash-card-hover)]" />
                    </PaginationItem>
                    <PaginationItem>
                      <p className="text-[var(--dash-text-muted)] text-sm font-medium" aria-live="polite">
                        Page <span className="text-[var(--dash-text-primary)] font-semibold">1</span> of <span className="text-[var(--dash-text-primary)] font-semibold">5</span>
                      </p>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" className="border-[var(--dash-divider)] border hover:bg-[var(--dash-card-hover)]" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
          )}
        </div>
      </main>
    </>
  );
}
