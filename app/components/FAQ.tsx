"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How quickly can I hire a developer?",
    answer:
      "Most clients receive matched candidate profiles within 24–48 hours. After you select a candidate, onboarding can happen in as little as 1–2 business days depending on your requirements.",
  },
  {
    question: "What technologies do your developers specialize in?",
    answer:
      "Our talent pool covers 50+ technologies including React, Node.js, Python, Go, AWS, Kubernetes, Flutter, Swift, and more. We also have specialists in AI/ML, DevOps, blockchain, and data engineering.",
  },
  {
    question: "How do you vet your developers?",
    answer:
      "Every developer goes through a rigorous 5-step screening process: resume review, technical assessment, live coding challenge, behavioral interview, and reference checks. Only the top 3% make it through.",
  },
  {
    question: "Can I hire developers part-time or on contract?",
    answer:
      "Absolutely. We offer flexible engagement models — C-C (Contract to Contract) or C-H (Contract to Hire). You can scale your team up or down based on project demands with no long-term commitments.",
  },
  {
    question: "What happens if a developer isn't a good fit?",
    answer:
      "We offer a risk-free 14-day trial period. If you're not satisfied with a hire within the first two weeks, we'll find a replacement at no additional cost. Your satisfaction is guaranteed.",
  },
  {
    question: "Do you handle payroll and compliance?",
    answer:
      "Yes. We manage contracts, invoicing, tax compliance, and payroll across 150+ countries. You focus on building your product — we handle all the administrative overhead.",
  },
];

import { Plus } from "lucide-react";

function FAQItem({ faq, isOpen, onToggle, index }) {
  return (
    <div
      className="border-b transition-colors duration-500"
      style={{
        borderColor: "var(--card-light-border)",
        animation: `fadeInUp 0.5s ease ${index * 0.08}s both`,
      }}
    >
      <button
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
        onClick={onToggle}
      >
        <span
          className="text-lg font-semibold pr-8 transition-colors duration-500 group-hover:opacity-80"
          style={{ color: "var(--text-on-light)" }}
        >
          {faq.question}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            backgroundColor: isOpen
              ? "var(--accent-primary)"
              : "transparent",
            border: isOpen ? "none" : "1px solid var(--card-light-border)",
          }}
        >
          <Plus
            size={16}
            color={isOpen ? "#ffffff" : "var(--text-on-light-muted)"}
            className="transition-transform duration-300"
            style={{
              transform: isOpen ? "rotate(45deg)" : "none",
            }}
          />
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen ? "200px" : "0",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p
          className="pb-6 leading-relaxed pr-12 transition-colors duration-500"
          style={{ color: "var(--text-on-light-muted)" }}
        >
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      className="py-8 md:py-12 transition-colors duration-500"
      style={{ backgroundColor: "var(--light-bg)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mt-3 transition-colors duration-500"
            style={{ color: "var(--text-on-light)" }}
          >
            Frequently Asked{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
              }}
            >
              Questions
            </span>
          </h2>
          <p
            className="mt-4 text-lg max-w-2xl mx-auto transition-colors duration-500"
            style={{ color: "var(--text-on-light-muted)" }}
          >
            Everything you need to know about our platform and services.
          </p>
        </div>

        {/* FAQ list */}
        <div
          className="rounded-2xl border p-2 md:p-4 transition-colors duration-500"
          style={{
            backgroundColor: "var(--card-light)",
            borderColor: "var(--card-light-border)",
          }}
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
