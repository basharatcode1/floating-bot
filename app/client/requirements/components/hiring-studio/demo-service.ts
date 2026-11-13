/**
 * Local deterministic NLP heuristics and templating service for Hiring Studio.
 * Complies with platform policies (e.g. C-C & C-H engagement models only).
 */
import {
  emptyDraft,
  type Answers,
  type JDDraft,
  type SectionKey,
  type Suggestion,
} from "./types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const bullets = (s: string) =>
  s
    .split(/[,\n;]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => `• ${x}`)
    .join("\n");

/** Assembles a draft from the user's answers. Only uses what the user typed. */
export async function demoAssembleDraft(a: Answers): Promise<JDDraft> {
  await wait(800);
  const d = emptyDraft();
  const set = (k: SectionKey, content: string) =>
    (d[k] = { content, source: "user" });

  if (a.title)
    set(
      "overview",
      `We are looking to hire ${a.openings ? `${a.openings} ` : ""}${a.title}${Number(a.openings) > 1 ? "s" : ""}.${a.interviewRounds ? ` The interview process will consist of ${a.interviewRounds}.` : ""}${a.urgency ? ` (${a.urgency.toLowerCase()})` : ""}`
    );
  if (a.responsibilities) set("responsibilities", bullets(a.responsibilities));
  if (a.mandatory) set("required", bullets(a.mandatory));
  if (a.preferred) set("preferred", bullets(a.preferred));
  if (a.experience) set("experience", a.experience);
  if (a.location || a.workMode)
    set("location", [a.location, a.workMode].filter(Boolean).join(" · "));
  if (a.employment) set("employment", a.employment);
  if (a.salary) set("compensation", a.salary);
  if (a.additional) set("additional", a.additional);
  return d;
}

const HEADINGS: [RegExp, SectionKey][] = [
  [/responsibilit|what you.?ll do|duties/i, "responsibilities"],
  [/required|must.?have|requirements|qualifications/i, "required"],
  [/preferred|nice.?to.?have|bonus/i, "preferred"],
  [/experience/i, "experience"],
  [/location|work mode|remote|onsite|hybrid/i, "location"],
  [/employment|engagement|contract|c-c|c-h/i, "employment"],
  [/salary|compensation|ctc|pay|budget/i, "compensation"],
  [/additional|other|notes/i, "additional"],
  [/overview|about the role|summary|description/i, "overview"],
];

/** Splits pasted/uploaded text into sections by simple heading detection. */
export function splitIntoSections(text: string): JDDraft {
  const d = emptyDraft();
  let current: SectionKey = "overview";
  const buf: Record<string, string[]> = {};

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const isHeading =
      line.length > 0 &&
      line.length < 50 &&
      /:?$/.test(line) &&
      !/^[•\-*]/.test(line);
    const match = isHeading ? HEADINGS.find(([re]) => re.test(line)) : undefined;
    if (match && line.split(" ").length <= 6) {
      current = match[1];
      continue;
    }
    (buf[current] ??= []).push(raw);
  }

  for (const [k, lines] of Object.entries(buf)) {
    d[k as SectionKey] = { content: lines.join("\n").trim(), source: "user" };
  }
  return d;
}

