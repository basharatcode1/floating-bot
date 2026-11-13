import { Cpu, ShieldCheck, Briefcase, FileCheck, Headphones, TrendingUp } from "lucide-react";

const features = [
  {
    title: "AI-Powered Matching",
    description:
      "Our algorithm analyzes 50+ data points to match you with candidates who fit your tech stack, culture, and project needs.",
    icon: <Cpu size={24} />,
  },
  {
    title: "Pre-Vetted Talent",
    description:
      "Every developer passes a rigorous 5-step screening including technical assessments, coding challenges, and background checks.",
    icon: <ShieldCheck size={24} />,
  },
  {
    title: "Flexible Engagement",
    description:
      "Hire on C-C or contract-to-hire basis. Scale your team up or down based on project demands — no long-term commitments required.",
    icon: <Briefcase size={24} />,
  },
  {
    title: "Compliance & Payroll",
    description:
      "We handle contracts, invoicing, tax compliance, and payroll across 150+ countries. You focus on shipping — we handle the rest.",
    icon: <FileCheck size={24} />,
  },
  {
    title: "Dedicated Support",
    description:
      "Every client gets a dedicated account manager who ensures smooth onboarding, resolves issues, and optimizes your team composition.",
    icon: <Headphones size={24} />,
  },
  {
    title: "Risk-Free Trial",
    description:
      "Not satisfied in the first 2 weeks? We'll find you a replacement at no extra cost. Your success is our guarantee.",
    icon: <TrendingUp size={24} />,
  },
];

export default function Features() {
  return (
    <section
      className="py-8 md:py-12 transition-colors duration-500"
      style={{ backgroundColor: "var(--light-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mt-3 transition-colors duration-500"
            style={{ color: "var(--text-on-light)" }}
          >
            Built for Modern Teams
          </h2>
          <p
            className="mt-4 text-lg max-w-2xl mx-auto transition-colors duration-500"
            style={{ color: "var(--text-on-light-muted)" }}
          >
            Everything you need to build and manage a world-class remote engineering team.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-default"
              style={{
                backgroundColor: "var(--card-light)",
                borderColor: "var(--card-light-border)",
                animation: `fadeInUp 0.5s ease ${i * 0.08}s both`,
              }}
            >
              {/* Icon container */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white transition-transform duration-300 group-hover:scale-110"
                style={{
                  background:
                    "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                }}
              >
                {feature.icon}
              </div>

              <h3
                className="text-xl font-bold mb-3 transition-colors duration-500"
                style={{ color: "var(--text-on-light)" }}
              >
                {feature.title}
              </h3>
              <p
                className="leading-relaxed transition-colors duration-500"
                style={{ color: "var(--text-on-light-muted)" }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
