/**
 * Emotion Design — CSS/SVG effects synced to video content.
 * 12 emotional categories: Curiosidade, Surpresa, Conquista, Desafio,
 * Alívio, Confiança, Autoridade, Conexão, Transformação, Dinheiro,
 * Liberdade, Impacto.
 * All animations use interpolate() — no CSS transitions/animations.
 */
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT } from "../fonts";

const CYAN = "#4FC3F7";
const GOLD = "#FFD700";
const WHITE = "#FFFFFF";

// ── Zoom punch on video ───────────────────────────────────────────
export const usePunchZoom = (punchFrame: number, zoomTo = 1.06, duration = 14) => {
  const frame = useCurrentFrame();
  return interpolate(
    frame,
    [punchFrame, punchFrame + duration * 0.25, punchFrame + duration],
    [1, zoomTo, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }
  );
};

// ── Handle / watermark ───────────────────────────────────────────
export const Handle: React.FC<{ handle: string }> = ({ handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0.4 * fps, 1.2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 56,
        left: 40,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: CYAN,
          boxShadow: `0 0 8px ${CYAN}, 0 0 16px ${CYAN}88`,
        }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 28,
          color: WHITE,
          textShadow: "0 2px 10px rgba(0,0,0,0.9)",
          letterSpacing: 0.5,
        }}
      >
        {handle}
      </span>
    </div>
  );
};

// ── Emotion flash overlay (mood color burst) ──────────────────────
type EmotionType =
  | "curiosidade" | "dinheiro" | "autoridade" | "conquista"
  | "desafio" | "conexao" | "transformacao" | "impacto";

const EMOTION_CONFIG: Record<EmotionType, { color: string; emoji: string; label: string }> = {
  curiosidade:  { color: "#7B2FBE", emoji: "👁", label: "Curiosidade" },
  dinheiro:     { color: "#FFD700", emoji: "💰", label: "Dinheiro" },
  autoridade:   { color: "#FFB300", emoji: "👑", label: "Autoridade" },
  conquista:    { color: "#4CAF50", emoji: "🏆", label: "Conquista" },
  desafio:      { color: "#FF5722", emoji: "⛰", label: "Desafio" },
  conexao:      { color: "#4FC3F7", emoji: "🔗", label: "Conexão" },
  transformacao:{ color: "#E91E63", emoji: "✨", label: "Transformação" },
  impacto:      { color: "#00BCD4", emoji: "💥", label: "Impacto" },
};

