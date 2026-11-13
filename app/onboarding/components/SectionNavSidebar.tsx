"use client";

import { useEffect, useRef, useState } from "react";

export interface NavSection {
  id: string;
  label: string;
  icon?: React.ReactNode;
  hasError?: boolean;
  fields?: string[];
}

interface SectionNavSidebarProps {
  sections: NavSection[];
  errors?: Record<string, any>;
  scrollContainerRef?: React.RefObject<any>;
}

export function hasSectionError(
  errors: Record<string, any> | undefined,
  fields?: string[],
): boolean {
  if (!errors || !fields || fields.length === 0) return false;
  return fields.some((field) => {
    const direct = errors[field];
    if (direct && (direct.message || typeof direct === "string")) {
      return true;
    }
    return Object.keys(errors).some(
      (k) =>
        (k === field ||
          k.startsWith(`${field}.`) ||
          k.startsWith(`${field}[`)) &&
        Boolean(
          errors[k]?.message ||
          (typeof errors[k] === "string" && errors[k].length > 0),
        ),
    );
  });
}

export function SectionNavSidebar({
  sections,
  errors,
  scrollContainerRef,
}: SectionNavSidebarProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Scroll-spy via scroll listener (supports window & container scroll) ── */
  useEffect(() => {
    const getCandidates = () =>
      sections
        .map((s) => document.getElementById(`section-${s.id}`))
        .filter(Boolean) as HTMLElement[];

    const onScroll = () => {
      // Skip scroll-spy updates during programmatic smooth-scroll
      if (isUserScrollingRef.current) return;

      const candidates = getCandidates();
      if (candidates.length === 0) return;

      const scrollEl = scrollContainerRef?.current;
      const isContainerScrolling =
        scrollEl && scrollEl.scrollHeight > scrollEl.clientHeight + 20;

      if (isContainerScrolling && scrollEl) {
        const scrollTop = scrollEl.scrollTop;
        let current = candidates[0].id.replace("section-", "");
        for (const el of candidates) {
          const top = el.offsetTop - scrollEl.offsetTop;
          if (scrollTop + 100 >= top) {
            current = el.id.replace("section-", "");
          }
        }
        setActiveId(current);
      } else {
        // Window scroll
        let current = candidates[0].id.replace("section-", "");
        for (const el of candidates) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            current = el.id.replace("section-", "");
          }
        }
        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 60
        ) {
          current = candidates[candidates.length - 1].id.replace(
            "section-",
            "",
          );
        }
        setActiveId(current);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const scrollEl = scrollContainerRef?.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", onScroll, { passive: true });
    }

    onScroll(); // set initial

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", onScroll);
      }
    };
  }, [sections, scrollContainerRef]);

  /* ── Click → smooth scroll (suppresses scroll-spy during animation) ── */
  const handleClick = (id: string) => {
    const target = document.getElementById(`section-${id}`);
    if (!target) return;

    // Lock the active section immediately and suppress scroll-spy
    setActiveId(id);
    isUserScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    const scrollEl = scrollContainerRef?.current;
    const isContainerScrolling =
      scrollEl && scrollEl.scrollHeight > scrollEl.clientHeight + 20;

    if (isContainerScrolling && scrollEl) {
      const scrollElRect = scrollEl.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const top = scrollEl.scrollTop + (targetRect.top - scrollElRect.top) - 20;
      scrollEl.scrollTo({ top, behavior: "smooth" });
    } else {
      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    }

    // Re-enable scroll-spy after the smooth scroll animation finishes
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 800);
  };

  return (
    <nav aria-label="Form sections" className="w-full">
      <div className="rounded-2xl border border-[#cee1f1] bg-white p-3 shadow-card">
        {/* Header */}
        <p className="px-3 pb-2 pt-1 text-xs font-semibold  tracking-wider text-slate-400 select-none">
          Sections
        </p>

        {/* Nav items */}
        <ol className="flex flex-col gap-0.5">
          {sections.map((section, idx) => {
            const isActive = activeId === section.id;
            const hasError = Boolean(
              section.hasError ||
              (errors &&
                section.fields &&
                hasSectionError(errors, section.fields)),
            );

            return (
              <li key={section.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => handleClick(section.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={`
                    group w-full flex items-center gap-2.5 rounded-lg text-xs font-medium px-3 py-2 text-left
                    transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C]
                    ${
                      isActive
                        ? "bg-[#EFF6FF] text-[#005A9C]"
                        : "text-slate-500 hover:bg-slate-100/70 hover:text-slate-900"
                    }
                  `}
                >
                  {/* Number / Error badge */}
                  <span
                    className={`
                      flex size-5 shrink-0 items-center justify-center rounded-full
                      text-[0.65rem] font-semibold leading-none select-none transition-colors
                      ${
                        hasError
                          ? "bg-[#ef4444] text-white"
                          : isActive
                            ? "bg-[#005A9C] text-white"
                            : "bg-slate-100 text-slate-500 group-hover:text-slate-900"
                      }
                    `}
                  >
                    {hasError ? "!" : idx + 1}
                  </span>

                  <span className="text-xs font-medium leading-snug">
                    {section.label}
                  </span>

                  {hasError && <span className="sr-only">(has errors)</span>}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
