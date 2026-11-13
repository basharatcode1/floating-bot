import robotAsset from "@/assets/cheerful-cyber-robot-mascot.png.asset.json";
import { cn } from "@/lib/utils";

export function Robot({ size = 56, animate = false, className }: { size?: number; animate?: boolean; className?: string }) {
  return (
    <img
      src={robotAsset.url}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={cn("select-none object-contain drop-shadow-[0_8px_16px_oklch(0.45_0.13_250/0.25)]", animate && "animate-robot", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function DemoBadge({ label = "Demo" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning-soft px-2 py-0.5 text-[11px] font-medium text-warning">
      <span className="h-1.5 w-1.5 rounded-full bg-warning" /> {label}
    </span>
  );
}

export function SourceTag({ source }: { source: "user" | "ai" }) {
  return source === "ai" ? (
    <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">AI suggestion</span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Your input</span>
  );
}

export function Typing() {
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-sm border bg-card px-4 py-3" aria-label="StaffSync AI is typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-primary animate-typing" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}
