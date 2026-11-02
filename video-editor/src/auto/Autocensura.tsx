import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import tokens from "../../public/autocensura/voz-captions.json";
import { COND, FPS, K, clamp } from "./theme";
import { Grain } from "./kit";
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, SceneProps } from "./scenes";
import { Condicao, Defesa, Editor, LabelStorm, Redacao } from "./scenes2";

const Serasque: React.FC<SceneProps> = (p) => (
  <LabelStorm {...p} labels={["ARROGANTE?", "CHATEADO?", "DIFÍCIL?"]} char="c1.png" charX={540} charW={980} />
);
const Final: React.FC<SceneProps> = (p) => (
  <LabelStorm {...p} labels={["ARROGANTE", "DIFÍCIL", "CHATO", "EGOÍSTA"]} question cta="CONTINUA…" />
);

// [component, start s, end s, beats (absolute seconds)]
const TIMELINE: Array<[React.FC<SceneProps>, number, number, number[]]> = [
  [S1, 0, 8.0, [2.2]],
  [S2, 8.0, 20.6, [18.8, 14.5, 16.0, 17.2, 18.1, 10.3]],
  [Condicao, 20.6, 29.3, [24.1, 25.3, 26.4]],
  [S3, 29.3, 38.6, [31.4, 35.5, 37.1, 32.0]],
  [S4, 38.6, 44.4, [38.8, 43.0]],
  [S5, 44.4, 49.0, [46.7]],
  [S7, 49.0, 55.0, [52.5, 49.8]],
  [S6, 55.0, 58.2, [56.4]],
  [Defesa, 58.2, 64.4, [61.0, 62.9, 63.4, 63.8, 58.5]],
  [S8, 64.4, 73.6, [72.5, 67.7]],
  [Serasque, 73.6, 78.6, [74.4, 75.6, 77.0]],
  [Redacao, 78.6, 84.1, [80.0, 81.6, 82.6, 83.3]],
  [Editor, 84.1, 91.4, [84.5, 85.8, 89.6]],
  [S9, 91.4, 107.5, [92.7, 102.6, 103.1, 103.8, 105.8, 96.0, 97.9]],
  [Final, 107.5, 116.5, [108.2, 108.8, 109.4, 110.0, 112.1]],
];

export const AUTO_FRAMES = Math.round(116.5 * FPS);
const OVERLAP = 8;

