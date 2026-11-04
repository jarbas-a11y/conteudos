import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { DISPLAY, GRAD, MONO, P, SERIF, UI, clamp, ease, expo, outP, pop, rnd } from "./theme";

/* ───────────────────────── Background ───────────────────────── */

export const Bg: React.FC<{ tone?: "violet" | "cyan" | "both" | "dark"; intensity?: number }> = ({ tone = "both", intensity = 1 }) => {
  const f = useCurrentFrame();
  const a = f * 0.012;
  const v = tone !== "cyan" && tone !== "dark";
  const c = tone !== "violet" && tone !== "dark";
  return (
    <AbsoluteFill style={{ background: P.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 0%, ${P.deep} 0%, ${P.night} 60%)` }} />
      {v && (
        <div style={{ position: "absolute", left: 140 + Math.sin(a) * 160, top: 380 + Math.cos(a * 0.8) * 200, width: 1100, height: 1100, borderRadius: "50%", background: `radial-gradient(circle, ${P.violet}55 0%, ${P.violet}00 62%)`, opacity: 0.85 * intensity, translate: "-30% -30%" }} />
      )}
      {c && (
        <div style={{ position: "absolute", left: 900 + Math.cos(a * 0.9) * 160, top: 1400 + Math.sin(a * 1.1) * 220, width: 1000, height: 1000, borderRadius: "50%", background: `radial-gradient(circle, ${P.cyan}3a 0%, ${P.cyan}00 62%)`, opacity: 0.8 * intensity, translate: "-50% -50%" }} />
      )}
      {/* dot grid */}
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${P.lav}22 1.4px, transparent 1.6px)`, backgroundSize: "44px 44px", backgroundPosition: `${(f * 0.3) % 44}px 0px`, maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 20%, transparent 75%)" }} />
      <Grain />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 45%, transparent 55%, rgba(3,5,14,0.85) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 8;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <filter id={`grain${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
    </svg>
  );
};

/* ───────────────────────── Primitives ───────────────────────── */

type Pos = { x: number; y: number };

/** Glass panel with gradient hairline border and soft depth. */
export const Glass: React.FC<{
  x: number; y: number; w: number; h?: number; r?: number; at?: number; out?: number; glow?: string; tilt?: [number, number];
  from?: "up" | "pop" | "left" | "right" | "zoom" | "none"; style?: React.CSSProperties; children?: React.ReactNode; strong?: boolean;
}> = ({ x, y, w, h, r = 36, at = 0, out, glow, tilt = [0, 0], from = "up", style, children, strong }) => {
  const f = useCurrentFrame();
  const p = from === "pop" ? pop(f, at, 14) : expo(f, at, 16);
  const o = outP(f, out, 8);
  const tr =
    from === "up" ? `translateY(${(1 - p) * 90}px)` :
    from === "left" ? `translateX(${(p - 1) * 300}px)` :
    from === "right" ? `translateX(${(1 - p) * 300}px)` :
    from === "zoom" ? `scale(${0.6 + 0.4 * p})` :
    from === "pop" ? `scale(${p})` : "";
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, padding: 2,
        background: `linear-gradient(140deg, ${P.lav}88, rgba(255,255,255,0.06) 40%, ${P.cyan}66)`,
        boxShadow: `0 40px 90px rgba(2,4,12,0.65)${glow ? `, 0 0 80px ${glow}55` : ""}`,
        opacity: Math.min(1, p * 1.6) * (1 - o),
        transform: `perspective(1600px) rotateX(${tilt[0]}deg) rotateY(${tilt[1]}deg) ${tr} translateY(${o * -40}px)`,
        filter: p < 0.98 && from !== "pop" ? `blur(${(1 - p) * 10}px)` : undefined,
        ...style,
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: r - 2, background: strong ? `linear-gradient(180deg, #1A2556, #0D1532)` : `linear-gradient(180deg, rgba(24,38,90,0.92), rgba(10,16,40,0.94))`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)", position: "relative", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
};

export const Cursor: React.FC<{ path: Array<[number, number, number]>; label?: string; clicks?: number[]; color?: string }> = ({ path, label = "você", clicks = [], color = P.violet }) => {
  const f = useCurrentFrame();
  // path: [frame, x, y]
  let x = path[0][1], y = path[0][2];
  for (let i = 1; i < path.length; i++) {
    const [t0, x0, y0] = path[i - 1];
    const [t1, x1, y1] = path[i];
    if (f >= t0) {
      const k = interpolate(f, [t0, t1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
      x = x0 + (x1 - x0) * k;
      y = y0 + (y1 - y0) * k;
    }
  }
  const press = clicks.reduce((m, c) => Math.max(m, 1 - Math.abs(f - c - 2) / 4), 0);
  const vis = ease(f, path[0][0], 6);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: vis, scale: String(1 - press * 0.15), transformOrigin: "0 0", zIndex: 50 }}>
      {clicks.map((c) => {
        const k = interpolate(f, [c, c + 14], [0, 1], clamp);
        return k > 0 && k < 1 ? <div key={c} style={{ position: "absolute", left: -40, top: -40, width: 80, height: 80, borderRadius: 40, border: `3px solid ${color}`, scale: String(0.3 + k), opacity: 1 - k }} /> : null;
      })}
      <svg width={54} height={60} viewBox="0 0 24 26" style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))" }}>
        <path d="M2 1 L2 20 L7 15.5 L10.5 23 L13.6 21.6 L10.2 14.3 L17 14 Z" fill={P.white} stroke={P.night} strokeWidth={1.2} strokeLinejoin="round" />
      </svg>
      {label && (
        <div style={{ position: "absolute", left: 40, top: 46, padding: "6px 14px", borderRadius: 10, background: color, color: P.white, fontFamily: UI, fontWeight: 700, fontSize: 24, whiteSpace: "nowrap" }}>{label}</div>
      )}
    </div>
  );
};

