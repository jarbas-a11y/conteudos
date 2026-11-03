import { Composition } from "remotion";
import { VideoTimeline } from "./scenes/VideoTimeline";
import { ReelsComposition as EmotionDesignDemo } from "./scenes/ReelsComposition";
import { ReelsComposition } from "./scenes/ReelsComposition";
import { ReelsPro, REELS_PRO_FRAMES } from "./pro/ReelsPro";
import { Autocensura, AUTO_FRAMES } from "./auto/Autocensura";
import { PuppetTest } from "./auto/PuppetTest";
import { Vox1, V1_DURATION } from "./vox/video1";
import { Vox2, V2_DURATION } from "./vox/video2";
import { Vox3, V3_DURATION } from "./vox/video3";
import { Vox4, V4_DURATION } from "./vox/video4";
import { Vox5, V5_DURATION } from "./vox/video5";

const FPS = 30;
// Vídeo editado: 39s → 1170 frames
const REELS_FRAMES = 1170;
const EMOTION_FRAMES = 150;
const TIMELINE_FRAMES = 437;

export const VideoEditorComposition = () => {
  return (
    <>
      <Composition id="Vox5" component={Vox5} durationInFrames={Math.round(V5_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="Vox4" component={Vox4} durationInFrames={Math.round(V4_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="Vox3" component={Vox3} durationInFrames={Math.round(V3_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="Vox2" component={Vox2} durationInFrames={Math.round(V2_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="Vox1" component={Vox1} durationInFrames={Math.round(V1_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="PuppetTest" component={PuppetTest} durationInFrames={60} fps={FPS} width={1080} height={1920} />
      <Composition id="Autocensura" component={Autocensura} durationInFrames={AUTO_FRAMES} fps={FPS} width={1080} height={1920} />
      <Composition id="ReelsPro" component={ReelsPro} durationInFrames={REELS_PRO_FRAMES} fps={FPS} width={1080} height={1920} />
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
