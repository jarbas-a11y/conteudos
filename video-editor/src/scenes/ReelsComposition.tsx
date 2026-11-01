/**
 * ReelsComposition — vídeo vertical 9:16 com:
 * - Vídeo full-frame (sem encolhimento)
 * - Legendas cinéticas estilo @jarbasvox (bold + caixa ciano + itálico colorido)
 * - Emotion design: zoom punches, handle, quote card, linha animada
 */
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { staticFile } from "remotion";
import { KineticCaption } from "./KineticCaption";
import { Handle, usePunchZoom } from "./EmotionDesign";
const VIDEO = "meu-video.mp4";
const SRT = "captions.srt";

// Frames onde ocorrem cortes/ênfases (aproximados pelo SRT)
const PUNCH_FRAMES = [
  159, // "valor"
  279, // "enfraquecer"
  420, // "caro"
  547, // "percepção"
  756, // "posicionar"
];

export const ReelsComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Zoom punch composto — pega o punch mais próximo
  const closestPunch = PUNCH_FRAMES.reduce((best, pf) => {
    const distBest = Math.abs(frame - best);
    const distCurr = Math.abs(frame - pf);
    return distCurr < distBest ? pf : best;
  }, PUNCH_FRAMES[0]);

  const punchZoom = usePunchZoom(closestPunch, 1.07, 18);

  // Vinheta dinâmica — aumenta nos punches
  const vignetteAmount = interpolate(
    frame,
    [closestPunch, closestPunch + 9, closestPunch + 18],
    [0.22, 0.38, 0.22],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fade in inicial
  const fadeIn = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill name="ReelsComposition" style={{ opacity: fadeIn }}>
      {/* ── Vídeo full-frame com zoom punch e vinheta ── */}
      <Video
        src={staticFile(VIDEO)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: String(punchZoom),
        }}
      />
      {/* Vinheta CSS — sem WebGL */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center,
            transparent 45%,
            rgba(0,0,0,${vignetteAmount * 0.9}) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── Legendas cinéticas ── */}
      <KineticCaption srtFile={SRT} />

      {/* ── Handle @jarbasvox ── */}
      <Handle handle="@jarbasvox" />
    </AbsoluteFill>
  );
};
