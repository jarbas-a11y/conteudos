import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COND, K, clamp } from "./theme";

const BACK = Easing.bezier(0.34, 1.56, 0.64, 1);
const OUT = Easing.bezier(0.16, 1, 0.3, 1);

export const pop = (frame: number, at: number, dur = 12) =>
  interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: BACK });
export const ease = (frame: number, at: number, dur = 14) =>
  interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: OUT });

// ── Icons (24×24 viewBox) ──────────────────────────────────────────
export type IconName =
  | "dots" | "x" | "scribble" | "micOff" | "quote" | "question" | "gear"
  | "bulb" | "lines" | "like" | "group" | "badge" | "check";

export const Icon: React.FC<{ name: IconName; color?: string; accent?: string; size?: number }> = ({
  name,
  color = K.ink,
  accent = K.orange,
  size = 64,
}) => {
  const s = { stroke: color, strokeWidth: 2.4, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const body: Record<IconName, React.ReactNode> = {
    dots: (
      <g fill={color}>
        <circle cx="6" cy="12" r="2.2" />
        <circle cx="12" cy="12" r="2.2" />
        <circle cx="18" cy="12" r="2.2" />
      </g>
    ),
    x: <path d="M7 7l10 10M17 7L7 17" {...s} stroke={accent} strokeWidth={3.2} />,
    scribble: <path d="M3 14c3-6 5 4 8-2s4 5 7-1 3 3 3 3M4 9c2-3 4 1 6-1" {...s} />,
    micOff: (
      <g>
        <rect x="9" y="3" width="6" height="11" rx="3" {...s} />
        <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" {...s} />
        <path d="M4 4l16 16" {...s} stroke={accent} strokeWidth={3} />
      </g>
    ),
    quote: (
      <text x="12" y="20" textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize="22" fill={color}>
        “”
      </text>
    ),
    question: (
      <text x="12" y="19.5" textAnchor="middle" fontFamily={COND} fontWeight={900} fontSize="22" fill={color}>
        ?
      </text>
    ),
    gear: (
      <g>
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="10.6" y="2" width="2.8" height="5" rx="1" fill={color} transform={`rotate(${i * 45} 12 12)`} />
        ))}
        <circle cx="12" cy="12" r="6" fill={color} />
        <circle cx="12" cy="12" r="2.4" fill={K.paper} />
      </g>
    ),
    bulb: (
      <g>
        <path d="M8.5 14.5a6 6 0 1 1 7 0c-.8.6-1.2 1.4-1.2 2.3H9.7c0-.9-.4-1.7-1.2-2.3Z" {...s} />
        <path d="M9.8 19.5h4.4M10.6 22h2.8" {...s} />
        <path d="M12 1.2v1.6M3.5 4.8l1.2 1.1M20.5 4.8l-1.2 1.1" {...s} />
      </g>
    ),
    lines: <path d="M5 8h14M5 12h14M5 16h9" {...s} />,
    like: <path d="M7 11v9H4v-9h3Zm0 0 4-7c1.5 0 2.5 1 2.2 2.6L12.6 10H19a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7" {...s} />,
    group: (
      <g fill={color}>
        <circle cx="12" cy="8" r="3.2" />
        <circle cx="5.5" cy="10" r="2.4" />
        <circle cx="18.5" cy="10" r="2.4" />
        <path d="M6 20c0-3.5 2.7-6 6-6s6 2.5 6 6Z" />
        <path d="M1.5 19c0-2.6 1.8-4.5 4-4.5 1 0 1.8.3 2.5.8-1.3 1.1-2 2.6-2.1 3.7Z" />
        <path d="M22.5 19c0-2.6-1.8-4.5-4-4.5-1 0-1.8.3-2.5.8 1.3 1.1 2 2.6 2.1 3.7Z" />
      </g>
    ),
    badge: (
      <g>
        <circle cx="12" cy="12" r="8.5" {...s} />
        <path d="m12 7.2 1.5 3.1 3.4.5-2.5 2.4.6 3.4-3-1.6-3 1.6.6-3.4-2.5-2.4 3.4-.5Z" fill={color} />
      </g>
    ),
    check: <path d="M5 12.5 10 17 19 7" {...s} stroke={accent} strokeWidth={3.2} />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {body[name]}
    </svg>
  );
};

