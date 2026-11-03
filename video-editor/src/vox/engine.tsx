import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { FPS, SANS, V, clamp } from "./theme";
import { Sfx } from "./kit";

type Tok = { text: string; startMs: number };
export type Word = { text: string; norm: string; start: number; end: number };

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

export const buildWords = (tokens: Tok[]): Word[] => {
  const out: Word[] = [];
  for (const t of tokens) {
    if (!t.text.trim()) continue;
    if (/^\s/.test(t.text) || !out.length) out.push({ text: t.text.trim(), norm: "", start: t.startMs / 1000, end: 0 });
    else out[out.length - 1].text += t.text.trim();
  }
  out.forEach((w, i) => {
    w.norm = norm(w.text);
    w.end = Math.min(out[i + 1]?.start ?? w.start + 0.5, w.start + 0.8);
  });
  return out.filter((w) => w.norm);
};

// Seconds where `phrase` starts, searching from `after` seconds. Throws when missing so a bad cue fails loudly.
export const makeCue = (words: Word[]) => (phrase: string, after = 0) => {
  const p = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    if (words[i].start + 0.01 < after) continue;
    if (p.every((t, k) => words[i + k]?.norm === t)) return words[i].start;
  }
  throw new Error(`cue not found: "${phrase}" after ${after}s`);
};

export type Ctx = {
  d: number; // scene length in frames (incl. lead/tail)
  f: (sec: number) => number; // absolute seconds → local frame
  cue: (phrase: string, after?: number) => number; // phrase → local frame
  start: number; // scene start (s)
};
export type SceneDef = { at: string | number; C: React.FC<Ctx> };

const LEAD = 10;

const SceneIn: React.FC<{ first: boolean; children: React.ReactNode }> = ({ first, children }) => {
  const f = useCurrentFrame();
  const p = first ? 1 : interpolate(f, [0, LEAD + 4], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return (
    <AbsoluteFill style={{ opacity: interpolate(p, [0, 0.45], [0, 1], clamp), scale: String(1.1 - 0.1 * p), filter: p < 0.98 ? `blur(${(1 - p) * 16}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

const Captions: React.FC<{ words: Word[]; keys: Set<string>; hide: Array<[number, number]> }> = ({ words, keys, hide }) => {
  const pages: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    const prev = words[i - 1];
    if (cur.length && (cur.length >= 4 || w.start - prev.end > 0.35 || /[.,!?:]["”]?$/.test(prev.text))) {
      pages.push(cur);
      cur = [];
    }
    cur.push(w);
  });
  if (cur.length) pages.push(cur);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((pg, i) => {
        const from = Math.round(pg[0].start * FPS);
        if (hide.some(([a, b]) => pg[0].start >= a && pg[0].start < b)) return null;
        const next = pages[i + 1] ? Math.round(pages[i + 1][0].start * FPS) : from + 40;
        const end = Math.min(next, Math.round((pg[pg.length - 1].end + 0.6) * FPS));
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, end - from)} layout="none">
            <Page words={pg} keys={keys} t0={pg[0].start} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Page: React.FC<{ words: Word[]; keys: Set<string>; t0: number }> = ({ words, keys, t0 }) => {
  const f = useCurrentFrame();
  const now = t0 + f / FPS;
  const p = interpolate(f, [0, 4], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ top: 1530, height: 200, justifyContent: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px", padding: "0 80px", opacity: p, translate: `0 ${(1 - p) * 12}px` }}>
        {words.map((w, i) => {
          const k = keys.has(w.norm);
          const on = now >= w.start - 0.03;
          return (
            <span
              key={i}
              style={{
                fontFamily: SANS,
                fontWeight: k ? 800 : 650,
                fontSize: 50,
                lineHeight: 1.15,
                color: k ? V.cyan : V.white,
                opacity: on ? 1 : 0.42,
                textShadow: "0 3px 14px rgba(0,0,0,0.85)",
              }}
            >
              {w.text.replace(/[“”"]/g, "")}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const VoxVideo: React.FC<{ audio: string; tokens: Tok[]; scenes: SceneDef[]; keys: string[]; duration: number; noCaptions?: Array<[string, string]> }> = ({
  audio,
  tokens,
  scenes,
  keys,
  duration,
  noCaptions = [],
}) => {
  const words = buildWords(tokens);
  const cueSec = makeCue(words);
  const starts = scenes.map((s, i) => (i === 0 ? 0 : typeof s.at === "number" ? s.at : cueSec(s.at) - 0.12));
  const keySet = new Set(keys.map(norm));
  const hide = noCaptions.map(([a, b]) => [cueSec(a), cueSec(b)] as [number, number]);
  return (
    <AbsoluteFill style={{ backgroundColor: V.navy0 }}>
      {scenes.map(({ C }, i) => {
        const start = starts[i];
        const end = i + 1 < scenes.length ? starts[i + 1] : duration;
        const lead = i === 0 ? 0 : LEAD;
        const from = Math.round(start * FPS) - lead;
        const d = Math.round((end - start) * FPS) + lead + LEAD;
        const f = (sec: number) => Math.round((sec - start) * FPS) + lead;
        const ctx: Ctx = { d, f, cue: (ph, after) => f(cueSec(ph, after ?? Math.max(0, start - 1.5))), start };
        return (
          <Sequence key={i} from={from} durationInFrames={d} layout="none">
            <SceneIn first={i === 0}>
              <C {...ctx} />
            </SceneIn>
          </Sequence>
        );
      })}
      {starts.slice(1).map((s, i) => (
        <Sfx key={i} at={s * FPS - 6} src="whoosh" volume={0.1} />
      ))}
      <Captions words={words} keys={keySet} hide={hide} />
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};
