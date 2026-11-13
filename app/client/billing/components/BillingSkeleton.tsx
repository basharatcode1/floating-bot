import {
  SkeletonLine,
  SkeletonBlock,
  SkeletonBadge,
  SkeletonContainer,
  SkeletonAvatar,
} from "../../shared/skeletons/SkeletonBase";

export default function BillingSkeleton() {
  return (
    <SkeletonContainer>
      {/* ── Page Header ── */}
      <div className="sk-page-header">
        <div className="sk-page-header-left">
          <SkeletonLine style={{ width: 220, height: 28 }} />
          <SkeletonLine style={{ width: 340, height: 14 }} />
        </div>
        <div className="sk-page-header-right">
          <SkeletonBadge width={110} style={{ height: 38 }} />
          <SkeletonBadge width={130} style={{ height: 38 }} />
        </div>
      </div>

      {/* ── 3 Stat Summary Row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} className={`sk-card sk-delay-${i + 1}`}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <SkeletonAvatar size={40} style={{ borderRadius: 12 }} />
              <SkeletonLine style={{ width: "50%", height: 12 }} />
            </div>
            <SkeletonLine style={{ width: "40%", height: 28, marginBottom: 8 }} />
            <SkeletonLine style={{ width: "60%", height: 12 }} />
          </div>
        ))}
      </div>

      {/* ── Main 2-Col Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Current Plan Skeleton */}
        <div className="sk-card">
          <div className="sk-card-header">
            <SkeletonLine style={{ width: "35%", height: 15 }} />
            <SkeletonBadge width={60} style={{ marginLeft: "auto" }} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 20px",
              background: "var(--dash-card-hover)",
              border: "1px solid var(--dash-card-border)",
              borderRadius: 12,
              marginBottom: 20,
            }}
          >
            <SkeletonAvatar size={46} style={{ borderRadius: 14 }} />
            <div style={{ flex: 1 }}>
              <SkeletonLine style={{ width: "50%", height: 14, marginBottom: 6 }} />
              <SkeletonLine style={{ width: "70%", height: 11 }} />
            </div>
            <div style={{ textAlign: "right" }}>
              <SkeletonLine style={{ width: 60, height: 24, marginBottom: 4 }} />
              <SkeletonLine style={{ width: 30, height: 11 }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <SkeletonAvatar size={15} />
                <SkeletonLine style={{ width: i % 2 === 0 ? "80%" : "65%", height: 12 }} />
              </div>
            ))}
          </div>
          <SkeletonBlock style={{ height: 38, borderRadius: 10 }} />
        </div>

        {/* Payment Method Skeleton */}
        <div className="sk-card">
          <div className="sk-card-header">
            <SkeletonLine style={{ width: "40%", height: 15 }} />
            <SkeletonLine style={{ width: "20%", height: 13, marginLeft: "auto" }} />
          </div>
          <div
            style={{
              borderRadius: 14,
              padding: "22px 24px",
              background: "var(--dash-card-hover)",
              border: "1px solid var(--dash-card-border)",
              marginBottom: 20,
              height: 140,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <SkeletonLine style={{ width: 40, height: 8 }} />
              <SkeletonLine style={{ width: 36, height: 14 }} />
            </div>
            <SkeletonLine style={{ width: "70%", height: 16 }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <SkeletonLine style={{ width: 60, height: 8, marginBottom: 4 }} />
                <SkeletonLine style={{ width: 80, height: 12 }} />
              </div>
              <div style={{ textAlign: "right" }}>
                <SkeletonLine style={{ width: 40, height: 8, marginBottom: 4 }} />
                <SkeletonLine style={{ width: 40, height: 12 }} />
              </div>
            </div>
          </div>
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
            <SkeletonAvatar size={14} />
            <SkeletonLine style={{ width: "80%", height: 11 }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <SkeletonBlock style={{ height: 32, borderRadius: 10, flex: 1 }} />
            <SkeletonBlock style={{ height: 32, borderRadius: 10, flex: 1 }} />
          </div>
        </div>
      </div>

      {/* ── Invoice History Table Skeleton ── */}
      <div className="sk-card">
        <div className="sk-card-header">
          <SkeletonLine style={{ width: "25%", height: 15 }} />
          <SkeletonBadge width={110} style={{ marginLeft: "auto" }} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
            gap: 12,
            paddingBottom: 10,
            borderBottom: "1px solid var(--dash-divider)",
            marginBottom: 4,
          }}
        >
          {["40%", "60%", "50%", "40%", "40%", "30%"].map((w, i) => (
            <SkeletonLine key={i} style={{ width: w, height: 11 }} />
          ))}
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
              gap: 12,
              padding: "16px 0",
              borderBottom: i < 3 ? "1px solid var(--dash-divider)" : "none",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SkeletonAvatar size={30} style={{ borderRadius: 8 }} />
              <SkeletonLine style={{ width: "55%", height: 13 }} />
            </div>
            <SkeletonLine style={{ width: "70%", height: 13 }} />
            <SkeletonLine style={{ width: "60%", height: 13 }} />
            <SkeletonLine style={{ width: "40%", height: 13, fontWeight: "bold" }} />
            <SkeletonBadge width={64} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <SkeletonBadge width={56} style={{ height: 24 }} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonContainer>
  );
}
