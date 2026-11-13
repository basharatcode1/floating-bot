"use client";

import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  {
    value: 10000,
    suffix: "+",
    label: "Verified Developers",
    description: "Pre-vetted engineers across 50+ technologies",
  },
  {
    value: 500,
    suffix: "+",
    label: "Companies Served",
    description: "From startups to Fortune 500 enterprises",
  },
  {
    value: 48,
    suffix: "hr",
    label: "Average Hire Time",
    description: "From request to onboarded team member",
  },
  {
    value: 95,
    suffix: "%",
    label: "Client Retention",
    description: "Clients who hire again within 6 months",
  },
];

export default function Stats() {
  return (
    <section
      className="py-24 md:py-32 transition-colors duration-500"
      style={{ backgroundColor: "var(--light-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span
            className="text-sm font-semibold uppercase tracking-[0.2em] transition-colors duration-500"
            style={{ color: "var(--accent-primary)" }}
          >
            By The Numbers
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mt-3 transition-colors duration-500"
            style={{ color: "var(--text-on-light)" }}
          >
            Results That Speak
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center p-6 md:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: "var(--card-light)",
                borderColor: "var(--card-light-border)",
                animation: `fadeInUp 0.6s ease ${i * 0.1}s both`,
              }}
            >
              <div
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 transition-colors duration-500"
                style={{ color: "var(--accent-primary)" }}
              >
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                />
              </div>
              <div
                className="text-lg font-semibold mb-1 transition-colors duration-500"
                style={{ color: "var(--text-on-light)" }}
              >
                {stat.label}
              </div>
              <p
                className="text-sm transition-colors duration-500 hidden md:block"
                style={{ color: "var(--text-on-light-muted)" }}
              >
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
