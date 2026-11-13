import {
  SkeletonLine,
  SkeletonBlock,
  SkeletonBadge,
  SkeletonContainer,
  SkeletonAvatar,
} from "../../shared/skeletons/SkeletonBase";

export default function SubmissionsSkeleton() {
  return (
    <SkeletonContainer className="sk-page-content-enter">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <SkeletonLine style={{ width: 280, height: 32, marginBottom: 8 }} />
          <SkeletonLine style={{ width: 400, height: 20 }} />
        </div>
      </div>

      {/* ── Global Stats Row ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-1.5 px-1.5 mb-5 bg-[var(--dash-card-bg)] border border-[var(--dash-card-border)] rounded-2xl divide-y md:divide-y-0 md:divide-x divide-[var(--dash-divider)] sk-delay-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 flex items-center justify-between py-1 px-1.5 md:py-0.5 ${
              i > 1 ? "md:pl-3 md:pr-2" : "md:px-2"
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

      {/* ── Requirement Selector Carousel ── */}
      <div className="flex flex-col gap-3 mb-5 sk-delay-2">
        <div className="flex items-center justify-between px-1">
          <SkeletonLine style={{ width: 150, height: 14 }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col p-4 rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg)]">
              <div className="flex items-start justify-between gap-2 mb-2">
                <SkeletonBadge width={80} style={{ height: 20, borderRadius: 4 }} />
              </div>
              <SkeletonLine style={{ width: "90%", height: 20, marginBottom: 16 }} />
              <div className="flex justify-between items-center mt-auto">
                <SkeletonLine style={{ width: 100, height: 14 }} />
                <SkeletonLine style={{ width: 80, height: 14 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Split Panel Layout ── */}
      <div className="flex gap-4 sk-delay-3" style={{ height: "calc(100vh - 280px)", minHeight: 500, alignItems: "stretch" }}>
        
        {/* LEFT: Candidate List */}
        <div className="w-[40%] flex-shrink-0 flex-col gap-3 hidden md:flex overflow-hidden">
          {/* Search & Filter */}
          <div className="flex flex-col gap-2">
            <SkeletonBlock style={{ width: "100%", height: 36, borderRadius: 12 }} />
            <div className="flex items-center gap-2">
              <SkeletonBlock style={{ flex: 1, height: 32, borderRadius: 12 }} />
              <SkeletonBlock style={{ width: 60, height: 32, borderRadius: 12 }} />
            </div>
          </div>
          
          {/* List */}
          <div className="flex flex-col gap-2 overflow-hidden flex-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full flex-shrink-0 p-4 rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg)]">
                <div className="flex items-start gap-4 w-full">
                  <div className="flex-shrink-0 pt-1">
                    <SkeletonAvatar size={64} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-col gap-2 min-w-0 pr-4">
                        <div className="flex items-center gap-2">
                          <SkeletonLine style={{ width: 120, height: 20 }} />
                          <SkeletonBadge width={40} style={{ height: 18 }} />
                        </div>
                        <SkeletonLine style={{ width: 140, height: 14 }} />
                        <div className="flex items-center gap-2 mt-1">
                          <SkeletonBadge width={60} style={{ height: 18 }} />
                          <SkeletonLine style={{ width: 100, height: 14 }} />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <SkeletonBlock style={{ width: 50, height: 28, borderRadius: 6 }} />
                        <SkeletonBadge width={80} style={{ height: 20, borderRadius: 10 }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex gap-2">
                        <SkeletonBadge width={50} style={{ height: 22 }} />
                        <SkeletonBadge width={60} style={{ height: 22 }} />
                        <SkeletonBadge width={40} style={{ height: 22 }} />
                      </div>
                      <div className="flex gap-2">
                        <SkeletonBlock style={{ width: 32, height: 32, borderRadius: 8 }} />
                        <SkeletonBlock style={{ width: 32, height: 32, borderRadius: 8 }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Candidate Detail Panel */}
        <div className="flex-1 min-w-0 flex flex-col gap-4 overflow-hidden pr-1">
          <div className="rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] p-5 flex flex-col gap-4 h-full">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <SkeletonAvatar size={52} />
                <div>
                  <SkeletonLine style={{ width: 200, height: 24, marginBottom: 6 }} />
                  <SkeletonLine style={{ width: 140, height: 16, marginBottom: 8 }} />
                  <div className="flex gap-2">
                    <SkeletonBadge width={70} style={{ height: 20, borderRadius: 4 }} />
                    <SkeletonLine style={{ width: 120, height: 16 }} />
                  </div>
                </div>
              </div>
              <SkeletonBlock style={{ width: 32, height: 32, borderRadius: 8 }} />
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-[var(--dash-divider)] pb-1 mt-4">
              <SkeletonLine style={{ width: 100, height: 16 }} />
              <SkeletonLine style={{ width: 120, height: 16 }} />
              <SkeletonLine style={{ width: 110, height: 16 }} />
              <SkeletonLine style={{ width: 80, height: 16 }} />
            </div>

            {/* Content (AI Match Report Structure) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 w-full">
              {/* Match Score */}
              <div className="w-full h-fit flex flex-col p-5 rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)] bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-transparent dark:to-transparent gap-4">
                 <div className="flex justify-between items-center w-full">
                   <SkeletonLine style={{ width: 120, height: 12 }} />
                   <SkeletonLine style={{ width: 80, height: 16, borderRadius: 8 }} />
                 </div>
                 <div className="flex flex-col items-center justify-center flex-1">
                  <SkeletonAvatar size={130} />
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="w-full md:col-span-2 flex flex-col p-5 rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)] gap-4">
                <SkeletonLine style={{ width: 100, height: 12 }} />
                <div className="w-full flex-1 flex flex-col justify-center gap-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                    {[1, 2].map((i) => (
                      <div key={i} className="w-full p-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)]">
                        <div className="flex justify-between items-center mb-2">
                          <SkeletonLine style={{ width: 80, height: 10 }} />
                          <SkeletonLine style={{ width: 40, height: 10 }} />
                        </div>
                        <SkeletonLine style={{ width: "100%", height: 6, borderRadius: 3 }} />
                      </div>
                    ))}
                  </div>
                  <div className="w-full p-3 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)]">
                    <div className="flex justify-between items-center mb-2">
                      <SkeletonLine style={{ width: 80, height: 10 }} />
                      <SkeletonLine style={{ width: 40, height: 10 }} />
                    </div>
                    <SkeletonLine style={{ width: "100%", height: 6, borderRadius: 3 }} />
                  </div>
                </div>
              </div>

              {/* Strengths, Weaknesses, and Improvements Grid (Single Card Wrapper) */}
              <div className="col-span-1 md:col-span-3 p-5 rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-input-bg)] w-full">
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[var(--dash-card-border)] w-full">
                  {/* Strengths Card Skeleton */}
                  <div className="flex-1 pb-4 md:pb-0 md:pr-6">
                    <div className="flex items-center gap-2 mb-3">
                      <SkeletonLine style={{ width: 80, height: 12 }} />
                    </div>
                    <div className="space-y-2 pl-4">
                      <SkeletonLine style={{ width: "90%", height: 10 }} />
                      <SkeletonLine style={{ width: "80%", height: 10 }} />
                    </div>
                  </div>

                  {/* Weaknesses Card Skeleton */}
                  <div className="flex-1 py-4 md:py-0 md:px-6">
                    <div className="flex items-center gap-2 mb-3">
                      <SkeletonLine style={{ width: 90, height: 12 }} />
                    </div>
                    <div className="space-y-2 pl-4">
                      <SkeletonLine style={{ width: "85%", height: 10 }} />
                      <SkeletonLine style={{ width: "90%", height: 10 }} />
                    </div>
                  </div>

                  {/* Improvements Card Skeleton */}
                  <div className="flex-1 pt-4 md:pt-0 md:pl-6">
                    <div className="flex items-center gap-2 mb-3">
                      <SkeletonLine style={{ width: 95, height: 12 }} />
                    </div>
                    <div className="space-y-2 pl-4">
                      <SkeletonLine style={{ width: "80%", height: 10 }} />
                      <SkeletonLine style={{ width: "85%", height: 10 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonContainer>
  );
}
