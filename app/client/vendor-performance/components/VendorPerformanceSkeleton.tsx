import {
  SkeletonLine,
  SkeletonBlock,
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonContainer,
} from "../../shared/skeletons/SkeletonBase";

/* ─────────────────────────────────────────────────────────────
   VendorPerformanceSkeleton
   Full-page high-fidelity placeholder matching the real Vendor Performance page:
   • Header with Page Title, Subtitle & Search Bar
   • KPI summary cards row (4 metric cards)
   • Multi-column Vendor Performance leaderboard table matching vp-table-header/row
  ───────────────────────────────────────────────────────────── */
export default function VendorPerformanceSkeleton() {
  return (
    <SkeletonContainer className="sk-page-content-enter relative z-10">
      {/* ── Page Header Skeleton ── */}
      <div className="dash-page-header">
        <div>
          <SkeletonLine style={{ width: 220, height: 28, borderRadius: 6 }} />
          <SkeletonLine style={{ width: 230, height: 14, marginTop: 8, borderRadius: 4 }} />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search input placeholder */}
          <SkeletonBlock style={{ width: 256, height: 38, borderRadius: 10 }} />
        </div>
      </div>

      {/* ── KPI Summary Cards Skeleton ── */}
      <div className="vp-kpi-grid sk-delay-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="vp-kpi-card">
            <SkeletonAvatar size={40} style={{ borderRadius: 12 }} />
            <div className="flex flex-col gap-1.5">
              <SkeletonLine style={{ width: 48, height: 22, borderRadius: 4 }} />
              <SkeletonLine style={{ width: 80, height: 12, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Vendor List Table Skeleton ── */}
      <div
        className="border rounded-2xl overflow-hidden shadow-sm mb-6 sk-delay-2"
        style={{
          background: "var(--dash-card-bg)",
          borderColor: "var(--dash-card-border)",
        }}
      >
        {/* Table Header */}
        <div className="vp-table-header">
          <div>
            <SkeletonLine style={{ width: 14, height: 12 }} />
          </div>
          <div>
            <SkeletonLine style={{ width: 90, height: 12 }} />
          </div>
          <div className="text-center">
            <SkeletonLine style={{ width: 95, height: 12, margin: "0 auto" }} />
          </div>
          <div>
            <SkeletonLine style={{ width: 110, height: 12 }} />
          </div>
          <div>
            <SkeletonLine style={{ width: 80, height: 12 }} />
          </div>
          <div>
            <SkeletonLine style={{ width: 120, height: 12 }} />
          </div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {[
            { tagWidths: [55, 65, 50, 60] },
            { tagWidths: [60, 50, 70] },
            { tagWidths: [45, 65, 55, 50] },
            { tagWidths: [65, 55, 60] },
          ].map((row, i) => (
            <div key={i} className={`vp-table-row sk-delay-${i + 2}`}>
              {/* Rank Badge */}
              <div>
                <SkeletonAvatar
                  size={26}
                  style={{
                    borderRadius: "50%",
                    margin: "0 auto",
                  }}
                />
              </div>

              {/* Vendor Info */}
              <div className="flex items-center gap-3">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <SkeletonLine style={{ width: 150, height: 16 }} />
                    {i === 0 && (
                      <SkeletonBadge
                        width={64}
                        style={{ height: 18, borderRadius: 4 }}
                      />
                    )}
                    <SkeletonAvatar size={14} style={{ borderRadius: 3 }} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {row.tagWidths.map((w, tagIdx) => (
                      <SkeletonBadge key={tagIdx} width={w} style={{ height: 20 }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Success Rate — Circular */}
              <div className="flex flex-col items-center justify-center gap-1.5">
                <SkeletonAvatar size={50} style={{ borderRadius: "50%" }} />
              </div>

              {/* Avg Response Time */}
              <div className="flex items-center gap-2">
                <SkeletonAvatar size={16} style={{ borderRadius: 4 }} />
                <div className="flex flex-col gap-1">
                  <SkeletonLine style={{ width: 70, height: 15 }} />
                  <SkeletonLine style={{ width: 45, height: 11 }} />
                </div>
              </div>

              {/* Selected / Hires Progress */}
              <div className="flex flex-col justify-center pr-4 gap-1.5">
                <div className="flex items-center gap-1.5">
                  <SkeletonAvatar size={14} style={{ borderRadius: 4 }} />
                  <SkeletonLine style={{ width: 55, height: 15 }} />
                </div>
                <SkeletonBlock
                  style={{ width: "100%", height: 6, borderRadius: 3 }}
                />
              </div>

              {/* External Ratings (Glassdoor & AmbitionBox) */}
              <div
                className="flex flex-col gap-2.5 border-l pl-4"
                style={{ borderColor: "var(--dash-divider)" }}
              >
                {/* Glassdoor */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SkeletonBlock
                      style={{ width: 22, height: 22, borderRadius: 6 }}
                    />
                    <SkeletonLine style={{ width: 62, height: 12 }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <SkeletonLine style={{ width: 40, height: 12 }} />
                    <SkeletonLine style={{ width: 36, height: 12 }} />
                  </div>
                </div>

                {/* AmbitionBox */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SkeletonBlock
                      style={{ width: 22, height: 22, borderRadius: 6 }}
                    />
                    <SkeletonLine style={{ width: 72, height: 12 }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <SkeletonLine style={{ width: 40, height: 12 }} />
                    <SkeletonLine style={{ width: 36, height: 12 }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonContainer>
  );
}
