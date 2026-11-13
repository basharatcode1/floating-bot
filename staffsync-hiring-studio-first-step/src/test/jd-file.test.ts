import { describe, expect, it } from "vitest";
import { validateFile } from "@/lib/jd/file";

const mk = (name: string, type: string, size: number) => {
  const f = new File(["x"], name, { type });
  Object.defineProperty(f, "size", { value: size });
  return f;
};

describe("JD file validation", () => {
  it("accepts a PDF up to 10 MB", () => expect(validateFile(mk("a.pdf", "application/pdf", 10 * 1024 * 1024))).toBeNull());
  it("rejects files over 10 MB", () => expect(validateFile(mk("a.txt", "text/plain", 10 * 1024 * 1024 + 1))).toMatch(/10 MB/));
  it("rejects non PDF/TXT files", () => expect(validateFile(mk("a.docx", "application/msword", 100))).toMatch(/PDF or TXT/));
});
