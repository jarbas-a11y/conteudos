import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Video, Audio } from "@remotion/media";
import { vignette } from "@remotion/effects/vignette";
import { chromaticAberration } from "@remotion/effects/chromatic-aberration";
import { ZoomClip } from "./ZoomClip";
import { TitleScene } from "./TitleScene";
import { LowerThird } from "./LowerThird";
import { SFX } from "./SoundEffect";

// Demo clips from remotion.media (replace with staticFile() for your own clips)
const CLIP_A = "https://remotion.media/video.mp4";
const CLIP_B = "https://remotion.media/video.webm";

export const VideoTimeline: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Chromatic aberration flash at hard cuts
  const cutFlash = interpolate(
    frame % (3 * fps),
    [0, 2, 4],
    [12, 0, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill name="VideoTimeline">
      {/* Background music (replace with your own track) */}
      <Audio src={CLIP_A} volume={0.08} />

      {/* Sound effects at specific frames */}
      <Audio src={SFX.whoosh} from={3 * fps} volume={0.5} />
      <Audio src={SFX.whip} from={6 * fps} volume={0.4} />
      <Audio src={SFX.ding} from={9 * fps} volume={0.5} />

      {/* Main video timeline with ripple editing */}
      <TransitionSeries name="Video timeline">

        {/* Cena 1: Título */}
        <TransitionSeries.Sequence name="Título" durationInFrames={3 * fps}>
          <TitleScene
            title="Meu Vídeo"
            subtitle="Editado com Remotion"
            backgroundColor="#0a0a1a"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Cena 2: Clip com zoom */}
        <TransitionSeries.Sequence name="Clip 1 — Zoom" durationInFrames={4 * fps}>
          <ZoomClip
            src={CLIP_A}
            trimBefore={0}
            zoomFrom={1}
            zoomTo={1.3}
            zoomStartFrame={0}
            zoomEndFrame={2 * fps}
            label="Cena 1"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />

        {/* Cena 3: Segundo clip com aberração cromática */}
        <TransitionSeries.Sequence name="Clip 2 — Efeito" durationInFrames={3 * fps}>
          <AbsoluteFill name="Clip2Scene">
            <Video
              src={CLIP_B}
              trimBefore={0}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              effects={[
                vignette({ amount: 0.4 }),
                chromaticAberration({ amount: cutFlash }),
              ]}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: 18 })}
        />

        {/* Cena 4: Clip com zoom reverso + lower third */}
        <TransitionSeries.Sequence name="Clip 3 — Lower Third" durationInFrames={4 * fps}>
          <AbsoluteFill name="Clip3Scene">
            <ZoomClip
              src={CLIP_A}
              trimBefore={3 * fps}
              zoomFrom={1.3}
              zoomTo={1}
              zoomStartFrame={0}
              zoomEndFrame={3 * fps}
              label="Cena 3"
            />
            <LowerThird
              name="Nome do Apresentador"
              role="Título / Cargo"
              from={0}
              durationInFrames={3 * fps}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* Cena 5: Encerramento */}
        <TransitionSeries.Sequence name="Encerramento" durationInFrames={3 * fps}>
          <TitleScene
            title="Obrigado!"
            subtitle="Acesse remotion.dev"
            backgroundColor="#0a1a0a"
          />
        </TransitionSeries.Sequence>

      </TransitionSeries>
    </AbsoluteFill>
  );
};
