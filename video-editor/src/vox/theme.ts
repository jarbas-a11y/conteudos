import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const DISPLAY = "Archivo";
export const SANS = "Inter";

loadFont({ family: DISPLAY, url: staticFile("fonts/archivo.woff2"), weight: "100 900", style: "normal", stretch: "62% 125%" });
loadFont({ family: DISPLAY, url: staticFile("fonts/archivo-italic.woff2"), weight: "100 900", style: "italic", stretch: "62% 125%" });
loadFont({ family: SANS, url: staticFile("fonts/inter.woff2"), weight: "100 900", style: "normal" });
loadFont({ family: SANS, url: staticFile("fonts/inter-italic.woff2"), weight: "100 900", style: "italic" });

export const V = {
  navy0: "#050B1F",
  navy1: "#0A1638",
  navy2: "#13235A",
  line: "#2A3C7A",
  cyan: "#2FE0F2",
  cyanDim: "#1A8FA8",
  violet: "#9B7BFF",
  violetDim: "#5B44B8",
  white: "#F4F7FF",
  mute: "#8E9AC4",
  skin: "#C98E68",
};

export const FPS = 30;
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