export const Chip: React.FC<{ x: number; y: number; at: number; text: string; icon?: React.ReactNode; tone?: "violet" | "cyan" | "glass" | "danger" | "white"; out?: number; size?: number; strike?: number; rot?: number; center?: boolean }> = ({ x, y, at, text, icon, tone = "glass", out, size = 34, strike, rot = 0, center }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 12);
  const o = outP(f, out, 8);
  const bg = tone === "violet" ? P.violet : tone === "cyan" ? P.cyan : tone === "danger" ? P.danger : tone === "white" ? P.white : "rgba(26,40,92,0.92)";
  const fg = tone === "cyan" || tone === "white" ? P.night : P.white;
  const s = strike === undefined ? 0 : ease(f, strike, 8);
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: center ? "-50% -50%" : undefined, rotate: `${rot}deg`, scale: String(p * (1 - o * 0.4)), opacity: Math.min(1, p) * (1 - o), display: "flex", alignItems: "center", gap: 14, padding: `${size * 0.42}px ${size * 0.8}px`, borderRadius: 999, background: bg, border: tone === "glass" ? `1.5px solid ${P.lav}55` : "none", color: fg, fontFamily: UI, fontWeight: 700, fontSize: size, whiteSpace: "nowrap", boxShadow: tone === "glass" ? "0 18px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)" : `0 14px 40px ${bg}66` }}>
      {icon}
      <span style={{ position: "relative", opacity: 1 - s * 0.45 }}>
        {text}
        {s > 0 && <span style={{ position: "absolute", left: -6, top: "52%", height: 5, width: `calc(${s * 100}% + 12px)`, background: P.danger, borderRadius: 3 }} />}
      </span>
    </div>
  );
};

