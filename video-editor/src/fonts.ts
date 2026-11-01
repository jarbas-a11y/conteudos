import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT = "Inter";
export const FONT_BOLD = "Inter";
export const FONT_ITALIC = "Inter";

loadFont({ family: FONT, url: staticFile("fonts/inter.woff2"), weight: "100 900", style: "normal" });
loadFont({ family: FONT, url: staticFile("fonts/inter-italic.woff2"), weight: "100 900", style: "italic" });
