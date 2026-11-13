import { useState } from "react";
import { ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { AssistantIntro, type Path } from "@/components/requirements/AssistantIntro";
import { SourceInput, type SourceState } from "@/components/requirements/SourceInput";
import { CreateChat } from "@/components/requirements/CreateChat";
import { JDEditor, regenerateUnavailable } from "@/components/requirements/JDEditor";
import { ReviewPublish } from "@/components/requirements/ReviewPublish";
import { DemoBadge, Robot } from "@/components/requirements/Robot";
import { demoAssembleDraft, splitIntoSections } from "@/lib/jd/demo-service";
import { emptyDraft, type Answers, type JDDraft, type SectionKey } from "@/lib/jd/types";

type View = "intro" | Path | "preview";

export function RequirementBuilder({ embedded = false }: { embedded?: boolean }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [view, setView] = useState<View>("intro");
  const [introFinished, setIntroFinished] = useState(false);
  const [source, setSource] = useState<SourceState>({ file: null, text: "" });
  const [answers, setAnswers] = useState<Answers>({});
  const [qIndex, setQIndex] = useState(0);
  const [draft, setDraft] = useState<JDDraft>(emptyDraft);
  const [hasDraft, setHasDraft] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<{ msg: string; retry: () => void } | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const setSection = (k: SectionKey, content: string) => setDraft((d) => ({ ...d, [k]: { content, source: "user" } }));

  async function run(label: string, fn: () => Promise<void>) {
    setBusy(label);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError({ msg: (e as Error).message || "Something went wrong.", retry: () => run(label, fn) });
    } finally {
      setBusy(null);
    }
  }

  const fromSource = () => {
    setDraft(splitIntoSections(source.text));
    setHasDraft(true);
    setView("preview");
  };
  const finishChat = () =>
    run("Assembling your job description…", async () => {
      setDraft(await demoAssembleDraft({ ...answers }));
      setHasDraft(true);
      setView("preview");
    });

  const saveDraft = () => {
    try {
      localStorage.setItem("staffsync-jd-draft", JSON.stringify({ draft, answers, savedAt: Date.now() }));
      setSavedAt(new Date());
      toast.success("Draft saved", { description: "Stored in this browser only (demo)." });
    } catch {
      toast.error("Couldn't save draft", { description: "Browser storage is unavailable. Please try again." });
    }
  };

  const back = (to: View) => (
    <Button variant="ghost" size="sm" onClick={() => setView(to)} className="mb-3"><ArrowLeft className="h-4 w-4" /> Back</Button>
  );

  return (
    <div className={embedded ? "bg-background" : "min-h-screen bg-background"}>
      <Toaster position="top-center" />
      {!embedded && <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 md:px-8">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand font-display text-sm font-bold text-primary-foreground">S</span>
          <span className="font-display font-semibold">StaffSync</span>
          <span className="ml-2 text-sm text-muted-foreground">/ Requirements</span>
        </div>
      </header>}

      <main className={embedded ? "px-4 pb-6 pt-6 md:px-8" : "mx-auto max-w-6xl px-4 pb-8 pt-8 md:px-8"}>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold md:text-4xl">Create Hiring Requirement</h1>
        </div>

        {error && (
          <div role="alert" className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
            {error.msg}
            <Button size="sm" variant="outline" onClick={error.retry}><RotateCcw className="h-4 w-4" /> Retry</Button>
          </div>
        )}

        {step === 2 ? (
          <ReviewPublish draft={draft} setSection={setSection} onBack={() => setStep(1)} onSaveDraft={saveDraft} savedAt={savedAt} />
        ) : busy ? (
          <div className="flex flex-col items-center rounded-3xl border bg-card py-20 text-center shadow-soft" role="status">
            <Robot size={96} animate />
            <p className="mt-4 flex items-center gap-2 font-medium"><Loader2 className="h-4 w-4 animate-spin text-primary" /> {busy}</p>
            <div className="mt-3"><DemoBadge label="Demo processing — AI not connected" /></div>
          </div>
        ) : view === "intro" ? (
          <>
            <AssistantIntro onPick={(p) => setView(p)} completed={introFinished} onComplete={() => setIntroFinished(true)} />
            {hasDraft && (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                You have a draft in progress. <button className="font-medium text-primary underline-offset-2 hover:underline" onClick={() => setView("preview")}>Return to preview</button>
              </p>
            )}
          </>
        ) : view === "upload" ? (
          <section className="mx-auto max-w-3xl">
            {back("intro")}
            <div className="rounded-3xl border bg-card p-6 shadow-soft md:p-8">
              <h2 className="text-xl font-semibold">Upload an existing JD</h2>
              <p className="mb-6 mt-1 text-sm text-muted-foreground">Upload a file or paste the text. You'll review everything before publishing.</p>
              <SourceInput value={source} onChange={setSource} onSubmit={fromSource} submitLabel="Continue to preview" />
            </div>
          </section>
        ) : view === "create" ? (
          <div className="mx-auto max-w-3xl">
            <CreateChat answers={answers} setAnswers={setAnswers} index={qIndex} setIndex={setQIndex} onDone={finishChat} onExit={() => setView("intro")} />
          </div>
        ) : (
          <div className="space-y-6">
            {back("intro")}
            <JDEditor
              draft={draft}
              setSection={setSection}
              onContinue={() => setStep(2)}
              onRegenerate={regenerateUnavailable}
            />
          </div>
        )}
      </main>
    </div>
  );
}
