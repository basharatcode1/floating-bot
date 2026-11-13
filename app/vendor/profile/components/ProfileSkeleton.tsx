import {
  SkeletonLine,
  SkeletonBlock,
  SkeletonBadge,
  SkeletonContainer,
} from "@/app/client/shared/skeletons/SkeletonBase";
import {
  SkeletonProfileHeader,
  SkeletonCertRow,
  SkeletonSection,
} from "@/app/client/shared/skeletons/SkeletonSections";

/* ─────────────────────────────────────────────────────────────
   ProfileSkeleton
   Full-page placeholder that mirrors the real profile layout:
   • Page header row
   • Profile hero (avatar + name + meta)
   • Company Information 2-col grid
   • Certifications list
   • Company Summary text block
   • Social & Account info
   • Package information
   • Account Actions
───────────────────────────────────────────────────────────── */
export default function ProfileSkeleton() {
  return (
    <SkeletonContainer>
      {/* ── Page Header ── */}
      <div className="sk-page-header">
        <SkeletonLine style={{ width: 120, height: 26 }} />
        <SkeletonBadge width={120} />
      </div>

      {/* ── 1. Profile Hero ── */}
      <SkeletonProfileHeader />

      {/* ── 2. Company Information (2-col grid) ── */}
      <div className="sk-info-grid-3to1 sk-delay-1">
        {/* Company Details */}
        <div className="sk-card">
          <div className="sk-card-header">
            <SkeletonLine style={{ width: "50%", height: 15 }} />
          </div>
          <div className="sk-card-body">
            <div className="profile-section-inner-grid">
              <div className="profile-kv-list">
                {[70, 90, 55, 75, 60].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "9px 0",
                      borderBottom: i === 4 ? "none" : "1px solid var(--dash-divider)",
                    }}
                  >
                    <SkeletonLine style={{ width: "35%", height: 12 }} />
                    <SkeletonLine style={{ width: `${w - 20}%`, height: 12 }} />
                  </div>
                ))}
              </div>
              <div className="profile-section-inner-divider" />
              <div className="profile-kv-list">
                {[60, 85, 75, 65, 80].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "9px 0",
                      borderBottom: i === 4 ? "none" : "1px solid var(--dash-divider)",
                    }}
                  >
                    <SkeletonLine style={{ width: "35%", height: 12 }} />
                    <SkeletonLine style={{ width: `${w - 20}%`, height: 12 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Point of Contact */}
        <div className="sk-card">
          <div className="sk-card-header">
            <SkeletonLine style={{ width: "55%", height: 15 }} />
          </div>
          <div className="sk-card-body">
            {[60, 80, 50, 65].map((w, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <SkeletonLine style={{ width: "30%", height: 12 }} />
                <SkeletonLine style={{ width: `${w - 10}%`, height: 12 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. Certifications ── */}
      <div className="sk-card sk-delay-2" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 18,
          }}
        >
          <div>
            <SkeletonLine style={{ width: 220, height: 15, marginBottom: 8 }} />
            <SkeletonLine style={{ width: 300, height: 12 }} />
          </div>
          <SkeletonBadge width={160} />
        </div>
        {[0, 1, 2].map((i) => (
          <SkeletonCertRow key={i} index={i} />
        ))}
      </div>

      {/* ── 4. Company Summary ── */}
      <SkeletonSection showTitle fullWidth className="sk-delay-3">
        <SkeletonLine style={{ width: "100%", height: 13, marginBottom: 8 }} />
        <SkeletonLine style={{ width: "90%", height: 13, marginBottom: 8 }} />
        <SkeletonLine style={{ width: "75%", height: 13 }} />
      </SkeletonSection>

      {/* ── 5. Social, Account Info & Account Actions ── */}
      <div className="profile-three-col sk-delay-4">
        <div className="sk-card">
          <div className="sk-card-header">
            <SkeletonLine style={{ width: "45%", height: 15 }} />
          </div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <SkeletonBadge width={22} />
              <SkeletonLine style={{ width: "60%", height: 13 }} />
            </div>
          ))}
        </div>
        <div className="sk-card">
          <div className="sk-card-header">
            <SkeletonLine style={{ width: "50%", height: 15 }} />
          </div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <SkeletonLine style={{ width: "35%", height: 12 }} />
              <SkeletonLine style={{ width: "45%", height: 12 }} />
            </div>
          ))}
        </div>
        <div className="sk-card">
          <div className="sk-card-header">
            <SkeletonLine style={{ width: "45%", height: 15 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <SkeletonLine style={{ width: "60%", height: 12 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonContainer>
  );
}
