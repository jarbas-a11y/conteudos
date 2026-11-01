/**
 * ReelsComposition — 9:16 vertical video for Instagram Reels / TikTok
 * @jarbasvox style:
 *  - Vídeo full-frame (objectFit cover, sem encolhimento)
 *  - Legendas cinéticas: caixa cyan, itálico cyan, branco bold
 *  - Emotion Design: flash de cor, scan line, partículas douradas, neon grid
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
import {
  Handle,
  usePunchZoom,
  EmotionFlash,
  ScanLine,
  GoldParticles,
  NeonGrid,
  ImpactTitle,
} from "./EmotionDesign";

const VIDEO = "meu-video.mp4";
const SRT = "captions.srt";

// Frame timestamps for cut/emphasis points (30 fps)
// SRT: "valor" ~5.8s=174, "enfraquecer" ~11.5s=345, "caro" ~16s=480,
//      "percepção" ~23s=690, "posicionar" ~32s=960, end ~38.8s=1164
const PUNCH_FRAMES = [174, 345, 480, 690, 960];

export const ReelsComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Pick closest punch frame for zoom
  const closestPunch = PUNCH_FRAMES.reduce((best, pf) => {
    return Math.abs(frame - pf) < Math.abs(frame - best) ? pf : best;
  }, PUNCH_FRAMES[0]);

  const punchZoom = usePunchZoom(closestPunch, 1.06, 16);

  // CSS vignette — stronger on punches
  const vignetteAmount = interpolate(
    frame,
    [closestPunch, closestPunch + 8, closestPunch + 16],
    [0.18, 0.32, 0.18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fade in (first 0.4s)
  const fadeIn = interpolate(frame, [0, Math.round(0.4 * fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000", opacity: fadeIn }}>
      {/* ── Full-frame video ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        <Video
          src={staticFile(VIDEO)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            scale: String(punchZoom),
          }}
        />
      </div>

      {/* ── Vinheta CSS ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center,
            transparent 40%,
            rgba(0,0,0,${vignetteAmount * 0.85}) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── Opening scan line (neon intro) ── */}
      <ScanLine from={0} color="#4FC3F7" />

      {/* ── Emotion: Curiosidade — opening hook (frame 0-90) ── */}
      <EmotionFlash emotion="curiosidade" from={15} duration={30} />

      {/* ── Emotion: Dinheiro — "mais rico" (frame ~174) ── */}
      <EmotionFlash emotion="dinheiro" from={160} duration={25} />
      <GoldParticles from={162} duration={50} />

      {/* ── Emotion: Autoridade — "seu valor" (frame ~174) ── */}
      <EmotionFlash emotion="autoridade" from={320} duration={25} />

      {/* ── Emotion: Desafio — "enfraquecer" (frame ~345) ── */}
      <EmotionFlash emotion="desafio" from={345} duration={22} />

      {/* ── Emotion: Dinheiro — "muito caro" (frame ~480) ── */}
      <EmotionFlash emotion="dinheiro" from={480} duration={22} />
      <GoldParticles from={482} duration={45} />

      {/* ── Emotion: Conexão — "comunicar bem uma ideia" (frame ~546) ── */}
      <NeonGrid from={546} duration={90} />
      <EmotionFlash emotion="conexao" from={550} duration={22} />

      {/* ── Emotion: Transformação — "percepção" (frame ~690) ── */}
      <EmotionFlash emotion="transformacao" from={690} duration={22} />

      {/* ── Emotion: Conquista — "posicionar" (frame ~960) ── */}
      <EmotionFlash emotion="conquista" from={960} duration={25} />

      {/* ── Emotion: Impacto — "Falar melhor" (frame ~1080) ── */}
      <EmotionFlash emotion="impacto" from={1080} duration={30} />
      <ImpactTitle from={1080} />

      {/* ── Kinetic captions ── */}
      <KineticCaption srtFile={SRT} />

      {/* ── @jarbasvox handle ── */}
      <Handle handle="@jarbasvox" />
    </AbsoluteFill>
  );
};
