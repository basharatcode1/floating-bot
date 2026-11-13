import { useState } from "react";
import { ArrowRight, Pencil, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SECTION_META, type JDDraft, type SectionKey } from "@/lib/jd/types";
import { SourceTag } from "./Robot";
import { cn } from "@/lib/utils";

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
    <div className={cn("group rounded-2xl border bg-card p-5 transition-shadow hover:shadow-soft", s.source === "ai" && "border-l-4 border-l-brand-sky", empty && meta.required && "border-dashed border-warning/50")}>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-sm font-semibold">{meta.label}</h3>
        {!meta.required && <span className="text-xs text-muted-foreground">optional</span>}
        {!empty && <SourceTag source={s.source} />}
        <div className="ml-auto flex gap-1">
          {onRegenerate && !compact && (
            <Button size="sm" variant="ghost" onClick={() => onRegenerate(k)} aria-label={`Regenerate ${meta.label}`}><RotateCcw className="h-3.5 w-3.5" /> Regenerate</Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => { setVal(s.content); setEditing((e) => !e); }} aria-label={`Edit ${meta.label}`}>
            <Pencil className="h-3.5 w-3.5" /> {editing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>
      {editing ? (
        <div className="mt-3 space-y-2">
          <Textarea value={val} onChange={(e) => setVal(e.target.value)} className="min-h-28" autoFocus aria-label={meta.label} />
          <div className="flex justify-end"><Button size="sm" onClick={() => { setSection(k, val); setEditing(false); }}>Save section</Button></div>
        </div>
      ) : empty ? (
        <p className="mt-2 text-sm text-muted-foreground">{meta.required ? "Missing — click Edit to add this section." : "Not provided."}</p>
      ) : (
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{s.content}</p>
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
  onRegenerate: (k: SectionKey) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-soft">
        <div>
          <h2 className="text-lg font-semibold">Job description preview</h2>
          <p className="text-sm text-muted-foreground">Edit any section inline. Blue-edged sections came from AI suggestions you accepted.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onContinue}>Continue to review <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {SECTION_META.map((m) => (
          <div key={m.key} className={cn(["overview", "responsibilities"].includes(m.key) && "lg:col-span-2")}>
            <SectionCard k={m.key} draft={draft} setSection={setSection} onRegenerate={onRegenerate} />
          </div>
        ))}
      </div>
    </section>
  );
}

export const regenerateUnavailable = () =>
  toast.info("Section regeneration needs the AI service", { description: "It isn't connected in this demo. Edit the section directly." });
