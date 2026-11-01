import React, { useId } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "./theme";

const OUT = Easing.bezier(0.16, 1, 0.3, 1);

export const progress = (frame: number, at: number, dur = 12) =>
  interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: OUT });

// Directional motion blur through an inline SVG filter (CSS blur is only isotropic).
export const MotionBlur: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, y, children, style }) => {
  const id = useId().replace(/:/g, "");
  const active = x > 0.05 || y > 0.05;
  return (
    <div style={{ ...style, filter: active ? `url(#mb${id})` : undefined }}>
      {active && (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id={`mb${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={`${x} ${y}`} />
          </filter>
        </svg>
      )}
      {children}
    </div>
  );
};

type Dir = "up" | "down" | "left" | "right" | "none";

export const Reveal: React.FC<{
  at: number;
  dur?: number;
  dir?: Dir;
  dist?: number;
  blur?: number;
  scaleFrom?: number;
  outAt?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, dur = 12, dir = "up", dist = 60, blur = 18, scaleFrom = 1, outAt, style, children }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, dur);
  const o = outAt === undefined ? 0 : progress(frame, outAt, 8);
  const rest = 1 - p;
  const dx = dir === "left" ? -dist * rest : dir === "right" ? dist * rest : 0;
  const dy = dir === "up" ? dist * rest : dir === "down" ? -dist * rest : 0;
  const horizontal = dir === "left" || dir === "right";
  const b = blur * rest + blur * o;
  return (
    <MotionBlur
      x={horizontal ? b : b * 0.35}
      y={horizontal ? b * 0.35 : b}
      style={{
        opacity: interpolate(p, [0, 0.35], [0, 1], clamp) * (1 - o),
        translate: `${dx}px ${dy - o * 30}px`,
        scale: String(scaleFrom + (1 - scaleFrom) * p),
        ...style,
      }}
    >
      {children}
    </MotionBlur>
  );
};

// Full-screen cutaway with a zoom-blur in and out.
export const Cutaway: React.FC<{
  duration: number;
  bg: string;
  instant?: boolean;
  children: React.ReactNode;
}> = ({ duration, bg, instant, children }) => {
  const frame = useCurrentFrame();
  const inP = instant ? 1 : progress(frame, 0, 9);
  const outP = interpolate(frame, [duration - 7, duration], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const blur = (1 - inP) * 28 + outP * 28;
  return (
    <AbsoluteFill
      style={{
        background: bg,
        opacity: interpolate(inP, [0, 0.4], [0, 1], clamp) * (1 - outP),
        scale: String(1.12 - 0.12 * inP + 0.08 * outP),
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        overflow: "hidden",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Counter: React.FC<{
  from: number;
  to: number;
  at: number;
  dur: number;
  format: (n: number) => string;
  style?: React.CSSProperties;
}> = ({ from, to, at, dur, format, style }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + dur], [from, to], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{format(v)}</span>;
};
