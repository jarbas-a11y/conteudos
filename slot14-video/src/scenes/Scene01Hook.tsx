import {displayFont as fontFamily} from '../fonts';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../constants';


export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const badgeScale = interpolate(frame, [5, 20], [0.6, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.spring({damping: 180}),
  });

  const overlayOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* Gradient bg */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 80%, ${COLORS.purple}44 0%, transparent 70%),
                     radial-gradient(ellipse 60% 40% at 20% 20%, ${COLORS.blue}33 0%, transparent 60%)`,
      }} />

      {/* Character placeholder */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 200,
      }}>
        <div style={{
          width: 680,
          height: 900,
          borderRadius: 32,
          border: `2px solid ${COLORS.purple}66`,
          background: `linear-gradient(160deg, ${COLORS.purpleDim}44 0%, ${COLORS.bg} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Grid lines */}
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: 0, right: 0,
              top: `${(i + 1) * (100 / 7)}%`,
              height: 1,
              background: `${COLORS.purple}22`,
            }} />
          ))}
          <div style={{
            fontFamily,
            fontSize: 26,
            fontWeight: 700,
            color: `${COLORS.purpleLight}99`,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>Câmera — Personagem</div>
          <div style={{
            width: 120, height: 120,
            borderRadius: '50%',
            border: `2px solid ${COLORS.purple}66`,
            background: `${COLORS.purple}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="22" r="12" fill={`${COLORS.purpleLight}66`} />
              <ellipse cx="30" cy="52" rx="22" ry="14" fill={`${COLORS.purpleLight}44`} />
            </svg>
          </div>
          <div style={{
            marginTop: 20,
            fontFamily,
            fontSize: 20,
            color: `${COLORS.muted}`,
            letterSpacing: '0.1em',
          }}>Momento 1 / 2</div>
        </div>
      </AbsoluteFill>

      {/* VOX badge */}
      <AbsoluteFill style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start',
        padding: '80px 60px',
        opacity: logoOpacity,
      }}>
        <div style={{
          scale: String(badgeScale),
          background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.blue})`,
          borderRadius: 16,
          padding: '12px 28px',
          fontFamily,
          fontSize: 32,
          fontWeight: 800,
          color: COLORS.white,
          letterSpacing: '0.08em',
        }}>VOX</div>
      </AbsoluteFill>

      {/* Caption */}
      <AbsoluteFill style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0 60px 160px',
      }}>
        {(() => {
          const textOpacity = interpolate(frame, [20, 35], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          const textY = interpolate(frame, [20, 35], [30, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <div style={{
              opacity: textOpacity,
              translate: `0 ${textY}px`,
              fontFamily,
              fontSize: 72,
              fontWeight: 800,
              color: COLORS.white,
              lineHeight: 1.15,
              textAlign: 'center',
              textShadow: '0 4px 30px rgba(0,0,0,0.9)',
            }}>
              Você já deixou de dar uma <span style={{color: COLORS.purpleLight}}>opinião</span>
            </div>
          );
        })()}
      </AbsoluteFill>

      {/* Fade out */}
      <AbsoluteFill style={{
        backgroundColor: COLORS.bg,
        opacity: overlayOpacity,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
