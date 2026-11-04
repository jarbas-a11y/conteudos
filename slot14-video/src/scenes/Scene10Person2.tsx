import {displayFont as fontFamily} from '../fonts';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../constants';


export const Scene10Person2: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const overlayOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const captionOpacity = interpolate(frame, [30, 50, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const captionY = interpolate(frame, [30, 50], [30, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Insight badge animation
  const badgeScale = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.spring({damping: 160}),
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, opacity: fadeIn}}>
      {/* BG gradient */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 80%, ${COLORS.blue}33 0%, transparent 70%),
                     radial-gradient(ellipse 60% 40% at 80% 10%, ${COLORS.purple}22 0%, transparent 60%)`,
      }} />

      {/* Animated line behind character */}
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: 0, right: 0,
          top: 300 + i * 350,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.purple}${i === 1 ? '55' : '22'}, transparent)`,
          transform: `scaleX(${interpolate(frame, [i * 20, i * 20 + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})})`,
        }} />
      ))}

      {/* Character placeholder */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 320,
      }}>
        <div style={{
          width: 680,
          height: 820,
          borderRadius: 32,
          border: `2px solid ${COLORS.blue}55`,
          background: `linear-gradient(160deg, ${COLORS.blue}22 0%, ${COLORS.bg} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Grid */}
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: 0, right: 0,
              top: `${(i + 1) * (100 / 6)}%`,
              height: 1,
              background: `${COLORS.blue}18`,
            }} />
          ))}
          <div style={{
            fontFamily, fontSize: 24, fontWeight: 700,
            color: `${COLORS.blueLight}88`,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>Câmera — Personagem</div>
          <div style={{
            width: 110, height: 110, borderRadius: '50%',
            border: `2px solid ${COLORS.blue}55`,
            background: `${COLORS.blue}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="55" height="55" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="22" r="12" fill={`${COLORS.blueLight}55`} />
              <ellipse cx="30" cy="52" rx="22" ry="14" fill={`${COLORS.blueLight}33`} />
            </svg>
          </div>
          <div style={{
            marginTop: 20, fontFamily, fontSize: 20,
            color: COLORS.muted, letterSpacing: '0.1em',
          }}>Momento 2 / 2</div>
        </div>
      </AbsoluteFill>

      {/* Insight badge */}
      <div style={{
        position: 'absolute',
        top: 100, right: 60,
        scale: String(badgeScale),
        transformOrigin: 'right top',
        background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.blue})`,
        borderRadius: 20,
        padding: '14px 28px',
        fontFamily,
        fontSize: 28,
        fontWeight: 800,
        color: COLORS.white,
        letterSpacing: '0.06em',
        boxShadow: `0 8px 40px ${COLORS.purple}66`,
      }}>💡 insight</div>

      {/* Caption */}
      <AbsoluteFill style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0 60px 160px',
      }}>
        <div style={{
          opacity: captionOpacity,
          translate: `0 ${captionY}px`,
          fontFamily,
          fontSize: 70,
          fontWeight: 800,
          color: COLORS.white,
          lineHeight: 1.2,
          textAlign: 'center',
          textShadow: '0 4px 30px rgba(0,0,0,0.9)',
        }}>
          Uma boa comunicação é saber lidar com o que{' '}
          <span style={{color: COLORS.purpleLight}}>não sai perfeito.</span>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{backgroundColor: COLORS.bg, opacity: overlayOpacity}} />
    </AbsoluteFill>
  );
};
