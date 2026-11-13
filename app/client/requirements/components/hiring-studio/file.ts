export const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateFile(f: File): string | null {
  const ok =
    /\.(pdf|txt)$/i.test(f.name) &&
    ["application/pdf", "text/plain", ""].includes(f.type);
  if (!ok) return `“${f.name}” isn't supported. Please upload a PDF or TXT file.`;
  if (f.size > MAX_BYTES)
    return `“${f.name}” is ${formatSize(f.size)}. The maximum size is 10 MB.`;
  if (f.size === 0) return `“${f.name}” is empty.`;
  return null;
}

export const formatSize = (b: number): string =>
  b < 1024
    ? `${b} B`
    : b < 1024 * 1024
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1024 / 1024).toFixed(1)} MB`;

/** Reads a file locally with real progress. TXT returns text; PDF returns null (needs a parsing service). */
export function readFile(
  f: File,
  onProgress: (p: number) => void
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onprogress = (e) =>
      e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    r.onerror = () => reject(new Error("The file couldn't be read."));
    r.onload = () => {
      onProgress(100);
      resolve(/\.txt$/i.test(f.name) ? String(r.result) : null);
    };
    if (/\.txt$/i.test(f.name)) r.readAsText(f);
    else r.readAsArrayBuffer(f);
  });
}