// ── Speech bubble with an icon, pops in and bobs ───────────────────
export const Bubble: React.FC<{
  icon: IconName;
  at: number;
  x: number;
  y: number;
  size?: number;
  tone?: "paper" | "orange";
  tail?: "left" | "right";
  bob?: number;
  outAt?: number;
}> = ({ icon, at, x, y, size = 170, tone = "paper", tail = "left", bob = 10, outAt }) => {
  const frame = useCurrentFrame();
  const p = pop(frame, at, 14);
  const o = outAt === undefined ? 0 : ease(frame, outAt, 10);
  const seed = x * 7 + y;
  const dy = Math.sin((frame + seed) / 22) * bob;
  const bg = tone === "orange" ? K.orange : K.paper;
  const fg = tone === "orange" ? K.white : K.ink;
  const w = size;
  const h = size * 0.78;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        scale: String(p * (1 - o * 0.6)),
        opacity: Math.min(1, p * 2) * (1 - o),
        translate: `0 ${dy}px`,
        rotate: `${(1 - p) * (tail === "left" ? -20 : 20)}deg`,
        filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.45))",
      }}
    >
      <svg width={w} height={h * 1.22} viewBox="0 0 100 96" style={{ position: "absolute", inset: 0 }}>
        <path
          d={
            tail === "left"
              ? "M18 4h64a14 14 0 0 1 14 14v38a14 14 0 0 1-14 14H38L20 90l4-20h-6A14 14 0 0 1 4 56V18A14 14 0 0 1 18 4Z"
              : "M18 4h64a14 14 0 0 1 14 14v38a14 14 0 0 1-14 14h-6l4 20-18-20H18A14 14 0 0 1 4 56V18A14 14 0 0 1 18 4Z"
          }
          fill={bg}
        />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h * 0.74, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={size * 0.42} color={fg} accent={tone === "orange" ? K.white : K.orange} />
      </div>
    </div>
  );
};

// ── Paper-cut label ────────────────────────────────────────────────
export const Label: React.FC<{
  text: string;
  at: number;
  x: number;
  y: number;
  rot?: number;
  size?: number;
  tone?: "paper" | "glass" | "orange";
  outAt?: number;
  from?: "left" | "right" | "up" | "down" | "zoom";
  style?: React.CSSProperties;
}> = ({ text, at, x, y, rot = -4, size = 110, tone = "paper", outAt, from = "zoom", style }) => {
  const frame = useCurrentFrame();
  const p = pop(frame, at, 14);
  const o = outAt === undefined ? 0 : ease(frame, outAt, 10);
  const dist = 420 * (1 - ease(frame, at, 16));
  const off =
    from === "left" ? `${-dist}px 0` : from === "right" ? `${dist}px 0` : from === "up" ? `0 ${-dist}px` : from === "down" ? `0 ${dist}px` : "0 0";
  const tones = {
    paper: { background: `linear-gradient(170deg, ${K.paper} 0%, ${K.paperShade} 100%)`, color: K.ink, border: "none", glow: "0 22px 40px rgba(0,0,0,0.5)" },
    glass: {
      background: "linear-gradient(160deg, rgba(255,160,120,0.30) 0%, rgba(242,107,58,0.16) 100%)",
      color: K.paper,
      border: `3px solid ${K.orangeHi}`,
      glow: `0 0 40px ${K.orange}88, 0 22px 40px rgba(0,0,0,0.5)`,
    },
    orange: { background: `linear-gradient(170deg, ${K.orangeHi} 0%, ${K.orange} 100%)`, color: K.white, border: "none", glow: `0 0 50px ${K.orange}66, 0 22px 40px rgba(0,0,0,0.5)` },
  }[tone];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: `-50% -50%`,
        transform: `translate(${off.split(" ")[0]}, ${off.split(" ")[1]}) rotate(${rot + (1 - p) * rot * 3}deg) scale(${(from === "zoom" ? 0.3 + 0.7 * p : 1) * (1 - 0.4 * o)})`,
        opacity: Math.min(1, p * 2.5) * (1 - o),
        padding: `${size * 0.12}px ${size * 0.28}px ${size * 0.08}px`,
        background: tones.background,
        border: tones.border,
        boxShadow: tones.glow,
        clipPath: tone === "paper" ? "polygon(1% 3%, 99% 0, 100% 96%, 0 100%)" : undefined,
        borderRadius: tone === "glass" ? 10 : 2,
        fontFamily: COND,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 0.95,
        color: tones.color,
        textTransform: "uppercase",
        textAlign: "center",
        whiteSpace: "pre",
        letterSpacing: 1,
        backdropFilter: tone === "glass" ? "blur(6px)" : undefined,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// ── Orange orbit ring (partial ellipse that spins) ─────────────────
export const Orbit: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  at?: number;
  speed?: number;
  tilt?: number;
  width?: number;
  arc?: number;
  opacity?: number;
}> = ({ cx, cy, rx, ry, at = 0, speed = 1, tilt = -12, width = 6, arc = 0.7, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, 24);
  const len = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  const shown = len * arc * p;
  return (
    <svg
      width={rx * 2 + 40}
      height={ry * 2 + 40}
      style={{ position: "absolute", left: cx - rx - 20, top: cy - ry - 20, rotate: `${tilt}deg`, opacity, overflow: "visible" }}
    >
      <ellipse
        cx={rx + 20}
        cy={ry + 20}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={K.orange}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={`${shown} ${len}`}
        strokeDashoffset={-frame * 6 * speed}
        style={{ filter: `drop-shadow(0 0 10px ${K.orange})` }}
      />
    </svg>
  );
};

