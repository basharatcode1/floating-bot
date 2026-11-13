"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuthModal } from "@/app/components/auth/AuthModalContext";

const plans = [
  {
    name: "Starter",
    price: "499",
    period: "/month",
    description: "Perfect for small teams starting to scale",
    features: [
      "Up to 3 hires per month",
      "48-hour candidate matching",
      "Basic skills verification",
      "Email support",
      "Standard contracts",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "1,299",
    period: "/month",
    description: "For growing companies with ongoing hiring needs",
    features: [
      "Up to 10 hires per month",
      "24-hour priority matching",
      "Advanced technical assessments",
      "Dedicated account manager",
      "Custom contracts & compliance",
      "Payroll management included",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large-scale operations",
    features: [
      "Unlimited hires",
      "Same-day matching",
      "White-glove onboarding",
      "24/7 priority support",
      "Custom API integrations",
      "Dedicated talent pool",
      "SLA guarantees",
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  const { openSignup } = useAuthModal();
  const [isDark, setIsDark] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // Change to dark at the exact same scroll position the navbar reaches it (y = 40px)
      setIsDark(rect.top <= 40 && rect.bottom >= 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("force-dark");
    } else {
      document.documentElement.classList.remove("force-dark");
    }
    return () => {
      document.documentElement.classList.remove("force-dark");
    };
  }, [isDark]);

  return (
    <section
      ref={sectionRef}
      className="relative py-8 md:py-12 theme-transition"
      style={{
        backgroundColor: "var(--light-bg-alt)",
      }}
    >
      {/* GPU-accelerated background overlay for smooth gradient transition */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          background: "linear-gradient(180deg, var(--dark-bg) 0%, var(--dark-bg-alt) 100%)",
          opacity: isDark ? 1 : 0,
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mt-3 transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ color: isDark ? "var(--text-on-dark)" : "var(--text-on-light)" }}
          >
            Simple, Transparent{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
              }}
            >
              Pricing
            </span>
          </h2>
          <p
            className="mt-4 text-lg max-w-2xl mx-auto transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ color: isDark ? "var(--text-on-dark-muted)" : "var(--text-on-light-muted)" }}
          >
            No hidden fees. No long-term contracts. Cancel anytime.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 ${
                plan.highlighted ? "hover:shadow-2xl" : "hover:shadow-xl"
              }`}
              style={{
                backgroundColor: isDark
                  ? "var(--card-dark)"
                  : "var(--card-light)",
                borderColor: plan.highlighted
                  ? "var(--accent-primary)"
                  : (isDark ? "var(--card-dark-border)" : "var(--card-light-border)"),
                animation: `fadeInUp 0.6s ease ${i * 0.12}s both`,
                boxShadow: plan.highlighted
                  ? "0 0 60px color-mix(in srgb, var(--accent-primary) 15%, transparent)"
                  : "none",
              }}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                  }}
                >
                  Most Popular
                </div>
              )}

              {/* Plan name */}
              <h3
                className="text-xl font-bold mb-2 transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ color: isDark ? "var(--text-on-dark)" : "var(--text-on-light)" }}
              >
                {plan.name}
              </h3>
              <p
                className="text-sm mb-6 transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ color: isDark ? "var(--text-on-dark-muted)" : "var(--text-on-light-muted)" }}
              >
                {plan.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-8">
                {plan.price !== "Custom" && (
                  <span
                    className="text-lg transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ color: isDark ? "var(--text-on-dark-muted)" : "var(--text-on-light-muted)" }}
                  >
                    $
                  </span>
                )}
                <span
                  className="text-5xl font-bold transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    color: plan.highlighted
                      ? "var(--accent-primary)"
                      : (isDark ? "var(--text-on-dark)" : "var(--text-on-light)"),
                  }}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className="text-sm transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ color: isDark ? "var(--text-on-dark-muted)" : "var(--text-on-light-muted)" }}
                  >
                    {plan.period}
                  </span>
                )}
              </div>

              {/* CTA */}
              {plan.price === "Custom" ? (
                <Link href="#contact" className="w-full block">
                  <button
                    className="w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer mb-8 text-center"
                    style={
                      plan.highlighted
                        ? {
                            background:
                              "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                            color: "#ffffff",
                            boxShadow:
                              "0 4px 20px rgba(0,0,0,0.3)",
                          }
                        : {
                            backgroundColor: isDark ? "var(--dark-bg-alt)" : "var(--light-bg)",
                            color: isDark ? "var(--text-on-dark)" : "var(--text-on-light)",
                            border: isDark ? "1px solid var(--card-dark-border)" : "1px solid var(--card-light-border)",
                          }
                    }
                  >
                    Contact Sales
                  </button>
                </Link>
              ) : (
                <Link href="/get-started" className="w-full block">
                  <button
                    className="w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer mb-8 text-center"
                    style={
                      plan.highlighted
                        ? {
                            background:
                              "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                            color: "#ffffff",
                            boxShadow:
                              "0 4px 20px rgba(0,0,0,0.3)",
                          }
                        : {
                            backgroundColor: isDark ? "var(--dark-bg-alt)" : "var(--light-bg)",
                            color: isDark ? "var(--text-on-dark)" : "var(--text-on-light)",
                            border: isDark ? "1px solid var(--card-dark-border)" : "1px solid var(--card-light-border)",
                          }
                    }
                  >
                    Get Started
                  </button>
                </Link>
              )}

              {/* Features list */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ color: isDark ? "var(--text-on-dark-muted)" : "var(--text-on-light-muted)" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--accent-success)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 mt-0.5"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
