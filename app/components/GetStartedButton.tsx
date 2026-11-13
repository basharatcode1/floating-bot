"use client";

import * as React from "react";

export interface GetStartedButtonProps {
  text?: string;
  buttonWidth?: number;
  buttonHeight?: number;
  radius?: number;
  borderSize?: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  textColor?: string;
  hoverTextColor?: string;
  normalColor1?: string;
  normalColor2?: string;
  hoverColor1?: string;
  hoverColor2?: string;
  blueColor?: string;
  lightColor?: string;
  hoverLightColor?: string;
  glowSize?: number;
  glowOpacity?: number;
  speed?: number;
  alignX?: string;
  alignY?: string;
  hoverScale?: number;
  onClick?: () => void;
}

export default function GetStartedButton({
  text = "Get Started",
  buttonWidth = 135,
  buttonHeight = 44,
  radius = 12,
  borderSize = 1.5,
  fontFamily = "Inter, sans-serif",
  fontSize = 14,
  fontWeight = 600,
  letterSpacing = -0.2,
  textColor = "#FFFFFF",
  hoverTextColor = "#FFFFFF",
  normalColor1 = "#777777",
  normalColor2 = "#0F1111",
  hoverColor1 = "#006BFF",
  hoverColor2 = "#06152E",
  blueColor = "#005BFF",
  lightColor = "rgba(0,225,255,0.35)",
  hoverLightColor = "#00E5FF",
  glowSize = 18,
  glowOpacity = 0.28,
  speed = 1.8,
  alignX = "center",
  alignY = "center",
  hoverScale = 1.03,
  onClick,
}: GetStartedButtonProps) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const innerRadius = Math.max(radius - borderSize, 0);
  const ringSize = Math.max(buttonWidth, buttonHeight) * 2.4;
  const activeLight = hover ? hoverLightColor : lightColor;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: alignY,
        justifyContent: alignX,
        overflow: "visible",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes realismButtonLight {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `,
        }}
      />
      <button
        type="button"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          setActive(false);
        }}
        onMouseDown={() => setActive(true)}
        onMouseUp={() => setActive(false)}
        onClick={onClick}
        style={{
          position: "relative",
          width: buttonWidth,
          height: buttonHeight,
          flexShrink: 0,
          padding: borderSize,
          border: "none",
          borderRadius: radius,
          cursor: "pointer",
          overflow: "hidden",
          isolation: "isolate",
          boxSizing: "border-box",
          background: hover
            ? `radial-gradient(circle 90px at 80% -20%, ${hoverLightColor}, ${hoverColor2} 64%)`
            : `radial-gradient(circle 90px at 80% -20%, #ffffff, ${normalColor2} 64%)`,
          transform: active
            ? "scale(0.97)"
            : hover
              ? `scale(${hoverScale})`
              : "scale(1)",
          transition:
            "transform 0.25s cubic-bezier(.2,.8,.2,1), background 0.3s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: ringSize,
            height: ringSize,
            borderRadius: "50%",
            background: `conic-gradient(
              transparent 0deg,
              transparent 58deg,
              ${activeLight} 96deg,
              #ffffff 114deg,
              ${activeLight} 132deg,
              transparent 170deg,
              transparent 360deg
            )`,
            opacity: hover ? 1 : 0,
            animation: `realismButtonLight ${speed}s linear infinite`,
            transition: "opacity 0.25s ease",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -38,
            bottom: -44,
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${activeLight}, ${blueColor}, transparent 70%)`,
            filter: `blur(${glowSize}px)`,
            opacity: hover ? glowOpacity + 0.16 : glowOpacity,
            transition: "opacity 0.25s ease",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
            borderRadius: innerRadius,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxSizing: "border-box",
            fontFamily,
            fontSize,
            fontWeight,
            letterSpacing,
            color: hover ? hoverTextColor : textColor,
            lineHeight: 1,
            whiteSpace: "nowrap",
            background: hover
              ? `
                radial-gradient(circle 90px at 0% 100%, ${hoverLightColor}, transparent 58%),
                radial-gradient(circle 140px at 50% 50%, ${hoverColor1}, ${hoverColor2} 72%)
              `
              : `
                radial-gradient(circle 90px at 0% 100%, ${lightColor}, transparent 58%),
                radial-gradient(circle 90px at 80% -45%, ${normalColor1}, ${normalColor2} 68%)
              `,
            boxShadow: hover
              ? `
                inset 0 1px 0 rgba(255,255,255,0.28),
                inset 0 -1px 0 rgba(0,0,0,0.55),
                inset 0 0 22px ${hoverLightColor}
              `
              : `
                inset 0 1px 0 rgba(255,255,255,0.22),
                inset 0 -1px 0 rgba(0,0,0,0.55)
              `,
            transition:
              "background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -32,
              bottom: -38,
              width: 95,
              height: 95,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${activeLight}, ${blueColor}, transparent 72%)`,
              filter: `blur(${glowSize * 0.45}px)`,
              opacity: hover ? 0.38 : 0.14,
              transition: "opacity 0.25s ease",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 12,
              width: "54%",
              height: 1,
              borderRadius: 999,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), rgba(255,255,255,0.95))",
              opacity: hover ? 1 : 0.7,
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              position: "relative",
              zIndex: 2,
              textShadow: hover
                ? `0 0 ${Math.max(glowSize * 0.6, 6)}px ${hoverLightColor}`
                : "none",
              transition: "text-shadow 0.25s ease",
            }}
          >
            {text}
          </span>
        </div>
      </button>
    </div>
  );
}
