import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, FileUp, SkipForward, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WelcomeRobot } from "./WelcomeRobot";
import { cn } from "@/lib/utils";
import { typedLetters, WELCOME_TIMING, type WelcomePhase } from "./welcome-sequence";

export type Path = "upload" | "create";

const CARDS: { id: Path; icon: typeof FileUp; title: string; desc: string; meta: string; primary?: boolean }[] = [
  { id: "create", icon: Sparkles, title: "Create a JD with AI", desc: "Answer a few quick questions and I'll assemble a structured job description.", meta: "~3 minutes", primary: true },
  { id: "upload", icon: FileUp, title: "Upload an existing JD", desc: "Drop a file or paste text you already have, then review it.", meta: "PDF or TXT · max 10 MB" },
];

const GREETING = "Hey! I’m StaffSync AI 👋";
const SUPPORT = "I’m here to help you create a great job description. How would you like to get started?";

export function AssistantIntro({ onPick, completed, onComplete }: {
  onPick: (p: Path) => void;
  completed: boolean;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<WelcomePhase>(completed ? "ready" : "arrival");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [letters, setLetters] = useState(0);
  const pocket = useRef<HTMLSpanElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const skipped = useRef(false);
  const reportReady = useCallback(() => {}, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) setPhase("ready");
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (completed || reducedMotion) { setPhase("ready"); return; }
    // Start immediately: the robot picture is already on screen while the 3D version loads.
    setPhase((current) => current === "loading" ? "arrival" : current);
  }, [completed, reducedMotion]);

  useEffect(() => {
    const next = phase === "arrival" ? "greeting" : phase === "greeting" ? "cards" : phase === "cards" ? "ready" : null;
    if (!next) return;
    const delay = phase === "arrival" ? WELCOME_TIMING.greeting
      : phase === "greeting" ? WELCOME_TIMING.cards - WELCOME_TIMING.greeting
      : WELCOME_TIMING.ready - WELCOME_TIMING.cards;
    const timer = setTimeout(() => setPhase(next), delay);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "greeting") return;
    const start = performance.now();
    const total = GREETING.length + SUPPORT.length;
    let frame = 0;
    const tick = () => {
      const shown = typedLetters(performance.now() - start, total);
      setLetters(shown);
      if (shown < total) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase !== "ready") return;
    onComplete();
    if (skipped.current) { cards.current[0]?.focus({ preventScroll: true }); skipped.current = false; }
  }, [phase, onComplete]);

  useLayoutEffect(() => {
    if (phase !== "cards" || reducedMotion) return;
    const origin = pocket.current?.getBoundingClientRect();
    if (!origin) return;
    const animations = cards.current.map((card, index) => {
      if (!card) return null;
      const rect = card.getBoundingClientRect();
      const x = origin.x + origin.width / 2 - rect.x - rect.width / 2;
      const y = origin.y + origin.height / 2 - rect.y - rect.height / 2;
      const turn = index === 0 ? -12 : 12;
      return card.animate([
        { transform: `translate(${x}px, ${y}px) scale(0.08) rotate(${turn}deg)`, opacity: 0 },
        { transform: `translate(${x}px, ${y - 25}px) scale(0.14) rotate(${turn}deg)`, opacity: 1, offset: 0.2 },
        { transform: `translate(${x * 0.55}px, ${y * 0.55 - 65}px) scale(0.48) rotate(${turn / 2}deg)`, opacity: 1, offset: 0.52 },
        { transform: "translate(0, -8px) scale(1.015) rotate(0deg)", opacity: 1, offset: 0.85 },
        { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
      ], { duration: 1400, delay: index * 130, easing: "cubic-bezier(.22,.8,.3,1)", fill: "both" });
    });
    return () => animations.forEach((animation) => animation?.cancel());
  }, [phase, reducedMotion]);

  const greetingVisible = phase === "greeting" || phase === "cards" || phase === "ready";
  const choicesVisible = phase === "cards" || phase === "ready";
  const fullText = phase === "cards" || phase === "ready";

  return (
    <section className="requirements-welcome relative" data-welcome-phase={phase} aria-label="StaffSync AI welcome">
      {phase !== "ready" && (
        <Button variant="ghost" size="sm" className="welcome-skip absolute right-0 top-0 z-20" onClick={() => {
          skipped.current = true;
          setPhase("ready");
        }}><SkipForward className="h-4 w-4" /> Skip intro</Button>
      )}
      <div className="welcome-stage relative">
        <div className="welcome-mascot absolute">
          <div className="welcome-ground" aria-hidden="true" />
          <WelcomeRobot onReady={reportReady} phase={phase} />
          <span ref={pocket} className="welcome-pocket" aria-hidden="true" />
          {phase === "cards" && <div className="pocket-peek" aria-hidden="true"><span /><span /></div>}
        </div>
        <div className={cn("welcome-greeting welcome-speech absolute rounded-2xl border bg-card px-5 py-4 shadow-soft", greetingVisible ? "speech-visible" : "speech-hidden")} aria-hidden={!greetingVisible}>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">StaffSync AI</p>
          <h2 className="mt-2 text-xl font-semibold" aria-label={GREETING}><span aria-hidden="true">{fullText ? GREETING : GREETING.slice(0, letters)}</span></h2>
          <p className="mt-2 text-sm text-muted-foreground" aria-label={SUPPORT}><span aria-hidden="true">{fullText ? SUPPORT : SUPPORT.slice(0, Math.max(0, letters - GREETING.length))}</span></p>
        </div>
      </div>
      <div className="welcome-choices grid gap-4 md:grid-cols-2" aria-hidden={!choicesVisible} inert={phase !== "ready"}>
        {CARDS.map((c, index) => (
          <Button
            ref={(node) => { cards.current[index] = node; }}
            variant="outline"
            key={c.id}
            type="button"
            onClick={() => onPick(c.id)}
            className={cn(
              "welcome-choice group relative flex h-auto min-w-0 flex-col items-stretch whitespace-normal rounded-2xl border bg-card p-5 text-left hover:bg-card hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              !choicesVisible && "invisible",
              c.primary && "border-primary/50 ring-1 ring-primary/20",
            )}
          >
            <span className={cn("grid h-11 w-11 place-items-center rounded-xl", c.primary ? "bg-gradient-brand text-primary-foreground" : "bg-accent text-accent-foreground")}>
              <c.icon className="h-5 w-5" />
            </span>
            <span className="mt-4 font-display text-base font-semibold">{c.title}</span>
            <span className="mt-1 text-sm text-muted-foreground">{c.desc}</span>
            <span className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              {c.meta}
              <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        ))}
      </div>
    </section>
  );
}
