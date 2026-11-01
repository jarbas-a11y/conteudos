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
import { parseSrt, createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption } from "@remotion/captions";
import { useState, useEffect, useCallback, useMemo } from "react";
import { FONT } from "../fonts";

const CYAN = "#4FC3F7";
const WHITE = "#FFFFFF";
const BLACK = "#000000";

// Words that get the CYAN BOX treatment
const HIGHLIGHT_WORDS = new Set([
  "rico", "valor", "enfraquecer", "caro", "mudar", "percepção",
  "ouvir", "posicionar", "oportunidades", "melhor", "suficiente",
  "comunicação", "história",
]);

// Words that get CYAN ITALIC treatment
const ITALIC_WORDS = new Set([
  "não", "pode", "muito", "bem", "também", "bastante", "completamente",
  "demais",
]);

const FONT_SIZE = 78;
const CAPTION_SWITCH_MS = 1800;

type WordStyle = "highlight" | "italic" | "normal";

function classifyWord(word: string): WordStyle {
  const clean = word.toLowerCase().replace(/[.,!?;:]/g, "");
  if (HIGHLIGHT_WORDS.has(clean)) return "highlight";
  if (ITALIC_WORDS.has(clean)) return "italic";
  return "normal";
}

// ── Single caption page renderer ──────────────────────────────────
const CaptionPage: React.FC<{
  tokens: Array<{ text: string; fromMs: number; toMs: number }>;
  startMs: number;
}> = ({ tokens, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000 + startMs;

  // Page entrance animation
  const pageOpacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pageSlideY = interpolate(frame, [0, 6], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        opacity: pageOpacity,
        translate: `0 ${pageSlideY}px`,
        display: "flex",
        flexWrap: "wrap",
        gap: "12px 10px",
        padding: "0 40px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {tokens.map((token, i) => {
        const word = token.text.trim();
        if (!word) return null;
        const style = classifyWord(word);

        // Per-word stagger entrance
        const wordDelay = i * 1.5;
        const wordOpacity = interpolate(frame, [wordDelay, wordDelay + 3], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const wordSlideY = interpolate(frame, [wordDelay, wordDelay + 4], [10, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        // Active word pulse (for highlight/important words when spoken)
        const isActive = token.fromMs <= currentMs && token.toMs > currentMs;

        if (style === "highlight") {
          const punchScale = isActive
            ? interpolate(frame, [0, 3, 6], [1, 1.08, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;
          return (
            <span
              key={i}
              style={{
                opacity: wordOpacity,
                translate: `0 ${wordSlideY}px`,
                scale: String(punchScale),
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: FONT_SIZE,
                color: BLACK,
                backgroundColor: CYAN,
                padding: "2px 14px 5px",
                lineHeight: 1.05,
                display: "inline-block",
                borderRadius: 3,
                textTransform: "uppercase",
                letterSpacing: "-0.5px",
              }}
            >
              {word}
            </span>
          );
        }

        if (style === "italic") {
          return (
            <span
              key={i}
              style={{
                opacity: wordOpacity,
                translate: `0 ${wordSlideY}px`,
                fontFamily: FONT,
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: FONT_SIZE * 0.88,
                color: CYAN,
                lineHeight: 1.1,
                display: "inline-block",
                textShadow: "0 2px 14px rgba(0,0,0,0.9)",
              }}
            >
              {word}
            </span>
          );
        }

        // Normal word — bold white with strong black outline
        const activeGlow = isActive
          ? `0 0 20px ${CYAN}55`
          : "0 0 0 transparent";

        return (
          <span
            key={i}
            style={{
              opacity: wordOpacity,
              translate: `0 ${wordSlideY}px`,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: FONT_SIZE,
              color: WHITE,
              lineHeight: 1.1,
              display: "inline-block",
              textShadow: `
                3px 3px 0 ${BLACK},
                -3px -3px 0 ${BLACK},
                3px -3px 0 ${BLACK},
                -3px 3px 0 ${BLACK},
                3px 0 0 ${BLACK},
                -3px 0 0 ${BLACK},
                0 3px 0 ${BLACK},
                0 -3px 0 ${BLACK},
                ${activeGlow}
              `,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ── Main KineticCaption component ─────────────────────────────────
export const KineticCaption: React.FC<{ srtFile: string }> = ({ srtFile }) => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading SRT captions"));
  const { fps } = useVideoConfig();

  const fetchCaptions = useCallback(async () => {
    try {
      const res = await fetch(staticFile(srtFile));
      const text = await res.text();
      const { captions: parsed } = parseSrt({ input: text });
      setCaptions(parsed);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [continueRender, cancelRender, handle, srtFile]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  const pages = useMemo(() => {
    if (!captions) return [];
    const { pages: p } = createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: CAPTION_SWITCH_MS,
    });
    return p;
  }, [captions]);

  if (!captions) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = nextPage
          ? Math.min((nextPage.startMs / 1000) * fps, startFrame + (CAPTION_SWITCH_MS / 1000) * fps)
          : startFrame + (CAPTION_SWITCH_MS / 1000) * fps;
        const durationInFrames = Math.max(1, Math.round(endFrame - startFrame));

        return (
          <Sequence key={index} from={Math.floor(startFrame)} durationInFrames={durationInFrames}>
            <AbsoluteFill
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: 200,
              }}
            >
              <CaptionPage tokens={page.tokens} startMs={page.startMs} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
