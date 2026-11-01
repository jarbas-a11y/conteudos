import { AbsoluteFill } from "remotion";
import { Video } from "@remotion/media";
import { staticFile } from "remotion";
import { CaptionOverlay } from "./CaptionOverlay";
import { LowerThird } from "./LowerThird";
import { vignette } from "@remotion/effects/vignette";

// Substitua "meu-video.mp4" pelo nome do seu arquivo em public/
// e "captions.json" pelo arquivo gerado pelo script de transcrição
const VIDEO_FILE = "meu-video.mp4";
const CAPTIONS_FILE = "captions.json";

export const CaptionedVideo: React.FC = () => {
  return (
    <AbsoluteFill name="CaptionedVideo">
      {/* Vídeo principal */}
      <Video
        src={staticFile(VIDEO_FILE)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        effects={[vignette({ amount: 0.25 })]}
      />

      {/* Legendas interativas com destaque de palavra */}
      <CaptionOverlay captionsFile={CAPTIONS_FILE} />

      {/* Lower third opcional */}
      <LowerThird
        name="Jarbas Terapeuta"
        role="Mentoria em NeuroComunicação"
        from={0}
        durationInFrames={90}
      />
    </AbsoluteFill>
  );
};
