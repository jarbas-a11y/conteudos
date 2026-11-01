import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type TitleSceneProps = {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
};

export const TitleScene: React.FC<TitleSceneProps> = ({
  title,
  subtitle,
  backgroundColor = "#0f0f0f",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const titleTranslateY = interpolate(frame, [0, 1 * fps], ["30px", "0px"], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subtitleOpacity = interpolate(frame, [1 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const lineScale = interpolate(frame, [0.5 * fps, 1.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      name="TitleScene"
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Interactive.Div
        name="TitleText"
        style={{
          opacity: titleOpacity,
          translate: `0 ${titleTranslateY}`,
          color: "white",
          fontSize: 72,
          fontFamily: "sans-serif",
          fontWeight: 700,
          letterSpacing: "-1px",
          textAlign: "center",
        }}
      >
        {title}
      </Interactive.Div>

      <Interactive.Div
        name="TitleLine"
        style={{
          width: 120,
          height: 3,
          backgroundColor: "#ff4444",
          scale: `${lineScale} 1`,
        }}
      />

      {subtitle && (
        <Interactive.Div
          name="SubtitleText"
          style={{
            opacity: subtitleOpacity,
            color: "#aaaaaa",
            fontSize: 28,
            fontFamily: "sans-serif",
            textAlign: "center",
          }}
        >
          {subtitle}
        </Interactive.Div>
      )}
    </AbsoluteFill>
  );
};
