import {
  SkeletonLine,
  SkeletonBlock,
  SkeletonBadge,
  SkeletonContainer,
  SkeletonAvatar,
} from "../../../client/shared/skeletons/SkeletonBase";

export default function BillingSkeleton() {
  return (
    <SkeletonContainer>
      {/* ── Page Header ── */}
      <div className="sk-page-header">
        <div className="sk-page-header-left">
          <SkeletonLine style={{ width: 220, height: 28 }} />
          <SkeletonLine style={{ width: 380, height: 14 }} />
        </div>
        <div className="sk-page-header-right">
          <SkeletonBadge width={110} style={{ height: 38 }} />
          <SkeletonBadge width={130} style={{ height: 38 }} />
        </div>
      </div>

      {/* ── 4 KPI Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`sk-card sk-delay-${i + 1}`}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <SkeletonAvatar size={38} style={{ borderRadius: 10 }} />
              <SkeletonLine style={{ width: "60%", height: 12 }} />
            </div>
            <SkeletonLine style={{ width: "50%", height: 26, marginBottom: 6 }} />
            <SkeletonLine style={{ width: "40%", height: 12 }} />
          </div>
        ))}
      </div>

      {/* ── 2-Col: Chart + Bank details ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Monthly Earnings Skeleton */}
        <div className="sk-card">
          <div className="sk-card-header">
            <SkeletonLine style={{ width: "35%", height: 15 }} />
            <SkeletonBadge width={110} style={{ marginLeft: "auto" }} />
          </div>
          {/* Chart Bars Skeleton */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              height: 160,
              padding: "0 4px",
              marginBottom: 12,
            }}
          >
            {[50, 40, 65, 60, 80, 70, 100].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  height: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <SkeletonBlock
                  style={{
                    width: "100%",
                    height: `${h}%`,
                    borderRadius: "6px 6px 4px 4px",
                  }}
                />
                <SkeletonLine style={{ width: "50%", height: 10 }} />
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid var(--dash-divider)",
              paddingTop: 10,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <SkeletonLine key={i} style={{ width: 40, height: 10 }} />
            ))}
          </div>
        </div>

        {/* Payout Account Skeleton */}
        <div className="sk-card">
          <div className="sk-card-header">
            <SkeletonLine style={{ width: "40%", height: 15 }} />
            <SkeletonLine style={{ width: "15%", height: 13, marginLeft: "auto" }} />
          </div>
          {/* Bank Card Visual */}
          <div
            style={{
              borderRadius: 14,
              padding: "20px 22px",
              background: "var(--dash-card-hover)",
              border: "1px solid var(--dash-card-border)",
              marginBottom: 16,
              height: 120,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <SkeletonAvatar size={20} style={{ borderRadius: 4 }} />
              <SkeletonLine style={{ width: 60, height: 10 }} />
            </div>
            <SkeletonLine style={{ width: "70%", height: 16 }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <SkeletonLine style={{ width: 60, height: 8, marginBottom: 4 }} />
                <SkeletonLine style={{ width: 80, height: 12 }} />
              </div>
              <div style={{ textAlign: "right" }}>
                <SkeletonLine style={{ width: 30, height: 8, marginBottom: 4 }} />
                <SkeletonLine style={{ width: 60, height: 12 }} />
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
            <SkeletonAvatar size={13} />
            <SkeletonLine style={{ width: "70%", height: 11 }} />
          </div>
          {/* Withdraw CTA block */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 10,
              background: "var(--dash-card-hover)",
              border: "1px solid var(--dash-card-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <SkeletonLine style={{ width: 80, height: 12, marginBottom: 4 }} />
              <SkeletonLine style={{ width: 120, height: 10 }} />
            </div>
            <SkeletonBadge width={72} style={{ height: 28 }} />
          </div>
        </div>
      </div>

      {/* ── Transaction History Table Skeleton ── */}
      <div className="sk-card">
        <div className="sk-card-header">
          <SkeletonLine style={{ width: "30%", height: 15 }} />
          <SkeletonBadge width={110} style={{ marginLeft: "auto" }} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.5fr 1fr 1fr 1.2fr 1fr 1fr",
            gap: 12,
            paddingBottom: 10,
            borderBottom: "1px solid var(--dash-divider)",
            marginBottom: 4,
          }}
        >
          {["40%", "60%", "50%", "40%", "45%", "30%"].map((w, i) => (
            <SkeletonLine key={i} style={{ width: w, height: 11 }} />
          ))}
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2.5fr 1fr 1fr 1.2fr 1fr 1fr",
              gap: 12,
              padding: "14px 0",
              borderBottom: i < 3 ? "1px solid var(--dash-divider)" : "none",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <SkeletonAvatar size={34} style={{ borderRadius: 10 }} />
              <div style={{ flex: 1 }}>
                <SkeletonLine style={{ width: "80%", height: 13, marginBottom: 4 }} />
                <SkeletonLine style={{ width: "40%", height: 11 }} />
              </div>
            </div>
            <SkeletonLine style={{ width: "70%", height: 13 }} />
            <SkeletonBadge width={50} style={{ height: 18 }} />
            <SkeletonLine style={{ width: "50%", height: 14 }} />
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
