"use client";

import React, { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { SECTION_META, type Suggestion } from "./types";
import { DemoBadge } from "./Robot";

export function SuggestionList({
  items,
  onAccept,
  onDismiss,
}: {
  items: Suggestion[];
  onAccept: (s: Suggestion, text: string) => void;
  onDismiss: (s: Suggestion) => void;
}) {
  const pending = items.filter((s) => s.status === "pending");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-[var(--dash-text-primary,#0f172a)] uppercase tracking-wider">
          AI Suggestions ({pending.length} pending)
        </h4>
        <DemoBadge label="AI Heuristics" />
      </div>

      {items.length === 0 && (
        <p className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-700 dark:text-emerald-300">
          No gaps detected — your requirement covers all recommended fields.
        </p>
      )}

      {items.map((s) => (
        <SuggestionItem
          key={s.id}
          s={s}
          onAccept={onAccept}
          onDismiss={onDismiss}
        />
      ))}

      <p className="text-[11px] text-[var(--dash-text-muted,#64748b)]">
        Accepted suggestions are merged into the matching section. Your original text is never overwritten without confirmation.
      </p>
    </div>
  );
}

function SuggestionItem({
  s,
  onAccept,
  onDismiss,
}: {
  s: Suggestion;
  onAccept: (s: Suggestion, t: string) => void;
  onDismiss: (s: Suggestion) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(s.proposed);
  const label = SECTION_META.find((m) => m.key === s.section)?.label;

  if (s.status !== "pending") {
    return (
      <div className="flex items-center justify-between rounded-xl border border-[var(--dash-card-border,#e2e8f0)] bg-[var(--dash-card-bg,#f8fafc)] px-3 py-2 text-xs text-[var(--dash-text-muted,#64748b)]">
        <span className="truncate">{s.title}</span>
        <span
          className={
            s.status === "accepted"
              ? "font-medium text-emerald-600 dark:text-emerald-400"
              : ""
          }
        >
          {s.status === "accepted" ? "Accepted" : "Dismissed"}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-l-4 border-l-cyan-500 border-[var(--dash-card-border,#e2e8f0)] bg-[var(--dash-card-bg-solid,#ffffff)] p-3.5 shadow-sm">
      <p className="text-[11px] font-semibold text-[var(--color-primary,#005A9C)]">
        {label}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-[var(--dash-text-primary,#0f172a)]">
        {s.title}
      </p>
      <p className="text-[11px] text-[var(--dash-text-muted,#64748b)] mt-0.5 leading-relaxed">
        {s.reason}
      </p>

      {editing ? (
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-2 min-h-16 text-xs bg-[var(--dash-card-bg-solid,#ffffff)] border border-[var(--dash-card-border,#e2e8f0)] focus:border-primary focus-visible:border-primary"
          aria-label="Edit suggestion"
        />
      ) : (
        <p className="mt-2 whitespace-pre-line rounded-lg bg-[#eaf5ff] dark:bg-[#00437f]/20 p-2.5 text-xs text-[#00437f] dark:text-[#daeeff] leading-relaxed">
          {text}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => onAccept(s, text)}
          className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
        >
          <Check className="h-3.5 w-3.5" /> Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditing((v) => !v)}
          className="h-7 px-2 text-xs"
        >
          <Pencil className="h-3 w-3 mr-1" /> {editing ? "Done" : "Edit"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDismiss(s)}
          className="h-7 px-2 text-xs text-[var(--dash-text-muted,#64748b)] hover:text-red-500"
        >
          <X className="h-3.5 w-3.5 mr-1" /> Dismiss
        </Button>
      </div>
    </div>
  );
}

