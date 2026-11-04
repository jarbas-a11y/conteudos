import {displayFont as fontFamily} from '../fonts';
import React from 'react';
import {AbsoluteFill, CanvasImage, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, IMGS} from '../constants';


export const Scene06Conversation: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const cutEvery = 70;
  const imgIndex = Math.min(Math.floor(frame / cutEvery), 3);
  const imgs = IMGS.conversation;

  const overlayOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const captionOpacity = interpolate(frame, [20, 35, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const captionY = interpolate(frame, [20, 35], [30, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Split screen collage effect
  const collageFraction = interpolate(frame, [140, 180], [0, 0.42], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* Main b-roll */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <CanvasImage
          src={imgs[imgIndex % imgs.length]}
          style={{
            position: 'absolute', left: 0, top: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>

      {/* Collage second image slides in */}
      {collageFraction > 0 && (
        <div style={{
          position: 'absolute',
          right: 0, top: 0,
          width: `${collageFraction * 100}%`,
          height: '100%',
          overflow: 'hidden',
          boxShadow: `-8px 0 40px ${COLORS.bg}`,
        }}>
          <CanvasImage
            src={imgs[(imgIndex + 1) % imgs.length]}
            style={{
              position: 'absolute',
              right: 0, top: 0,
              width: `${(1 / collageFraction) * 100}%`,
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: 4,
            background: `linear-gradient(to bottom, transparent, ${COLORS.purple}, ${COLORS.blue}, transparent)`,
            boxShadow: `0 0 20px ${COLORS.purple}`,
          }} />
        </div>
      )}

      {/* Purple gradient overlay */}
      <AbsoluteFill style={{
        background: `linear-gradient(to bottom,
          ${COLORS.bg}cc 0%,
          transparent 20%,
          transparent 55%,
          ${COLORS.bg}ee 100%)`,
      }} />

      {/* Purple tint */}
      <AbsoluteFill style={{
        background: `${COLORS.purple}18`,
        mixBlendMode: 'color',
      }} />

      {/* Caption */}
      <AbsoluteFill style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0 60px 150px',
        pointerEvents: 'none',
      }}>
        <div style={{
          opacity: captionOpacity,
          translate: `0 ${captionY}px`,
          fontFamily,
          fontSize: 72,
          fontWeight: 800,
          lineHeight: 1.2,
          textAlign: 'center',
          color: COLORS.white,
          textShadow: '0 4px 40px rgba(0,0,0,0.95)',
        }}>
          Enquanto você busca as{' '}
          <span style={{
            color: COLORS.purpleLight,
            textShadow: `0 0 50px ${COLORS.purpleLight}66`,
          }}>palavras certas</span>...
        </div>
      </AbsoluteFill>

      {/* VOX stamp top */}
      <AbsoluteFill style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start',
        padding: '80px 60px',
      }}>
        <div style={{
          opacity: captionOpacity,
          background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.blue})`,
          borderRadius: 14,
          padding: '10px 24px',
          fontFamily,
          fontSize: 28,
          fontWeight: 800,
          color: COLORS.white,
          letterSpacing: '0.08em',
        }}>VOX</div>
      </AbsoluteFill>

      <AbsoluteFill style={{backgroundColor: COLORS.bg, opacity: overlayOpacity}} />
    </AbsoluteFill>
  );
};
