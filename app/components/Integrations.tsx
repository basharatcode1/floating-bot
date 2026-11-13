"use client";

import Link from "next/link";

const integrations = [
  { name: "Slack", category: "Communication" },
  { name: "Jira", category: "Project Management" },
  { name: "GitHub", category: "Development" },
  { name: "Notion", category: "Documentation" },
  { name: "Figma", category: "Design" },
  { name: "Linear", category: "Project Management" },
  { name: "GitLab", category: "Development" },
  { name: "Discord", category: "Communication" },
];

const iconPaths = {
  Communication: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  "Project Management": "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
  Development: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  Documentation: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
  Design: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
};

export default function Integrations() {
  return (
    <section
      className="py-8 md:py-12 transition-colors duration-500"
      style={{ backgroundColor: "var(--light-bg-alt)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mt-3 transition-colors duration-500"
            style={{ color: "var(--text-on-light)" }}
          >
            Works With Your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
              }}
            >
              Stack
            </span>
          </h2>
          <p
            className="mt-4 text-lg max-w-2xl mx-auto transition-colors duration-500"
            style={{ color: "var(--text-on-light-muted)" }}
          >
            Seamlessly integrate with the tools your team already uses every day.
          </p>
        </div>

        {/* Integrations grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {integrations.map((item, i) => (
            <div
              key={item.name}
              className="group p-6 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default"
              style={{
                backgroundColor: "var(--card-light)",
                borderColor: "var(--card-light-border)",
                animation: `fadeInUp 0.5s ease ${i * 0.06}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-primary)";
                e.currentTarget.style.boxShadow =
                  "0 0 40px color-mix(in srgb, var(--accent-primary) 10%, transparent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--card-light-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
                style={{
                  background:
                    "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                  opacity: 0.9,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={iconPaths[item.category]} />
                </svg>
              </div>

              {/* Name */}
              <h3
                className="text-base font-semibold mb-1 transition-colors duration-500"
                style={{ color: "var(--text-on-light)" }}
              >
                {item.name}
              </h3>
              <p
                className="text-xs transition-colors duration-500"
                style={{ color: "var(--text-on-light-muted)" }}
              >
                {item.category}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-12">
          <p
            className="text-sm transition-colors duration-500"
            style={{ color: "var(--text-on-light-muted)" }}
          >
            And 50+ more integrations available via our{" "}
            <Link
              href="#"
              className="underline transition-colors duration-200"
              style={{ color: "var(--accent-primary)" }}
            >
              REST API
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
