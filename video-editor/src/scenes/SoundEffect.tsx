import { Audio } from "@remotion/media";

type SoundEffectProps = {
  src: string;
  volume?: number;
  from?: number;
};

export const SoundEffect: React.FC<SoundEffectProps> = ({
  src,
  volume = 0.6,
  from = 0,
}) => {
  return (
    <Audio
      src={src}
      volume={volume}
      from={from}
    />
  );
};

export const SFX = {
  whoosh: "https://remotion.media/whoosh.wav",
  whip: "https://remotion.media/whip.wav",
  ding: "https://remotion.media/ding.wav",
  shutter: "https://remotion.media/shutter-modern.wav",
  switch: "https://remotion.media/switch.wav",
  pageTurn: "https://remotion.media/page-turn.wav",
};
