import {displayFont as fontFamily} from '../fonts';
import React from 'react';
import {AbsoluteFill, CanvasImage, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, IMGS} from '../constants';


const KenBurns: React.FC<{
  src: string;
  from?: number;
  rotation?: number;
  scale?: number;
  x?: number;
  y?: number;
  opacity?: number;
}> = ({src, from = 0, rotation = 0, scale = 1, x = 0, y = 0, opacity = 1}) => {
  const frame = useCurrentFrame();
  const local = frame - from;

  const zoom = interpolate(local, [0, 180], [scale, scale * 1.08], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const panX = interpolate(local, [0, 180], [0, 15], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      position: 'absolute',
      width: '100%', height: '100%',
      left: 0, top: 0,
      opacity,
      overflow: 'hidden',
    }}>
      <CanvasImage
        src={src}
        style={{
          position: 'absolute',
          width: `${zoom * 100}%`,
          height: `${zoom * 100}%`,
          left: `${-((zoom - 1) * 50) + panX}%`,
          top: `${-((zoom - 1) * 50)}%`,
          objectFit: 'cover',
          rotate: `${rotation}deg`,
          translate: `${x}px ${y}px`,
        }}
      />
    </div>
  );
};

export const Scene02Thinking: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const totalFrames = durationInFrames;
  const cutEvery = Math.floor(totalFrames / 3);
  const imgIndex = Math.min(Math.floor(frame / cutEvery), 2);

  const cutFlash = (frame % cutEvery < 3) && frame > 3
    ? interpolate(frame % cutEvery, [0, 3], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;

  const overlayOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const captionOpacity = interpolate(frame, [15, 30, totalFrames - 15, totalFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const captionY = interpolate(frame, [15, 30], [25, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* B-roll images with hard cuts */}
      <KenBurns src={IMGS.thinking[0]} scale={1} />
      {imgIndex >= 1 && <KenBurns src={IMGS.thinking[1]} scale={1.05} />}
      {imgIndex >= 2 && <KenBurns src={IMGS.thinking[2]} scale={1} rotation={-1} />}

      {/* Cut flash */}
      <AbsoluteFill style={{backgroundColor: 'white', opacity: cutFlash * 0.4}} />

      {/* Gradient overlay - purple vignette */}
      <AbsoluteFill style={{
        background: `linear-gradient(to bottom,
          ${COLORS.bg}99 0%,
          transparent 25%,
          transparent 60%,
          ${COLORS.bg}ee 100%)`,
      }} />

      {/* Purple tint overlay */}
      <AbsoluteFill style={{
        background: `${COLORS.purple}22`,
        mixBlendMode: 'color',
      }} />

      {/* Caption — synced to narration */}
      <AbsoluteFill style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0 60px 140px',
        pointerEvents: 'none',
      }}>
        <div style={{
          opacity: captionOpacity,
          translate: `0 ${captionY}px`,
          fontFamily,
          fontSize: 76,
          fontWeight: 800,
          color: COLORS.white,
          lineHeight: 1.15,
          textAlign: 'center',
          textShadow: '0 4px 40px rgba(0,0,0,0.95)',
        }}>
          <span style={{color: COLORS.purpleLight}}>Pensa</span> na frase.{' '}
          Muda uma palavra.{' '}
          <span style={{color: COLORS.purpleLight}}>Reconsidera</span> o tom.
        </div>
      </AbsoluteFill>

      {/* Scene tag top right */}
      <AbsoluteFill style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
        padding: '80px 60px',
      }}>
        <div style={{
          fontFamily,
          fontSize: 22,
          fontWeight: 700,
          color: `${COLORS.purpleLight}bb`,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          opacity: captionOpacity,
        }}>B-ROLL</div>
      </AbsoluteFill>

      <AbsoluteFill style={{backgroundColor: COLORS.bg, opacity: overlayOpacity}} />
    </AbsoluteFill>
  );
};
