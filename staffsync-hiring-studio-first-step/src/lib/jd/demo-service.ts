/**
 * DEMO SERVICE — no AI backend is connected.
 * Every function here is deterministic, local-only logic (templating + heuristics),
 * and the UI labels its output as "Demo". Replace these with real server-function
 * calls (e.g. createServerFn hitting an AI gateway) to go live. Keep the signatures.
 */
import { emptyDraft, type Answers, type JDDraft, type SectionKey, type Suggestion } from "./types";

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
  await wait(900);
  const d = emptyDraft();
  const set = (k: SectionKey, content: string) => (d[k] = { content, source: "user" });
  if (a.title)
    set(
      "overview",
      `We are hiring ${a.openings ? `${a.openings} ` : ""}${a.title}${Number(a.openings) > 1 ? "s" : ""}${a.urgency ? ` (${a.urgency.toLowerCase()})` : ""}.`,
    );
  if (a.responsibilities) set("responsibilities", bullets(a.responsibilities));
  if (a.mandatory) set("required", bullets(a.mandatory));
  if (a.preferred) set("preferred", bullets(a.preferred));
  if (a.experience) set("experience", a.experience);
  if (a.location || a.workMode) set("location", [a.location, a.workMode].filter(Boolean).join(" · "));
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
  [/employment|job type|contract/i, "employment"],
  [/salary|compensation|ctc|pay/i, "compensation"],
  [/additional|other/i, "additional"],
  [/overview|about the role|summary|description/i, "overview"],
];

/** Splits pasted/uploaded text into sections by simple heading detection. */
export function splitIntoSections(text: string): JDDraft {
  const d = emptyDraft();
  let current: SectionKey = "overview";
  const buf: Record<string, string[]> = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const isHeading = line.length > 0 && line.length < 50 && /:?$/.test(line) && !/^[•\-*]/.test(line);
    const match = isHeading ? HEADINGS.find(([re]) => re.test(line)) : undefined;
    if (match && line.split(" ").length <= 6) {
      current = match[1];
      continue;
    }
    (buf[current] ??= []).push(raw);
  }
  for (const [k, lines] of Object.entries(buf)) d[k as SectionKey] = { content: lines.join("\n").trim(), source: "user" };
  return d;
}

/** Heuristic gap analysis (demo). Suggestions never overwrite — the UI asks first. */
export async function demoAnalyze(d: JDDraft): Promise<Suggestion[]> {
  await wait(1400);
  const out: Suggestion[] = [];
  const add = (section: SectionKey, title: string, reason: string, proposed: string) =>
    out.push({ id: `${section}-${out.length}`, section, title, reason, proposed, status: "pending" });
  const all = Object.values(d).map((s) => s.content).join("\n");
  if (!d.experience.content && !/\d+\s*(\+|-|to)?\s*\d*\s*years?/i.test(all))
    add("experience", "Add an experience range", "Candidates filter heavily on experience; none was found.", "3–5 years of relevant experience");
  if (!d.location.content && !/(remote|hybrid|on-?site|office)/i.test(all))
    add("location", "Specify location & work mode", "No location or work mode was detected.", "Bengaluru, India · Hybrid (3 days in office)");
  if (!d.employment.content && !/(full.?time|part.?time|contract|intern)/i.test(all))
    add("employment", "State the employment type", "Employment type is missing.", "Full-time, permanent");
  if (!d.compensation.content && !/(salary|ctc|lpa|\$|₹|compensation)/i.test(all))
    add("compensation", "Consider adding a salary range", "Postings with pay ranges typically get more qualified applicants (optional).", "₹18–24 LPA, based on experience");
  if (d.responsibilities.content && !d.responsibilities.content.includes("•"))
    add("responsibilities", "Format responsibilities as bullets", "Long paragraphs are harder to scan.", bullets(d.responsibilities.content.replace(/\.\s+/g, ", ")));
  if (!d.required.content)
    add("required", "List mandatory skills", "No clear 'required skills' section was found.", "• Add 4–6 must-have skills here");
  return out;
}

const FAQ: [RegExp, string][] = [
  [/skill/i, "List 4–6 must-have skills under Required, and move nice-to-haves to Preferred. Too many mandatory skills shrinks your candidate pool."],
  [/salary|compensation|pay/i, "Compensation is optional, but including a range usually improves response quality. You can add it in the Compensation section."],
  [/publish/i, "Publishing makes the requirement visible to your StaffSync vendors. You'll always get a confirmation step first — nothing publishes automatically."],
  [/draft|save/i, "Save as Draft stores your work in this browser (demo). You can come back and continue anytime."],
  [/experience/i, "Use a range like '3–5 years'. Ranges attract more candidates than a single fixed number."],
  [/pdf|upload|file/i, "You can upload PDF or TXT files up to 10 MB. TXT is read directly; PDF text extraction needs the parsing service, so paste the text if it isn't extracted."],
  [/work mode|remote|hybrid/i, "Work mode is On-site, Hybrid, or Remote. For Hybrid, mention how many office days are expected."],
];

export async function demoAsk(q: string, context: string): Promise<string> {
  await wait(700);
  const hit = FAQ.find(([re]) => re.test(q));
  if (hit) return hit[1];
  return `I can explain fields, suggest skills, or help phrase a section. You're currently on “${context}”. Try asking about skills, experience, salary, or publishing.`;
}

export const SKILL_SUGGESTIONS = {
  frontend: ["React", "TypeScript", "CSS", "Accessibility", "Testing"],
  backend: ["Node.js", "SQL", "REST APIs", "Cloud", "Microservices"],
  data: ["Python", "SQL", "Statistics", "Power BI", "ETL"],
  design: ["Figma", "User research", "Prototyping", "Design systems"],
  sales: ["Negotiation", "CRM", "Lead generation", "Communication"],
  default: ["Communication", "Problem solving", "Stakeholder management", "MS Office"],
};

export function skillChips(title: string) {
  const t = title.toLowerCase();
  if (/front|react|ui dev/.test(t)) return SKILL_SUGGESTIONS.frontend;
  if (/back|java|node|api/.test(t)) return SKILL_SUGGESTIONS.backend;
  if (/data|analyst|bi/.test(t)) return SKILL_SUGGESTIONS.data;
  if (/design|ux/.test(t)) return SKILL_SUGGESTIONS.design;
  if (/sales|account/.test(t)) return SKILL_SUGGESTIONS.sales;
  return SKILL_SUGGESTIONS.default;
}