const SceneIn: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, OVERLAP + 2], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(p, [0, 0.5], [0, 1], clamp),
        scale: String(1.14 - 0.14 * p),
        filter: p < 0.98 ? `blur(${(1 - p) * 26}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Sweep: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 12], [-1400, 1600], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: -400, left: x, width: 220, height: 2800, rotate: "18deg", background: K.orange, boxShadow: `0 0 80px ${K.orange}` }} />
      <div style={{ position: "absolute", top: -400, left: x - 120, width: 40, height: 2800, rotate: "18deg", background: K.paper, opacity: 0.8 }} />
    </AbsoluteFill>
  );
};

// ── Captions ───────────────────────────────────────────────────────
type W = { text: string; start: number; end: number };
const WORDS: W[] = (() => {
  const out: W[] = [];
  for (const t of tokens as Array<{ text: string; startMs: number }>) {
    if (!t.text.trim()) continue;
    if (/^\s/.test(t.text) || !out.length) out.push({ text: t.text.trim(), start: t.startMs / 1000, end: 0 });
    else out[out.length - 1].text += t.text.trim();
  }
  out.forEach((w, i) => (w.end = Math.min(out[i + 1]?.start ?? w.start + 0.5, w.start + 0.8)));
  return out;
})();

const KEY = new Set(
  "aprovação errado talvez sentido condição reunião opinião diferente 5 20 não justificativa enorme sorrindo egoísta arrogante inconveniente negociação difícil chateado preço editar naturalidade posicionar explicações desculpas existir personagem autorização imagem interpretado caráter".split(" "),
);
const norm = (w: string) => w.toLowerCase().replace(/[.,!?"“”…]/g, "");

const PAGES: W[][] = (() => {
  const pages: W[][] = [];
  let cur: W[] = [];
  WORDS.forEach((w, i) => {
    const prev = WORDS[i - 1];
    if (cur.length && (cur.length >= 3 || w.start - prev.end > 0.3 || /[.,!?]["”]?$/.test(prev.text))) {
      pages.push(cur);
      cur = [];
    }
    cur.push(w);
  });
  if (cur.length) pages.push(cur);
  return pages;
})();

const CaptionPage: React.FC<{ words: W[]; t0: number }> = ({ words, t0 }) => {
  const frame = useCurrentFrame();
  const now = t0 + frame / FPS;
  const p = interpolate(frame, [0, 4], [0, 1], clamp);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 20px",
        padding: "0 70px",
        opacity: p,
        translate: `0 ${(1 - p) * 16}px`,
      }}
    >
      {words.map((w, i) => {
        const key = KEY.has(norm(w.text));
        const on = now >= w.start - 0.03;
        const s = interpolate(now, [w.start, w.start + 0.1], [0.82, 1], clamp);
        return (
          <span
            key={i}
            style={{
              fontFamily: COND,
              fontWeight: 800,
              fontSize: key ? 92 : 76,
              lineHeight: 1.05,
              textTransform: "uppercase",
              color: key ? K.orange : K.white,
              opacity: on ? 1 : 0.4,
              scale: String(on ? s : 0.9),
              display: "inline-block",
              textShadow: key ? `0 0 26px ${K.orange}66, 0 4px 14px rgba(0,0,0,0.8)` : "0 4px 14px rgba(0,0,0,0.85)",
            }}
          >
            {w.text.replace(/[“”"]/g, "")}
          </span>
        );
      })}
    </div>
  );
};

const Captions: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 70%, rgba(5,12,16,0.65) 82%, rgba(5,12,16,0.65) 90%, transparent 100%)" }} />
    {PAGES.map((pg, i) => {
      const from = Math.round(pg[0].start * FPS);
      const next = PAGES[i + 1] ? Math.round(PAGES[i + 1][0].start * FPS) : from + 30;
      const end = Math.min(next, Math.round((pg[pg.length - 1].end + 0.5) * FPS));
      return (
        <Sequence key={i} from={from} durationInFrames={Math.max(1, end - from)} layout="none">
          <AbsoluteFill style={{ top: 1500, height: 230, justifyContent: "center" }}>
            <CaptionPage words={pg} t0={pg[0].start} />
          </AbsoluteFill>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 0.3 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

export const Autocensura: React.FC = () => {
  const sfx: Array<[number, string, number]> = [];
  TIMELINE.forEach(([, start, , beats], i) => {
    if (i > 0) sfx.push([start * FPS - 4, i % 2 ? "whoosh" : "whip", 0.22]);
    beats.forEach((t) => sfx.push([t * FPS, "switch", 0.16]));
  });
  sfx.push([43.0 * FPS, "ding", 0.25], [26.4 * FPS + 10, "shutter-modern", 0.35], [83.3 * FPS, "shutter-modern", 0.35], [2.2 * FPS, "whip", 0.3]);
  [85.0, 85.4, 85.8, 86.6, 87.4, 89.8, 90.2].forEach((t) => sfx.push([t * FPS, "mouse-click", 0.25]));

  return (
    <AbsoluteFill style={{ backgroundColor: K.bg0 }}>
      {TIMELINE.map(([Comp, start, end, beats], i) => {
        const lead = i === 0 ? 0 : OVERLAP;
        const from = Math.round(start * FPS) - lead;
        const d = Math.round((end - start) * FPS) + lead + OVERLAP;
        const b = beats.map((t) => Math.round((t - start) * FPS) + lead);
        return (
          <Sequence key={i} from={from} durationInFrames={d} layout="none">
            <SceneIn first={i === 0}>
              <Comp d={d} b={b} />
            </SceneIn>
          </Sequence>
        );
      })}
      {TIMELINE.slice(1).map(([, start], i) => (
        <Sequence key={`sw${i}`} from={Math.round(start * FPS) - 8} durationInFrames={14} layout="none">
          <Sweep />
        </Sequence>
      ))}
      <Captions />
      <Grain />
      <Audio src={staticFile("autocensura/voz-1.5x.wav")} />
      {sfx.map(([f, s, v], i) => (
        <Sfx key={i} at={f} src={s} volume={v} />
      ))}
    </AbsoluteFill>
  );
};