/** Heuristic gap analysis. Suggestions never overwrite without explicit confirmation. */
export async function demoAnalyze(d: JDDraft): Promise<Suggestion[]> {
  await wait(1000);
  const out: Suggestion[] = [];
  const add = (
    section: SectionKey,
    title: string,
    reason: string,
    proposed: string
  ) =>
    out.push({
      id: `${section}-${out.length}`,
      section,
      title,
      reason,
      proposed,
      status: "pending",
    });

  const all = Object.values(d)
    .map((s) => s.content)
    .join("\n");

  if (!d.experience.content && !/\d+\s*(\+|-|to)?\s*\d*\s*years?/i.test(all))
    add(
      "experience",
      "Add an experience range",
      "Vendors filter candidates heavily by experience; none was specified.",
      "3–5 years of relevant experience"
    );

  if (!d.location.content && !/(remote|hybrid|on-?site|office)/i.test(all))
    add(
      "location",
      "Specify location & work mode",
      "No location or work mode was detected.",
      "Bengaluru, India · Hybrid (3 days in office)"
    );

  if (
    !d.employment.content &&
    !/(c-c|c-h|contract to contract|contract to hire)/i.test(all)
  )
    add(
      "employment",
      "Specify engagement model",
      "Engagement model is missing. Platform supports C-C or C-H.",
      "Contract to Contract (C-C)"
    );

  if (!d.compensation.content && !/(salary|ctc|lpa|\$|₹|budget|compensation)/i.test(all))
    add(
      "compensation",
      "Consider specifying budget/rate",
      "Postings with explicit budget ranges receive faster vendor matches.",
      "₹18–24 LPA (or $70–90/hr)"
    );

  if (d.responsibilities.content && !d.responsibilities.content.includes("•"))
    add(
      "responsibilities",
      "Format responsibilities as bullets",
      "Bullet points make requirements much easier to parse.",
      bullets(d.responsibilities.content.replace(/\.\s+/g, ", "))
    );

  if (!d.required.content)
    add(
      "required",
      "List mandatory skills",
      "No clear required skills section was detected.",
      "• Add 3–5 mandatory skills here"
    );

  return out;
}

const FAQ: [RegExp, string][] = [
  [
    /skill/i,
    "List 4–6 must-have skills under Required, and move nice-to-haves to Preferred. A focused list helps vendors match faster.",
  ],
  [
    /salary|compensation|budget|rate/i,
    "Compensation is optional, but including a rate or budget range significantly improves candidate response quality.",
  ],
  [
    /publish/i,
    "Publishing makes the requirement visible to your vetted vendors. You'll always get a confirmation review step first.",
  ],
  [
    /draft|save/i,
    "Save as Draft stores your requirement locally in your browser so you can continue anytime.",
  ],
  [
    /experience/i,
    "Ranges like '3–5 years' or '5–8 years' attract more qualified candidates than a single fixed number.",
  ],
  [
    /work mode|remote|hybrid/i,
    "Work modes include On-site, Hybrid, and Remote. For Hybrid roles, please specify expected office days.",
  ],
  [
    /engagement|model|c-c|c-h/i,
    "The platform strictly supports Contract to Contract (C-C) and Contract to Hire (C-H) engagement models.",
  ],
];

export async function demoAsk(q: string, context: string): Promise<string> {
  await wait(600);
  const hit = FAQ.find(([re]) => re.test(q));
  if (hit) return hit[1];
  return `I can explain fields, suggest skills, or help phrase a section. You're currently on “${context}”. Ask about skills, experience, budget, or engagement models.`;
}

export const SKILL_SUGGESTIONS = {
  frontend: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "Jest"],
  backend: ["Node.js", "Express", "PostgreSQL", "REST APIs", "AWS", "Docker"],
  data: ["Python", "SQL", "Pandas", "Power BI", "Data Modeling", "ETL"],
  design: ["Figma", "UI/UX", "User Research", "Prototyping", "Design Systems"],
  sales: ["B2B Sales", "Lead Generation", "CRM", "Negotiation", "Account Management"],
  devops: ["Kubernetes", "Docker", "CI/CD", "Terraform", "AWS", "Linux"],
  default: ["Communication", "Problem Solving", "Stakeholder Management", "Agile"],
};

export function skillChips(title: string): string[] {
  const t = title.toLowerCase();
  if (/front|react|ui|web/i.test(t)) return SKILL_SUGGESTIONS.frontend;
  if (/back|node|api|server|java|python/i.test(t)) return SKILL_SUGGESTIONS.backend;
  if (/data|analyst|analytics|bi/i.test(t)) return SKILL_SUGGESTIONS.data;
  if (/design|ux|product designer/i.test(t)) return SKILL_SUGGESTIONS.design;
  if (/devops|cloud|sre|infra/i.test(t)) return SKILL_SUGGESTIONS.devops;
  if (/sales|account|bdm/i.test(t)) return SKILL_SUGGESTIONS.sales;
  return SKILL_SUGGESTIONS.default;
}

