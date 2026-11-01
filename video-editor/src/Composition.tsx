import { Composition } from "remotion";
import { VideoTimeline } from "./scenes/VideoTimeline";
import { MotionDesignDemo } from "./scenes/MotionDesign";
import { CaptionedVideo } from "./scenes/CaptionedVideo";

// Timeline principal: 437 frames @ 30fps ≈ 14.5s
const TOTAL_FRAMES = 437;
// Motion design demo: 5s
const MOTION_FRAMES = 150;
// Captioned video: duração depende do clipe (ajuste após transcrição)
const CAPTIONED_FRAMES = 450;
const FPS = 30;

export const VideoEditorComposition = () => {
  return (
    <>
      <Composition
        id="VideoEditor"
        component={VideoTimeline}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1280}
        height={720}
      />
      <Composition
        id="MotionDesign"
        component={MotionDesignDemo}
        durationInFrames={MOTION_FRAMES}
        fps={FPS}
        width={1280}
        height={720}
      />
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        durationInFrames={CAPTIONED_FRAMES}
        fps={FPS}
        width={1280}
        height={720}
      />
    </>
  );
};
