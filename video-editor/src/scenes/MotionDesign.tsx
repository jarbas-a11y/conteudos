import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type AnimatedBadgeProps = {
  text: string;
  from?: number;
  color?: string;
};

const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  text,
  from = 0,
  color = "#ff4444",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;

  const scale = interpolate(local, [0, 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.spring({ damping: 12, stiffness: 200 }),
    output: "perceptual-scale",
  });

  const opacity = interpolate(local, [0, 0.2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (local < 0) return null;

  return (
    <div
      style={{
        backgroundColor: color,
        color: "white",
        fontSize: 22,
        fontWeight: 700,
        fontFamily: "sans-serif",
        padding: "6px 18px",
        borderRadius: 40,
        scale: String(scale),
        opacity,
        display: "inline-block",
        letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};

type CounterProps = {
  value: number;
  label: string;
  from?: number;
};

const AnimatedCounter: React.FC<CounterProps> = ({
  value,
  label,
  from = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;

  const displayValue = Math.round(
    interpolate(local, [0, 1.5 * fps], [0, value], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    })
  );

  const opacity = interpolate(local, [0, 0.3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (local < 0) return null;

  return (
    <div
      style={{
        opacity,
        textAlign: "center",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1 }}>
        {displayValue.toLocaleString("pt-BR")}
      </div>
      <div style={{ fontSize: 20, opacity: 0.7, marginTop: 4 }}>{label}</div>
    </div>
  );
};

type KineticTextProps = {
  words: string[];
  from?: number;
};

const KineticText: React.FC<KineticTextProps> = ({ words, from = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "center",
        maxWidth: "80%",
      }}
    >
      {words.map((word, i) => {
        const wordFrom = from + i * 0.12 * fps;
        const local = frame - wordFrom;

        const translateY = interpolate(local, [0, 0.5 * fps], ["30px", "0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        const opacity = interpolate(local, [0, 0.3 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <span
            key={i}
            style={{
              fontSize: 56,
              fontWeight: 800,
              fontFamily: "sans-serif",
              color: "white",
              translate: `0 ${translateY}`,
              opacity,
              display: "inline-block",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

type ProgressBarProps = {
  progress: number;
  label?: string;
  from?: number;
  color?: string;
};

const AnimatedProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  from = 0,
  color = "#ff4444",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;

  const width = interpolate(local, [0, 1 * fps], [0, progress], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const opacity = interpolate(local, [0, 0.2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (local < 0) return null;

  return (
    <div style={{ opacity, width: "100%" }}>
      {label && (
        <div
          style={{
            color: "white",
            fontSize: 18,
            fontFamily: "sans-serif",
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          width: "100%",
          height: 8,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
};

// Demo composition showcasing all motion design elements
export const MotionDesignDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      name="MotionDesign"
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%)",
        opacity: bgOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <KineticText
        words={["Transforme", "sua", "comunicação"]}
        from={0}
      />

      <div style={{ display: "flex", gap: 60, marginTop: 20 }}>
        <AnimatedCounter value={1200} label="Alunos" from={1 * fps} />
        <AnimatedCounter value={98} label="% Aprovação" from={1.3 * fps} />
        <AnimatedCounter value={7} label="Anos" from={1.6 * fps} />
      </div>

      <div
        style={{
          width: 500,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginTop: 10,
        }}
      >
        <AnimatedProgressBar
          progress={92}
          label="Resultados comprovados"
          from={2 * fps}
          color="#ff4444"
        />
        <AnimatedProgressBar
          progress={78}
          label="Crescimento médio"
          from={2.3 * fps}
          color="#44aaff"
        />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
        <AnimatedBadge text="Ao Vivo" from={3 * fps} color="#ff4444" />
        <AnimatedBadge text="Online" from={3.2 * fps} color="#4444ff" />
        <AnimatedBadge text="Certificado" from={3.4 * fps} color="#44aa44" />
      </div>
    </AbsoluteFill>
  );
};

export { AnimatedBadge, AnimatedCounter, KineticText, AnimatedProgressBar };
