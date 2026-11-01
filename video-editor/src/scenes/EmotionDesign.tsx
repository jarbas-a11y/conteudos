/**
 * Emotion Design — elementos animados que reforçam o impacto emocional do conteúdo.
 * Ativados em frames específicos do vídeo principal.
 */
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadLocalFonts, FONT_BOLD as FONT } from "../fonts";

loadLocalFonts();

const CYAN = "#4FC3F7";
const WHITE = "#FFFFFF";

// —— Linha horizontal animada (separador visual) ——
export const AnimatedLine: React.FC<{ from?: number; color?: string }> = ({
  from = 0,
  color = CYAN,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const local = frame - from;

  const scaleX = interpolate(local, [0, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const opacity = interpolate(local, [0, 0.15 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (local < 0) return null;
  return (
    <div
      style={{
        width: width - 96,
        height: 4,
        backgroundColor: color,
        opacity,
        scale: `${scaleX} 1`,
        transformOrigin: "left center",
        borderRadius: 2,
      }}
    />
  );
};

// —— Número animado com etiqueta ——
export const ImpactNumber: React.FC<{
  number: string;
  label: string;
  from?: number;
}> = ({ number, label, from = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;

  const scale = interpolate(local, [0, 0.5 * fps], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.spring({ damping: 14, stiffness: 200 }),
    output: "perceptual-scale",
  });

  const opacity = interpolate(local, [0, 0.2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (local < 0) return null;
  return (
    <div style={{ opacity, scale: String(scale), textAlign: "center" }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 120,
          color: CYAN,
          lineHeight: 1,
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 32,
          color: WHITE,
          textTransform: "uppercase",
          letterSpacing: 4,
          marginTop: 8,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// —— Cartão de citação ——
export const QuoteCard: React.FC<{
  text: string;
  from?: number;
  durationInFrames?: number;
}> = ({ text, from = 0, durationInFrames = 90 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;

  const opacity = interpolate(
    local,
    [0, 0.3 * fps, durationInFrames - 0.4 * fps, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const slideY = interpolate(local, [0, 0.4 * fps], ["20px", "0px"], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  if (local < 0 || local > durationInFrames) return null;

  return (
    <div
      style={{
        opacity,
        translate: `0 ${slideY}`,
        borderLeft: `6px solid ${CYAN}`,
        paddingLeft: 24,
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      <p
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 38,
          color: WHITE,
          margin: 0,
          lineHeight: 1.4,
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
        }}
      >
        {text}
      </p>
    </div>
  );
};

// —— Handle / Marca d'água ——
export const Handle: React.FC<{ handle: string }> = ({ handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0.5 * fps, 1.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: 48,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: CYAN,
        }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 26,
          color: WHITE,
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          letterSpacing: 0.5,
        }}
      >
        {handle}
      </span>
    </div>
  );
};

// —— Zoom punch no vídeo ——
export const usePunchZoom = (
  punchFrame: number,
  zoomTo = 1.06,
  duration = 12
) => {
  const frame = useCurrentFrame();
  return interpolate(
    frame,
    [punchFrame, punchFrame + duration * 0.3, punchFrame + duration],
    [1, zoomTo, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }
  );
};

// —— Composição Emotion Design Demo ——
export const EmotionDesignDemo: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const bgOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      name="EmotionDesign"
      style={{
        background: "linear-gradient(160deg, #050510 0%, #0a1628 100%)",
        opacity: bgOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "0 48px",
        gap: 32,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 56,
          color: CYAN,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: interpolate(frame, [0.3 * fps, 0.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Comunicação
      </div>

      <AnimatedLine from={Math.round(0.8 * fps)} />

      <QuoteCard
        text="Falar melhor não é falar mais."
        from={Math.round(1.2 * fps)}
        durationInFrames={Math.round(3 * fps)}
      />

      <div
        style={{
          display: "flex",
          gap: 80,
          marginTop: 16,
        }}
      >
        <ImpactNumber number="7" label="Lições" from={Math.round(2 * fps)} />
        <ImpactNumber number="1" label="Mudança" from={Math.round(2.3 * fps)} />
      </div>
    </AbsoluteFill>
  );
};
