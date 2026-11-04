import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { DISPLAY, FPS, P, SERIF, clamp, ease } from "./theme";
import { Grain, Sfx } from "./kit";

type Tok = { text: string; startMs: number };
export type Word = { text: string; show: string; norm: string; start: number; end: number; punct: string };

export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

export const buildWords = (tokens: Tok[]): Word[] => {
  const out: Word[] = [];
  for (const t of tokens) {
    if (!t.text.trim()) continue;
    if (/^\s/.test(t.text) || !out.length) out.push({ text: t.text.trim(), show: "", norm: "", start: t.startMs / 1000, end: 0, punct: "" });
    else out[out.length - 1].text += t.text.trim();
  }
  out.forEach((w, i) => {
    w.norm = norm(w.text);
    w.show = w.text.replace(/["“”]/g, "").replace(/[.,:;!?]+$/g, "");
    w.punct = (w.text.match(/[.,:;!?]+["”]?$/) ?? [""])[0];
    w.end = Math.min(out[i + 1]?.start ?? w.start + 0.6, w.start + 0.9);
  });
  // merge pure-punctuation tokens into previous word
  const res: Word[] = [];
  for (const w of out) {
    if (!w.norm) {
      if (res.length) res[res.length - 1].punct += w.text;
      continue;
    }
    res.push(w);
  }
  return res;
};

export const makeCue = (words: Word[]) => (phrase: string, after = 0) => {
  const p = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    if (words[i].start + 0.01 < after) continue;
    if (p.every((t, k) => words[i + k]?.norm === t)) return words[i].start;
  }
  throw new Error(`cue not found: "${phrase}" after ${after}s`);
};

export type Ctx = {
  d: number; // scene length in frames
  f: (sec: number) => number; // absolute seconds → local frame
  cue: (phrase: string, after?: number) => number; // phrase (searched from scene start) → local frame
  start: number;
};

export type CapLayout = { y: number; align?: "center" | "left"; scale?: number; x?: number; w?: number } | "hidden";
export type Tr = "whip" | "zoom" | "cut" | "up" | "flash";
export type SceneDef = { at: string | number; C: React.FC<Ctx>; cap?: CapLayout; tr?: Tr; z?: number };

export const TOP: CapLayout = { y: 360 };
export const MID: CapLayout = { y: 880 };
export const LOW: CapLayout = { y: 1430 };

export type Style = "serif" | "box" | "cyan" | "strike" | "big" | "lav";

/* ───────────────────────── Kinetic captions ───────────────────────── */

type Page = { words: Word[]; from: number; to: number; layout: Exclude<CapLayout, "hidden"> };

const charW = (s: Style | undefined) => (s === "serif" ? 0.44 : 0.56);

const KWord: React.FC<{ w: Word; at: number; style?: Style; size: number; color: string; weight: number }> = ({ w, at, style, size, color, weight }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, 7, Easing.out(Easing.exp));
  if (f < at - 1) return <span style={{ display: "inline-block", opacity: 0, fontSize: size, fontFamily: style === "serif" ? SERIF : DISPLAY }}>{w.show}&nbsp;</span>;
  const serif = style === "serif";
  const boxP = ease(f, at - 2, 7, Easing.out(Easing.cubic));
  const strikeP = ease(f, at + 9, 7);
  const ul = ease(f, at + 5, 12, Easing.inOut(Easing.cubic));
  const base: React.CSSProperties = {
    display: "inline-block",
    position: "relative",
    fontFamily: serif ? SERIF : DISPLAY,
    fontStyle: serif ? "italic" : "normal",
    fontWeight: serif ? 400 : weight,
    fontSize: size,
    lineHeight: 1.02,
    letterSpacing: serif ? -size * 0.01 : -size * 0.035,
    color,
    opacity: Math.min(1, p * 1.4),
    transform: serif ? `translateX(${(1 - p) * 40}px) skewX(${(1 - p) * -12}deg)` : `translateY(${(1 - p) * 0.4 * size}px) scale(${0.92 + 0.08 * p})`,
    filter: p < 0.97 ? `blur(${(1 - p) * 14}px)` : undefined,
    textShadow: style === "cyan" ? `0 0 40px ${P.cyan}88` : "0 6px 30px rgba(0,0,0,0.6)",
    padding: style === "box" ? `0 ${size * 0.16}px` : undefined,
    margin: style === "box" ? `${size * 0.06}px ${size * 0.06}px` : undefined,
    zIndex: 1,
  };
  return (
    <>
      <span style={base}>
        {style === "box" && (
          <span style={{ position: "absolute", inset: `${size * 0.04}px 0 ${size * 0.02}px 0`, borderRadius: size * 0.14, background: `linear-gradient(100deg, ${P.violet}, #5B3FE0)`, transformOrigin: "0 50%", transform: `scaleX(${boxP})`, zIndex: -1, boxShadow: `0 10px 40px ${P.violet}77` }} />
        )}
        {w.show}
        {style === "strike" && <span style={{ position: "absolute", left: -6, top: "54%", height: size * 0.09, width: `calc(${strikeP * 100}% + 12px)`, background: P.danger, borderRadius: 6, boxShadow: `0 0 20px ${P.danger}` }} />}
        {serif && (
          <svg style={{ position: "absolute", left: 0, bottom: -size * 0.12, width: "100%", height: size * 0.22, overflow: "visible" }} viewBox="0 0 100 20" preserveAspectRatio="none">
            <path d="M2 14 C 30 4, 60 4, 98 10" pathLength={1} fill="none" stroke={P.cyan} strokeWidth={3} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - ul} vectorEffect="non-scaling-stroke" style={{ strokeWidth: 5 }} />
          </svg>
        )}
      </span>
      {w.punct.includes("?") ? <span style={{ ...base, marginLeft: -size * 0.12, opacity: base.opacity }}>?</span> : null}
      <span style={{ display: "inline-block", width: size * 0.24 }} />
    </>
  );
};

const KPage: React.FC<{ pg: Page; emph: Record<string, Style> }> = ({ pg, emph }) => {
  const f = useCurrentFrame(); // local to page
  const dur = pg.to - pg.from;
  const out = interpolate(f, [dur - 5, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const styles = pg.words.map((w) => emph[w.norm]);
  const hasEmph = styles.some(Boolean);
  const L = pg.layout;
  const W = (L.w ?? 960) * (L.scale ?? 1);
  // size: emphasised words big, the rest small ("ele não foi / EDITADO")
  const emphChars = Math.max(...pg.words.map((w, i) => (styles[i] ? w.show.length * charW(styles[i]) : 0)), 0.1);
  const bigSize = Math.min(styles.includes("serif") ? 230 : 190, W / Math.max(emphChars + 0.4, 1)) * (L.scale ?? 1);
  const total = pg.words.reduce((s, w) => s + w.show.length + 1, 0);
  const longest = Math.max(...pg.words.map((w) => w.show.length));
  const plainSize = Math.min(136, W / (Math.max(longest + 1, total / 2.1) * 0.56)) * (L.scale ?? 1);
  const smallSize = Math.min(84, plainSize * 0.66);
  return (
    <div
      style={{
        position: "absolute",
        left: L.x ?? (1080 - W) / 2,
        width: W,
        top: L.y,
        translate: "0 -50%",
        textAlign: L.align ?? "center",
        opacity: 1 - out,
        transform: `translateY(${-out * 50}px)`,
        filter: out > 0 ? `blur(${out * 12}px)` : undefined,
      }}
    >
      {pg.words.map((w, i) => {
        const st = styles[i];
        const at = Math.round(w.start * FPS) - pg.from - 2;
        const size = st ? bigSize : hasEmph ? smallSize : plainSize;
        const color = st === "serif" ? P.lav : st === "cyan" ? P.cyan : st === "lav" ? P.lav : hasEmph && !st ? "#C9CFEA" : P.white;
        const brk = st && hasEmph && pg.words.length > 1;
        return (
          <React.Fragment key={i}>
            {brk && i > 0 && !styles[i - 1] ? <br /> : null}
            <KWord w={w} at={at} style={st} size={size} color={color} weight={st ? 800 : hasEmph ? 600 : 800} />
            {brk && i < pg.words.length - 1 && !styles[i + 1] ? <br /> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const buildPages = (words: Word[], bounds: number[], layoutAt: (sec: number) => CapLayout, hold: number): Page[] => {
  const groups: Word[][] = [];
  let cur: Word[] = [];
  let chars = 0;
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const crossesScene = prev && bounds.some((b) => prev.start < b - 0.05 && w.start >= b - 0.13);
    const breakNow =
      cur.length &&
      (crossesScene ||
        /[.?!]/.test(prev.punct) ||
        (/[,:;]/.test(prev.punct) && cur.length >= 2) ||
        cur.length >= 4 ||
        chars + w.show.length > 20 ||
        w.start - prev.end > 0.45);
    if (breakNow) {
      groups.push(cur);
      cur = [];
      chars = 0;
    }
    cur.push(w);
    chars += w.show.length + 1;
  });
  if (cur.length) groups.push(cur);
  const pages: Page[] = [];
  groups.forEach((g, i) => {
    const lay = layoutAt(g[0].start + 0.05);
    if (lay === "hidden") return;
    const from = Math.round(g[0].start * FPS) - 3;
    const nextStart = groups[i + 1] ? Math.round(groups[i + 1][0].start * FPS) - 3 : Infinity;
    const lastEnd = Math.round((g[g.length - 1].end + hold) * FPS);
    pages.push({ words: g, from, to: Math.min(nextStart, lastEnd), layout: lay });
  });
  return pages;
};

/* ───────────────────────── Scene transitions ───────────────────────── */

const TR = 9;

const SceneWrap: React.FC<{ dur: number; trIn: Tr | null; trOut: Tr | null; children: React.ReactNode }> = ({ dur, trIn, trOut, children }) => {
  const f = useCurrentFrame();
  const pin = trIn ? interpolate(f, [0, TR], [0, 1], { ...clamp, easing: Easing.out(Easing.exp) }) : 1;
  const pout = trOut ? interpolate(f, [dur, dur + TR], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) }) : 0;
  let tf = "";
  let op = 1;
  let blur = 0;
  if (trIn === "whip") { tf += ` translateX(${(1 - pin) * 900}px)`; blur += (1 - pin) * 26; }
  if (trIn === "up") { tf += ` translateY(${(1 - pin) * 1400}px)`; blur += (1 - pin) * 20; }
  if (trIn === "zoom") { tf += ` scale(${0.55 + 0.45 * pin})`; op *= Math.min(1, pin * 2); blur += (1 - pin) * 20; }
  if (trIn === "cut" || trIn === "flash") { tf += ` scale(${1.08 - 0.08 * ease(f, 0, 10)})`; }
  if (trOut === "whip") { tf += ` translateX(${-pout * 900}px)`; blur += pout * 26; }
  if (trOut === "up") { tf += ` translateY(${-pout * 1400}px)`; blur += pout * 20; }
  if (trOut === "zoom") { tf += ` scale(${1 + pout * 0.9})`; op *= 1 - pout; blur += pout * 20; }
  if ((trOut === "cut" || trOut === "flash") && f >= dur) op = 0;
  const drift = 1 + 0.035 * (f / Math.max(dur, 1));
  return (
    <AbsoluteFill style={{ transform: tf, opacity: op, filter: blur > 0.5 ? `blur(${blur}px)` : undefined }}>
      <AbsoluteFill style={{ scale: String(drift) }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const Flash: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at - 1, at + 1, at + 6], [0, 0.85, 0], clamp);
  return k > 0 ? <AbsoluteFill style={{ background: `radial-gradient(circle, ${P.white}, ${P.lav})`, opacity: k, mixBlendMode: "screen" }} /> : null;
};

/* ───────────────────────── Video ───────────────────────── */

export const VoxVideo: React.FC<{
  audio: string;
  tokens: Tok[];
  scenes: SceneDef[];
  duration: number;
  emph: Record<string, Style>;
  hold?: number;
}> = ({ audio, tokens, scenes, duration, emph, hold = 0.5 }) => {
  const words = buildWords(tokens);
  const cueAbs = makeCue(words);
  const total = Math.round(duration * FPS);
  const starts = scenes.map((s) => (typeof s.at === "number" ? s.at : Math.max(0, cueAbs(s.at) - 0.12)));
  starts.forEach((s, i) => {
    if (i && s <= starts[i - 1]) throw new Error(`scene ${i} (${String(scenes[i].at)}) starts before previous`);
  });
  const frames = starts.map((s) => Math.round(s * FPS));
  const layoutAt = (sec: number) => {
    let k = 0;
    starts.forEach((s, i) => {
      if (sec >= s) k = i;
    });
    return scenes[k].cap ?? TOP;
  };
  const pages = buildPages(words, starts.slice(1), layoutAt, hold);
  const normEmph: Record<string, Style> = {};
  Object.entries(emph).forEach(([k, v]) => (normEmph[norm(k)] = v));
  return (
    <AbsoluteFill style={{ background: P.night }}>
      {scenes.map((s, i) => {
        const from = frames[i];
        const to = i + 1 < scenes.length ? frames[i + 1] : total;
        const trIn = i === 0 ? null : s.tr ?? "whip";
        const trOut = i + 1 < scenes.length ? scenes[i + 1].tr ?? "whip" : null;
        const tail = trOut && trOut !== "cut" && trOut !== "flash" ? TR : 0;
        const ctx = {
          d: to - from,
          start: starts[i],
          f: (sec: number) => Math.round(sec * FPS) - from,
          cue: (phrase: string, after?: number) => Math.round(cueAbs(phrase, after ?? starts[i] - 0.3) * FPS) - from,
        };
        const C = s.C;
        return (
          <Sequence key={i} from={from} durationInFrames={to - from + tail} layout="none">
            <SceneWrap dur={to - from} trIn={trIn} trOut={trOut}>
              <AbsoluteFill style={{ scale: String(s.z ?? 1.15), transformOrigin: "50% 60%" }}>
                <C {...ctx} />
              </AbsoluteFill>
            </SceneWrap>
          </Sequence>
        );
      })}
      {scenes.map((s, i) => (i > 0 && s.tr === "flash" ? <Flash key={`fl${i}`} at={frames[i]} /> : null))}
      {pages.map((pg, i) => (
        <Sequence key={`p${i}`} from={pg.from} durationInFrames={Math.max(1, pg.to - pg.from)} layout="none">
          <KPage pg={pg} emph={normEmph} />
        </Sequence>
      ))}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Grain opacity={0.06} />
      </AbsoluteFill>
      <Audio src={staticFile(audio)} />
      {scenes.map((s, i) =>
        i === 0 ? null : (
          <Sfx key={`s${i}`} at={frames[i] - 3} src={s.tr === "flash" ? "shutter-modern" : s.tr === "cut" ? "switch" : "whoosh"} volume={s.tr === "cut" ? 0.05 : 0.08} />
        ),
      )}
    </AbsoluteFill>
  );
};
