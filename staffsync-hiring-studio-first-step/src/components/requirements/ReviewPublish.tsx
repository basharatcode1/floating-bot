import { useState } from "react";
import { ArrowLeft, CheckCircle2, CircleDashed, Loader2, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SECTION_META, completeness, type JDDraft, type SectionKey } from "@/lib/jd/types";
import { SectionCard } from "./JDEditor";
import { DemoBadge, Robot } from "./Robot";

export function ReviewPublish({
  draft,
  setSection,
  onBack,
  onSaveDraft,
  savedAt,
}: {
  draft: JDDraft;
  setSection: (k: SectionKey, c: string) => void;
  onBack: () => void;
  onSaveDraft: () => void;
  savedAt: Date | null;
}) {
  const c = completeness(draft);
  const [confirm, setConfirm] = useState(false);
  const [state, setState] = useState<"idle" | "publishing" | "done">("idle");

  if (state === "done")
    return (
      <section className="mx-auto max-w-xl rounded-3xl border bg-card p-10 text-center shadow-soft">
        <Robot size={96} className="mx-auto" />
        <h2 className="mt-4 text-2xl font-semibold">Requirement ready to publish</h2>
        <p className="mt-2 text-muted-foreground">
          You confirmed publishing. In this demo the requirement was <strong>not sent</strong> to any server — the publishing API isn't connected yet.
        </p>
        <div className="mt-4 flex justify-center"><DemoBadge label="Demo — not actually published" /></div>
        <Button className="mt-6" variant="outline" onClick={() => setState("idle")}>Back to review</Button>
      </section>
    );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        {SECTION_META.map((m) => <SectionCard key={m.key} k={m.key} draft={draft} setSection={setSection} compact />)}
      </div>
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display font-semibold">Completeness</h3>
            <span className="text-2xl font-semibold text-primary">{c.pct}%</span>
          </div>
          <Progress value={c.pct} className="mt-3 h-2" />
          <ul className="mt-4 space-y-2 text-sm">
            {SECTION_META.map((m) => {
              const ok = draft[m.key].content.trim();
              return (
                <li key={m.key} className="flex items-center gap-2">
                  {ok ? <CheckCircle2 className="h-4 w-4 text-success" /> : <CircleDashed className={m.required ? "h-4 w-4 text-warning" : "h-4 w-4 text-muted-foreground"} />}
                  <span className={ok ? "" : "text-muted-foreground"}>{m.label}</span>
                  {!m.required && <span className="ml-auto text-xs text-muted-foreground">optional</span>}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="space-y-2 rounded-2xl border bg-card p-5 shadow-soft">
          <Button className="w-full" disabled={c.done < c.total} onClick={() => setConfirm(true)}><Send className="h-4 w-4" /> Publish Requirement</Button>
          {c.done < c.total && <p className="text-xs text-warning">Complete all required sections to publish.</p>}
          <Button variant="outline" className="w-full" onClick={onSaveDraft}><Save className="h-4 w-4" /> Save as Draft</Button>
          {savedAt && <p className="text-center text-xs text-muted-foreground">Saved in this browser at {savedAt.toLocaleTimeString()}</p>}
          <Button variant="ghost" className="w-full" onClick={onBack}><ArrowLeft className="h-4 w-4" /> Back to editing</Button>
        </div>
      </aside>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish this requirement?</AlertDialogTitle>
            <AlertDialogDescription>
              It will become visible to your StaffSync vendors. Please make sure every detail is correct. (Demo: no data will actually be sent.)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                setState("publishing");
                setTimeout(() => { setState("done"); setConfirm(false); }, 900);
              }}
            >
              {state === "publishing" ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Yes, publish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
