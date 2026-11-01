import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  staticFile,
  useDelayRender,
} from "remotion";
import { parseSrt } from "@remotion/captions";
import type { Caption } from "@remotion/captions";
import { useState, useEffect, useCallback } from "react";
import { loadLocalFonts, FONT_BOLD, FONT_ITALIC } from "../fonts";

loadLocalFonts();

const CYAN = "#4FC3F7";
const WHITE = "#FFFFFF";
const BLACK = "#000000";

const HIGHLIGHT_WORDS = [
  "rico", "valor", "enfraquecer", "caro", "mudar", "percepção",
  "ouvir", "posicionar", "oportunidades", "melhor",
];

const ITALIC_WORDS = [
  "não", "pode", "muito", "bem", "também", "bastante", "completamente",
];

type WordToken = { text: string; isHighlight: boolean; isItalic: boolean };

function tokenizeText(text: string): WordToken[] {
  return text.split(/\s+/).filter(Boolean).map((word) => {
    const clean = word.toLowerCase().replace(/[.,!?]/g, "");
    return {
      text: word,
      isHighlight: HIGHLIGHT_WORDS.includes(clean),
      isItalic: ITALIC_WORDS.includes(clean),
    };
  });
}

const CaptionBlock: React.FC<{ caption: Caption; isUpper: boolean }> = ({
  caption,
  isUpper,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideY = interpolate(frame, [0, 0.3 * fps], [isUpper ? "-20px" : "20px", "0px"], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const opacity = interpolate(frame, [0, 0.2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lines = caption.text.split("\n").filter(Boolean);
  const fontSize = 76;

  return (
    <div
      style={{
        opacity,
        translate: `0 ${slideY}`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "0 48px",
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          {tokenizeText(line).map((token, ti) => {
            if (token.isHighlight) {
              return (
                <span
                  key={ti}
                  style={{
                    fontFamily: FONT_BOLD,
                    fontWeight: 900,
                    fontSize,
                    color: BLACK,
                    backgroundColor: CYAN,
                    padding: "0 12px 4px",
                    lineHeight: 1.1,
                    display: "inline-block",
                  }}
                >
                  {token.text}
                </span>
              );
            }
            if (token.isItalic) {
              return (
                <span
                  key={ti}
                  style={{
                    fontFamily: FONT_ITALIC,
                    fontWeight: 900,
                    fontStyle: "italic",
                    fontSize: fontSize * 0.9,
                    color: CYAN,
                    lineHeight: 1.1,
                    textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                  }}
                >
                  {token.text}
                </span>
              );
            }
            return (
              <span
                key={ti}
                style={{
                  fontFamily: FONT_BOLD,
                  fontWeight: 900,
                  fontSize,
                  color: WHITE,
                  lineHeight: 1.1,
                  textShadow: `
                    2px 2px 0 ${BLACK},
                    -2px -2px 0 ${BLACK},
                    2px -2px 0 ${BLACK},
                    -2px 2px 0 ${BLACK},
                    0 0 24px rgba(0,0,0,0.5)
                  `,
                }}
              >
                {token.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const KineticCaption: React.FC<{ srtFile: string }> = ({ srtFile }) => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender: dr, continueRender: cr, cancelRender } = useDelayRender();
  const [handle] = useState(() => dr());
  const { fps } = useVideoConfig();

  const fetchCaptions = useCallback(async () => {
    try {
      const res = await fetch(staticFile(srtFile));
      const text = await res.text();
      const { captions: parsed } = parseSrt({ input: text });
      setCaptions(parsed);
      cr(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [cr, cancelRender, handle, srtFile]);

  useEffect(() => { fetchCaptions(); }, [fetchCaptions]);

  if (!captions) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {captions.map((caption, index) => {
        const startFrame = Math.floor((caption.startMs / 1000) * fps);
        const endFrame = Math.ceil((caption.endMs / 1000) * fps);
        const duration = Math.max(1, endFrame - startFrame);
        const isUpper = index % 2 === 0;

        return (
          <Sequence key={index} from={startFrame} durationInFrames={duration}>
            <AbsoluteFill
              style={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
                ...(isUpper
                  ? { top: 80 }
                  : { top: undefined, bottom: 160 }),
              }}
            >
              <CaptionBlock caption={caption} isUpper={isUpper} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
