import {
  SkeletonLine,
  SkeletonBlock,
  SkeletonBadge,
  SkeletonContainer,
} from "../../shared/skeletons/SkeletonBase";

/* ─────────────────────────────────────────────────────────────
   RequirementsSkeleton
   Full-page placeholder that mirrors the real requirements layout:
   • Page header (title + Post Requirement button)
   • Stats Overview row (Total, Positions, Candidates, Active)
   • Search / filter bar
   • 3 requirement cards matching the multi-column layout
  ───────────────────────────────────────────────────────────── */
export default function RequirementsSkeleton() {
  return (
    <SkeletonContainer>
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <SkeletonLine style={{ width: 180, height: 28, borderRadius: 6 }} />
          <SkeletonLine style={{ width: 280, height: 14, marginTop: 8, borderRadius: 4 }} />
        </div>
        <SkeletonBadge width={160} style={{ height: 40, borderRadius: 12 }} />
      </div>

      {/* ── Stats Overview Row Skeleton ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-1.5 px-1.5 mb-5 bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl divide-y md:divide-y-0 md:divide-x divide-[var(--dash-divider)] sk-delay-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 flex items-center justify-between py-1 px-1.5 md:py-0.5 ${
              i > 0 ? "md:pl-3 md:pr-2" : "md:px-2"
            }`}
          >
            <div className="flex items-center gap-2">
              <SkeletonBlock style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0 }} />
              <SkeletonLine style={{ width: 90, height: 12 }} />
            </div>
            <SkeletonLine style={{ width: 24, height: 20 }} />
          </div>
        ))}
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center sk-delay-2">
        {/* Search Input */}
        <div className="relative flex-1 max-w-full md:max-w-md">
          <SkeletonBlock style={{ height: 36, borderRadius: 12 }} />
        </div>

        {/* Dropdown Filters */}
        <div className="flex w-full md:w-auto gap-2.5 sm:gap-4 items-center">
          <SkeletonBadge width={120} style={{ height: 36, borderRadius: 12 }} />
          <SkeletonBadge width={120} style={{ height: 36, borderRadius: 12 }} />
          <SkeletonBadge width={130} style={{ height: 36, borderRadius: 12 }} />
        </div>
      </div>

      {/* ── 3 Requirement Cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`req-card sk-card sk-delay-${i + 3}`}
          >
            {/* Multi-column Grid Layout */}
            <div className="req-card-grid grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              
              {/* Column 1: Title & Meta Details */}
              <div className="req-card-col lg:col-span-3 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-center gap-1.5 py-0.5 min-w-0">
                <div className="flex flex-col gap-1">
                  <SkeletonBadge width={70} style={{ height: 18, borderRadius: 6 }} />
                  <SkeletonLine style={{ width: "90%", height: 18, borderRadius: 4 }} />
                </div>
                
                {/* Experience Skeleton */}
                <div className="flex items-center gap-1.5">
                  <SkeletonLine style={{ width: 65, height: 10 }} />
                  <SkeletonLine style={{ width: 55, height: 12 }} />
                </div>
                
                <div className="grid grid-cols-2 items-center gap-x-2 gap-y-2">
                  <SkeletonLine style={{ width: 95, height: 13 }} />
                  <SkeletonLine style={{ width: 50, height: 13 }} />
                  <SkeletonLine style={{ width: 80, height: 13 }} />
                  <SkeletonLine style={{ width: 40, height: 13 }} />
                </div>
              </div>

              {/* Column 2: Skills */}
              <div className="req-card-col lg:col-span-4 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-start gap-2.5 py-0.5 min-w-0">
                {/* Primary Skills */}
                <div className="flex flex-col gap-2">
                  <SkeletonLine style={{ width: "45%", height: 11 }} />
                  <div className="flex flex-wrap gap-1.5">
                    <SkeletonBadge width={55} style={{ height: 20 }} />
                    <SkeletonBadge width={75} style={{ height: 20 }} />
                    <SkeletonBadge width={60} style={{ height: 20 }} />
                    <SkeletonBadge width={35} style={{ height: 20 }} />
                  </div>
                </div>

                {/* Secondary Skills */}
                <div className="flex flex-col gap-2">
                  <SkeletonLine style={{ width: "50%", height: 11 }} />
                  <div className="flex flex-wrap gap-1.5">
                    <SkeletonBadge width={60} style={{ height: 20 }} />
                    <SkeletonBadge width={80} style={{ height: 20 }} />
                    <SkeletonBadge width={35} style={{ height: 20 }} />
                  </div>
                </div>
              </div>

              {/* Column 3: Salary, Certificate */}
              <div className="req-card-col lg:col-span-3 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-start py-0.5 min-w-0 gap-2.5">
                {/* Salary */}
                <div className="flex flex-col gap-2">
                  <SkeletonLine style={{ width: "30%", height: 11 }} />
                  <SkeletonLine style={{ width: "55%", height: 14 }} />
                </div>

                {/* Certificate */}
                <div className="flex flex-col gap-1.5">
                  <SkeletonLine style={{ width: "45%", height: 11 }} />
                  <SkeletonLine style={{ width: "80%", height: 14 }} />
                  <SkeletonLine style={{ width: "70%", height: 14 }} />
                  <div className="flex items-center gap-2">
                    <SkeletonLine style={{ width: "55%", height: 14 }} />
                    <SkeletonBadge width={45} style={{ height: 18, borderRadius: 4 }} />
                  </div>
                </div>
              </div>

              {/* Column 4: Status & Stats Panel */}
              <div className="req-card-col lg:col-span-2 flex flex-col justify-between py-1 min-w-0 h-full gap-4">
                {/* Top Row: Status Button & Dot Menu */}
                <div className="flex items-center justify-between">
                  <SkeletonBadge width={80} style={{ height: 28, borderRadius: 999 }} />
                  <SkeletonBadge width={28} style={{ height: 28, borderRadius: 8 }} />
                </div>

                {/* Stats Panel box */}
                <div 
                  style={{
                    backgroundColor: "var(--dash-card-bg-solid)",
                    border: "1px solid var(--dash-card-border)",
                    borderRadius: "12px",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px"
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <SkeletonBadge width={32} style={{ height: 32, borderRadius: 8 }} />
                      <SkeletonLine style={{ width: 70, height: 13 }} />
                    </div>
                    <SkeletonLine style={{ width: 16, height: 16 }} />
                  </div>
                  
                  <div style={{ height: 1, backgroundColor: "var(--dash-divider)" }} />

                  <div className="flex items-center justify-between">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <SkeletonBadge width={32} style={{ height: 32, borderRadius: 8 }} />
                      <SkeletonLine style={{ width: 80, height: 13 }} />
                    </div>
                    <SkeletonLine style={{ width: 16, height: 16 }} />
                  </div>

                  <div style={{ height: 1, backgroundColor: "var(--dash-divider)" }} />

                  <div className="flex items-center justify-between">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <SkeletonBadge width={32} style={{ height: 32, borderRadius: 8 }} />
                      <SkeletonLine style={{ width: 65, height: 13 }} />
                    </div>
                    <SkeletonLine style={{ width: 16, height: 16 }} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </SkeletonContainer>
  );
}
