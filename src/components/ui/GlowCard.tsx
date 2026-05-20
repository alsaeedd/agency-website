import React, { useEffect, useRef, ReactNode } from "react";
import "./GlowCard.css";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "purple" | "lavender" | "mint" | "magenta";
  width?: string | number;
  height?: string | number;
  padding?: string;
  radius?: number;
}

const glowColorMap = {
  purple:   { base: 280, spread: 280 },   // violet (brand primary)
  lavender: { base: 260, spread: 240 },
  mint:     { base: 160, spread: 180 },
  magenta:  { base: 310, spread: 240 },
};

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  glowColor = "purple",
  width,
  height,
  padding = "1.5rem",
  radius = 18,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      if (cardRef.current) {
        cardRef.current.style.setProperty("--x", x.toFixed(2));
        cardRef.current.style.setProperty(
          "--xp",
          (x / window.innerWidth).toFixed(2),
        );
        cardRef.current.style.setProperty("--y", y.toFixed(2));
        cardRef.current.style.setProperty(
          "--yp",
          (y / window.innerHeight).toFixed(2),
        );
      }
    };
    document.addEventListener("pointermove", syncPointer);
    return () => document.removeEventListener("pointermove", syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  const styleVars = {
    "--base": base,
    "--spread": spread,
    "--radius": radius,
    "--border": 1.5,
    "--backdrop": "rgba(22, 14, 39, 0.55)",
    "--backup-border": "var(--backdrop)",
    "--size": 220,
    "--outer": 1,
    "--border-size": "calc(var(--border, 2) * 1px)",
    "--spotlight-size": "calc(var(--size, 200) * 1px)",
    "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    padding,
    borderRadius: `${radius}px`,
  } as React.CSSProperties;

  return (
    <div
      ref={cardRef}
      data-glow
      style={styleVars}
      className={`glow-card ${className}`}
    >
      <div data-glow />
      <div className="glow-card-inner">{children}</div>
    </div>
  );
};

export default GlowCard;
