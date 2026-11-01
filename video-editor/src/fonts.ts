import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT = "Montserrat";
export const FONT_BOLD = "Montserrat";
export const FONT_ITALIC = "Montserrat";

// @remotion/fonts handles delayRender/continueRender internally
loadFont({ family: FONT, url: staticFile("fonts/montserrat-900.woff2"), weight: "900", style: "normal" });
loadFont({ family: FONT, url: staticFile("fonts/montserrat-900-italic.woff2"), weight: "900", style: "italic" });
