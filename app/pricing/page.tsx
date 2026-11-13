import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Pricing from "@/app/components/Pricing";
import FAQ from "@/app/components/FAQ";
import CTA from "@/app/components/CTA";
import { LandingPageClient } from "@/app/components/auth/LandingPageClient";

export const metadata = {
  title: "Pricing — StaffSync",
  description:
    "Simple, transparent pricing plans for hiring elite developers and tech experts. No hidden fees. Cancel anytime.",
};

export default function PricingPage() {
  return (
    <LandingPageClient>
      <main 
        className="min-h-screen transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden relative"
        style={{ backgroundColor: "var(--dark-bg)", color: "var(--text-on-dark)" }}
      >
        {/* Navbar */}
        <Navbar />

        {/* Spacing for fixed navbar */}
        <div className="pt-20" />

        {/* Pricing Section */}
        <div data-section-theme="dark">
          <Pricing />
        </div>

        {/* FAQ Section */}
        <div data-section-theme="light">
          <FAQ />
        </div>

        {/* CTA Section */}
        <div data-section-theme="dark">
          <CTA />
        </div>

        {/* Footer */}
        <div data-section-theme="dark">
          <Footer />
        </div>
      </main>
    </LandingPageClient>
  );
}
