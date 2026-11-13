"use client";

const testimonials = [
  {
    quote:
      "We scaled from 5 to 25 engineers in just 3 months. The quality of talent and speed of delivery completely transformed our product roadmap.",
    name: "Sarah Chen",
    role: "VP of Engineering",
    company: "Finova Technologies",
    avatar: "SC",
  },
  {
    quote:
      "Finding senior React developers used to take us 3 months. Now we get pre-vetted candidates within 48 hours. It's a game-changer for our sprint planning.",
    name: "Marcus Johnson",
    role: "CTO",
    company: "CloudStack AI",
    avatar: "MJ",
  },
  {
    quote:
      "The compliance and payroll handling alone saves us hundreds of hours per quarter. We can focus entirely on building instead of managing contracts.",
    name: "Priya Sharma",
    role: "Head of Operations",
    company: "NexGen Solutions",
    avatar: "PS",
  },
];

export default function Testimonials() {
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
            Loved by Teams
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative"
              style={{
                backgroundColor: "var(--card-light)",
                borderColor: "var(--card-light-border)",
                animation: `fadeInUp 0.6s ease ${i * 0.12}s both`,
              }}
            >
              {/* Quote mark */}
              <div
                className="text-6xl font-serif leading-none mb-4 opacity-30 transition-colors duration-500 select-none"
                style={{ color: "var(--accent-primary)" }}
              >
                &ldquo;
              </div>

              {/* Quote text */}
              <p
                className="leading-relaxed mb-8 transition-colors duration-500"
                style={{ color: "var(--text-on-light)" }}
              >
                {t.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 mt-auto">
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm transition-colors duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div
                    className="font-semibold transition-colors duration-500"
                    style={{ color: "var(--text-on-light)" }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-sm transition-colors duration-500"
                    style={{ color: "var(--text-on-light-muted)" }}
                  >
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
