"use client";

import {
  useRef,
  useCallback,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  className?: string;
  isDark?: boolean;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
  autoFocus = true,
  className = "",
  isDark = false,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value
    .split("")
    .concat(Array(length).fill(""))
    .slice(0, length);

  const focusInput = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, length - 1));
      inputsRef.current[clamped]?.focus();
    },
    [length],
  );

  const handleChange = useCallback(
    (index: number, char: string) => {
      if (!/^\d?$/.test(char)) return;
      const next = digits.slice();
      next[index] = char;
      const joined = next.join("");
      onChange(joined);

      if (char && index < length - 1) {
        focusInput(index + 1);
      }
    },
    [digits, length, onChange, focusInput],
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        if (digits[index]) {
          handleChange(index, "");
        } else if (index > 0) {
          handleChange(index - 1, "");
          focusInput(index - 1);
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        focusInput(index - 1);
      } else if (e.key === "ArrowRight" && index < length - 1) {
        focusInput(index + 1);
      }
    },
    [digits, length, handleChange, focusInput],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);
      if (pasted) {
        onChange(pasted.padEnd(length, "").slice(0, length));
        focusInput(Math.min(pasted.length, length - 1));
      }
    },
    [length, onChange, focusInput],
  );

  return (
    <div className={`flex items-center gap-2 ${className || "justify-center"}`}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          onChange={(e) => handleChange(i, e.target.value.slice(-1))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.currentTarget.select()}
          className={`
            otp-digit-box
            w-9 h-9 sm:w-10 sm:h-10 aspect-square
            text-center text-sm sm:text-base font-semibold
            rounded-xl border
            outline-none transition-all duration-200
            ${
              isDark
                ? "bg-white/[0.06] text-white border-white/15 focus:border-white/40 focus:bg-white/[0.08] focus:ring-0 focus:outline-none"
                : "bg-white text-slate-900 border-slate-200 focus:border-slate-400 focus:ring-0 focus:outline-none"
            }
            ${
              error
                ? "!border-red-500 !ring-2 !ring-red-500/20"
                : ""
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
