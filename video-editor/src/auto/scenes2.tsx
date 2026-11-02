import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Bubble, Character, Icon, Label, Orbit, ease, pop } from "./kit";
import { COND, K, SANS, clamp } from "./theme";
import type { SceneProps } from "./scenes";

const at = (b: number[], i: number, d: number, frac: number) => b[i] ?? Math.round(d * frac);
const IMG = (n: string) => `autocensura/${n}`;

// ── Condição: the speech bubble gets padlocked ─────────────────────
export const Condicao: React.FC<SceneProps> = ({ d, b }) => {
  const frame = useCurrentFrame();
  const ok = at(b, 0, d, 0.3);
  const prob = at(b, 1, d, 0.5);
  const lock = at(b, 2, d, 0.62);
  const drop = interpolate(frame, [lock, lock + 10], [-700, 0], { ...clamp, easing: Easing.in(Easing.quad) });
  const impact = interpolate(frame, [lock + 10, lock + 13, lock + 18], [0, 1, 0], clamp);
  const shake = Math.sin(frame * 2.2) * 10 * impact + (frame > prob && frame < lock ? Math.sin(frame * 1.4) * 3 : 0);
  const grey = ease(frame, lock + 10, 12);
  return (
    <AbsoluteFill>
      <Backdrop plate={IMG("p2.jpg")} plateOpacity={0.25} />
      <AbsoluteFill style={{ translate: `${shake}px ${impact * 8}px` }}>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 330,
            width: 780,
            height: 470,
            scale: String(pop(frame, 2, 16)),
            filter: `grayscale(${grey}) drop-shadow(0 30px 50px rgba(0,0,0,0.5))`,
          }}
        >
          <svg width="780" height="560" viewBox="0 0 100 72" style={{ position: "absolute", inset: 0 }}>
            <path d="M10 2h80a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8H40L26 70l3-12H10a8 8 0 0 1-8-8V10a8 8 0 0 1 8-8Z" fill={K.paper} />
          </svg>
          <div style={{ position: "absolute", left: 80, top: 90, display: "grid", gap: 34, width: 600 }}>
            {[100, 86, 64].map((w, i) => (
              <div key={i} style={{ height: 34, width: `${w * ease(frame, 6 + i * 4, 14)}%`, borderRadius: 17, background: i === 2 ? K.mute : K.ink }} />
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              right: -30,
              top: -40,
              width: 140,
              height: 140,
              borderRadius: 70,
              background: K.paper,
              border: `8px solid ${K.ink}`,
              scale: String(pop(frame, ok, 12) * (1 - ease(frame, lock, 8))),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="check" size={100} accent={K.ink} />
          </div>
        </div>
        <svg width="300" height="360" viewBox="0 0 300 360" style={{ position: "absolute", left: 390, top: 560, translate: `0 ${drop}px`, opacity: frame >= lock ? 1 : 0 }}>
          <path
            d="M80 160 V100 a70 70 0 0 1 140 0 V160"
            fill="none"
            stroke={K.paperShade}
            strokeWidth={30}
            strokeLinecap="round"
            style={{ translate: `0 ${(1 - ease(frame, lock + 12, 8)) * -40}px` }}
          />
          <rect x="30" y="150" width="240" height="190" rx="30" fill={K.orange} style={{ filter: `drop-shadow(0 0 30px ${K.orange})` }} />
          <circle cx="150" cy="230" r="24" fill={K.ink} />
          <rect x="140" y="240" width="20" height="50" rx="8" fill={K.ink} />
        </svg>
      </AbsoluteFill>
      <Character src={IMG("c2.png")} x={540} y={1000} width={520} />
      <Label text={"CONDIÇÃO\nPARA FALAR"} at={lock + 16} x={540} y={1300} rot={-3} size={110} tone="orange" />
    </AbsoluteFill>
  );
};

// ── Defesa do caráter: labels bounce off a shield ──────────────────
export const Defesa: React.FC<SceneProps> = ({ d, b }) => {
  const frame = useCurrentFrame();
  const shield = at(b, 0, d, 0.4);
  const hits = [
    { t: "EGOÍSTA", from: [-500, 260], to: [320, 600], a: at(b, 1, d, 0.7) },
    { t: "ARROGANTE", from: [1580, 380], to: [770, 720], a: at(b, 2, d, 0.78) },
    { t: "INCONVENIENTE", from: [540, -300], to: [540, 520], a: at(b, 3, d, 0.86) },
  ];
  const sp = pop(frame, shield, 16);
  return (
    <AbsoluteFill>
      <Backdrop glow={K.orange} />
      <Label text={"PREFERÊNCIA\nSIMPLES"} at={at(b, 4, d, 0.05)} outAt={shield - 6} x={540} y={430} rot={-3} size={110} />
      <svg width="560" height="660" viewBox="0 0 100 118" style={{ position: "absolute", left: 260, top: 420, scale: String(sp), filter: `drop-shadow(0 0 ${30 + 20 * Math.sin(frame / 8)}px ${K.orange}88)` }}>
        <path d="M50 3 L94 18 V54 C94 84 74 104 50 115 C26 104 6 84 6 54 V18 Z" fill={K.bg2} stroke={K.orange} strokeWidth={5} />
        <path d="M50 14 L84 26 V54 C84 78 68 94 50 103 C32 94 16 78 16 54 V26 Z" fill="none" stroke={K.paper} strokeWidth={2} opacity={0.5} />
        <text x="50" y="68" textAnchor="middle" fontFamily={COND} fontWeight={900} fontSize="16" fill={K.paper} letterSpacing="1">
          DEFESA
        </text>
        <text x="50" y="84" textAnchor="middle" fontFamily={COND} fontWeight={800} fontSize="11" fill={K.orange} letterSpacing="1">
          DO CARÁTER
        </text>
      </svg>
      {hits.map((h) => {
        const fly = interpolate(frame, [h.a, h.a + 9], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        const back = ease(frame, h.a + 9, 18);
        const x = h.from[0] + (h.to[0] - h.from[0]) * fly + (h.to[0] - 540) * 1.2 * back;
        const y = h.from[1] + (h.to[1] - h.from[1]) * fly + 320 * back;
        return (
          <div key={h.t} style={{ position: "absolute", inset: 0, opacity: frame < h.a ? 0 : 1 - back * 0.85 }}>
            <Label text={h.t} at={h.a - 1} x={x} y={y} rot={-8 + back * 40} size={86} tone="glass" from="zoom" />
          </div>
        );
      })}
      <Character src={IMG("c7.png")} x={540} y={1100} width={760} />
    </AbsoluteFill>
  );
};

// ── Label storm (Será que…? / final hook) ──────────────────────────
export const LabelStorm: React.FC<
  SceneProps & { labels: string[]; question?: boolean; cta?: string; char?: string; charX?: number; charW?: number }
> = ({ d, b, labels, question, cta, char = "c10.png", charX = 860, charW = 700 }) => {
  const frame = useCurrentFrame();
  const pos = [
    { x: 330, y: 470, r: -6 },
    { x: 770, y: 570, r: 5 },
    { x: 310, y: 770, r: 4 },
    { x: 760, y: 880, r: -5 },
  ];
  const q = at(b, labels.length, d, 0.72);
  const qp = question ? pop(frame, q, 16) : 0;
  const push = question ? interpolate(frame, [q, q + 30], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) }) : 0;
  return (
    <AbsoluteFill>
      <Backdrop glow={K.orange} plate={IMG("p10.jpg")} plateOpacity={0.3} />
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, d], [1.0, 1.14], clamp)) }}>
        <Orbit cx={540} cy={700} rx={500} ry={380} at={4} tilt={-14} arc={0.35} width={5} opacity={0.8} />
        {labels.map((t, i) => {
          const p = pos[i % pos.length];
          return (
            <Label
              key={t}
              text={t}
              at={at(b, i, d, 0.08 + i * 0.14)}
              x={540 + (p.x - 540) * (1 + push * 0.8)}
              y={700 + (p.y - 700) * (1 + push * 0.8)}
              rot={p.r}
              size={104}
              tone={i % 2 ? "orange" : "glass"}
              style={{ opacity: 1 - push * 0.75 }}
            />
          );
        })}
        <Character src={IMG(char)} x={charX} y={980} width={charW} />
      </AbsoluteFill>
      {question && (
        <div
          style={{
            position: "absolute",
            left: 540 - 150,
            top: 1100,
            width: 300,
            height: 250,
            borderRadius: 18,
            border: `5px solid ${K.orangeHi}`,
            background: "rgba(242,107,58,0.22)",
            boxShadow: `0 0 ${40 + qp * 40}px ${K.orange}`,
            scale: String(qp * (1 + interpolate(frame, [q, d], [0, 0.35], clamp))),
            rotate: "-4deg",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: COND,
            fontWeight: 900,
            fontSize: 200,
            color: K.paper,
          }}
        >
          ?
        </div>
      )}
      {cta && (
        <div
          style={{
            position: "absolute",
            top: 250,
            width: "100%",
            textAlign: "center",
            fontFamily: COND,
            fontWeight: 800,
            fontStyle: "italic",
            fontSize: 76,
            letterSpacing: 6,
            color: K.orange,
            opacity: ease(frame, q + 20, 14),
            textShadow: `0 0 30px ${K.orange}66`,
          }}
        >
          {cta}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ── Mal interpretado: the sentence gets redacted ───────────────────
export const Redacao: React.FC<SceneProps> = ({ d, b }) => {
  const frame = useCurrentFrame();
  const lines = ["EU DISCORDO", "DISSO E PENSO", "DIFERENTE."];
  const stamp = at(b, 3, d, 0.75);
  const sp = interpolate(frame, [stamp, stamp + 6, stamp + 10], [2.2, 0.92, 1], clamp);
  return (
    <AbsoluteFill>
      <Backdrop />
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 380,
          width: 860,
          height: 760,
          background: `linear-gradient(170deg, ${K.paper}, ${K.paperShade})`,
          boxShadow: "0 40px 80px rgba(0,0,0,0.55)",
          rotate: "-2deg",
          padding: "70px 70px",
          opacity: ease(frame, 0, 12),
          translate: `0 ${(1 - ease(frame, 0, 16)) * 120}px`,
        }}
      >
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: K.mute, letterSpacing: 4, marginBottom: 30 }}>O QUE EU REALMENTE PENSO:</div>
        {lines.map((l, i) => {
          const r = ease(frame, at(b, i, d, 0.2 + i * 0.18), 10);
          return (
            <div key={l} style={{ position: "relative", marginBottom: 26 }}>
              <div style={{ fontFamily: COND, fontWeight: 900, fontSize: 132, lineHeight: 1, color: K.ink }}>{l}</div>
              <div style={{ position: "absolute", left: -10, top: 4, height: 124, width: `${r * 104}%`, background: K.ink, boxShadow: "0 6px 0 rgba(0,0,0,0.2)" }} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 1170,
          rotate: "-10deg",
          border: `10px solid ${K.orange}`,
          color: K.orange,
          fontFamily: COND,
          fontWeight: 900,
          fontSize: 120,
          padding: "0 30px",
          letterSpacing: 6,
          opacity: frame >= stamp ? 0.95 : 0,
          scale: String(sp),
          textShadow: `0 0 20px ${K.orange}66`,
        }}
      >
        AUTOCENSURA
      </div>
    </AbsoluteFill>
  );
};

