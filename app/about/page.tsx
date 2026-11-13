import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { LandingPageClient } from "@/app/components/auth/LandingPageClient";
import { Lightbulb, Rocket, Brain, Eye, Zap, Users } from "lucide-react";
import GetStartedButton from "@/app/components/GetStartedButton";

export const metadata = {
  title: "About Us — StaffSync",
  description:
    "Discover the vision, mission, and core values that drive StaffSync. We are transforming tech staffing through transparency, intelligence, and speed.",
};

export default function AboutPage() {
  return (
    <LandingPageClient>
      <main 
        className="min-h-screen transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden relative"
        style={{ backgroundColor: "var(--dark-bg)", color: "var(--text-on-dark)" }}
      >
        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <section
          data-section-theme="dark"
          className="relative pt-32 pb-20 md:pt-40 md:pb-28 border-b transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            borderColor: "var(--card-dark-border)",
          }}
        >
          {/* Mesh Glow Background Effects (similar to HeroThree.tsx) */}
          <div
            className="absolute top-1/4 left-[10%] w-[350px] h-[350px] rounded-full blur-[130px] pointer-events-none"
            style={{ background: "hsla(221, 83%, 53%, 0.08)" }}
          />
          <div
            className="absolute bottom-1/4 right-[10%] w-[300px] h-[300px] rounded-full blur-[120px] pointer-events-none"
            style={{ background: "hsla(262, 83%, 53%, 0.08)" }}
          />

          {/* Grid Background Effect */}
          <div className="absolute inset-0 collage-grid opacity-20 pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
            {/* Section Tagline */}
            <span 
              className="inline-block text-xs uppercase tracking-widest font-semibold mb-4 px-3 py-1 rounded-full border"
              style={{
                borderColor: "var(--card-dark-border)",
                background: "var(--card-dark)",
                color: "var(--text-on-dark-muted)",
              }}
            >
              ABOUT STAFFSYNC
            </span>

            {/* Main Title */}
            <h1 
              className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
              style={{ letterSpacing: "-0.04em" }}
            >
              Making Every Hire{" "}
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                }}
              >
                the Right Hire
              </span>
            </h1>

            {/* Subtext */}
            <p 
              className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light"
              style={{ color: "var(--text-on-dark-muted)" }}
            >
              We believe that recruitment should not be a game of speed, luck, or who has
              the biggest email list. It should be intelligent, transparent, and fair — for the
              companies who need talent and the vendors who have it.
            </p>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section 
          data-section-theme="dark" 
          className="py-20 border-b transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ borderColor: "var(--card-dark-border)" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Vision Card */}
              <div
                className="p-8 sm:p-10 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: "var(--card-dark)",
                  borderColor: "var(--card-dark-border)",
                }}
              >
                {/* Icon Container with current project gradient */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white"
                  style={{
                    background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                  }}
                >
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p 
                  className="text-lg font-medium italic mb-4 border-l-2 pl-4"
                  style={{ borderColor: "var(--accent-primary)", color: "var(--text-on-dark)" }}
                >
                  "To make every hire the right hire — for everyone involved."
                </p>
                <p className="leading-relaxed font-light" style={{ color: "var(--text-on-dark-muted)" }}>
                  We believe that recruitment should not be a game of speed, luck, or who has the
                  biggest email list. It should be intelligent, transparent, and fair for the companies
                  who need talent and the vendors who have it.
                </p>
              </div>

              {/* Mission Card */}
              <div
                className="p-8 sm:p-10 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: "var(--card-dark)",
                  borderColor: "var(--card-dark-border)",
                }}
              >
                {/* Icon Container with current project gradient */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white"
                  style={{
                    background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                  }}
                >
                  <Rocket className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="leading-relaxed font-light" style={{ color: "var(--text-on-dark-muted)" }}>
                  StaffSync exists to eliminate the friction, opacity, and inefficiency that has
                  defined traditional recruitment for too long. We're building the platform where
                  clients find talent faster, vendors win more placements, and every step of the
                  hiring journey — from requirement to onboarding — is visible, trackable, and human.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section 
          data-section-theme="dark" 
          className="py-20 border-b transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ borderColor: "var(--card-dark-border)" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16">
              <span 
                className="text-xs uppercase tracking-widest font-semibold mb-2 block"
                style={{ color: "var(--text-on-dark-muted)" }}
              >
                WHAT DRIVES US
              </span>
              <h2 
                className="text-3xl md:text-5xl font-bold tracking-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                Our Core{" "}
                <span 
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                  }}
                >
                  Values
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Value 1 */}
              <div 
                className="p-6 sm:p-8 rounded-xl border transition-all duration-300 hover:border-[var(--accent-primary)]/40 flex items-start gap-5"
                style={{
                  backgroundColor: "var(--card-dark)",
                  borderColor: "var(--card-dark-border)",
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{
                    background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                  }}
                >
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2">Intelligence Over Volume</h4>
                  <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-on-dark-muted)" }}>
                    We don't believe in showing you more; we believe in showing you better. Every
                    feature we build is driven by relevance, not noise.
                  </p>
                </div>
              </div>

              {/* Value 2 */}
              <div 
                className="p-6 sm:p-8 rounded-xl border transition-all duration-300 hover:border-[var(--accent-primary)]/40 flex items-start gap-5"
                style={{
                  backgroundColor: "var(--card-dark)",
                  borderColor: "var(--card-dark-border)",
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{
                    background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                  }}
                >
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2">Transparency for Both Sides</h4>
                  <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-on-dark-muted)" }}>
                    No black holes. No one-sided information. What a client sees, a vendor can
                    understand. What a vendor submits, a client can evaluate. Fairly.
                  </p>
                </div>
              </div>

              {/* Value 3 */}
              <div 
                className="p-6 sm:p-8 rounded-xl border transition-all duration-300 hover:border-[var(--accent-primary)]/40 flex items-start gap-5"
                style={{
                  backgroundColor: "var(--card-dark)",
                  borderColor: "var(--card-dark-border)",
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{
                    background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                  }}
                >
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2">Speed Without Compromise</h4>
                  <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-on-dark-muted)" }}>
                    Hiring fast and hiring right are not opposites. StaffSync proves that with AI,
                    you can have both.
                  </p>
                </div>
              </div>

              {/* Value 4 */}
              <div 
                className="p-6 sm:p-8 rounded-xl border transition-all duration-300 hover:border-[var(--accent-primary)]/40 flex items-start gap-5"
                style={{
                  backgroundColor: "var(--card-dark)",
                  borderColor: "var(--card-dark-border)",
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{
                    background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                  }}
                >
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2">Partnership, Not Transactions</h4>
                  <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-on-dark-muted)" }}>
                    We're not a job board. We're not a marketplace. We're a platform built on
                    relationships — between clients, vendors, and the talent that connects them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem & Solution Section */}
        <section 
          data-section-theme="dark" 
          className="py-20 border-b transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ borderColor: "var(--card-dark-border)" }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-widest font-semibold mb-2 block" style={{ color: "var(--text-on-dark-muted)" }}>
                THE PROBLEM WE SOLVE
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight" style={{ letterSpacing: "-0.02em" }}>
                Recruitment Is{" "}
                <span className="text-rose-500">
                  Broken
                </span>
              </h2>
              <p className="mt-6 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light" style={{ color: "var(--text-on-dark-muted)" }}>
                Recruitment today is broken in a very specific way. Clients spend too much time
                waiting for the right profile. Vendors spend too much time on submissions that go
                nowhere. And somewhere in the middle, good candidates wait unseen on someone's bench.
              </p>
            </div>

            {/* Solution Card */}
            <div
              className="p-8 sm:p-10 rounded-2xl border relative overflow-hidden group"
              style={{
                backgroundColor: "var(--card-dark)",
                borderColor: "var(--card-dark-border)",
              }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full animate-pulse" 
                      style={{
                        background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                      }}
                    />
                    How StaffSync Solves It
                  </h4>
                  <p className="text-sm sm:text-base leading-relaxed font-light" style={{ color: "var(--text-on-dark-muted)" }}>
                    By connecting clients and vendors on one AI-powered platform, we compress the
                    hiring cycle, improve match quality, and bring the kind of visibility that
                    turns recruitment from a headache into a competitive advantage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          data-section-theme="dark"
          className="py-24 text-center relative overflow-hidden"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
              Ready to transform your hiring?
            </h2>
            <p className="mb-8 max-w-lg mx-auto font-light" style={{ color: "var(--text-on-dark-muted)" }}>
              See how StaffSync brings structure, speed, and transparency to recruitment.
            </p>
            <div className="flex justify-center">
              <GetStartedButton
                text="Book a Demo"
                buttonWidth={160}
                buttonHeight={48}
                radius={12}
                borderSize={1.5}
                fontSize={15}
                fontWeight={600}
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </LandingPageClient>
  );
}
