interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export default function ShinyText({
  text,
  className = "",
  speed = 3,
}: ShinyTextProps) {
  return (
    <span
      className={`relative inline bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, #ffffff 20%, var(--gradient-from) 40%, var(--gradient-to) 60%, #ffffff 80%)",
        backgroundSize: "200% 100%",
        animation: `shimmer ${speed}s linear infinite`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {text}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
      `}</style>
    </span>
  );
}
