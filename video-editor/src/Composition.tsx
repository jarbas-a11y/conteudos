import { Composition } from "remotion";
import { VideoTimeline } from "./scenes/VideoTimeline";
import { ReelsComposition as EmotionDesignDemo } from "./scenes/ReelsComposition";
import { ReelsComposition } from "./scenes/ReelsComposition";

const FPS = 30;
// Vídeo editado: 39s → 1170 frames
const REELS_FRAMES = 1170;
const EMOTION_FRAMES = 150;
const TIMELINE_FRAMES = 437;

export const VideoEditorComposition = () => {
  return (
    <>
      {/* Composição principal: Reels 9:16 com legendas + emotion design */}
      <Composition
        id="Reels"
        component={ReelsComposition}
        durationInFrames={REELS_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
      {/* Demo de emotion design isolado */}
      <Composition
        id="EmotionDesign"
        component={EmotionDesignDemo}
        durationInFrames={EMOTION_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
      {/* Timeline 16:9 original */}
      <Composition
        id="VideoEditor"
        component={VideoTimeline}
        durationInFrames={TIMELINE_FRAMES}
        fps={FPS}
        width={1280}
        height={720}
      />
    </>
  );
};
