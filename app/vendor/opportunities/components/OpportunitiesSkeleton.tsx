import {
  SkeletonLine,
  SkeletonBlock,
  SkeletonBadge,
  SkeletonContainer,
} from "@/app/client/shared/skeletons/SkeletonBase";

/* ─────────────────────────────────────────────────────────────
   OpportunitiesSkeleton
   Full-page placeholder that mirrors the real Opportunities layout:
   • Page header (title + subtitle)
   • Stats Overview row (Total, Positions, Proposed, High Match)
   • Search / filter bar
   • 3 requirement cards matching the multi-column layout
  ───────────────────────────────────────────────────────────── */
export default function OpportunitiesSkeleton() {
  return (
    <SkeletonContainer>
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <SkeletonLine style={{ width: 220, height: 28, borderRadius: 6 }} />
          <SkeletonLine
            style={{ width: 340, height: 14, marginTop: 8, borderRadius: 4 }}
          />
        </div>
      </div>

      {/* ── Stats Overview Row Skeleton ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-1.5 px-1.5 mb-5 bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl divide-y md:divide-y-0 md:divide-x divide-[var(--dash-divider)] sk-delay-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 flex items-center justify-between py-1 px-1.5 md:py-0.5 md:px-2 ${
              i > 0 ? "md:pl-3" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <SkeletonBadge
                width={36}
                style={{ height: 36, borderRadius: 8 }}
              />
              <SkeletonLine
                style={{ width: 80, height: 10, borderRadius: 3 }}
              />
            </div>
            <SkeletonLine
              style={{ width: 24, height: 16, borderRadius: 4 }}
            />
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
          <SkeletonBadge className="flex-1 md:w-[145px] md:flex-none" style={{ height: 36, borderRadius: 12 }} />
          <SkeletonBadge className="flex-1 md:w-[130px] md:flex-none" style={{ height: 36, borderRadius: 12 }} />
          <SkeletonBadge className="flex-1 md:w-[150px] md:flex-none" style={{ height: 36, borderRadius: 12 }} />
        </div>
      </div>

      {/* ── 3 Opportunity Cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={`req-card sk-card sk-delay-${i + 3}`}>
            {/* Multi-column Grid Layout */}
            <div className="req-card-grid grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              {/* Column 1: Title & Meta Details */}
              <div className="req-card-col lg:col-span-3 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-center gap-2 py-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <SkeletonBadge
                    width={70}
                    style={{ height: 20, borderRadius: 6 }}
                  />
                  <SkeletonBadge
                    width={45}
                    style={{ height: 18, borderRadius: 4 }}
                  />
                </div>
                <SkeletonLine
                  style={{ width: "90%", height: 22, borderRadius: 4 }}
                />
                <SkeletonLine
                  style={{ width: "65%", height: 13, borderRadius: 4 }}
                />

                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex gap-4">
                    <SkeletonLine style={{ width: 80, height: 12 }} />
                    <SkeletonLine style={{ width: 60, height: 12 }} />
                  </div>
                  <div className="flex gap-4">
                    <SkeletonLine style={{ width: 100, height: 12 }} />
                    <SkeletonLine style={{ width: 70, height: 12 }} />
                  </div>
                </div>
              </div>

              {/* Column 2: Skills */}
              <div className="req-card-col lg:col-span-4 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-between py-0.5 min-w-0 gap-4">
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

              {/* Column 3: Experience, Salary, Certificate */}
              <div className="req-card-col lg:col-span-3 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-between py-0.5 min-w-0 gap-4">
                {/* Experience */}
                <div className="flex flex-col gap-2">
                  <SkeletonLine style={{ width: "40%", height: 11 }} />
                  <SkeletonLine style={{ width: "60%", height: 14 }} />
                </div>

                {/* Salary */}
                <div className="flex flex-col gap-2">
                  <SkeletonLine style={{ width: "30%", height: 11 }} />
                  <SkeletonLine style={{ width: "55%", height: 14 }} />
                </div>

                {/* Certificate */}
                <div className="flex flex-col gap-2">
                  <SkeletonLine style={{ width: "45%", height: 11 }} />
                  <SkeletonLine style={{ width: "70%", height: 14 }} />
                </div>
              </div>

              {/* Column 4: Match, Action & Stats Panel */}
              <div className="req-card-col lg:col-span-2 flex flex-col justify-between py-1 min-w-0 h-full gap-3">
                {/* Top Row: Match Pill & Action Menu */}
                <div className="flex items-center justify-between">
                  <SkeletonBadge
                    width={85}
                    style={{ height: 26, borderRadius: 999 }}
                  />
                  <SkeletonBadge
                    width={28}
                    style={{ height: 28, borderRadius: 8 }}
                  />
                </div>

                {/* Propose Button Skeleton */}
                <SkeletonBlock
                  style={{ width: "100%", height: 32, borderRadius: 8 }}
                />

                {/* Stats Panel box */}
                <div
                  style={{
                    backgroundColor: "var(--dash-card-bg-solid)",
                    border: "1px solid var(--dash-card-border)",
                    borderRadius: "12px",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <SkeletonBadge
                        width={24}
                        style={{ height: 24, borderRadius: 6 }}
                      />
                      <SkeletonLine style={{ width: 60, height: 12 }} />
                    </div>
                    <SkeletonLine style={{ width: 14, height: 14 }} />
                  </div>

                  <div
                    style={{
                      height: 1,
                      backgroundColor: "var(--dash-divider)",
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <SkeletonBadge
                        width={24}
                        style={{ height: 24, borderRadius: 6 }}
                      />
                      <SkeletonLine style={{ width: 70, height: 12 }} />
                    </div>
                    <SkeletonLine style={{ width: 14, height: 14 }} />
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
