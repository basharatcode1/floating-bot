/**
 * "Quiet Grid" background texture.
 *
 * Minimalist take: a faint fixed line grid with a soft spotlight fade
 * and a whisper of film grain — restrained, premium, and quiet enough
 * to sit behind the hero copy without competing for attention.
 */

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface HeroMatchMeshProps {
  showHorizonLine?: boolean;
  fullPageGrid?: boolean;
}

export default function HeroMatchMesh({
  showHorizonLine = true,
  fullPageGrid = false,
}: HeroMatchMeshProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* fine line grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsla(221, 83%, 53%, 0.14) 1px, transparent 1px), linear-gradient(to bottom, hsla(221, 83%, 53%, 0.14) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: fullPageGrid
            ? "radial-gradient(ellipse 100% 100% at 50% 50%, black 0%, transparent 100%)"
            : "radial-gradient(ellipse 65% 55% at 50% 30%, black 0%, transparent 75%)",
          WebkitMaskImage: fullPageGrid
            ? "radial-gradient(ellipse 100% 100% at 50% 50%, black 0%, transparent 100%)"
            : "radial-gradient(ellipse 65% 55% at 50% 30%, black 0%, transparent 75%)",
        }}
      />

      {/* single soft light source, upper-left of the headline */}
      <div
        className="absolute -top-10 left-[6%] w-[520px] h-[420px]"
        style={{
          background:
            "radial-gradient(closest-side, hsla(221, 83%, 53%, 0.10), transparent 70%)",
        }}
      />

      {/* one quiet horizon line beneath the copy */}
      {showHorizonLine && (
        <div
          className="absolute left-0 right-0"
          style={{
            top: "62%",
            height: "1px",
            background:
              "linear-gradient(to right, transparent 0%, hsla(221, 83%, 53%, 0.25) 20%, hsla(262, 83%, 53%, 0.2) 55%, transparent 85%)",
          }}
        />
      )}

      {/* whisper of grain for tactile depth */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG, opacity: 0.04 }}
      />
    </div>
  );
}
