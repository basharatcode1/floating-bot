"use client";

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
  "Stripe",
  "Shopify",
  "Spotify",
  "Airbnb",
  "Uber",
  "Slack",
];

function CompanyLogo({ name }) {
  return (
    <div
      className="flex items-center gap-2 px-6 py-3 rounded-lg transition-colors duration-500 select-none"
      style={{ color: "var(--text-on-light-muted)" }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="opacity-40"
      >
        <rect
          width="24"
          height="24"
          rx="6"
          fill="currentColor"
          opacity="0.3"
        />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="currentColor"
        >
          {name.charAt(0)}
        </text>
      </svg>
      <span className="text-base font-semibold opacity-50 tracking-wide">
        {name}
      </span>
    </div>
  );
}

export default function TrustedBy() {
  return (
    <section
      className="py-16 transition-colors duration-500 overflow-hidden"
      style={{ backgroundColor: "var(--light-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p
          className="text-center text-sm font-semibold uppercase tracking-[0.2em] mb-10 transition-colors duration-500"
          style={{ color: "var(--text-on-light-muted)" }}
        >
          Trusted by 500+ companies worldwide
        </p>

        {/* Marquee */}
        <div className="relative">
          {/* Fade edges */}
          <div
            className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, var(--light-bg), transparent)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, var(--light-bg), transparent)",
            }}
          />

          <div className="flex animate-marquee">
            {[...companies, ...companies].map((company, i) => (
              <CompanyLogo key={`${company}-${i}`} name={company} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