/** Glossy stylised person bust. */
export const Avatar: React.FC<{ x: number; y: number; s?: number; at?: number; tone?: string; ring?: number; dim?: number; out?: number; crown?: boolean }> = ({ x, y, s = 1, at = 0, tone = P.lav, ring, dim = 0, out, crown }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 14);
  const o = outP(f, out, 8);
  const ringP = ring === undefined ? 0 : ease(f, ring, 10);
  return (
    <div style={{ position: "absolute", left: x - 110 * s, top: y - 130 * s, width: 220 * s, height: 260 * s, scale: String(p), opacity: Math.min(1, p * 1.5) * (1 - o) * (1 - dim * 0.6), transformOrigin: "50% 100%", filter: dim ? `saturate(${1 - dim})` : undefined }}>
      <svg width={220 * s} height={260 * s} viewBox="0 0 220 260" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id={`h${tone}`} cx="38%" cy="30%" r="75%">
            <stop offset="0" stopColor="#ffffff" stopOpacity={0.55} />
            <stop offset="0.35" stopColor={tone} />
            <stop offset="1" stopColor={P.deep} />
          </radialGradient>
          <linearGradient id={`b${tone}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={tone} />
            <stop offset="1" stopColor={P.deep} />
          </linearGradient>
        </defs>
        {ringP > 0 && <circle cx="110" cy="72" r={66 + ringP * 6} fill="none" stroke={P.cyan} strokeWidth={5} opacity={ringP} />}
        <path d="M18 258 Q18 146 110 146 Q202 146 202 258 Z" fill={`url(#b${tone})`} />
        <circle cx="110" cy="72" r="54" fill={`url(#h${tone})`} />
        <path d="M150 40 A54 54 0 0 1 160 100" stroke="#fff" strokeOpacity={0.35} strokeWidth={4} fill="none" strokeLinecap="round" />
        {crown && <path d="M78 14 L90 -10 L110 8 L130 -10 L142 14 Z" fill={P.cyan} />}
      </svg>
    </div>
  );
};

export const Bubble: React.FC<{ x: number; y: number; w?: number; at: number; text?: string; me?: boolean; typing?: [number, number]; out?: number; size?: number; dim?: number; name?: string }> = ({ x, y, w = 640, at, text, me, typing, out, size = 40, dim = 0, name }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 12);
  const o = outP(f, out, 8);
  const isTyping = typing && f >= typing[0] && f < typing[1];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", flexDirection: "column", alignItems: me ? "flex-end" : "flex-start", opacity: Math.min(1, p) * (1 - o) * (1 - dim * 0.55), scale: String(0.7 + 0.3 * p), transformOrigin: me ? "100% 100%" : "0% 100%" }}>
      {name && <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 24, color: P.mute, margin: "0 18px 8px" }}>{name}</div>}
      <div style={{ padding: `${size * 0.6}px ${size * 0.8}px`, borderRadius: me ? `${size}px ${size}px 10px ${size}px` : `${size}px ${size}px ${size}px 10px`, background: me ? `linear-gradient(135deg, ${P.violet}, #5B3FE0)` : "rgba(34,48,104,0.96)", border: me ? "none" : `1.5px solid ${P.lav}44`, color: P.white, fontFamily: UI, fontWeight: 600, fontSize: size, lineHeight: 1.25, boxShadow: me ? `0 20px 50px ${P.violet}55` : "0 20px 50px rgba(0,0,0,0.45)" }}>
        {isTyping ? <TypingDots f={f} /> : text}
      </div>
    </div>
  );
};

const TypingDots: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ display: "flex", gap: 10, padding: "8px 4px" }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: P.white, opacity: 0.35 + 0.65 * Math.max(0, Math.sin((f - i * 4) * 0.35)) }} />
    ))}
  </div>
);

