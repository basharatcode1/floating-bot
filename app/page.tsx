import Navbar from "@/app/components/Navbar";
import TrustedBy from "@/app/components/TrustedBy";
import HowItWorks from "@/app/components/HowItWorks";
import Stats from "@/app/components/Stats";
import Features from "@/app/components/Features";
import Testimonials from "@/app/components/Testimonials";
import FAQ from "@/app/components/FAQ";
import Integrations from "@/app/components/Integrations";
import CTA from "@/app/components/CTA";
import PlatformBenefitsDark from "@/app/components/PlatformBenefitsDark";
import Footer from "@/app/components/Footer";
import HeroThree from "./components/HeroThree";
import ProblemSolutionVideo from "./components/ProblemSolutionVideo";
import { LandingPageClient } from "@/app/components/auth/LandingPageClient";

export const metadata = {
  title: "StaffSync — Find Top Tech Talent in 48 Hours",
  description:
    "Connect with elite developers, engineers, and tech experts on StaffSync. Hire top talent in just 48 hours.",
  openGraph: {
    title: "StaffSync — Find Top Tech Talent in 48 Hours",
    description:
      "Connect with elite developers, engineers, and tech experts on StaffSync. Hire top talent in just 48 hours.",
    type: "website",
  },
};

export default function Home() {
  return (
    <LandingPageClient>
      <main>
        <Navbar />
        {/* <div data-section-theme="dark">
        <Hero />
      </div> */}
        <div data-section-theme="dark">
          <HeroThree />
        </div>

        <div data-section-theme="dark">
          <ProblemSolutionVideo />
        </div>

        {/* <div data-section-theme="light">
        <PlatformBenefits />
      </div> */}
        {/* <div data-section-theme="dark">
          <PlatformBenefitsDark />
        </div> */}
        <div data-section-theme="light">
          <TrustedBy />
        </div>
        <div id="how-it-works" data-section-theme="light">
          <HowItWorks />
        </div>
        <div data-section-theme="light">
          <Stats />
        </div>
        <div id="features" data-section-theme="light">
          <Features />
        </div>
        <div id="testimonials" data-section-theme="light">
          <Testimonials />
        </div>

        <div data-section-theme="light">
          <Integrations />
        </div>
        <div data-section-theme="light">
          <FAQ />
        </div>
        <div data-section-theme="dark">
          <CTA />
        </div>

        <div data-section-theme="dark">
          <Footer />
        </div>
      </main>
    </LandingPageClient>
  );
}
