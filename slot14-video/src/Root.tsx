import {Composition} from 'remotion';
import {Slot14} from './Slot14';
import {TOTAL_FRAMES, FPS, WIDTH, HEIGHT} from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Slot14"
        component={Slot14}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
