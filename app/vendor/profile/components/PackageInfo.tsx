"use client";

import { Package } from "lucide-react";
import Link from "next/link";

export default function PackageInfo() {
  return (
    <div className="profile-section profile-full-width" id="package-info-section">
      <div className="profile-section-title">
        <span className="profile-section-title-icon">
          <Package size={18} />
        </span>
        Package Information
      </div>

      <div className="profile-plan-row">
        <div>
          <div className="profile-plan-badge">Growth Plan</div>
          <div className="profile-plan-features">
            <span>50 bench slots</span>
            <span className="profile-plan-feature-sep" />
            <span>Priority matching</span>
            <span className="profile-plan-feature-sep" />
            <span>Revenue dashboard</span>
          </div>
          <div className="profile-plan-expiry">Expiration Date: March 10, 2027</div>
        </div>
        <Link href="/vendor/subscription" className="profile-upgrade-btn">
          Upgrade Plan
        </Link>
      </div>
    </div>
  );
}
