import {displayFont as fontFamily} from '../fonts';
import React from 'react';
import {AbsoluteFill, CanvasImage, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, IMGS} from '../constants';


export const Scene09Trap: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const overlayOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Split: left stress image, right motion text
  const splitProgress = interpolate(frame, [0, 20], [0, 0.42], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // "ARMADILHA" reveal
  const wordOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const wordScale = interpolate(frame, [15, 35], [1.4, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.spring({damping: 150}),
  });

  // Text phases
  const text1Opacity = interpolate(frame, [40, 55, 140, 155], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const text2Opacity = interpolate(frame, [150, 165, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const imgZoom = interpolate(frame, [0, durationInFrames], [1, 1.1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* Background stress image */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <CanvasImage
          src={IMGS.stress[0]}
          style={{
            position: 'absolute',
            width: `${imgZoom * 100}%`, height: `${imgZoom * 100}%`,
            objectFit: 'cover',
            left: `${-((imgZoom - 1) * 50)}%`,
            top: `${-((imgZoom - 1) * 50)}%`,
          }}
        />
      </AbsoluteFill>

      {/* Heavy dark overlay */}
      <AbsoluteFill style={{
        background: `linear-gradient(to bottom, ${COLORS.bg}ee 0%, ${COLORS.bg}99 30%, ${COLORS.bg}99 70%, ${COLORS.bg}ee 100%)`,
      }} />
      <AbsoluteFill style={{background: `${COLORS.purple}33`, mixBlendMode: 'color'}} />

      {/* Right panel */}
      <div style={{
        position: 'absolute',
        right: 0, top: 0, bottom: 0,
        width: `${splitProgress * 100}%`,
        background: `linear-gradient(135deg, ${COLORS.purple}33, ${COLORS.blue}22)`,
        borderLeft: `2px solid ${COLORS.purple}66`,
        backdropFilter: 'blur(30px)',
      }} />

      {/* ARMADILHA word */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '20%',
        transform: 'translate(-50%, -50%)',
        opacity: wordOpacity,
        scale: String(wordScale),
        textAlign: 'center',
        fontFamily,
      }}>
        <div style={{
          fontSize: 48,
          fontWeight: 700,
          color: COLORS.muted,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>A maior</div>
        <div style={{
          fontSize: 118,
          fontWeight: 800,
          background: `linear-gradient(90deg, ${COLORS.magenta}, ${COLORS.purple})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
          textShadow: 'none',
          filter: `drop-shadow(0 0 40px ${COLORS.magenta}66)`,
        }}>
          ARMA<br />DILHA
        </div>
      </div>

      {/* Text 1 */}
      <div style={{
        position: 'absolute',
        left: 60, right: 60, top: '52%',
        opacity: text1Opacity,
        fontFamily,
        fontSize: 60,
        fontWeight: 700,
        color: COLORS.white,
        lineHeight: 1.3,
        textAlign: 'center',
      }}>
        Você tenta evitar ser{' '}
        <span style={{color: COLORS.magenta}}>julgado</span>
        {' '}por uma fala imperfeita...
      </div>

      {/* Text 2 */}
      <div style={{
        position: 'absolute',
        left: 60, right: 60, top: '52%',
        opacity: text2Opacity,
        fontFamily,
        fontSize: 60,
        fontWeight: 700,
        color: COLORS.white,
        lineHeight: 1.3,
        textAlign: 'center',
      }}>
        ...mas abre mão de{' '}
        <span style={{
          color: COLORS.purpleLight,
          display: 'block',
          fontSize: 72,
          fontWeight: 800,
        }}>participar da conversa.</span>
      </div>

      <AbsoluteFill style={{backgroundColor: COLORS.bg, opacity: overlayOpacity}} />
    </AbsoluteFill>
  );
};
