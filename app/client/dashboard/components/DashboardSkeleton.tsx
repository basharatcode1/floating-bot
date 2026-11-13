import {
  SkeletonLine,
  SkeletonBlock,
  SkeletonBadge,
  SkeletonContainer,
} from "../../shared/skeletons/SkeletonBase";

/* ─────────────────────────────────────────────────────────────
   DashboardSkeleton
   Full-page placeholder that mirrors the real dashboard layout:
   • Page header row with title, live badge, and buttons
   • 3 Stat Cards (Requirements, Pipeline, Vendor Performance)
   • Content grid containing TopMatchedCandidates and TopRequirements
   • LiveActivity feed at the bottom half
   ───────────────────────────────────────────────────────────── */
export default function DashboardSkeleton() {
  return (
    <SkeletonContainer>
      {/* ── Page Header ── */}
      <div className="dash-page-header">
        <div className="min-w-0">
          <h1 className="dash-page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SkeletonLine style={{ width: 160, height: 34, borderRadius: 8, marginBottom: 0 }} />
            <SkeletonBadge width={48} style={{ height: 20 }} />
          </h1>
          <p className="page-subtitle dash-page-subtitle">
            <SkeletonLine style={{ width: 320, height: 14, marginBottom: 0 }} />
          </p>
        </div>
        <div className="dash-page-actions" style={{ display: "flex", gap: 10 }}>
          <SkeletonBlock style={{ width: 132, height: 34, borderRadius: 12 }} />
          <SkeletonBlock style={{ width: 146, height: 34, borderRadius: 12 }} />
        </div>
      </div>

      {/* ── 3 Stat Cards Row ── */}
      <div className="dash-stats-grid">
        {/* ── Requirements ── */}
        <div className="dash-stat-card dash-stat-card--donut">
          <div className="section-heading">
            <div className="section-heading-main">
              <div className="section-heading-icon">
                <SkeletonBlock style={{ width: 24, height: 24, borderRadius: 6 }} />
              </div>
              <div className="section-heading-text">
                <SkeletonLine style={{ width: 96, height: 15, marginBottom: 0 }} />
              </div>
            </div>
            <div className="section-heading-actions">
              <SkeletonBadge width={64} />
            </div>
          </div>
          <div className="dash-stat-hero-row">
            <SkeletonLine style={{ width: 32, height: 18, marginBottom: 0 }} />
            <SkeletonLine style={{ width: 108, height: 12, marginLeft: 4, marginBottom: 0 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "16px 8px 24px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <SkeletonLine style={{ width: 48, height: 12 }} />
                <SkeletonBlock style={{ flex: 1, height: 22, margin: "0 10px", borderRadius: 6 }} />
                <SkeletonLine style={{ width: 52, height: 12 }} />
              </div>
            ))}
          </div>
          <div className="dash-stat-trend">
            <SkeletonLine style={{ width: 170, height: 12 }} />
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
            <SkeletonLine style={{ width: 36, height: 18, marginBottom: 0 }} />
            <SkeletonLine style={{ width: 112, height: 12, marginLeft: 4, marginBottom: 0 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", height: 180, marginTop: 6 }}>
            <div style={{ width: "65%" }}>
              <SkeletonBlock style={{ height: 136, borderRadius: 8, width: "90%" }} />
            </div>
            <div style={{ width: "35%", display: "flex", flexDirection: "column", gap: 24 }}>
              {[0, 1, 2].map((i) => (
                <SkeletonLine key={i} style={{ width: "80%", height: 12 }} />
              ))}
            </div>
          </div>
          <div className="dash-stat-trend">
            <SkeletonLine style={{ width: 155, height: 12 }} />
          </div>
        </div>

        {/* ── Vendor Performance ── */}
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
            <SkeletonLine style={{ width: 180, height: 12 }} />
          </div>
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div className="dash-content-grid" style={{ marginTop: 24 }}>
        {/* Top Matched Candidates */}
        <div className="dash-card">
          <div className="section-heading">
            <div className="section-heading-main">
              <div className="section-heading-icon">
                <SkeletonBlock style={{ width: 24, height: 24, borderRadius: 6 }} />
              </div>
              <div className="section-heading-text">
                <SkeletonLine style={{ width: 175, height: 15, marginBottom: 0 }} />
              </div>
            </div>
            <div className="section-heading-actions">
              <SkeletonLine style={{ width: 60, height: 12, marginBottom: 0 }} />
            </div>
          </div>
          <div className="dash-table-container">
            <table className="dash-table">
              <thead>
                <tr>
                  <th><SkeletonLine style={{ width: 45, height: 11 }} /></th>
                  <th><SkeletonLine style={{ width: 60, height: 11 }} /></th>
                  <th><SkeletonLine style={{ width: 85, height: 11 }} /></th>
                  <th><SkeletonLine style={{ width: 50, height: 11 }} /></th>
                  <th><SkeletonLine style={{ width: 65, height: 11 }} /></th>
                  <th><SkeletonLine style={{ width: 50, height: 11 }} /></th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td><SkeletonLine style={{ width: 62, height: 12 }} /></td>
                    <td><SkeletonLine style={{ width: 110, height: 13 }} /></td>
                    <td>
                      <div className="dash-table-candidate">
                        <SkeletonLine style={{ width: 90, height: 13 }} />
                      </div>
                    </td>
                    <td><SkeletonLine style={{ width: 46, height: 13 }} /></td>
                    <td><SkeletonLine style={{ width: 40, height: 13 }} /></td>
                    <td><SkeletonLine style={{ width: 34, height: 13 }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Requirements */}
        <div className="dash-card">
          <div className="section-heading">
            <div className="section-heading-main">
              <div className="section-heading-icon">
                <SkeletonBlock style={{ width: 24, height: 24, borderRadius: 6 }} />
              </div>
              <div className="section-heading-text">
                <SkeletonLine style={{ width: 140, height: 15, marginBottom: 0 }} />
              </div>
            </div>
            <div className="section-heading-actions">
              <SkeletonLine style={{ width: 60, height: 12, marginBottom: 0 }} />
            </div>
          </div>
          <div className="dash-table-container">
            <table className="dash-table">
              <thead>
                <tr>
                  <th><SkeletonLine style={{ width: 45, height: 11 }} /></th>
                  <th><SkeletonLine style={{ width: 70, height: 11 }} /></th>
                  <th><SkeletonLine style={{ width: 45, height: 11 }} /></th>
                  <th><SkeletonLine style={{ width: 50, height: 11 }} /></th>
                  <th><SkeletonLine style={{ width: 70, height: 11 }} /></th>
                  <th><SkeletonLine style={{ width: 45, height: 11 }} /></th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td><SkeletonLine style={{ width: 62, height: 12 }} /></td>
                    <td><SkeletonLine style={{ width: 125, height: 13 }} /></td>
                    <td><SkeletonLine style={{ width: 46, height: 13 }} /></td>
                    <td><SkeletonLine style={{ width: 64, height: 13 }} /></td>
                    <td><SkeletonLine style={{ width: 28, height: 13, margin: "0 auto" }} /></td>
                    <td><SkeletonBadge width={55} style={{ height: 22 }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Live Activity ── */}
      <div className="dash-bottom-half" style={{ marginTop: 24 }}>
        <div className="dash-card">
          <div className="section-heading">
            <div className="section-heading-main">
              <div className="section-heading-icon">
                <SkeletonBlock style={{ width: 24, height: 24, borderRadius: 6 }} />
              </div>
              <div className="section-heading-text">
                <SkeletonLine style={{ width: 100, height: 15, marginBottom: 0 }} />
              </div>
            </div>
            <div className="section-heading-actions">
              <SkeletonBadge width={48} style={{ height: 20 }} />
            </div>
          </div>
          <div className="dash-activity-list" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="dash-activity-item" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <SkeletonBlock style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <SkeletonLine style={{ width: "55%", height: 13 }} />
                  <SkeletonLine style={{ width: "20%", height: 11 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonContainer>
  );
}