export const EmotionFlash: React.FC<{
  emotion: EmotionType;
  from: number;
  duration?: number;
}> = ({ emotion, from, duration = 20 }) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  const cfg = EMOTION_CONFIG[emotion];

  if (local < 0 || local > duration) return null;

  const midpoint = duration * 0.3;
  const opacity = interpolate(
    local,
    [0, midpoint, duration],
    [0, 0.28, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scaleRing = interpolate(local, [0, duration], [0.6, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });

  const ringOpacity = interpolate(local, [0, midpoint * 0.5, duration], [0.8, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const emojiScale = interpolate(local, [0, 4, 10], [0, 1.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    output: "perceptual-scale",
  });

  const emojiOpacity = interpolate(local, [0, 3, duration - 6, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Color vignette flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, ${cfg.color}55 0%, transparent 70%)`,
          opacity,
        }}
      />
      {/* Expanding ring */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 300,
          height: 300,
          marginLeft: -150,
          marginTop: -150,
          borderRadius: "50%",
          border: `4px solid ${cfg.color}`,
          scale: String(scaleRing),
          opacity: ringOpacity,
          boxShadow: `0 0 30px ${cfg.color}66`,
        }}
      />
      {/* Emotion emoji + label (top-right corner) */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 40,
          opacity: emojiOpacity,
          scale: String(emojiScale),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 64, lineHeight: 1 }}>{cfg.emoji}</span>
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 18,
            color: cfg.color,
            letterSpacing: 2,
            textTransform: "uppercase",
            textShadow: `0 2px 10px rgba(0,0,0,0.9), 0 0 20px ${cfg.color}88`,
          }}
        >
          {cfg.label}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── Neon scan line (opening/impact) ──────────────────────────────
export const ScanLine: React.FC<{ from?: number; color?: string }> = ({
  from = 0,
  color = CYAN,
}) => {
  const frame = useCurrentFrame();
  const { height, fps } = useVideoConfig();
  const local = frame - from;

  if (local < 0 || local > 1.5 * fps) return null;

  const travel = interpolate(local, [0, 1.2 * fps], [-50, height + 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });

  const opacity = interpolate(local, [0, 6, 1.2 * fps, 1.5 * fps], [0, 0.7, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: travel,
        height: 3,
        background: `linear-gradient(90deg, transparent 0%, ${color} 30%, ${color} 70%, transparent 100%)`,
        opacity,
        boxShadow: `0 0 20px ${color}, 0 0 40px ${color}66`,
        pointerEvents: "none",
      }}
    />
  );
};

// ── Golden particles (for Dinheiro / Conquista moments) ───────────
const PARTICLE_CONFIGS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: 15 + (i * 11) % 70,   // % of width
  delay: (i * 3) % 12,
  size: 6 + (i * 3) % 8,
  driftX: (i % 2 === 0 ? 1 : -1) * (20 + (i * 7) % 30),
}));

export const GoldParticles: React.FC<{ from?: number; duration?: number }> = ({
  from = 0,
  duration = 40,
}) => {
  const frame = useCurrentFrame();
  useVideoConfig();
  const local = frame - from;

  if (local < 0 || local > duration) return null;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {PARTICLE_CONFIGS.map((p) => {
        const pLocal = local - p.delay;
        if (pLocal < 0) return null;

        const rise = interpolate(pLocal, [0, duration - p.delay], [0, -220], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const drift = interpolate(pLocal, [0, duration - p.delay], [0, p.driftX], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const pOpacity = interpolate(
          pLocal,
          [0, 4, (duration - p.delay) * 0.7, duration - p.delay],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              bottom: 250,
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: GOLD,
              opacity: pOpacity,
              translate: `${drift}px ${rise}px`,
              boxShadow: `0 0 ${p.size * 2}px ${GOLD}`,
            }}
          />
        );
      })}
    </div>
  );
};

// ── Neon grid lines (for Conexão) ─────────────────────────────────
export const NeonGrid: React.FC<{ from?: number; duration?: number; color?: string }> = ({
  from = 0,
  duration = 60,
  color = CYAN,
}) => {
  const frame = useCurrentFrame();
  const local = frame - from;

  if (local < 0 || local > duration) return null;

  const opacity = interpolate(
    local,
    [0, 10, duration - 12, duration],
    [0, 0.18, 0.18, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const lines = [20, 40, 60, 80];

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}>
      {lines.map((pct) => (
        <div
          key={`v${pct}`}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${pct}%`,
            width: 1,
            background: `linear-gradient(180deg, transparent 0%, ${color}66 30%, ${color}66 70%, transparent 100%)`,
          }}
        />
      ))}
      {lines.map((pct) => (
        <div
          key={`h${pct}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${pct}%`,
            height: 1,
            background: `linear-gradient(90deg, transparent 0%, ${color}66 30%, ${color}66 70%, transparent 100%)`,
          }}
        />
      ))}
    </div>
  );
};

// ── "Comunicação é poder." impact title card ──────────────────────
export const ImpactTitle: React.FC<{ from?: number }> = ({ from = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;

  if (local < 0) return null;

  const opacity = interpolate(local, [0, 0.3 * fps, 1.5 * fps, 2 * fps], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scaleY = interpolate(local, [0, 0.4 * fps], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    output: "perceptual-scale",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 320,
        left: 0,
        right: 0,
        opacity,
        scale: `1 ${scaleY}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          width: 60,
          height: 3,
          backgroundColor: CYAN,
          borderRadius: 2,
          boxShadow: `0 0 12px ${CYAN}`,
          marginBottom: 8,
        }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 38,
          color: WHITE,
          textTransform: "uppercase",
          letterSpacing: 6,
          textShadow: `0 0 30px ${CYAN}88, 0 2px 8px rgba(0,0,0,0.9)`,
        }}
      >
        Comunicação é poder.
      </span>
    </div>
  );
};
