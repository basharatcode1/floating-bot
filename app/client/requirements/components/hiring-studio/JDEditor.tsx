"use client";

import React, { useState } from "react";
import { ArrowRight, Pencil, RotateCcw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { SECTION_META, type JDDraft, type SectionKey } from "./types";
import { SourceTag } from "./Robot";
import { cn } from "@/app/lib/utils";

export function SectionCard({
  k,
  draft,
  setSection,
  onRegenerate,
  compact,
}: {
  k: SectionKey;
  draft: JDDraft;
  setSection: (k: SectionKey, content: string) => void;
  onRegenerate?: (k: SectionKey) => void;
  compact?: boolean;
}) {
  const meta = SECTION_META.find((m) => m.key === k);
  const s = draft[k];
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(s.content);
  const empty = !s.content.trim();

  if (!meta) return null;

  return (
    <div
      className={cn(
        "group rounded-xl border border-[var(--dash-card-border,#e2e8f0)] bg-[var(--dash-card-bg-solid,#ffffff)] p-3.5 sm:p-4 transition-shadow hover:shadow-sm",
        s.source === "ai" && "border-l-4 border-l-[#52c1e1]",
        empty && meta.required && "border-dashed border-amber-500/60 bg-amber-50/20"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="form-section-title text-[0.9rem] font-semibold text-black tracking-tight">
          {meta.label}
        </h3>
        {!meta.required && (
          <span className="form-section-desc text-[11px] text-slate-500 font-normal">
            optional
          </span>
        )}
        {!empty && <SourceTag source={s.source} />}

        <div className="ml-auto flex gap-1">
          {!compact && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRegenerate?.(k)}
              aria-label={`Regenerate ${meta.label}`}
              className="h-7 px-2.5 !rounded-md text-[11px] sm:text-xs font-semibold text-slate-700 hover:text-[#005A9C] hover:bg-[#EFF6FF] gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="h-3 w-3 shrink-0" /> Regenerate
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setVal(s.content);
              setEditing((e) => !e);
            }}
            aria-label={`Edit ${meta.label}`}
            className="h-7 px-2.5 !rounded-md text-[11px] sm:text-xs font-semibold text-slate-700 hover:text-[#005A9C] hover:bg-[#EFF6FF] gap-1.5 cursor-pointer transition-colors"
          >
            <Pencil className="h-3 w-3 shrink-0" /> {editing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      {editing ? (
        <div className="mt-3 space-y-2">
          <Textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="min-h-28 bg-[var(--dash-card-bg-solid,#ffffff)] border border-[var(--dash-card-border,#e2e8f0)] form-input-text focus:border-[#005A9C] focus-visible:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20"
            autoFocus
            aria-label={meta.label}
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                setSection(k, val);
                setEditing(false);
              }}
              className="h-8 px-3 !rounded-lg bg-[#005A9C] hover:bg-[#004A82] text-white text-xs font-bold cursor-pointer"
            >
              Save section
            </Button>
          </div>
        </div>
      ) : empty ? (
        <p className="mt-2 text-xs text-slate-500 italic font-normal">
          {meta.required
            ? "Missing — click Edit to add content for this required section."
            : "Not provided."}
        </p>
      ) : (
        <p className="mt-2 whitespace-pre-line text-xs sm:text-small-xs leading-relaxed text-slate-800 font-normal">
          {s.content}
        </p>
      )}
    </div>
  );
}

export function JDEditor({
  draft,
  setSection,
  onContinue,
  onRegenerate,
}: {
  draft: JDDraft;
  setSection: (k: SectionKey, content: string) => void;
  onContinue: () => void;
  onRegenerate?: (k: SectionKey) => void;
}) {
  return (
    <section className="space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-[var(--dash-card-border,#e2e8f0)] bg-[var(--dash-card-bg-solid,#ffffff)] p-3.5 shadow-sm">
        <div>
          <h2 className="text-[0.9rem] font-semibold text-black tracking-tight">
            Job description preview
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Edit any section inline. Blue-edged sections came from AI suggestions you accepted.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onContinue}
            className="h-8 px-3.5 !rounded-xl bg-[#005A9C] hover:bg-[#004A82] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
          >
            Continue to review <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {SECTION_META.map((m) => (
          <div
            key={m.key}
            className={cn(
              ["overview", "responsibilities"].includes(m.key) && "lg:col-span-2"
            )}
          >
            <SectionCard
              k={m.key}
              draft={draft}
              setSection={setSection}
              onRegenerate={onRegenerate}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
