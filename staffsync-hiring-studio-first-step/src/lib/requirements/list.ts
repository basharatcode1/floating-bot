export type Requirement = {
  id: string; title: string; experience: string; date?: string; location?: string;
  type?: string; timezone?: string; primary: string[]; secondary: string[];
  morePrimary?: boolean; moreSecondary?: boolean; salary: string; certificates: string[];
  positions?: number; open?: number; candidates?: number; status: "Active";
};

// Only records visible in the supplied reference; no invented remaining rows.
export const requirements: Requirement[] = [
  { id: "REQ-0001", title: "Java Backend Developer", experience: "5-8 Years", date: "24 March 2026", location: "Hybrid - Bengaluru, Karnataka", type: "C-C", timezone: "IST", primary: ["Java 21", "Spring Boot 3.2", "Java Persistence API (JPA)", "Oracle", "Continuous Integration and Continuous Deployment (CI/CD) pipelines"], secondary: ["Leadership", "Application Programming Interfaces (APIs)", "Windows operating system"], morePrimary: true, salary: "₹17L - ₹22L / year • INR", certificates: ["Oracle Certified Professional: Java SE", "Spring Certified Professional", "AWS Certified Developer"], positions: 2, open: 2, candidates: 4, status: "Active" },
  { id: "REQ-0002", title: "Senior React Developer", experience: "5-7 Years", date: "15 March 2026", location: "Bangalore", type: "C-C", timezone: "IST", primary: ["React", "TypeScript", "Next.js", "Redux", "Tailwind CSS"], secondary: ["Node.js", "PostgreSQL", "Docker", "Git", "AWS"], morePrimary: true, moreSecondary: true, salary: "₹15 - ₹18L / year • INR", certificates: ["AWS Certified Developer", "Google Cloud Professional Architect", "Certified Kubernetes Administrator (CKA)", "Meta Certified Front-End Developer"], positions: 3, open: 2, candidates: 5, status: "Active" },
  { id: "REQ-0003", title: "Node.js Backend Engineer", experience: "4-6 Years", date: "12 March 2026", location: "Remote", type: "C-C", timezone: "UST", primary: ["Node.js", "Express", "TypeScript", "MongoDB", "PostgreSQL"], secondary: ["Docker", "Kubernetes", "AWS", "Kafka", "RabbitMQ"], morePrimary: true, moreSecondary: true, salary: "₹12 - ₹16L / year • INR", certificates: ["Node.js Certified Developer", "AWS Certified Solutions Architect", "MongoDB Certified Developer", "Docker Certified Associate"], positions: 2, open: 1, candidates: 3, status: "Active" },
  { id: "REQ-0004", title: "UI/UX Designer", experience: "3+ Years", primary: ["Figma", "Adobe XD", "UI Design", "UX Research", "Wireframing"], secondary: [], morePrimary: true, salary: "₹10 - ₹14L / year • INR", certificates: [], status: "Active" },
];

export function filterRequirements(rows: Requirement[], query: string, status: string, type: string, engagement: string) {
  const search = query.trim().toLowerCase();
  return rows.filter(row => {
    const searchable = [row.id, row.title, ...row.primary, ...row.secondary].join(" ").toLowerCase();
    const place = row.location?.toLowerCase() ?? "";
    return (!search || searchable.includes(search)) && (status === "all" || row.status.toLowerCase() === status)
      && (type === "all" || row.type === type)
      && (engagement === "all" || (engagement === "remote" ? place === "remote" : engagement === "hybrid" ? place.startsWith("hybrid") : !!place && place !== "remote" && !place.startsWith("hybrid")));
  });
}