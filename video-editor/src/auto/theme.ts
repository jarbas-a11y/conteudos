import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const COND = "Barlow Condensed";
export const SANS = "Inter";

const f = (file: string, weight: string, style: string, family = COND) =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, style });

f("barlow-condensed-600-normal.woff2", "600", "normal");
f("barlow-condensed-800-normal.woff2", "800", "normal");
f("barlow-condensed-900-normal.woff2", "900", "normal");
f("barlow-condensed-800-italic.woff2", "800", "italic");
f("barlow-condensed-900-italic.woff2", "900", "italic");
loadFont({ family: SANS, url: staticFile("fonts/inter.woff2"), weight: "100 900", style: "normal" });

export const K = {
  bg0: "#0B161C",
  bg1: "#142630",
  bg2: "#1F3843",
  teal: "#3E6D7C",
  orange: "#F26B3A",
  orangeHi: "#FF8A57",
  paper: "#ECEFEF",
  paperShade: "#C9D0D2",
  ink: "#16222A",
  white: "#FFFFFF",
  mute: "#8FA3AB",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const FPS = 30;
