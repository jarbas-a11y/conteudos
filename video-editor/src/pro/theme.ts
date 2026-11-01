import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const INTER = "Inter";
export const SERIF = "Instrument Serif";

loadFont({ family: INTER, url: staticFile("fonts/inter.woff2"), weight: "100 900", style: "normal" });
loadFont({ family: INTER, url: staticFile("fonts/inter-italic.woff2"), weight: "100 900", style: "italic" });
loadFont({ family: SERIF, url: staticFile("fonts/instrument-serif.woff2"), weight: "400", style: "normal" });
loadFont({ family: SERIF, url: staticFile("fonts/instrument-serif-italic.woff2"), weight: "400", style: "italic" });

export const C = {
  lime: "#D1FE17",
  pink: "#FF005B",
  dark: "#0F1113",
  black: "#050505",
  cream: "#F3C977",
  lavender: "#ECEAFB",
  paper: "#F6F6F4",
  white: "#FFFFFF",
  ink: "#111111",
  gray: "#8A8A8A",
  blue: "#2F7BFF",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
