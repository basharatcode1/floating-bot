import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Lightbulb, Pencil, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Robot, Typing } from "./Robot";
import { skillChips } from "@/lib/jd/demo-service";
import type { AnswerKey, Answers } from "@/lib/jd/types";
import { cn } from "@/lib/utils";

interface Q {
  id: AnswerKey;
  ask: string;
  optional?: boolean;
  multiline?: boolean;
  chips?: string[] | ((a: Answers) => string[]);
  multi?: boolean;
  helper?: string;
  placeholder?: string;
}

export const QUESTIONS: Q[] = [
  { id: "title", ask: "Let's start simple — what's the job title?", chips: ["Frontend Developer", "Data Analyst", "Sales Executive", "UX Designer"], placeholder: "e.g. Senior Backend Engineer" },
  { id: "openings", ask: "How many openings do you have?", chips: ["1", "2", "3–5", "6+"] },
  { id: "experience", ask: "What experience range are you looking for?", chips: ["0–2 years", "2–4 years", "4–7 years", "7+ years"] },
  { id: "employment", ask: "What's the employment type?", chips: ["Full-time", "Part-time", "Contract", "Contract-to-hire", "Internship"] },
  { id: "mandatory", ask: "Which skills are mandatory?", multi: true, chips: (a) => skillChips(a.title ?? ""), helper: "Not sure which skills to include? I've suggested some based on the role — tap to add.", placeholder: "Comma-separated, e.g. React, TypeScript" },
  { id: "preferred", ask: "Any preferred (nice-to-have) skills?", optional: true, multi: true, chips: ["Leadership", "Mentoring", "Cloud certification", "Agile"] },
  { id: "responsibilities", ask: "What will this person be responsible for?", multiline: true, helper: "Write 3–5 key duties, one per line. Short and specific works best.", placeholder: "Build and maintain…\nCollaborate with…" },
  { id: "location", ask: "Where is the role based?", chips: ["Bengaluru", "Mumbai", "Pune", "Hyderabad", "Delhi NCR"] },
  { id: "workMode", ask: "What's the work mode?", chips: ["On-site", "Hybrid", "Remote"] },
  { id: "salary", ask: "Would you like to share a salary range?", optional: true, helper: "Optional — but ranges often improve response quality.", placeholder: "e.g. ₹12–18 LPA" },
  { id: "urgency", ask: "How urgent is this hire?", chips: ["Immediate", "Within 2 weeks", "Within a month", "Flexible"] },
  { id: "additional", ask: "Anything else candidates should know?", optional: true, multiline: true, placeholder: "Notice period, certifications, travel…" },
];

export function CreateChat({
  answers,
  setAnswers,
  index,
  setIndex,
  onDone,
  onExit,
}: {
  answers: Answers;
  setAnswers: (a: Answers) => void;
  index: number;
  setIndex: (i: number) => void;
  onDone: () => void;
  onExit: () => void;
}) {
  const q = QUESTIONS[Math.min(index, QUESTIONS.length - 1)]!;
  const [draft, setDraft] = useState(answers[q.id] ?? "");
  const [typing, setTyping] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(answers[q.id] ?? "");
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 550);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [typing, index]);

  const chips = typeof q.chips === "function" ? q.chips(answers) : q.chips;
  const submit = (val: string) => {
    const next = { ...answers, [q.id]: val.trim() };
    setAnswers(next);
    if (index + 1 >= QUESTIONS.length) onDone();
    else setIndex(index + 1);
  };
  const toggleChip = (c: string) => {
    if (!q.multi) return submit(c);
    const parts = draft.split(",").map((s) => s.trim()).filter(Boolean);
    setDraft((parts.includes(c) ? parts.filter((p) => p !== c) : [...parts, c]).join(", "));
  };
  const selected = draft.split(",").map((s) => s.trim());

  return (
    <section className="rounded-3xl border bg-card shadow-soft">
      <header className="flex flex-wrap items-center gap-4 border-b px-5 py-4">
        <Button variant="ghost" size="sm" onClick={onExit}><ArrowLeft className="h-4 w-4" /> Options</Button>
        <div className="min-w-40 flex-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Question {index + 1} of {QUESTIONS.length}</span>
            <span>{Math.round((index / QUESTIONS.length) * 100)}%</span>
          </div>
          <Progress value={(index / QUESTIONS.length) * 100} className="mt-1.5 h-1.5" />
        </div>
      </header>

      <div className="max-h-[52vh] space-y-4 overflow-y-auto px-5 py-6" aria-live="polite">
        {QUESTIONS.slice(0, index).map((pq, i) => (
          <div key={pq.id} className="space-y-2">
            <Bubble>{pq.ask}</Bubble>
            <div className="flex justify-end">
              <button
                onClick={() => setIndex(i)}
                className="group flex max-w-[80%] items-start gap-2 whitespace-pre-line rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-left text-sm text-primary-foreground"
                aria-label={`Edit answer: ${pq.ask}`}
              >
                {answers[pq.id] || <em className="opacity-75">Skipped</em>}
                <Pencil className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
              </button>
            </div>
          </div>
        ))}
        {typing ? (
          <div className="flex items-end gap-2"><Robot size={36} /><Typing /></div>
        ) : (
          <div className="space-y-2">
            <Bubble>{q.ask}{q.optional && <span className="ml-1 text-muted-foreground">(optional)</span>}</Bubble>
            {q.helper && (
              <p className="ml-11 flex max-w-md items-start gap-2 rounded-xl bg-brand-mist px-3 py-2 text-xs text-accent-foreground">
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {q.helper}
              </p>
            )}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        className="space-y-3 border-t bg-brand-mist/60 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.trim()) submit(draft);
        }}
      >
        {chips && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested answers">
            {chips.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => toggleChip(c)}
                aria-pressed={q.multi ? selected.includes(c) : undefined}
                className={cn(
                  "rounded-full border bg-card px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary",
                  q.multi && selected.includes(c) && "border-primary bg-accent text-accent-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          {q.multiline ? (
            <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={q.placeholder ?? "Type your answer…"} className="min-h-24 bg-card" aria-label={q.ask} />
          ) : (
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={q.placeholder ?? "Type your answer…"} className="h-11 bg-card" aria-label={q.ask} autoFocus />
          )}
          <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={!draft.trim()} aria-label="Send answer"><Send className="h-4 w-4" /></Button>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="ghost" size="sm" disabled={index === 0} onClick={() => setIndex(index - 1)}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {q.optional && <Button type="button" variant="ghost" size="sm" onClick={() => submit("")}>Skip for now</Button>}
        </div>
      </form>
    </section>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-end gap-2">
      <Robot size={36} />
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm border bg-card px-4 py-2.5 text-sm shadow-soft">{children}</div>
    </div>
  );
}
