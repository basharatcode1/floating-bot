import {
  SkeletonLine,
  SkeletonBlock,
  SkeletonBadge,
  SkeletonContainer,
  SkeletonAvatar,
} from "@/app/client/shared/skeletons/SkeletonBase";

/* ─────────────────────────────────────────────────────────────
   VendorBenchSkeleton
   Full-page placeholder that perfectly mirrors the 4-Column
   Requirements-Style Bench Layout:
   • Header row with Title, subtitle, and "Add Candidate" button
   • Filter bar with search bar and 3 dropdown filters
   • List of 4 Candidate cards (each mirroring the 4-column grid layout)
   ───────────────────────────────────────────────────────────── */
export default function VendorBenchSkeleton() {
  return (
    <SkeletonContainer>
      {/* ── Page Header ── */}
      <div className="dash-page-header">
        <div>
          <SkeletonLine style={{ width: 180, height: 28, marginBottom: 8 }} />
          <SkeletonLine style={{ width: 340, height: 14 }} />
        </div>
        <SkeletonBadge width={140} style={{ height: 36, borderRadius: 8 }} />
      </div>

      {/* ── Filters Bar ── */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center">
        <div className="relative flex-1 max-w-full md:max-w-md">
          <SkeletonBlock style={{ height: 36, borderRadius: 12 }} />
        </div>
        <div className="flex w-full md:w-auto gap-2.5 sm:gap-4 items-center">
          <SkeletonBadge className="flex-1 md:w-[140px] md:flex-none" style={{ height: 36, borderRadius: 12 }} />
          <SkeletonBadge className="flex-1 md:w-[140px] md:flex-none" style={{ height: 36, borderRadius: 12 }} />
          <SkeletonBadge className="flex-1 md:w-[120px] md:flex-none" style={{ height: 36, borderRadius: 12 }} />
        </div>
      </div>

      {/* ── Candidate Cards List (4-Column Layout Skeleton) ── */}
      <div className="flex flex-col gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`p-3 bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl relative overflow-hidden sk-delay-${
              i + 1
            }`}
            style={{
              animation: "sk-fade-in 0.3s ease both",
              animationDelay: `${(i + 1) * 0.05}s`,
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
              {/* Column 1: Candidate Meta & Rate */}
              <div className="lg:col-span-3 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <SkeletonBadge width={80} style={{ height: 18, borderRadius: 4 }} />
                    <SkeletonLine style={{ width: 35, height: 12 }} />
                  </div>
                  <SkeletonLine style={{ width: 160, height: 18 }} />
                  <SkeletonLine style={{ width: 120, height: 13 }} />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <SkeletonLine style={{ width: 65, height: 12 }} />
                    <SkeletonLine style={{ width: 75, height: 12 }} />
                  </div>
                  <div className="flex items-center gap-3">
                    <SkeletonLine style={{ width: 70, height: 12 }} />
                    <SkeletonLine style={{ width: 85, height: 12 }} />
                  </div>
                </div>

                <SkeletonBadge width={110} style={{ height: 26, borderRadius: 8 }} />
              </div>

              {/* Column 2: Primary & Secondary Skills */}
              <div className="lg:col-span-4 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <SkeletonLine style={{ width: 90, height: 10 }} />
                  <div className="flex gap-1.5 flex-wrap">
                    <SkeletonBadge width={70} style={{ height: 24, borderRadius: 6 }} />
                    <SkeletonBadge width={85} style={{ height: 24, borderRadius: 6 }} />
                    <SkeletonBadge width={65} style={{ height: 24, borderRadius: 6 }} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <SkeletonLine style={{ width: 100, height: 10 }} />
                  <div className="flex gap-1.5 flex-wrap">
                    <SkeletonBadge width={75} style={{ height: 24, borderRadius: 6 }} />
                    <SkeletonBadge width={60} style={{ height: 24, borderRadius: 6 }} />
                    <SkeletonBadge width={80} style={{ height: 24, borderRadius: 6 }} />
                  </div>
                </div>
              </div>

              {/* Column 3: Education, Work Experience, Certifications */}
              <div className="lg:col-span-3 lg:border-r border-[var(--dash-divider)] lg:pr-4 flex flex-col justify-between gap-2.5">
                <div className="flex flex-col gap-1.5">
                  <SkeletonLine style={{ width: 70, height: 10 }} />
                  <SkeletonLine style={{ width: 140, height: 14 }} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <SkeletonLine style={{ width: 110, height: 10 }} />
                  <SkeletonLine style={{ width: 150, height: 14 }} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <SkeletonLine style={{ width: 95, height: 10 }} />
                  <SkeletonBadge width={130} style={{ height: 22, borderRadius: 6 }} />
                </div>
              </div>

              {/* Column 4: Status, Availability & Action Menu */}
              <div className="lg:col-span-2 flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between gap-2">
                  <SkeletonBadge width={95} style={{ height: 26, borderRadius: 13 }} />
                  <SkeletonAvatar size={28} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <SkeletonLine style={{ width: 75, height: 10 }} />
                  <SkeletonBadge width={130} style={{ height: 26, borderRadius: 13 }} />
                </div>

                <SkeletonBadge style={{ width: "100%", height: 32, borderRadius: 8 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkeletonContainer>
  );
}
