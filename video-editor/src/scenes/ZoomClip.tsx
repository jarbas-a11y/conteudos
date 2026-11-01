import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { vignette } from "@remotion/effects/vignette";

type ZoomClipProps = {
  src: string;
  trimBefore?: number;
  zoomFrom?: number;
  zoomTo?: number;
  zoomStartFrame?: number;
  zoomEndFrame?: number;
  label?: string;
};

export const ZoomClip: React.FC<ZoomClipProps> = ({
  src,
  trimBefore = 0,
  zoomFrom = 1,
  zoomTo = 1.4,
  zoomStartFrame = 0,
  zoomEndFrame = 30,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = interpolate(frame, [zoomStartFrame, zoomEndFrame], [zoomFrom, zoomTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const labelOpacity = interpolate(frame, [0, 0.5 * fps, 2 * fps, 2.5 * fps], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill name="ZoomClip">
      <Video
        src={src}
        trimBefore={trimBefore}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: String(zoom),
        }}
        effects={[vignette({ amount: 0.3 })]}
      />
      {label && (
        <Interactive.Div
          name="ClipLabel"
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            opacity: labelOpacity,
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            fontSize: 22,
            fontFamily: "sans-serif",
            padding: "8px 16px",
            borderRadius: 6,
            backdropFilter: "blur(4px)",
          }}
        >
          {label}
        </Interactive.Div>
      )}
    </AbsoluteFill>
  );
};
