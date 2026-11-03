import React, { createContext } from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FPS, K, clamp } from "./theme";

// Absolute frame where the enclosing scene starts, so puppets can follow the global expression track.
export const SceneStart = createContext(0);

export type Expr =
  | "neutro" | "sorriso" | "rindo" | "empolgado" | "desconfiado" | "bravo" | "surpreso" | "chocado"
  | "uau" | "apreensivo" | "ironico" | "pensativo" | "piscadinha" | "arregalado" | "falando" | "cetico";

// ── Poses: hand / foot targets in rig units (neck at 0,0; y down) ──
type P = [number, number];
type Pose = { l: P; r: P; lb?: 1 | -1; rb?: 1 | -1; lFront?: boolean; rFront?: boolean; rBehindHead?: boolean; lift?: number };
const FEET: [P, P] = [[-30, 300], [30, 300]];

export const POSES = {
  idle: { l: [-62, 152], r: [62, 152] },
  listen: { l: [-58, 150], r: [40, 120], rFront: true },
  open: { l: [-118, 60], r: [118, 60] },
  shrug: { l: [-104, 30], r: [104, 30], lift: -10 },
  chin: { l: [-60, 150], r: [18, 30], rb: 1, rFront: true },
  chinL: { l: [-18, 30], r: [60, 150], lb: -1, lFront: true },
  pointR: { l: [-60, 150], r: [158, 2] },
  pointL: { l: [-158, 2], r: [60, 150] },
  pointUp: { l: [-60, 150], r: [128, -162] },
  raise: { l: [-60, 150], r: [124, -128] },
  stop: { l: [-60, 150], r: [128, 24] },
  facepalm: { l: [-60, 150], r: [20, -128], rb: 1, rFront: true },
  sheepish: { l: [-60, 150], r: [66, -132], rBehindHead: true },
  crossed: { l: [44, 76], r: [-44, 82], lb: -1, rb: 1, lFront: true, rFront: true },
  hips: { l: [-34, 120], r: [34, 120] },
  arms: { l: [-134, -146], r: [134, -146], lift: -6 },
  talk: { l: [-60, 150], r: [96, 70] },
  type: { l: [-30, 100], r: [30, 100], lb: -1, rb: 1, lFront: true, rFront: true },
} satisfies Record<string, Pose>;
export type PoseName = keyof typeof POSES;

const ik = (s: P, t: P, a: number, b: number, bend: 1 | -1): P => {
  const dx = t[0] - s[0];
  const dy = t[1] - s[1];
  const d = Math.min(Math.hypot(dx, dy), a + b - 0.01);
  const ang = Math.atan2(dy, dx);
  const cosA = (a * a + d * d - b * b) / (2 * a * d);
  const off = Math.acos(Math.max(-1, Math.min(1, cosA))) * bend;
  return [s[0] + Math.cos(ang + off) * a, s[1] + Math.sin(ang + off) * a];
};

const lerpP = (p: P, q: P, t: number): P => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];

// Pose track: [localFrame, pose, expression?]. Pose eases in over 9 frames; the expression holds until the next entry that sets one.
export type PoseTrack = Array<[number, PoseName, Expr?]>;

const usePose = (track: PoseTrack, frame: number) => {
  let i = 0;
  for (let k = 0; k < track.length; k++) if (track[k][0] <= frame) i = k;
  const cur = POSES[track[i][1]] as Pose;
  const prev = POSES[track[Math.max(0, i - 1)][1]] as Pose;
  const t = i === 0 ? 1 : interpolate(frame, [track[i][0], track[i][0] + 9], [0, 1], { ...clamp, easing: Easing.bezier(0.34, 1.4, 0.64, 1) });
  return { cur, prev, t, changedAt: track[i][0] };
};

const SKIN = "#C98E68";
const SKIN_D = "#8F5B3F";
const SHIRT = K.orange;
const PANTS = "#1D2A31";

