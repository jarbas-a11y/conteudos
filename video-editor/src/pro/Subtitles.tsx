import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, INTER, SERIF, clamp } from "./theme";
import { MotionBlur } from "./primitives";

type Word = { text: string; start: number; end: number };

const EMPHASIS = new Set(["rico", "antes", "valor", "argumento", "caro", "percepção", "ideia", "comunicação", "oportunidades", "mais", "melhor"]);

const clean = (w: string) => w.toLowerCase().replace(/[.,!?;:]/g, "");

const buildPages = (words: Word[], maxWords = 3, maxGap = 0.35) => {
  const pages: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const breakHere = cur.length >= maxWords || (prev && (w.start - prev.end > maxGap || /[.,!?]$/.test(prev.text)));
    if (breakHere && cur.length) {
      pages.push(cur);
      cur = [];
    }
    cur.push(w);
    if (EMPHASIS.has(clean(w.text))) {
      pages.push(cur);
      cur = [];
    }
  });
  if (cur.length) pages.push(cur);
  return pages;
};

const Page: React.FC<{ words: Word[]; t0: number }> = ({ words, t0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [0, 5], [0, 1], { ...clamp });
  const now = t0 + frame / fps;
  return (
    <MotionBlur
      x={0}
      y={(1 - p) * 6}
      style={{
        opacity: p,
        translate: `0 ${(1 - p) * 14}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        gap: 16,
        flexWrap: "wrap",
        padding: "0 90px",
      }}
    >
      {words.map((w, i) => {
        const emph = EMPHASIS.has(clean(w.text));
        const spoken = now >= w.start - 0.02;
        const pop = interpolate(now, [w.start, w.start + 0.12], [0.6, 1], clamp);
        return (
          <span
            key={i}
            style={{
              fontFamily: emph ? SERIF : INTER,
              fontStyle: emph ? "italic" : "normal",
              fontWeight: emph ? 400 : 600,
              fontSize: emph ? 96 : 54,
              lineHeight: 1.05,
              letterSpacing: emph ? 0 : -1,
              color: emph ? C.lime : C.white,
              opacity: spoken ? 1 : 0.55,
              scale: emph ? String(pop) : undefined,
              textShadow: emph ? `0 0 28px rgba(0,0,0,0.55), 0 0 22px ${C.lime}55` : "0 2px 14px rgba(0,0,0,0.55)",
            }}
          >
            {clean(w.text)}
          </span>
        );
      })}
    </MotionBlur>
  );
};

export const Subtitles: React.FC<{ words: Word[]; hidden: Array<[number, number]> }> = ({ words, hidden }) => {
  const { fps } = useVideoConfig();
  const visible = words.filter((w) => !hidden.some(([a, b]) => w.start >= a - 0.05 && w.start < b));
  const pages = buildPages(visible);
  return (
    <AbsoluteFill>
      {pages.map((pg, i) => {
        const start = pg[0].start;
        const next = pages[i + 1]?.[0].start ?? Infinity;
        const block = hidden.find(([a]) => a > start)?.[0] ?? Infinity;
        const end = Math.min(next, block, pg[pg.length - 1].end + 0.6);
        const from = Math.round(start * fps);
        const dur = Math.max(1, Math.round(end * fps) - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <AbsoluteFill style={{ top: 1290, height: 260, justifyContent: "center" }}>
              <Page words={pg} t0={start} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
