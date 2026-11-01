import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio, Video } from "@remotion/media";
import edit from "./edit.json";
import { clamp } from "./theme";
import { Subtitles } from "./Subtitles";
import { CostCard, EndCard, ExplainDrain, FinalStatement, Hook, ListenPrompt, Opportunities, StoryNeon, ValueChart } from "./cutaways";

const FPS = 30;
export const END_CARD_SEC = 1.6;
export const REELS_PRO_FRAMES = Math.ceil((edit.duration + END_CARD_SEC) * FPS);

const SCENES: Record<string, React.FC<{ d: number }>> = {
  hook: Hook,
  c1: ValueChart,
  c2: ExplainDrain,
  c3: CostCard,
  c4: StoryNeon,
  c5: ListenPrompt,
  c6: Opportunities,
  c7: FinalStatement,
};

// Start cutaways a few frames early so burned-in overlays never flash through the fade-in.
const LEAD = 3;
const scenes = edit.scenes.map((s) => ({
  ...s,
  from: s.id === "hook" ? 0 : Math.round(s.start * FPS) - LEAD,
  to: Math.round(s.end * FPS) + (s.id === "hook" ? 5 : 0),
}));

const segBounds = [0, ...edit.cuts.map((c) => Math.round(c * FPS)), ...scenes.map((s) => s.to)].sort((a, b) => a - b);

const TalkingHead: React.FC = () => {
  const frame = useCurrentFrame();
  let idx = 0;
  for (let i = 0; i < segBounds.length; i++) if (frame >= segBounds[i]) idx = i;
  const segStart = segBounds[idx];
  const segEnd = segBounds[idx + 1] ?? segStart + 60;
  const push = interpolate(frame, [segStart, segEnd], [0, 0.025], clamp);
  const zoom = (idx % 2 === 0 ? 1.0 : 1.09) + push;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Video
        src={staticFile("cut.mp4")}
        objectFit="cover"
        style={{
          width: "100%",
          height: "100%",
          scale: String(zoom),
          transformOrigin: "50% 12%",
          filter: "contrast(1.06) saturate(1.06) brightness(1.01)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%), radial-gradient(ellipse at 50% 35%, transparent 55%, rgba(0,0,0,0.28) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 0.4 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

export const ReelsPro: React.FC = () => {
  const { fps } = useVideoConfig();
  const endFrom = Math.round(edit.duration * fps) - 6;
  const sceneOf = (id: string) => scenes.find((s) => s.id === id)!.from;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TalkingHead />
      <Subtitles words={edit.words} hidden={scenes.map((s) => [s.from / fps, s.to / fps] as [number, number])} />

      {scenes.map((s) => {
        const Comp = SCENES[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from} layout="none">
            <Comp d={s.to - s.from} />
          </Sequence>
        );
      })}
      <Sequence from={endFrom} layout="none">
        <EndCard d={REELS_PRO_FRAMES - endFrom} />
      </Sequence>

      {scenes.filter((s) => s.id !== "hook").map((s) => (
        <Sfx key={`w${s.id}`} at={s.from - 2} src="whoosh" volume={0.28} />
      ))}
      <Sfx at={26} src="whip" volume={0.3} />
      <Sfx at={sceneOf("c3") + 46} src="ding" volume={0.22} />
      <Sfx at={sceneOf("c5") + 38} src="mouse-click" volume={0.6} />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} at={sceneOf("c6") + 14 + i * 8} src="switch" volume={0.3} />
      ))}
      <Sfx at={sceneOf("c7") + 88} src="whip" volume={0.3} />
      <Sfx at={endFrom} src="shutter-modern" volume={0.25} />
    </AbsoluteFill>
  );
};