export const Puppet: React.FC<{
  x: number;
  y: number; // ground line (feet)
  height: number; // full figure height in px
  pose?: PoseTrack;
  expr?: Expr; // fixed expression; otherwise taken from the pose track
  flip?: boolean;
  enter?: number; // local frame of the pop-in
  walk?: [number, number, number]; // [fromFrame, toFrame, dx px] walk cycle while moving
  style?: React.CSSProperties;
  headDir?: string;
  shirt?: string;
  shirtLine?: string;
}> = ({ x, y, height, pose = [[0, "idle"]], expr, flip, enter = 0, walk, style, headDir = "autocensura/heads", shirt = SHIRT, shirtLine = "#8A3415" }) => {
  const frame = useCurrentFrame();
  let exprName: Expr = expr ?? "neutro";
  let exprStart = -99;
  let exprIdx = 0;
  if (!expr) {
    pose.forEach(([f, , e], k) => {
      if (e && f <= frame) {
        exprName = e;
        exprStart = f;
        exprIdx = k;
      }
    });
  }
  const variant = exprIdx % 2 === 0 ? 1 : 2;
  const sinceExpr = frame - exprStart;
  const headPop = interpolate(sinceExpr, [0, 4, 10], [1.13, 0.96, 1], clamp);

  const { cur, prev, t, changedAt } = usePose(pose, frame);
  const bounce = interpolate(frame - changedAt, [0, 5, 12], [0, 8, 0], clamp);
  const tt = frame / FPS;
  const breathe = Math.sin(tt * 2.2) * 2.2;
  const sway = Math.sin(tt * 1.3) * 1.6;
  const lift = (prev.lift ?? 0) + ((cur.lift ?? 0) - (prev.lift ?? 0)) * t;

  const walking = walk && frame >= walk[0] && frame <= walk[1];
  const wp = walk ? interpolate(frame, [walk[0], walk[1]], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) }) : 0;
  const dxWalk = walk ? walk[2] * wp : 0;
  const phase = walking ? frame * 0.45 : 0;
  const stride = walking ? 34 : 0;

  const lHand = lerpP(prev.l, cur.l, t);
  const rHand = lerpP(prev.r, cur.r, t);
  const wave = (cur === POSES.talk ? Math.sin(tt * 7) * 14 : 0) + (cur === POSES.raise ? Math.sin(tt * 9) * 6 : 0);
  if (wave) rHand[0] += wave;
  if (walking) {
    lHand[0] += Math.sin(phase) * -22;
    rHand[0] += Math.sin(phase) * 22;
  }
  const shY = 16 + lift;
  const lSh: P = [-50, shY];
  const rSh: P = [50, shY];
  const lEl = ik(lSh, lHand, 72, 70, t > 0.5 ? cur.lb ?? 1 : prev.lb ?? 1);
  const rEl = ik(rSh, rHand, 72, 70, t > 0.5 ? cur.rb ?? -1 : prev.rb ?? -1);
  const hipY = 146;
  const lHip: P = [-22, hipY];
  const rHip: P = [22, hipY];
  const lFoot: P = [FEET[0][0] + Math.sin(phase) * stride, FEET[0][1] - Math.max(0, Math.cos(phase)) * (walking ? 14 : 0)];
  const rFoot: P = [FEET[1][0] - Math.sin(phase) * stride, FEET[1][1] - Math.max(0, -Math.cos(phase)) * (walking ? 14 : 0)];
  const lKn = ik(lHip, lFoot, 80, 78, 1);
  const rKn = ik(rHip, rFoot, 80, 78, -1);

  const unit = height / 560;
  const p = interpolate(frame, [enter, enter + 12], [0, 1], { ...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
  const bodyDy = bounce * 0.4 + (walking ? Math.abs(Math.sin(phase)) * -6 : 0);

  const limb = (a: P, b: P, c: P, color: string, w: number, outline: string) => (
    <>
      <polyline points={`${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}`} fill="none" stroke={outline} strokeWidth={w + 6} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}`} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
  const hand = (h: P) => <circle cx={h[0]} cy={h[1]} r={14} fill={SKIN} stroke={SKIN_D} strokeWidth={3} />;
  const armL = (
    <g>
      {limb(lSh, lEl, lHand, SKIN, 15, SKIN_D)}
      {hand(lHand)}
    </g>
  );
  const armR = (
    <g>
      {limb(rSh, rEl, rHand, SKIN, 15, SKIN_D)}
      {hand(rHand)}
    </g>
  );
  const lFront = cur.lFront && t > 0.4;
  const rFront = (cur.rFront && t > 0.4) || (prev.rFront && t < 0.4);
  const rBehindHead = cur.rBehindHead;

  const headH = 290;
  const VB = { x: -200, y: -270, w: 400, h: 600 };

  return (
    <div
      style={{
        position: "absolute",
        left: x + dxWalk - (VB.w * unit) / 2,
        top: y - (316 - VB.y) * unit,
        width: VB.w * unit,
        height: VB.h * unit,
        transformOrigin: "50% 100%",
        scale: `${(flip ? -1 : 1) * p} ${p}`,
        opacity: Math.min(1, p * 3),
        ...style,
      }}
    >
      <svg width="100%" height="100%" viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <ellipse cx={dxWalk ? 0 : 0} cy={312} rx={110} ry={16} fill="rgba(0,0,0,0.35)" />
        <g transform={`translate(0 ${bodyDy + breathe * 0.5}) rotate(${sway * 0.4} 0 300)`}>
          {limb(lHip, lKn, lFoot, PANTS, 22, "#0B1115")}
          {limb(rHip, rKn, rFoot, PANTS, 22, "#0B1115")}
          <ellipse cx={lFoot[0] - 10} cy={lFoot[1] + 8} rx={28} ry={13} fill={K.paper} stroke="#0B1115" strokeWidth={4} />
          <ellipse cx={rFoot[0] + 10} cy={rFoot[1] + 8} rx={28} ry={13} fill={K.paper} stroke="#0B1115" strokeWidth={4} />
          {!lFront && armL}
          {!rFront && !rBehindHead && armR}
          <path
            d={`M-56 ${shY - 6} Q0 ${shY - 22} 56 ${shY - 6} L44 ${hipY + 6} Q0 ${hipY + 16} -44 ${hipY + 6} Z`}
            fill={shirt}
            stroke={shirtLine}
            strokeWidth={4}
          />
          <path d={`M-20 ${shY - 12} Q0 ${shY + 8} 20 ${shY - 12}`} fill="none" stroke={shirtLine} strokeWidth={4} />
          <rect x={-46} y={hipY - 4} width={92} height={18} rx={6} fill={PANTS} />
          {lFront && armL}
          {rFront && armR}
        </g>
      </svg>
      {rBehindHead && (
        <svg width="100%" height="100%" viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g transform={`translate(0 ${bodyDy + breathe * 0.5})`}>{armR}</g>
        </svg>
      )}
      <Img
        src={staticFile(`${headDir}/${exprName}-${variant}.png`)}
        style={{
          position: "absolute",
          left: "50%",
          bottom: `${((VB.y + VB.h - (shY + 6) - bodyDy - breathe * 0.5) / VB.h) * 100}%`,
          height: headH * unit,
          translate: "-50% 0",
          transformOrigin: "50% 92%",
          scale: String(headPop),
          rotate: `${sway + (flip ? 0 : 0)}deg`,
          filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.45))",
        }}
      />
      {(lFront || rFront) && cur === POSES.facepalm && (
        <svg width="100%" height="100%" viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g transform={`translate(0 ${bodyDy + breathe * 0.5})`}>{armR}</g>
        </svg>
      )}
      {(cur === POSES.chin || cur === POSES.chinL) && t > 0.5 && (
        <svg width="100%" height="100%" viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g transform={`translate(0 ${bodyDy + breathe * 0.5})`}>{hand(cur === POSES.chin ? rHand : lHand)}</g>
        </svg>
      )}
    </div>
  );
};
