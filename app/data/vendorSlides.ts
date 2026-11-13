/**
 * Talent Vendors carousel slides configuration.
 * Jasper.ai-inspired bold collage style with colorful backgrounds,
 * geometric shapes, stat badges, and product UI mockups.
 */

export const vendorSlides = [
  {
    id: "vendor-challenges",
    layout: "centered-illustration",
    badge: "VENDOR PROBLEM",
    title: "Great Talent Deserves Better Opportunities.",
    description:
      "The challenge isn't finding candidates—it's navigating the hiring process.",
    bottomStory:
      "Great vendors lose opportunities because the process keeps getting in the way.",
    personImage: "/people/vendor-problems.webp",
    bgColor: "#FFF7ED", // warm peach for challenges
    gridColor: "rgba(234, 88, 12, 0.08)",
    featureCallout: {
      icon: "workflow",
      text: "Vendors spend too much time chasing updates instead of making placements",
    },
    shapes: [
      { type: "circle", color: "#FED7AA", x: "72%", y: "55%", size: 120 },
      { type: "circle", color: "#FDBA74", x: "84%", y: "38%", size: 70 },
      {
        type: "triangle",
        color: "#FB923C",
        x: "8%",
        y: "68%",
        size: 50,
        rotation: 20,
      },
      {
        type: "rect",
        color: "#FEF3C7",
        x: "88%",
        y: "72%",
        size: 36,
        rotation: -18,
      },
      { type: "circle", color: "#FBBF24", x: "60%", y: "76%", size: 45 },
    ],
    floatingWidgets: [
      {
        type: "problem-card",
        title: "Unreliable Clients",
        text: "Too many uncertain opportunities.",
        x: "1%",
        y: "16%",
      },
      {
        type: "problem-card",
        title: "Delayed Payments",
        text: "Success shouldn't end in waiting.",
        x: "1%",
        y: "38%",
      },
      {
        type: "problem-card",
        title: "Limited Visibility",
        text: "Submissions disappear without updates.",
        x: "1%",
        y: "60%",
      },
      {
        type: "problem-card",
        title: "Missing Feedback",
        text: "Silence replaces valuable insight.",
        x: "71%",
        y: "16%",
      },
      {
        type: "problem-card",
        title: "Slow Decisions",
        text: "Momentum fades with every delay.",
        x: "71%",
        y: "38%",
      },
      {
        type: "problem-card",
        title: "Changing Requirements",
        text: "The target keeps moving.",
        x: "71%",
        y: "60%",
      },
    ],
  },
  {
    id: "vendor-solutions",
    layout: "solutions-bento",
    badge: "WITH HIREFIRST",
    title: "Built For Vendors Who Deliver.",
    bottomStory:
      "When every step becomes transparent, every placement becomes more achievable",
    bgColor: "#F0F9FF", // soft sky blue
    gridColor: "rgba(14, 165, 233, 0.05)",
    solutions: [
      {
        icon: "shield",
        title: "Verified Clients",
        text: "Real hiring demand from pre-vetted companies with active budgets.",
        accent: "#10B981",
        gradient: "linear-gradient(135deg, #10B981, #059669)",
        bgTint: "rgba(16, 185, 129, 0.06)",
      },
      {
        icon: "briefcase",
        title: "Clear Requirements",
        text: "Detailed role specs, expectations, and timelines upfront.",
        accent: "#0EA5E9",
        gradient: "linear-gradient(135deg, #0EA5E9, #0284C7)",
        bgTint: "rgba(14, 165, 233, 0.06)",
      },
      {
        icon: "zap",
        title: "AI-Assisted Review",
        text: "Smart matching surfaces the best-fit candidates instantly.",
        accent: "#8B5CF6",
        gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
        bgTint: "rgba(139, 92, 246, 0.06)",
      },
      {
        icon: "activity",
        title: "Transparent Tracking",
        text: "Live pipeline visibility — every update in one place.",
        accent: "#F59E0B",
        gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
        bgTint: "rgba(245, 158, 11, 0.06)",
      },
      {
        icon: "send",
        title: "Faster Closures",
        text: "Shorter cycles from submission to offer with real-time feedback.",
        accent: "#F43F5E",
        gradient: "linear-gradient(135deg, #F43F5E, #E11D48)",
        bgTint: "rgba(244, 63, 94, 0.06)",
      },
      {
        icon: "star",
        title: "Strong Partnerships",
        text: "Build lasting client relationships through proven performance.",
        accent: "#6366F1",
        gradient: "linear-gradient(135deg, #6366F1, #4F46E5)",
        bgTint: "rgba(99, 102, 241, 0.06)",
      },
    ],
    shapes: [
      {
        type: "circle",
        color: "rgba(14, 165, 233, 0.12)",
        x: "-3%",
        y: "8%",
        size: 200,
      },
      {
        type: "circle",
        color: "rgba(14, 165, 233, 0.08)",
        x: "88%",
        y: "62%",
        size: 160,
      },
      {
        type: "circle",
        color: "rgba(139, 92, 246, 0.06)",
        x: "78%",
        y: "5%",
        size: 100,
      },
    ],
  },
];
