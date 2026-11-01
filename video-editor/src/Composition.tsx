import { Composition } from "remotion";
import { VideoTimeline } from "./scenes/VideoTimeline";

// Durations (fps=30):
// Título: 90, Clip1: 120, Clip2: 90, Clip3: 120, Encerramento: 90 = 510
// Transitions: fade(15) + slide(20) + wipe(18) + fade(20) = 73
// Total: 510 - 73 = 437 frames
const TOTAL_FRAMES = 437;
const FPS = 30;

export const VideoEditorComposition = () => {
  return (
    <Composition
      id="VideoEditor"
      component={VideoTimeline}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1280}
      height={720}
    />
  );
};
