import React from "react";
import { AbsoluteFill, Easing, interpolate, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { Puppet, PoseTrack, Expr } from "../auto/puppet";
import { DISPLAY, SANS, V, clamp } from "./theme";

const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const BACK = Easing.bezier(0.34, 1.45, 0.64, 1);
export const ease = (f: number, at: number, dur = 14) => interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: OUT });
export const pop = (f: number, at: number, dur = 12) => interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: BACK });
export const outP = (f: number, at?: number, dur = 10) => (at === undefined ? 0 : interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) }));

// ── Background: deep navy, dot grid, two slow glows ────────────────
export const Bg: React.FC<{ glow?: "cyan" | "violet" | "both" | "none"; dim?: number }> = ({ glow = "both", dim = 0 }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(130% 80% at 50% 30%, ${V.navy2} 0%, ${V.navy1} 42%, ${V.navy0} 100%)` }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${V.line} 1.6px, transparent 1.6px)`,
          backgroundSize: "54px 54px",
          opacity: 0.35,
          maskImage: "radial-gradient(70% 60% at 50% 45%, black 30%, transparent 100%)",
        }}
      />
      {(glow === "cyan" || glow === "both") && (
        <div style={{ position: "absolute", left: 80 + Math.sin(t * 0.3) * 60, top: 220 + Math.cos(t * 0.25) * 50, width: 700, height: 700, borderRadius: "50%", background: `${V.cyan}22`, filter: "blur(120px)" }} />
      )}
      {(glow === "violet" || glow === "both") && (
        <div style={{ position: "absolute", right: 40 + Math.cos(t * 0.27) * 60, bottom: 380 + Math.sin(t * 0.22) * 60, width: 760, height: 760, borderRadius: "50%", background: `${V.violet}26`, filter: "blur(130px)" }} />
      )}
      <AbsoluteFill style={{ background: `rgba(3,6,18,${0.15 + dim})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

// Slow continuous camera push (the only always-on motion).
export const Cam: React.FC<{ d: number; from?: number; to?: number; origin?: string; children: React.ReactNode }> = ({
  d,
  from = 1,
  to = 1.05,
  origin = "50% 45%",
  children,
}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ scale: String(interpolate(f, [0, d], [from, to], clamp)), transformOrigin: origin }}>{children}</AbsoluteFill>;
};

// Old subject steps back when a new one takes the stage.
export const Demote: React.FC<{ at?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  const p = at === undefined ? 0 : ease(f, at, 14);
  return (
    <AbsoluteFill style={{ scale: String(1 - 0.08 * p), opacity: 1 - 0.62 * p, filter: p > 0.02 ? `blur(${3 * p}px)` : undefined, ...style }}>
      {children}
    </AbsoluteFill>
  );
};

// ── Headline: words rise out of a mask. *word* = cyan, _word_ = violet ──
export const Headline: React.FC<{
  text: string;
  at: number;
  size?: number;
  x?: number;
  y: number;
  w?: number;
  align?: "center" | "left" | "right";
  stagger?: number;
  out?: number;
  weight?: number;
  stretch?: number;
  color?: string;
  italic?: boolean;
  lh?: number;
}> = ({ text, at, size = 110, x = 70, y, w = 940, align = "center", stagger = 3, out, weight = 850, stretch = 112, color = V.white, italic, lh = 1.0 }) => {
  const f = useCurrentFrame();
  const o = outP(f, out, 9);
  const lines = text.split("\n");
  let idx = 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, opacity: 1 - o, translate: `0 ${-o * 30}px` }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end", gap: `0 ${size * 0.22}px` }}>
          {ln.split(" ").filter(Boolean).map((raw, wi) => {
            const i = idx++;
            const cy = raw.startsWith("*") && raw.endsWith("*");
            const vi = raw.startsWith("_") && raw.endsWith("_");
            const word = cy || vi ? raw.slice(1, -1) : raw;
            const p = ease(f, at + i * stagger, 13);
            return (
              <span key={wi} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.08, lineHeight: lh }}>
                <span
                  style={{
                    display: "inline-block",
                    translate: `0 ${(1 - p) * 105}%`,
                    filter: p < 0.98 ? `blur(${(1 - p) * 6}px)` : undefined,
                    fontFamily: DISPLAY,
                    fontWeight: weight,
                    fontStretch: `${stretch}%`,
                    fontStyle: italic ? "italic" : "normal",
                    fontSize: size,
                    letterSpacing: -size * 0.02,
                    color: cy ? V.cyan : vi ? V.violet : color,
                    textShadow: cy ? `0 0 40px ${V.cyan}55` : vi ? `0 0 40px ${V.violet}55` : "0 6px 30px rgba(0,0,0,0.45)",
                  }}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ── Card (glass) ───────────────────────────────────────────────────
export const Card: React.FC<{
  at: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
  tone?: "cyan" | "violet" | "plain" | "solid";
  rot?: number;
  out?: number;
  from?: "up" | "down" | "left" | "right" | "pop";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, x, y, w = 420, h, tone = "plain", rot = 0, out, from = "up", children, style }) => {
  const f = useCurrentFrame();
  const p = from === "pop" ? pop(f, at, 13) : ease(f, at, 15);
  const o = outP(f, out, 9);
  const d = 90 * (1 - p);
  const tr = from === "up" ? `0 ${d}px` : from === "down" ? `0 ${-d}px` : from === "left" ? `${-d}px 0` : from === "right" ? `${d}px 0` : "0 0";
  const border = tone === "cyan" ? V.cyan : tone === "violet" ? V.violet : tone === "solid" ? V.cyan : "rgba(160,180,255,0.28)";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        translate: tr,
        scale: from === "pop" ? String(p) : String(1 - 0.1 * o),
        rotate: `${rot}deg`,
        opacity: Math.min(1, p * 2) * (1 - o),
        borderRadius: 26,
        padding: "26px 30px",
        background: tone === "solid" ? V.cyan : "linear-gradient(160deg, rgba(40,60,140,0.55), rgba(14,24,64,0.75))",
        border: `2px solid ${border}`,
        boxShadow: tone === "cyan" ? `0 0 40px ${V.cyan}33, 0 24px 60px rgba(0,0,0,0.45)` : tone === "violet" ? `0 0 40px ${V.violet}33, 0 24px 60px rgba(0,0,0,0.45)` : "0 24px 60px rgba(0,0,0,0.45)",
        color: tone === "solid" ? V.navy0 : V.white,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontStretch: "108%",
        fontSize: 48,
        lineHeight: 1.05,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ── Thought bubble (violet, italic) ────────────────────────────────
export const Thought: React.FC<{ text: string; at: number; x: number; y: number; w?: number; out?: number; size?: number; tail?: "left" | "right" | "none" }> = ({
  text,
  at,
  x,
  y,
  w = 560,
  out,
  size = 44,
  tail = "left",
}) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 14);
  const o = outP(f, out, 9);
  const bob = Math.sin((f + x) / 24) * 6;
  return (
    <div style={{ position: "absolute", left: x, top: y + bob, width: w, scale: String(p * (1 - 0.3 * o)), opacity: Math.min(1, p * 2) * (1 - o), transformOrigin: tail === "right" ? "90% 100%" : "10% 100%" }}>
      <div
        style={{
          borderRadius: 40,
          padding: "26px 34px",
          background: "linear-gradient(160deg, rgba(155,123,255,0.30), rgba(70,50,160,0.35))",
          border: `2px solid ${V.violet}`,
          boxShadow: `0 0 50px ${V.violet}33`,
          fontFamily: SANS,
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: size,
          lineHeight: 1.2,
          color: V.white,
        }}
      >
        {text}
      </div>
      {tail !== "none" &&
        [0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              [tail === "left" ? "left" : "right"]: 40 + i * 26,
              bottom: -24 - i * 26,
              width: 24 - i * 8,
              height: 24 - i * 8,
              borderRadius: "50%",
              background: `${V.violet}aa`,
            }}
          />
        ))}
    </div>
  );
};

// ── Chat bubble ────────────────────────────────────────────────────
export const Chat: React.FC<{ text: string; at: number; me?: boolean; x: number; y: number; w?: number; out?: number; dim?: boolean }> = ({ text, at, me, x, y, w = 600, out, dim }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 12);
  const o = outP(f, out, 9);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        maxWidth: w,
        scale: String(p),
        transformOrigin: me ? "100% 100%" : "0% 100%",
        opacity: Math.min(1, p * 2) * (1 - o) * (dim ? 0.45 : 1),
        padding: "22px 30px",
        borderRadius: me ? "34px 34px 8px 34px" : "34px 34px 34px 8px",
        background: me ? V.cyan : "rgba(30,48,110,0.9)",
        color: me ? V.navy0 : V.white,
        fontFamily: SANS,
        fontWeight: 650,
        fontSize: 46,
        lineHeight: 1.15,
        boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
      }}
    >
      {text}
    </div>
  );
};

// ── Line drawing (pathLength-normalised) ───────────────────────────
export const Draw: React.FC<{ d: string; at: number; dur?: number; color?: string; width?: number; glow?: boolean; dash?: boolean; opacity?: number }> = ({
  d,
  at,
  dur = 22,
  color = V.cyan,
  width = 6,
  glow,
  dash,
  opacity = 1,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash ? "0.02 0.025" : "1 1"}
      strokeDashoffset={dash ? -f * 0.002 : 1 - p}
      opacity={dash ? opacity * Math.min(1, p * 3) : opacity}
      style={glow ? { filter: `drop-shadow(0 0 10px ${color})` } : undefined}
    />
  );
};

export const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}>
    {children}
  </svg>
);

// ── Abstract person (head + shoulders) ─────────────────────────────
export const Figure: React.FC<{ x: number; y: number; s?: number; at: number; tone?: string; out?: number; dim?: number }> = ({ x, y, s = 1, at, tone = V.mute, out, dim = 0 }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 14);
  const o = outP(f, out, 9);
  return (
    <svg
      width={220 * s}
      height={260 * s}
      viewBox="0 0 220 260"
      style={{ position: "absolute", left: x - 110 * s, top: y - 130 * s, scale: String(p), opacity: Math.min(1, p * 2) * (1 - o) * (1 - dim), transformOrigin: "50% 100%" }}
    >
      <circle cx="110" cy="70" r="52" fill={tone} />
      <path d="M20 250 Q20 140 110 140 Q200 140 200 250 Z" fill={tone} />
    </svg>
  );
};

// ── Monitoring brackets around a rect ──────────────────────────────
export const Brackets: React.FC<{ x: number; y: number; w: number; h: number; at: number; color?: string; out?: number; pulse?: boolean }> = ({ x, y, w, h, at, color = V.violet, out, pulse }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, 16);
  const o = outP(f, out, 10);
  const g = 30 * (1 - p) + (pulse ? Math.sin(f / 6) * 4 : 0);
  const L = 70;
  const c = (cx: number, cy: number, sx: number, sy: number) => `M${cx + sx * L} ${cy} L${cx} ${cy} L${cx} ${cy + sy * L}`;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: p * (1 - o) }}>
      {[c(x - g, y - g, 1, 1), c(x + w + g, y - g, -1, 1), c(x - g, y + h + g, 1, -1), c(x + w + g, y + h + g, -1, -1)].map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
      ))}
    </svg>
  );
};

// ── Numbered list header ───────────────────────────────────────────
export const ItemNumber: React.FC<{ n: number; at: number; x?: number; y?: number; out?: number }> = ({ n, at, x = 80, y = 260, out }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, 14);
  const o = outP(f, out, 9);
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "baseline", gap: 18, opacity: p * (1 - o), translate: `${(1 - p) * -60}px 0` }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontStretch: "125%", fontSize: 230, lineHeight: 0.8, color: "transparent", WebkitTextStroke: `4px ${V.cyan}` }}>
        {String(n).padStart(2, "0")}
      </span>
      <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: V.mute, letterSpacing: 4 }}>/ 05</span>
    </div>
  );
};

// ── Jarbas puppet in VOX colours ───────────────────────────────────
export const Jarbas: React.FC<{ x: number; y: number; height: number; pose: PoseTrack; expr?: Expr; enter?: number; flip?: boolean; style?: React.CSSProperties }> = (p) => (
  <Puppet {...p} headDir="vox/heads" shirt={V.cyan} shirtLine="#127C8C" />
);

// Spotlight disc behind the puppet so he reads as a separate "studio" layer.
export const Spot: React.FC<{ x: number; y: number; r?: number; at: number; color?: string; out?: number }> = ({ x, y, r = 360, at, color = V.cyan, out }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, 18) * (1 - outP(f, out, 10));
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, ${color}40 0%, ${color}10 45%, transparent 70%)`, opacity: p, scale: String(0.7 + 0.3 * p) }} />;
};

export const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 0.18 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

export const seeded = (k: string) => random(k);
