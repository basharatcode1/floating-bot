"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Lightbulb, Pencil, Send } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Progress } from "@/app/components/ui/progress";
import { Robot, Typing } from "./Robot";
import { skillChips } from "./demo-service";
import type { AnswerKey, Answers } from "./types";
import { cn } from "@/app/lib/utils";

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
  {
    id: "title",
    ask: "What type of candidate are you looking to hire?",
    chips: [
      "Frontend Developer",
      "Senior Backend Engineer",
      "Full Stack Developer",
      "DevOps Specialist",
      "UI/UX Designer",
      "Data Analyst",
      "Product Manager",
    ],
    placeholder: "e.g. Senior Full Stack Engineer",
  },
  {
    id: "experience",
    ask: "What level of professional experience is required for this position?",
    chips: ["0–2 years", "2–4 years", "3–5 years", "5–8 years", "8+ years"],
    placeholder: "e.g. 3–5 years",
  },
  {
    id: "mandatory",
    ask: "What key skills are required for this position?",
    multi: true,
    chips: (a) => skillChips(a.title ?? ""),
    helper:
      "Tap suggested skills to select multiple, or type custom comma-separated tags.",
    placeholder: "Comma-separated, e.g. React, TypeScript, Next.js",
  },
  {
    id: "interviewRounds",
    ask: "How many interview rounds will be conducted for this position?",
    chips: ["1 Round", "2 Rounds", "3 Rounds", "4 Rounds"],
    placeholder: "e.g. 2 Rounds",
  },
  {
    id: "openings",
    ask: "How many candidates are you planning to hire for this position?",
    chips: ["1", "2", "3–5", "6+"],
    placeholder: "e.g. 1",
  },
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
    const t = setTimeout(() => setTyping(false), 450);
    return () => clearTimeout(t);
  }, [index, q.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [typing, index]);

  const chips = typeof q.chips === "function" ? q.chips(answers) : q.chips;

  const submit = (val: string) => {
    const next = { ...answers, [q.id]: val.trim() };
    setAnswers(next);
    if (index + 1 >= QUESTIONS.length) {
      onDone();
    } else {
      setIndex(index + 1);
    }
  };

  const toggleChip = (c: string) => {
    if (!q.multi) return submit(c);
    const parts = draft
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const updated = parts.includes(c)
      ? parts.filter((p) => p !== c)
      : [...parts, c];
    setDraft(updated.join(", "));
  };

  const selected = draft.split(",").map((s) => s.trim());

  return (
    <section className="rounded-2xl border border-[var(--dash-card-border,#e2e8f0)] bg-[var(--dash-card-bg-solid,#ffffff)] shadow-sm">
      <header className="flex flex-wrap items-center gap-3 border-b border-[var(--dash-divider,#e2e8f0)] px-4 py-2.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onExit}
          className="h-7 px-2 text-xs gap-1 text-[var(--dash-text-secondary,#475569)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Options
        </Button>
        <div className="min-w-36 flex-1">
          <div className="flex justify-between text-[11px] text-[var(--dash-text-muted,#64748b)]">
            <span>
              Question {index + 1} of {QUESTIONS.length}
            </span>
            <span>{Math.round((index / QUESTIONS.length) * 100)}%</span>
          </div>
          <Progress
            value={(index / QUESTIONS.length) * 100}
            className="mt-1 h-1.5"
          />
        </div>
      </header>

      <div
        className="max-h-[25vh] sm:max-h-[28vh] space-y-2 overflow-y-auto px-3.5 py-2.5"
        aria-live="polite"
      >
        {QUESTIONS.slice(0, index).map((pq, i) => (
          <div key={pq.id} className="space-y-2">
            <Bubble>{pq.ask}</Bubble>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group flex max-w-[80%] items-center gap-1.5 whitespace-pre-line rounded-xl rounded-tr-xs bg-[#005A9C] px-3 py-1.5 text-left text-xs text-white shadow-sm cursor-pointer hover:bg-[#004A82] transition-colors"
                aria-label={`Edit answer: ${pq.ask}`}
              >
                <span>
                  {answers[pq.id] || <em className="opacity-75">Skipped</em>}
                </span>
                <Pencil className="h-3 w-3 shrink-0 opacity-60 group-hover:opacity-100" />
              </button>
            </div>
          </div>
        ))}
        {typing ? (
          <div className="flex items-end gap-2">
            <Robot size={26} />
            <Typing />
          </div>
        ) : (
          <div className="space-y-1.5">
            <Bubble>
              {q.ask}
              {q.optional && (
                <span className="ml-1.5 text-xs text-[var(--dash-text-muted,#64748b)]">
                  (optional)
                </span>
              )}
            </Bubble>
            {q.helper && (
              <p className="ml-8 flex max-w-md items-start gap-1.5 rounded-lg bg-brand-mist px-2.5 py-1 text-[11px] text-accent-foreground">
                <Lightbulb className="mt-0.5 h-3 w-3 shrink-0" /> {q.helper}
              </p>
            )}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        className="space-y-2 border-t border-[var(--dash-divider,#e2e8f0)] bg-brand-mist/60 p-2.5 sm:p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.trim()) submit(draft);
        }}
      >
        {chips && (
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Suggested answers"
          >
            {chips.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => toggleChip(c)}
                aria-pressed={q.multi ? selected.includes(c) : undefined}
                className={cn(
                  "rounded-full border border-[var(--dash-card-border,#e2e8f0)] bg-[var(--dash-card-bg-solid,#ffffff)] px-2 py-0.5 text-xs text-[var(--dash-text-primary,#0f172a)] transition-colors hover:border-[#005A9C] hover:text-[#005A9C] cursor-pointer",
                  q.multi &&
                    selected.includes(c) &&
                    "border-[#005A9C] bg-[#EFF6FF] text-[#005A9C] font-semibold",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-1.5">
          {q.multiline ? (
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={q.placeholder ?? "Type your answer…"}
              className="min-h-16 rounded-xl bg-white border border-slate-300 hover:border-slate-400 form-input-text text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:border-[#005A9C] focus-visible:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20 px-3 py-2"
              aria-label={q.ask}
            />
          ) : (
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={q.placeholder ?? "Type your answer…"}
              className="h-[var(--dash-input-height)] rounded-xl bg-white border border-slate-300 hover:border-slate-400 form-input-text text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:border-[#005A9C] focus-visible:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20 px-3"
              aria-label={q.ask}
              autoFocus
            />
          )}
          <Button
            type="submit"
            size="icon"
            className="h-[var(--dash-input-height)] w-[var(--dash-input-height)] shrink-0 !rounded-xl bg-[#005A9C] hover:bg-[#004A82] text-white cursor-pointer shadow-xs"
            disabled={!draft.trim()}
            aria-label="Send answer"
          >
            <Send className="h-3.5 w-3.5 text-white" />
          </Button>
        </div>
        <div className="flex justify-between pt-0.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
            className="h-6 px-1.5 text-[11px] text-[var(--dash-text-muted,#64748b)]"
          >
            <ArrowLeft className="h-3 w-3 mr-1" /> Previous
          </Button>
          {q.optional && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => submit("")}
              className="h-6 px-1.5 text-[11px] text-[var(--dash-text-muted,#64748b)]"
            >
              Skip for now
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-end gap-2">
      <Robot size={26} />
      <div className="max-w-[85%] rounded-xl rounded-tl-xs border border-[var(--dash-card-border,#e2e8f0)] bg-[var(--dash-card-bg-solid,#ffffff)] px-3 py-1.5 text-xs text-[var(--dash-text-primary,#0f172a)] shadow-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
