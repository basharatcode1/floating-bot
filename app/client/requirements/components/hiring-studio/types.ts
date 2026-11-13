export type SectionKey =
  | "overview"
  | "responsibilities"
  | "required"
  | "preferred"
  | "experience"
  | "location"
  | "employment"
  | "compensation"
  | "additional";

export type Source = "user" | "ai";

export interface JDSection {
  content: string;
  source: Source;
}

export type JDDraft = Record<SectionKey, JDSection>;

export const SECTION_META: { key: SectionKey; label: string; required: boolean }[] = [
  { key: "overview", label: "Role overview", required: true },
  { key: "responsibilities", label: "Responsibilities", required: true },
  { key: "required", label: "Required skills", required: true },
  { key: "preferred", label: "Preferred skills", required: false },
  { key: "experience", label: "Experience", required: true },
  { key: "location", label: "Location & work mode", required: true },
  { key: "employment", label: "Employment / Engagement", required: true },
  { key: "compensation", label: "Compensation", required: false },
  { key: "additional", label: "Additional requirements", required: false },
];

export const emptyDraft = (): JDDraft =>
  Object.fromEntries(
    SECTION_META.map((s) => [s.key, { content: "", source: "user" as Source }])
  ) as JDDraft;

export type AnswerKey =
  | "title"
  | "openings"
  | "experience"
  | "employment"
  | "mandatory"
  | "preferred"
  | "responsibilities"
  | "location"
  | "workMode"
  | "salary"
  | "urgency"
  | "additional"
  | "interviewRounds";

export type Answers = Partial<Record<AnswerKey, string>>;

export interface Suggestion {
  id: string;
  section: SectionKey;
  title: string;
  reason: string;
  proposed: string;
  status: "pending" | "accepted" | "dismissed";
}

export function completeness(d: JDDraft) {
  const req = SECTION_META.filter((s) => s.required);
  const done = req.filter((s) => d[s.key].content.trim().length > 0).length;
  return {
    done,
    total: req.length,
    pct: Math.round((done / req.length) * 100),
  };
}

