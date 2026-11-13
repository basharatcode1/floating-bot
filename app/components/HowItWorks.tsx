"use client";

const steps = [
  {
    number: "01",
    title: "Tell Us What You Need",
    description:
      "Share your requirements — tech stack, team size, timeline, and budget. Our AI matches you with the perfect candidates from our pre-vetted pool.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Review Matched Talent",
    description:
      "Receive curated profiles within 24 hours. Each candidate is pre-screened with verified skills, work history, and client reviews — no guesswork.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Onboard & Ship",
    description:
      "Start working with your new team member in as fast as 48 hours. We handle contracts, payments, and compliance — you focus on building.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      className="py-8 md:py-12 transition-colors duration-500"
      style={{ backgroundColor: "var(--light-bg-alt)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2
            className="text-4xl md:text-5xl font-bold mt-3 transition-colors duration-500"
            style={{ color: "var(--text-on-light)" }}
          >
            Three Steps to Your
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
              }}
            >
              Dream Team
            </span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div
            className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[2px] opacity-20"
            style={{ backgroundColor: "var(--accent-primary)" }}
          />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative group"
              style={{
                animation: `fadeInUp 0.6s ease ${i * 0.15}s both`,
              }}
            >
              <div
                className="p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{
                  backgroundColor: "var(--card-light)",
                  borderColor: "var(--card-light-border)",
                }}
              >
                {/* Step number */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg mb-6 relative z-10 transition-colors duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                  }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className="mb-4 transition-colors duration-500"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <h3
                  className="text-xl font-bold mb-3 transition-colors duration-500"
                  style={{ color: "var(--text-on-light)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="leading-relaxed transition-colors duration-500"
                  style={{ color: "var(--text-on-light-muted)" }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