/** Semicircle gauge. */
export const Gauge: React.FC<{ x: number; y: number; s?: number; at: number; value: number; label?: string; color?: string; out?: number }> = ({ x, y, s = 1, at, value, label, color = P.cyan, out }) => {
  const f = useCurrentFrame();
  const p = expo(f, at, 14);
  const o = outP(f, out, 8);
  const R = 200;
  const ang = Math.PI * (1 - value);
  const len = Math.PI * R;
  return (
    <div style={{ position: "absolute", left: x - R * s - 30, top: y - R * s - 30, opacity: p * (1 - o), scale: String((0.85 + 0.15 * p) * s), transformOrigin: "50% 100%" }}>
      <svg width={R * 2 + 60} height={R + 80} viewBox={`-30 -30 ${R * 2 + 60} ${R + 80}`}>
        <defs>
          <linearGradient id="gg" x1="0" x2="1">
            <stop offset="0" stopColor={P.cyan} />
            <stop offset="1" stopColor={color === P.cyan ? P.violet : color} />
          </linearGradient>
        </defs>
        <path d={`M0 ${R} A${R} ${R} 0 0 1 ${2 * R} ${R}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={34} strokeLinecap="round" />
        <path d={`M0 ${R} A${R} ${R} 0 0 1 ${2 * R} ${R}`} fill="none" stroke="url(#gg)" strokeWidth={34} strokeLinecap="round" strokeDasharray={`${len * value} ${len}`} style={{ filter: `drop-shadow(0 0 14px ${color}88)` }} />
        {Array.from({ length: 11 }).map((_, i) => {
          const a = Math.PI * (1 - i / 10);
          return <line key={i} x1={R + Math.cos(a) * (R - 40)} y1={R - Math.sin(a) * (R - 40)} x2={R + Math.cos(a) * (R - 56)} y2={R - Math.sin(a) * (R - 56)} stroke={P.mute} strokeWidth={3} />;
        })}
        <line x1={R} y1={R} x2={R + Math.cos(ang) * (R - 70)} y2={R - Math.sin(ang) * (R - 70)} stroke={P.white} strokeWidth={8} strokeLinecap="round" />
        <circle cx={R} cy={R} r={16} fill={P.white} />
      </svg>
      {label && <div style={{ position: "absolute", width: "100%", top: R + 50, textAlign: "center", fontFamily: MONO, fontWeight: 600, fontSize: 26, letterSpacing: 4, color: P.mute }}>{label}</div>}
    </div>
  );
};

/** Animated value for gauge/bars: keyframes [frame, value]. */
export const track = (f: number, keys: Array<[number, number]>) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (f < keys[i][0]) return interpolate(f, [keys[i - 1][0], keys[i][0]], [keys[i - 1][1], keys[i][1]], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  }
  return keys[keys.length - 1][1];
};

export const Bar: React.FC<{ x: number; y: number; w: number; at: number; value: number; label?: string; color?: string; out?: number; h?: number }> = ({ x, y, w, at, value, label, color = P.cyan, out, h = 26 }) => {
  const f = useCurrentFrame();
  const p = expo(f, at, 12);
  const o = outP(f, out, 8);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: p * (1 - o) }}>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: P.mute, marginBottom: 14 }}>
          <span>{label}</span>
          <span style={{ color }}>{Math.round(value * 100)}%</span>
        </div>
      )}
      <div style={{ height: h, borderRadius: h, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{ height: h, width: `${value * 100 * p}%`, borderRadius: h, background: `linear-gradient(90deg, ${P.violet}, ${color})`, boxShadow: `0 0 24px ${color}88` }} />
      </div>
    </div>
  );
};

/** Draw-on SVG path. */
export const Stroke: React.FC<{ d: string; at: number; dur?: number; color?: string; width?: number; glow?: boolean; dash?: boolean; opacity?: number; out?: number }> = ({ d, at, dur = 18, color = P.white, width = 5, glow, dash, opacity = 1, out }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, dur, Easing.inOut(Easing.cubic));
  const o = outP(f, out, 8);
  return (
    <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash ? undefined : "1 1"} strokeDashoffset={dash ? undefined : 1 - p} opacity={(dash ? p : p > 0 ? 1 : 0) * opacity * (1 - o)} style={{ filter: glow ? `drop-shadow(0 0 10px ${color})` : undefined }} />
  );
};

export const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none", ...style }}>
    {children}
  </svg>
);

/** Brand orbit ring with nodes (VOX graphic element). */
export const Orbit: React.FC<{ x: number; y: number; r: number; at: number; nodes?: number; speed?: number; color?: string; out?: number; width?: number }> = ({ x, y, r, at, nodes = 4, speed = 0.01, color, out, width = 4 }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, 22, Easing.inOut(Easing.cubic));
  const o = outP(f, out, 8);
  const rot = f * speed;
  return (
    <svg width={r * 2 + 60} height={r * 2 + 60} style={{ position: "absolute", left: x - r - 30, top: y - r - 30, opacity: 1 - o, overflow: "visible" }}>
      <defs>
        <linearGradient id={`og${r}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color ?? P.violet} />
          <stop offset="1" stopColor={color ?? P.cyan} />
        </linearGradient>
      </defs>
      <circle cx={r + 30} cy={r + 30} r={r} fill="none" stroke={`url(#og${r})`} strokeWidth={width} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} transform={`rotate(${-90 + (rot * 180) / Math.PI} ${r + 30} ${r + 30})`} />
      {Array.from({ length: nodes }).map((_, i) => {
        const a = (i / nodes) * Math.PI * 2 + rot;
        const np = pop(f, at + 14 + i * 3, 10);
        return <circle key={i} cx={r + 30 + Math.cos(a) * r} cy={r + 30 + Math.sin(a) * r} r={12 * np} fill={P.night} stroke={i % 2 ? P.cyan : P.lav} strokeWidth={5} />;
      })}
    </svg>
  );
};

