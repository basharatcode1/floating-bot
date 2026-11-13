import { useRef, useState } from "react";
import { AlertCircle, FileText, RefreshCw, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { formatSize, readFile, validateFile } from "@/lib/jd/file";
import { cn } from "@/lib/utils";

export interface SourceState {
  file: File | null;
  text: string;
}

/** Upload + paste input. Controlled so text survives back/forward navigation. */
export function SourceInput({
  value,
  onChange,
  onSubmit,
  submitLabel,
}: {
  value: SourceState;
  onChange: (v: SourceState) => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function take(f: File) {
    const err = validateFile(f);
    setNotice(null);
    if (err) return setError(err);
    setError(null);
    setProgress(0);
    try {
      const text = await readFile(f, setProgress);
      if (text !== null) onChange({ file: f, text: value.text.trim() ? value.text : text });
      else {
        onChange({ ...value, file: f });
        setNotice("PDF attached. Text extraction needs the document-parsing service, which isn't connected in this demo — please paste the JD text below so it can be reviewed.");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setTimeout(() => setProgress(null), 400);
    }
  }

  return (
    <div className="space-y-5">
      {!value.file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files[0];
            if (f) take(f);
          }}
          className={cn(
            "flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
            drag ? "border-primary bg-accent" : "border-input bg-brand-mist",
            error && "border-destructive/60",
          )}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-card text-primary shadow-soft">
            <UploadCloud className="h-6 w-6" />
          </span>
          <p className="mt-3 font-medium">Drag & drop your JD here</p>
          <p className="text-sm text-muted-foreground">PDF or TXT, up to 10 MB</p>
          <Button type="button" variant="outline" className="mt-4" onClick={() => inputRef.current?.click()}>
            Browse files
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{value.file.name}</p>
            <p className="text-xs text-muted-foreground">{formatSize(value.file.size)}</p>
            {progress !== null && <Progress value={progress} className="mt-2 h-1.5" aria-label="Upload progress" />}
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => inputRef.current?.click()}>
            <RefreshCw className="h-4 w-4" /> Replace
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Remove file" onClick={() => { onChange({ ...value, file: null }); setNotice(null); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,application/pdf,text/plain"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) take(f);
          e.target.value = "";
        }}
      />
      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </p>
      )}
      {notice && <p role="status" className="rounded-xl bg-warning-soft p-3 text-sm text-warning">{notice}</p>}

      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <div>
        <label htmlFor="jd-paste" className="text-sm font-medium">Paste job description</label>
        <Textarea
          id="jd-paste"
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          placeholder={"Paste the full job description here…\n\nTip: headings like “Responsibilities” or “Required skills” help me split it into sections."}
          className="mt-2 min-h-56 resize-y bg-card"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">{value.text.length.toLocaleString()} characters</p>
      </div>
      <div className="flex justify-end">
        <Button type="button" onClick={onSubmit} disabled={!value.text.trim()}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
