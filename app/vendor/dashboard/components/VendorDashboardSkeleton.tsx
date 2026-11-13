import {
  SkeletonLine,
  SkeletonBlock,
  SkeletonBadge,
  SkeletonContainer,
} from "@/app/client/shared/skeletons/SkeletonBase";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/app/components/ui/table";

/* ─────────────────────────────────────────────────────────────
   VendorDashboardSkeleton
   Full-page placeholder that mirrors the real dashboard layout:
   • Page header row with title, live badge, and action buttons
   • 3 Stat Cards (Submissions, Candidate Pipeline, Client Performance)
   • Content grid (RecentSubmissions + VendorLiveActivity)
   • Bottom TopOpportunities section
   ───────────────────────────────────────────────────────────── */
export default function VendorDashboardSkeleton() {
  return (
    <SkeletonContainer>
      {/* ── Page Header ── */}
      <div className="dash-page-header">
        <div className="min-w-0">
          <h1
            className="dash-page-title"
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <SkeletonLine
              style={{ width: 160, height: 34, borderRadius: 8, marginBottom: 0 }}
            />
            <SkeletonBadge width={48} style={{ height: 20 }} />
          </h1>
          <p className="page-subtitle dash-page-subtitle">
            <SkeletonLine style={{ width: 320, height: 14, marginBottom: 0 }} />
          </p>
        </div>
        <div className="dash-page-actions" style={{ display: "flex", gap: 10 }}>
          <SkeletonBlock style={{ width: 136, height: 34, borderRadius: 12 }} />
          <SkeletonBlock style={{ width: 156, height: 34, borderRadius: 12 }} />
        </div>
      </div>

      {/* ── 3 Stat Cards Row ── */}
      <div className="dash-stats-grid">
        {/* ── Submissions ── */}
        <div className="dash-stat-card dash-stat-card--donut">
          <div className="section-heading">
            <div className="section-heading-main">
              <div className="section-heading-icon">
                <SkeletonBlock style={{ width: 24, height: 24, borderRadius: 6 }} />
              </div>
              <div className="section-heading-text">
                <SkeletonLine style={{ width: 92, height: 15, marginBottom: 0 }} />
              </div>
            </div>
            <div className="section-heading-actions">
              <SkeletonBadge width={64} />
            </div>
          </div>
          <div className="dash-stat-hero-row">
            <SkeletonLine style={{ width: 28, height: 18, marginBottom: 0 }} />
            <SkeletonLine
              style={{ width: 112, height: 12, marginLeft: 4, marginBottom: 0 }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              padding: "16px 8px 24px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <SkeletonLine style={{ width: 56, height: 12, marginBottom: 0 }} />
                <SkeletonBlock
                  style={{ flex: 1, height: 22, margin: "0 10px", borderRadius: 6 }}
                />
                <SkeletonLine style={{ width: 52, height: 12, marginBottom: 0 }} />
              </div>
            ))}
          </div>
          <div className="dash-stat-trend">
            <SkeletonLine style={{ width: 165, height: 12, marginBottom: 0 }} />
          </div>
        </div>

        {/* ── Candidate Pipeline ── */}
        <div className="dash-stat-card dash-stat-card--bar">
          <div className="section-heading">
            <div className="section-heading-main">
              <div className="section-heading-icon">
                <SkeletonBlock style={{ width: 24, height: 24, borderRadius: 6 }} />
              </div>
              <div className="section-heading-text">
                <SkeletonLine style={{ width: 126, height: 15, marginBottom: 0 }} />
              </div>
            </div>
            <div className="section-heading-actions">
              <SkeletonBadge width={54} />
            </div>
          </div>
          <div className="dash-stat-hero-row">
            <SkeletonLine style={{ width: 28, height: 18, marginBottom: 0 }} />
            <SkeletonLine
              style={{ width: 112, height: 12, marginLeft: 4, marginBottom: 0 }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 180,
              marginTop: 6,
            }}
          >
            <div style={{ width: "65%" }}>
              <SkeletonBlock style={{ height: 136, borderRadius: 8, width: "90%" }} />
            </div>
            <div
              style={{
                width: "35%",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {[0, 1, 2].map((i) => (
                <SkeletonLine
                  key={i}
                  style={{ width: "80%", height: 12, marginBottom: 0 }}
                />
              ))}
            </div>
          </div>
          <div className="dash-stat-trend">
            <SkeletonLine style={{ width: 110, height: 12, marginBottom: 0 }} />
          </div>
        </div>

        {/* ── Client Performance ── */}
        <div className="dash-stat-card dash-stat-card--vendor">
          <div className="section-heading">
            <div className="section-heading-main">
              <div className="section-heading-icon">
                <SkeletonBlock style={{ width: 24, height: 24, borderRadius: 6 }} />
              </div>
              <div className="section-heading-text">
                <SkeletonLine style={{ width: 132, height: 15, marginBottom: 0 }} />
              </div>
            </div>
            <div className="section-heading-actions">
              <SkeletonBadge width={46} />
            </div>
          </div>
          <div className="dash-vendor-kpi-row">
            <div className="dash-vendor-kpi">
              <SkeletonLine style={{ width: 28, height: 18, marginBottom: 0 }} />
              <SkeletonLine style={{ width: 76, height: 12, marginBottom: 0 }} />
            </div>
            <div className="dash-vendor-kpi-divider" />
            <div className="dash-vendor-kpi">
              <SkeletonLine style={{ width: 36, height: 18, marginBottom: 0 }} />
              <SkeletonLine style={{ width: 72, height: 12, marginBottom: 0 }} />
            </div>
            <div className="dash-vendor-kpi-divider" />
            <div className="dash-vendor-kpi">
              <SkeletonLine style={{ width: 36, height: 18, marginBottom: 0 }} />
              <SkeletonLine style={{ width: 64, height: 12, marginBottom: 0 }} />
            </div>
          </div>
          <div style={{ height: 116, marginBottom: 12 }}>
            <SkeletonBlock style={{ height: "100%", borderRadius: 8 }} />
          </div>
          <div className="dash-stat-trend">
            <SkeletonLine style={{ width: 185, height: 12, marginBottom: 0 }} />
          </div>
        </div>
      </div>

      {/* ── Content Grid: Recent Submissions + Live Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 dash-card h-full">
          <div className="section-heading">
            <div className="section-heading-main">
              <div className="section-heading-icon">
                <SkeletonBlock style={{ width: 24, height: 24, borderRadius: 6 }} />
              </div>
              <div className="section-heading-text">
                <SkeletonLine style={{ width: 145, height: 15, marginBottom: 0 }} />
              </div>
            </div>
            <div className="section-heading-actions">
              <SkeletonLine style={{ width: 60, height: 12, marginBottom: 0 }} />
            </div>
          </div>
          <div className="dash-table-container">
            <Table className="dash-table">
              <TableHeader>
                <TableRow className="border-[var(--dash-divider)] hover:bg-transparent">
                  <TableHead className="h-auto">
                    <SkeletonLine style={{ width: 60, height: 11, marginBottom: 0 }} />
                  </TableHead>
                  <TableHead className="h-auto">
                    <SkeletonLine style={{ width: 75, height: 11, marginBottom: 0 }} />
                  </TableHead>
                  <TableHead className="h-auto">
                    <SkeletonLine style={{ width: 45, height: 11, marginBottom: 0 }} />
                  </TableHead>
                  <TableHead className="h-auto">
                    <SkeletonLine style={{ width: 58, height: 11, marginBottom: 0 }} />
                  </TableHead>
                  <TableHead className="h-auto text-center !text-center">
                    <SkeletonLine
                      style={{
                        width: 45,
                        height: 11,
                        margin: "0 auto",
                        marginBottom: 0,
                      }}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[0, 1, 2, 3, 4].map((i) => (
                  <TableRow
                    key={i}
                    className="border-[var(--dash-divider)] hover:bg-transparent"
                  >
                    <TableCell>
                      <SkeletonLine style={{ width: 90, height: 13, marginBottom: 0 }} />
                    </TableCell>
                    <TableCell>
                      <SkeletonLine style={{ width: 125, height: 13, marginBottom: 0 }} />
                    </TableCell>
                    <TableCell>
                      <SkeletonLine style={{ width: 76, height: 13, marginBottom: 0 }} />
                    </TableCell>
                    <TableCell>
                      <SkeletonLine style={{ width: 62, height: 13, marginBottom: 0 }} />
                    </TableCell>
                    <TableCell className="text-center !text-center">
                      <SkeletonBadge width={70} style={{ height: 22 }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Live Activity */}
        <div className="lg:col-span-1 dash-card h-full">
          <div className="section-heading">
            <div className="section-heading-main">
              <div className="section-heading-icon">
                <SkeletonBlock style={{ width: 24, height: 24, borderRadius: 6 }} />
              </div>
              <div className="section-heading-text">
                <SkeletonLine style={{ width: 95, height: 15, marginBottom: 0 }} />
              </div>
            </div>
          </div>
          <div className="dash-activity-list">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="dash-activity-item">
                <div className="dash-activity-icon">
                  <SkeletonBlock style={{ width: 18, height: 18, borderRadius: 5 }} />
                </div>
                <div className="dash-activity-content">
                  <SkeletonLine style={{ width: "80%", height: 13, marginBottom: 6 }} />
                  <SkeletonLine style={{ width: "28%", height: 11, marginBottom: 0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top Opportunities ── */}
      <div className="mt-6">
        <div className="dash-card">
          <div className="section-heading">
            <div className="section-heading-main">
              <div className="section-heading-icon">
                <SkeletonBlock style={{ width: 24, height: 24, borderRadius: 6 }} />
              </div>
              <div className="section-heading-text">
                <SkeletonLine style={{ width: 135, height: 15, marginBottom: 0 }} />
              </div>
            </div>
            <div className="section-heading-actions">
              <SkeletonLine style={{ width: 60, height: 12, marginBottom: 0 }} />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="p-3 border border-[var(--dash-divider)] rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-3 items-center"
              >
                <div className="lg:col-span-3 flex flex-col gap-2">
                  <SkeletonLine style={{ width: "40%", height: 14 }} />
                  <SkeletonLine style={{ width: "75%", height: 16 }} />
                  <SkeletonLine style={{ width: "50%", height: 12 }} />
                </div>
                <div className="lg:col-span-4 flex flex-col gap-2">
                  <SkeletonLine style={{ width: "30%", height: 10 }} />
                  <div className="flex gap-1.5">
                    <SkeletonBadge width={60} />
                    <SkeletonBadge width={70} />
                    <SkeletonBadge width={55} />
                  </div>
                  <SkeletonLine style={{ width: "30%", height: 10 }} />
                  <div className="flex gap-1.5">
                    <SkeletonBadge width={50} />
                    <SkeletonBadge width={65} />
                  </div>
                </div>
                <div className="lg:col-span-3 flex flex-col gap-2">
                  <SkeletonLine style={{ width: "30%", height: 10 }} />
                  <SkeletonLine style={{ width: "60%", height: 14 }} />
                  <SkeletonLine style={{ width: "30%", height: 10 }} />
                  <SkeletonLine style={{ width: "50%", height: 14 }} />
                </div>
                <div className="lg:col-span-2 flex flex-col justify-between items-end gap-3">
                  <SkeletonBadge width={90} style={{ height: 26, borderRadius: 13 }} />
                  <SkeletonBadge width={130} style={{ height: 32, borderRadius: 8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonContainer>
  );
}