/** Brand waveform bars (deterministic, speech-like). */
export const Wave: React.FC<{ x: number; y: number; w: number; h: number; at: number; bars?: number; out?: number; calm?: number }> = ({ x, y, w, h, at, bars = 36, out, calm = 0 }) => {
  const f = useCurrentFrame();
  const p = expo(f, at, 14);
  const o = outP(f, out, 8);
  const bw = w / bars;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, display: "flex", alignItems: "center", gap: bw * 0.35, opacity: p * (1 - o) }}>
      {Array.from({ length: bars }).map((_, i) => {
        const env = Math.sin((i / bars) * Math.PI);
        const amp = env * (0.25 + 0.75 * Math.abs(Math.sin(f * 0.22 + i * 1.7) * Math.cos(f * 0.13 + i * 0.6))) * (1 - calm * 0.85);
        return <div key={i} style={{ flex: 1, height: `${Math.max(0.06, amp) * 100 * p}%`, borderRadius: 99, background: `linear-gradient(180deg, ${i / bars < 0.5 ? P.lav : P.cyan}, ${P.violet})` }} />;
      })}
    </div>
  );
};

/** Neural network brain-like cluster with travelling pulses. */
export const Neural: React.FC<{ x: number; y: number; s?: number; at: number; hot?: number; out?: number; count?: number }> = ({ x, y, s = 1, at, hot = 0, out, count = 26 }) => {
  const f = useCurrentFrame();
  const o = outP(f, out, 8);
  const pts = Array.from({ length: count }).map((_, i) => {
    const a = rnd(i) * Math.PI * 2;
    const r = Math.sqrt(rnd(i + 50)) * 230;
    return [Math.cos(a) * r * 1.15, Math.sin(a) * r * 0.85] as [number, number];
  });
  const edges: Array<[number, number]> = [];
  pts.forEach((pA, i) => {
    pts.forEach((pB, j) => {
      if (j > i && Math.hypot(pA[0] - pB[0], pA[1] - pB[1]) < 120) edges.push([i, j]);
    });
  });
  return (
    <svg width={700 * s} height={600 * s} viewBox="-350 -300 700 600" style={{ position: "absolute", left: x - 350 * s, top: y - 300 * s, opacity: 1 - o, overflow: "visible" }}>
      {edges.map(([i, j], k) => {
        const p = ease(f, at + k * 0.6, 10);
        return <line key={k} x1={pts[i][0]} y1={pts[i][1]} x2={pts[i][0] + (pts[j][0] - pts[i][0]) * p} y2={pts[i][1] + (pts[j][1] - pts[i][1]) * p} stroke={hot > 0.5 ? P.danger : P.lav} strokeOpacity={0.45} strokeWidth={2} />;
      })}
      {edges.slice(0, 18).map(([i, j], k) => {
        const t = ((f - at) * 0.04 + rnd(k + 9)) % 1;
        if (f < at + 10) return null;
        return <circle key={`p${k}`} cx={pts[i][0] + (pts[j][0] - pts[i][0]) * t} cy={pts[i][1] + (pts[j][1] - pts[i][1]) * t} r={5} fill={P.cyan} style={{ filter: `drop-shadow(0 0 6px ${P.cyan})` }} />;
      })}
      {pts.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={(6 + rnd(i + 3) * 8) * pop(f, at + i * 0.8, 10)} fill={i % 3 === 0 ? P.cyan : i % 3 === 1 ? P.lav : P.violet} style={{ filter: `drop-shadow(0 0 8px ${P.violet})` }} />
      ))}
    </svg>
  );
};

