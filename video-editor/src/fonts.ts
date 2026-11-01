import { continueRender, delayRender, staticFile } from "remotion";

let loaded = false;
let handle: number | null = null;

export const FONT_BOLD = "MontserratBold";
export const FONT_ITALIC = "MontserratItalic";

export function loadLocalFonts() {
  if (loaded || typeof document === "undefined") return;
  loaded = true;

  handle = delayRender("Loading local fonts");

  const boldFace = new FontFace(
    FONT_BOLD,
    `url(${staticFile("fonts/montserrat-900.woff2")}) format('woff2')`,
    { weight: "900", style: "normal" }
  );

  const italicFace = new FontFace(
    FONT_ITALIC,
    `url(${staticFile("fonts/montserrat-900-italic.woff2")}) format('woff2')`,
    { weight: "900", style: "italic" }
  );

  Promise.all([boldFace.load(), italicFace.load()])
    .then(([b, i]) => {
      document.fonts.add(b);
      document.fonts.add(i);
      if (handle !== null) continueRender(handle);
    })
    .catch(() => {
      if (handle !== null) continueRender(handle);
    });
}
