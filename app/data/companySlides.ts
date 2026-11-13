/**
 * Hiring Companies carousel slides configuration.
 * Jasper.ai-inspired bold collage style with colorful backgrounds,
 * geometric shapes, stat badges, and product UI mockups.
 */

export const companySlides = [
  {
    id: "client-problems",
    layout: "centered-illustration",
    badge: "THE DAILY REALITY",
    title: "Finding Great Talent Shouldn't Feel This Difficult.",
    description: "Hiring slows down long before interviews even begin.",
    bottomStory: "Every delay quietly pushes great talent toward someone else.",
    personImage: "/people/problems-client.webp",
    bgColor: "#FFF5F5", // soft warm red/rose for client problems
    gridColor: "rgba(244, 63, 94, 0.08)",
    shapes: [
      { type: "circle", color: "#FEC7D7", x: "72%", y: "55%", size: 120 },
      { type: "circle", color: "#FDA4AF", x: "84%", y: "38%", size: 70 },
      {
        type: "triangle",
        color: "#F43F5E",
        x: "8%",
        y: "68%",
        size: 50,
        rotation: 20,
      },
      {
        type: "rect",
        color: "#FFE4E6",
        x: "88%",
        y: "72%",
        size: 36,
        rotation: -18,
      },
      { type: "circle", color: "#FB7185", x: "60%", y: "76%", size: 45 },
    ],
    floatingWidgets: [
      {
        type: "problem-card",
        title: "Endless Search",
        text: "Finding the right profile takes longer than it should.",
        x: "1%",
        y: "16%",
      },
      {
        type: "problem-card",
        title: "Slow Responses",
        text: "Qualified candidates rarely arrive when needed.",
        x: "1%",
        y: "38%",
      },
      {
        type: "problem-card",
        title: "Uncertain Quality",
        text: "Every resume feels like another guess.",
        x: "1%",
        y: "60%",
      },
      {
        type: "problem-card",
        title: "Manual Screening",
        text: "Too much time spent filtering instead of hiring.",
        x: "71%",
        y: "16%",
      },
      {
        type: "problem-card",
        title: "Scheduling Delays",
        text: "Interview coordination becomes another bottleneck.",
        x: "71%",
        y: "38%",
      },
      {
        type: "problem-card",
        title: "Constant Follow-ups",
        text: "Progress depends on reminders, not momentum.",
        x: "71%",
        y: "60%",
      },
    ],
  },
  {
    id: "client-solutions",
    layout: "solutions-bento",
    badge: "WITH HIREFIRST",
    title: "Hire With Confidence, Not Guesswork.",
    bottomStory:
      "The hiring process finally moves at the speed your business needs.",
    bgColor: "#EEF2FF", // soft warm blue/indigo
    gridColor: "rgba(99, 102, 241, 0.05)",
    solutions: [
      {
        icon: "shield",
        title: "Trusted Vendors",
        text: "Reliable hiring partners with proven track records.",
        accent: "#10B981",
        gradient: "linear-gradient(135deg, #10B981, #059669)",
        bgTint: "rgba(16, 185, 129, 0.06)",
      },
      {
        icon: "zap",
        title: "AI-Scored Talent",
        text: "Smarter shortlisting based on job fit and skill match.",
        accent: "#8B5CF6",
        gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
        bgTint: "rgba(139, 92, 246, 0.06)",
      },
      {
        icon: "star",
        title: "Human Validation",
        text: "Advanced matching technology backed by expert recruitment oversight.",
        accent: "#F59E0B",
        gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
        bgTint: "rgba(245, 158, 11, 0.06)",
      },
      {
        icon: "briefcase",
        title: "Interview Ready",
        text: "Every candidate is pre-screened and prepared before submission.",
        accent: "#0EA5E9",
        gradient: "linear-gradient(135deg, #0EA5E9, #0284C7)",
        bgTint: "rgba(14, 165, 233, 0.06)",
      },
      {
        icon: "chart",
        title: "Live Visibility",
        text: "Track every interview stage and candidate status in real-time.",
        accent: "#6366F1",
        gradient: "linear-gradient(135deg, #6366F1, #4F46E5)",
        bgTint: "rgba(99, 102, 241, 0.06)",
      },
      {
        icon: "send",
        title: "Faster Hiring",
        text: "Spend less time waiting and make better hiring decisions.",
        accent: "#F43F5E",
        gradient: "linear-gradient(135deg, #F43F5E, #E11D48)",
        bgTint: "rgba(244, 63, 94, 0.06)",
      },
    ],
    shapes: [
      {
        type: "circle",
        color: "rgba(99, 102, 241, 0.12)",
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