/** Giant gradient numeral / word. */
export const Giant: React.FC<{ text: string; at: number; x?: number; y: number; size?: number; out?: number; outline?: boolean; color?: string; serif?: boolean }> = ({ text, at, x = 0, y, size = 520, out, outline, color, serif }) => {
  const f = useCurrentFrame();
  const p = expo(f, at, 16);
  const o = outP(f, out, 8);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 1080, textAlign: "center", fontFamily: serif ? SERIF : DISPLAY, fontStyle: serif ? "italic" : "normal", fontWeight: serif ? 400 : 800, fontSize: size, lineHeight: 0.9, letterSpacing: serif ? -4 : -size * 0.04, scale: String(1.4 - 0.4 * p), opacity: p * (1 - o), filter: `blur(${(1 - p) * 20}px)`, color: outline ? "transparent" : undefined, WebkitTextStroke: outline ? `5px ${color ?? P.lav}` : undefined, textShadow: outline ? `0 0 60px ${color ?? P.lav}55` : undefined, backgroundImage: outline ? undefined : color ? undefined : GRAD, backgroundClip: outline || color ? undefined : "text", WebkitBackgroundClip: outline || color ? undefined : "text", WebkitTextFillColor: outline ? "transparent" : color ? color : "transparent" }}>
      {text}
    </div>
  );
};

/** Sound effect helper. */
export const Sfx: React.FC<{ at: number; src: "whoosh" | "whip" | "mouse-click" | "switch" | "ding" | "shutter-modern" | "page-turn"; volume?: number }> = ({ at, src, volume = 0.15 }) => {
  const f = useCurrentFrame();
  if (f < at - 1 || at < 0) return null;
  return (
    <Seq at={at}>
      <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
    </Seq>
  );
};

const Seq: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => (
  <Sequence from={Math.round(at)} layout="none">
    {children}
  </Sequence>
);

/** Window chrome card (app-like). */
export const Window: React.FC<{ x: number; y: number; w: number; h: number; at: number; title?: string; out?: number; tilt?: [number, number]; from?: "up" | "pop" | "left" | "right" | "zoom"; children?: React.ReactNode }> = ({ x, y, w, h, at, title, out, tilt, from = "up", children }) => (
  <Glass x={x} y={y} w={w} h={h} at={at} out={out} tilt={tilt} from={from} r={30} strong>
    <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 26px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      {["#FF6B8B", "#FFC46B", "#5BE3A0"].map((c) => (
        <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c, opacity: 0.85 }} />
      ))}
      <div style={{ marginLeft: 16, fontFamily: MONO, fontSize: 22, color: P.mute, letterSpacing: 1 }}>{title}</div>
    </div>
    <div style={{ position: "relative", height: h - 68 }}>{children}</div>
  </Glass>
);

export const Label: React.FC<{ x: number; y: number; at: number; text: string; color?: string; out?: number; size?: number; w?: number; align?: "left" | "center" | "right" }> = ({ x, y, at, text, color = P.mute, out, size = 24, w, align = "left" }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, 10);
  const o = outP(f, out, 6);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, fontFamily: MONO, fontWeight: 600, fontSize: size, letterSpacing: size * 0.18, color, opacity: p * (1 - o), textTransform: "uppercase", clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
      {text}
    </div>
  );
};