// ── Character cutout layer (breathing + sway + parallax) ───────────
export const Character: React.FC<{
  src: string;
  x: number;
  y: number;
  width: number;
  at?: number;
  breathe?: number;
  sway?: number;
  drift?: [number, number];
  flip?: boolean;
  style?: React.CSSProperties;
}> = ({ src, x, y, width, at = 0, breathe = 0.012, sway = 0.6, drift = [0, 0], flip, style }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = ease(frame, at, 18);
  const t = frame / 30;
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        translate: `${-width / 2 + drift[0] * (frame / durationInFrames)}px ${(1 - p) * 120 + drift[1] * (frame / durationInFrames)}px`,
        transformOrigin: "50% 100%",
        scale: `${(flip ? -1 : 1) * (1 + Math.sin(t * 1.6) * breathe * 0.5)} ${1 + Math.sin(t * 1.6) * breathe}`,
        rotate: `${Math.sin(t * 0.9) * sway}deg`,
        opacity: p,
        filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.55))",
        ...style,
      }}
    />
  );
};

// ── Backdrop: teal gradient + drifting bokeh + grain ───────────────
export const Backdrop: React.FC<{ glow?: string; plate?: string; plateOpacity?: number }> = ({ glow = K.teal, plate, plateOpacity = 0.35 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 35%, ${K.bg2} 0%, ${K.bg1} 45%, ${K.bg0} 100%)`, overflow: "hidden" }}>
      {plate && (
        <Img
          src={staticFile(plate)}
          style={{
            position: "absolute",
            inset: -80,
            width: width + 160,
            height: height + 160,
            objectFit: "cover",
            filter: "blur(38px) saturate(0.9)",
            opacity: plateOpacity,
            scale: String(1.1 + frame * 0.0004),
          }}
        />
      )}
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 38%, ${glow}55 0%, transparent 70%)` }} />
      {Array.from({ length: 16 }).map((_, i) => {
        const r = 30 + random(`r${i}`) * 110;
        const x0 = random(`x${i}`) * width;
        const y0 = random(`y${i}`) * height;
        const sp = 0.15 + random(`s${i}`) * 0.4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0 + Math.sin((frame + i * 40) / 90) * 40,
              top: ((y0 - frame * sp) % height + height) % height,
              width: r,
              height: r,
              borderRadius: "50%",
              background: i % 4 === 0 ? `${K.orange}30` : "rgba(160,210,225,0.10)",
              filter: `blur(${8 + r / 10}px)`,
            }}
          />
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 8} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
