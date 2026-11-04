import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

export const FPS = 30;
export const W = 1080;
export const H = 1920;

// Brand palette (VOX visual direction image)
export const P = {
  night: "#070B1A",
  deep: "#111C3D",
  deep2: "#18265A",
  violet: "#7657F6",
  cyan: "#20C8E8",
  lav: "#9A8BFF",
  white: "#F1F4FF",
  mute: "#8E97C2",
  dim: "#4A5486",
  danger: "#FF6B8B",
};

export const GRAD = `linear-gradient(100deg, ${P.violet}, ${P.cyan})`;
export const GRAD_V = `linear-gradient(180deg, ${P.lav}, ${P.violet})`;

export const DISPLAY = "Bricolage";
export const SERIF = "InstrumentSerif";
export const MONO = "JetBrainsMono";
export const UI = "InterUI";

loadFont({ family: DISPLAY, url: staticFile("fonts/bricolage.woff2"), weight: "200 800" });
loadFont({ family: SERIF, url: staticFile("fonts/instrument-serif.woff2"), weight: "400", style: "normal" });
loadFont({ family: SERIF, url: staticFile("fonts/instrument-serif-italic.woff2"), weight: "400", style: "italic" });
loadFont({ family: MONO, url: staticFile("fonts/jetbrains-mono.woff2"), weight: "400 700" });
loadFont({ family: UI, url: staticFile("fonts/inter.woff2"), weight: "100 900" });

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 eased progress starting at `at` lasting `dur` frames. */
export const ease = (f: number, at: number, dur = 10, e: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: e });

/** Snappy overshoot 0→1 (back-out). */
export const pop = (f: number, at: number, dur = 12) => ease(f, at, dur, Easing.out(Easing.back(1.7)));

/** Expo-out, the "fast then settle" motion of premium motion design. */
export const expo = (f: number, at: number, dur = 14) => ease(f, at, dur, Easing.out(Easing.exp));

/** 1 when f has passed `out`, eased. */
export const outP = (f: number, out: number | undefined, dur = 8) =>
  out === undefined ? 0 : interpolate(f, [out, out + dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Deterministic pseudo-random in [0,1). */
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
