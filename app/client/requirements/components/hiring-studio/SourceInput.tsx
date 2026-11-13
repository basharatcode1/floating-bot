"use client";

import React, { useRef, useState } from "react";
import { AlertCircle, FileText, RefreshCw, UploadCloud, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Progress } from "@/app/components/ui/progress";
import { formatSize, readFile, validateFile } from "./file";
import { cn } from "@/app/lib/utils";

export interface SourceState {
  file: File | null;
  text: string;
}

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

  async function handleFile(f: File) {
    const err = validateFile(f);
    setNotice(null);
    if (err) return setError(err);
    setError(null);
    setProgress(0);
    try {
      const text = await readFile(f, setProgress);
      if (text !== null) {
        onChange({ file: f, text: value.text.trim() ? value.text : text });
      } else {
        onChange({ ...value, file: f });
        setNotice(
          "PDF attached. If the text isn't extracted automatically, please paste the JD text below so sections can be parsed.",
        );
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setTimeout(() => setProgress(null), 400);
    }
  }

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div>
        <label
          htmlFor="jd-file-input"
          className="block form-label mb-1.5 cursor-pointer"
        >
          Upload Job Description
        </label>
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
              if (f) handleFile(f);
            }}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-4 sm:py-5 text-center transition-colors",
              drag
                ? "border-[var(--color-primary,#005A9C)] bg-blue-50/50 dark:bg-blue-950/20"
                : "border-[var(--dash-card-border,#e2e8f0)] bg-[var(--dash-card-bg,#f8fafc)]/60",
              error && "border-red-500/60",
            )}
          >
            <UploadCloud className="h-7 w-7 text-[var(--color-primary,#005A9C)] stroke-[1.5]" />
            <p className="mt-2 font-semibold text-xs sm:text-sm text-[var(--dash-text-primary,#0f172a)]">
              Drag & drop your JD here
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--dash-text-muted,#64748b)]">
              PDF or TXT up to 10 MB
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 h-8 gap-1.5 text-xs !rounded-lg cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              Browse files
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--dash-card-border,#e2e8f0)] bg-[var(--dash-card-bg-solid,#ffffff)] p-4 shadow-sm">
            <FileText className="h-6 w-6 text-[var(--color-primary,#005A9C)] stroke-[1.75] shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--dash-text-primary,#0f172a)]">
                {value.file.name}
              </p>
              <p className="text-xs text-[var(--dash-text-muted,#64748b)]">
                {formatSize(value.file.size)}
              </p>
              {progress !== null && (
                <Progress value={progress} className="mt-2 h-1.5" />
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="gap-1 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Replace
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                onChange({ ...value, file: null });
                setNotice(null);
              }}
              aria-label="Remove file"
              className="h-8 w-8 text-[var(--dash-text-muted,#64748b)] hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id="jd-file-input"
        type="file"
        accept=".pdf,.txt,application/pdf,text/plain"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-600 dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-700 dark:text-amber-300"
        >
          {notice}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs  tracking-wider text-[var(--dash-text-muted,#64748b)]">
        <span className="h-px flex-1 bg-[var(--dash-divider,#e2e8f0)]" />
        <span>Or Paste Text</span>
        <span className="h-px flex-1 bg-[var(--dash-divider,#e2e8f0)]" />
      </div>

      <div>
        <label
          htmlFor="jd-paste"
          className="block form-label mb-1.5"
        >
          Paste Job Description
        </label>
        <Textarea
          id="jd-paste"
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          placeholder={
            "Paste the full job description here…\n\nTip: Common headings like “Role Overview”, “Responsibilities”, or “Required Skills” help automatically split content into sections."
          }
          className="min-h-24 sm:min-h-28 resize-y bg-[var(--dash-card-bg-solid,#ffffff)] border border-[var(--dash-card-border,#e2e8f0)] form-input-text focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20"
        />
        <p className="form-section-desc mt-1 text-right text-[11px] text-[var(--dash-text-muted,#64748b)]">
          {value.text.length.toLocaleString()} characters
        </p>
      </div>

      <div className="flex justify-end pt-1">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!value.text.trim()}
          className="h-9 px-4 !rounded-xl bg-[#005A9C] hover:bg-[#004A82] text-white text-xs font-bold cursor-pointer shadow-sm"
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
