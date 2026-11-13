import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SECTION_META, type Suggestion } from "@/lib/jd/types";
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
        <h3 className="font-display text-sm font-semibold">Suggestions ({pending.length} pending)</h3>
        <DemoBadge label="Demo heuristics" />
      </div>
      {items.length === 0 && <p className="rounded-xl bg-success-soft p-3 text-sm text-success">No gaps found — your JD covers the essentials.</p>}
      {items.map((s) => <Item key={s.id} s={s} onAccept={onAccept} onDismiss={onDismiss} />)}
      <p className="text-xs text-muted-foreground">Accepted suggestions are added to the matching section. Your original text is never overwritten without your approval.</p>
    </div>
  );
}

function Item({ s, onAccept, onDismiss }: { s: Suggestion; onAccept: (s: Suggestion, t: string) => void; onDismiss: (s: Suggestion) => void }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(s.proposed);
  const label = SECTION_META.find((m) => m.key === s.section)?.label;
  if (s.status !== "pending")
    return (
      <div className="flex items-center justify-between rounded-xl border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
        <span>{s.title}</span>
        <span className={s.status === "accepted" ? "text-success" : ""}>{s.status === "accepted" ? "Accepted" : "Dismissed"}</span>
      </div>
    );
  return (
    <div className="rounded-xl border border-l-4 border-l-brand-sky bg-card p-4">
      <p className="text-xs font-medium text-primary">{label}</p>
      <p className="mt-0.5 font-medium">{s.title}</p>
      <p className="text-sm text-muted-foreground">{s.reason}</p>
      {editing ? (
        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="mt-3 min-h-20" aria-label="Edit suggestion" />
      ) : (
        <p className="mt-3 whitespace-pre-line rounded-lg bg-brand-mist p-3 text-sm">{text}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => onAccept(s, text)}><Check className="h-4 w-4" /> Accept</Button>
        <Button size="sm" variant="outline" onClick={() => setEditing((v) => !v)}><Pencil className="h-4 w-4" /> {editing ? "Done" : "Edit"}</Button>
        <Button size="sm" variant="ghost" onClick={() => onDismiss(s)}><X className="h-4 w-4" /> Dismiss</Button>
      </div>
    </div>
  );
}