// ── Editar tanto: an editor that types and then deletes ────────────
export const Editor: React.FC<SceneProps> = ({ d, b }) => {
  const frame = useCurrentFrame();
  const price = at(b, 0, d, 0.08);
  const edit = at(b, 1, d, 0.25);
  const wipe = at(b, 2, d, 0.75);
  const full = "Eu penso que isso não está certo.";
  const soft = "Talvez… não sei… desculpa.";
  let text = "";
  if (frame < edit) text = full.slice(0, Math.floor(interpolate(frame, [price + 6, edit - 4], [0, full.length], clamp)));
  else if (frame < edit + 18) text = full.slice(0, Math.max(0, full.length - Math.floor((frame - edit) * 2)));
  else if (frame < wipe) text = soft.slice(0, Math.floor(interpolate(frame, [edit + 18, wipe - 10], [0, soft.length], clamp)));
  else text = soft.slice(0, Math.max(0, soft.length - Math.floor((frame - wipe) * 1.5)));
  const empty = frame > wipe + soft.length / 1.5;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Label text={"TEM UM\nPREÇO"} at={price} outAt={edit - 8} x={540} y={400} rot={-4} size={130} tone="orange" />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 620,
          width: 920,
          borderRadius: 36,
          background: "#11191E",
          border: "2px solid #2B3A42",
          boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
          opacity: ease(frame, 2, 14),
          scale: String(0.9 + 0.1 * ease(frame, 2, 14)),
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", gap: 14, padding: "24px 30px", borderBottom: "2px solid #22303A", alignItems: "center" }}>
          {[K.orange, "#E8B04A", "#5FB37A"].map((c) => (
            <span key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
          ))}
          <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: K.mute, marginLeft: 16 }}>o que eu ia dizer.txt</span>
        </div>
        <div style={{ padding: "50px 46px 70px", minHeight: 300, fontFamily: SANS, fontWeight: 600, fontSize: 60, lineHeight: 1.25, color: K.paper }}>
          {text}
          <span style={{ color: K.orange, opacity: frame % 16 < 9 ? 1 : 0 }}>|</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1150,
          width: "100%",
          textAlign: "center",
          fontFamily: COND,
          fontWeight: 900,
          fontSize: 92,
          color: K.paper,
          letterSpacing: 2,
          opacity: empty ? ease(frame, Math.ceil(wipe + soft.length / 1.5), 14) : 0,
        }}
      >
        SEM <span style={{ color: K.orange }}>NATURALIDADE</span>
      </div>
      <Bubble icon="scribble" at={edit} x={930} y={560} size={150} outAt={wipe} />
    </AbsoluteFill>
  );
};
