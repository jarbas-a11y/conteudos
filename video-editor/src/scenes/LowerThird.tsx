import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type LowerThirdProps = {
  name: string;
  role?: string;
  from?: number;
  durationInFrames?: number;
};

export const LowerThird: React.FC<LowerThirdProps> = ({
  name,
  role,
  from = 0,
  durationInFrames = 90,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - from;
  const fadeIn = interpolate(localFrame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const fadeOut = interpolate(
    localFrame,
    [durationInFrames - 0.5 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  const slideX = interpolate(localFrame, [0, 0.5 * fps], ["-40px", "0px"], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  if (localFrame < 0 || localFrame > durationInFrames) return null;

  return (
    <AbsoluteFill name="LowerThird" style={{ pointerEvents: "none" }}>
      <Interactive.Div
        name="LowerThirdBar"
        style={{
          position: "absolute",
          bottom: 80,
          left: 60,
          opacity,
          translate: `${slideX}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 4,
            height: role ? 58 : 38,
            backgroundColor: "#ff4444",
            position: "absolute",
            left: -12,
            top: 0,
          }}
        />
        <span
          style={{
            color: "white",
            fontSize: 28,
            fontFamily: "sans-serif",
            fontWeight: 700,
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          {name}
        </span>
        {role && (
          <span
            style={{
              color: "#dddddd",
              fontSize: 18,
              fontFamily: "sans-serif",
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            {role}
          </span>
        )}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
