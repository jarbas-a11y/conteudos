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
import { Vox6, V6_DURATION } from "./vox/video6";
import { Vox7, V7_DURATION } from "./vox/video7";
import { Vox11, V11_DURATION } from "./vox2/v11";
import { Carousel9, Carousel12 } from "./vox2/carousel";
import { Vox13, V13_DURATION } from "./vox2/v13";
import { Vox14, V14_DURATION } from "./vox2/v14";
import { Vox10, V10_DURATION } from "./vox2/v10";
import { Vox8, V8_DURATION } from "./vox2/v8";

const FPS = 30;
// Vídeo editado: 39s → 1170 frames
const REELS_FRAMES = 1170;
const EMOTION_FRAMES = 150;
const TIMELINE_FRAMES = 437;

export const VideoEditorComposition = () => {
  return (
    <>
      <Composition id="Carousel9" component={Carousel9} durationInFrames={10} fps={30} width={1080} height={1350} />
      <Composition id="Carousel12" component={Carousel12} durationInFrames={10} fps={30} width={1080} height={1350} />
      <Composition id="Vox8" component={Vox8} durationInFrames={Math.round(V8_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="Vox10" component={Vox10} durationInFrames={Math.round(V10_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="Vox14" component={Vox14} durationInFrames={Math.round(V14_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="Vox13" component={Vox13} durationInFrames={Math.round(V13_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="Vox11" component={Vox11} durationInFrames={Math.round(V11_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="Vox7" component={Vox7} durationInFrames={Math.round(V7_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="Vox6" component={Vox6} durationInFrames={Math.round(V6_DURATION * FPS)} fps={FPS} width={1080} height={1920} />
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