/** Radial burst of lines (impact accent). */
export const Burst: React.FC<{ x: number; y: number; at: number; r?: number; color?: string; n?: number }> = ({ x, y, at, r = 160, color = P.cyan, n = 12 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  if (k <= 0 || k >= 1) return null;
  return (
    <svg width={r * 3} height={r * 3} style={{ position: "absolute", left: x - r * 1.5, top: y - r * 1.5, overflow: "visible" }}>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2;
        const r0 = r * (0.4 + 0.6 * k);
        const r1 = r * (0.55 + 0.9 * k);
        return <line key={i} x1={r * 1.5 + Math.cos(a) * r0} y1={r * 1.5 + Math.sin(a) * r0} x2={r * 1.5 + Math.cos(a) * r1} y2={r * 1.5 + Math.sin(a) * r1} stroke={color} strokeWidth={6 * (1 - k)} strokeLinecap="round" />;
      })}
    </svg>
  );
};

export type { Pos };

/* ───────────────────────── Icons & character ───────────────────────── */

import type { LucideIcon } from "lucide-react";
import { Puppet, type Expr, type PoseTrack } from "../auto/puppet";

export const Ico: React.FC<{ I: LucideIcon; size?: number; color?: string; stroke?: number }> = ({ I, size = 48, color = P.white, stroke = 2.2 }) => <I size={size} color={color} strokeWidth={stroke} />;

/** App-icon style glass tile with a glowing icon. */
export const Tile: React.FC<{ x: number; y: number; s?: number; at: number; I: LucideIcon; tone?: "violet" | "cyan" | "danger" | "glass"; out?: number; dim?: number; rot?: number; badge?: string }> = ({ x, y, s = 1, at, I, tone = "violet", out, dim = 0, rot = 0, badge }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 14);
  const o = outP(f, out, 8);
  const c = tone === "cyan" ? P.cyan : tone === "danger" ? P.danger : tone === "glass" ? P.lav : P.violet;
  const S = 200 * s;
  return (
    <div style={{ position: "absolute", left: x - S / 2, top: y - S / 2, width: S, height: S, borderRadius: S * 0.26, rotate: `${rot}deg`, scale: String(p * (1 - o * 0.5)), opacity: Math.min(1, p * 1.5) * (1 - o) * (1 - dim * 0.6), background: `linear-gradient(150deg, #22306A, #0C1330)`, border: `2px solid ${c}66`, boxShadow: `0 30px 70px rgba(0,0,0,0.55), 0 0 60px ${c}${dim ? "11" : "44"}, inset 0 2px 0 rgba(255,255,255,0.14)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ filter: `drop-shadow(0 0 ${14 * s}px ${c})` }}>
        <I size={S * 0.46} color={c === P.lav ? P.white : c} strokeWidth={2} />
      </div>
      {badge && <div style={{ position: "absolute", right: -S * 0.08, top: -S * 0.08, minWidth: S * 0.3, height: S * 0.3, borderRadius: S * 0.15, background: tone === "danger" ? P.danger : P.cyan, color: P.night, fontFamily: UI, fontWeight: 800, fontSize: S * 0.16, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 10px", scale: String(pop(f, at + 10, 10)) }}>{badge}</div>}
    </div>
  );
};

/** Jarbas puppet in the VOX2 palette, standing on a glowing disc. */
export const Jarbas: React.FC<{ x: number; y: number; height: number; pose: PoseTrack; expr?: Expr; enter?: number; flip?: boolean; disc?: boolean }> = ({ disc = true, ...p }) => {
  const f = useCurrentFrame();
  const dp = expo(f, (p.enter ?? 0) - 4, 16);
  return (
    <>
      {disc && (
        <div style={{ position: "absolute", left: p.x - 260 * dp, top: p.y - 40, width: 520 * dp, height: 90, borderRadius: "50%", background: `radial-gradient(ellipse, ${P.violet}aa, ${P.violet}00 70%)`, filter: "blur(4px)" }} />
      )}
      {disc && <div style={{ position: "absolute", left: p.x - 200 * dp, top: p.y - 22, width: 400 * dp, height: 44, borderRadius: "50%", border: `3px solid ${P.cyan}`, boxShadow: `0 0 30px ${P.cyan}`, opacity: dp }} />}
      <div style={{ position: "absolute", inset: 0, filter: `drop-shadow(0 0 28px ${P.violet}66)` }}>
        <Puppet {...p} headDir="vox/heads" shirt={P.violet} shirtLine="#4B33B8" />
      </div>
    </>
  );
};
