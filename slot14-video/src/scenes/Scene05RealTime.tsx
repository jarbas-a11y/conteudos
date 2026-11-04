import {displayFont as fontFamily} from '../fonts';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../constants';


export const Scene05RealTime: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const overlayOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Clock animation
  const clockOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const secondsAngle = (frame / 30) * 360; // one rotation per second
  const minutesAngle = (frame / (30 * 60)) * 360;

  // Text phases
  const text1Opacity = interpolate(frame, [15, 30, 90, 105], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const text2Opacity = interpolate(frame, [100, 115, durationInFrames - 15, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const pulseScale = 1 + interpolate(Math.sin((frame / 20) * Math.PI), [-1, 1], [0, 0.03], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const clockSize = 320;
  const cx = 540;
  const cy = 820;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* BG gradient */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 100% 80% at 50% 50%, ${COLORS.blue}1a 0%, transparent 70%)`,
      }} />

      {/* Clock SVG */}
      <div style={{
        position: 'absolute',
        left: cx - clockSize / 2,
        top: cy - clockSize / 2,
        width: clockSize,
        height: clockSize,
        opacity: clockOpacity,
        scale: String(pulseScale),
      }}>
        <svg width={clockSize} height={clockSize} viewBox={`0 0 ${clockSize} ${clockSize}`}>
          {/* Clock face */}
          <circle cx={clockSize/2} cy={clockSize/2} r={clockSize/2 - 4}
            fill="none" stroke={`${COLORS.purple}66`} strokeWidth="3" />
          <circle cx={clockSize/2} cy={clockSize/2} r={clockSize/2 - 20}
            fill={`${COLORS.bg}dd`} />
          {/* Hour marks */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
            const r1 = clockSize/2 - 28;
            const r2 = clockSize/2 - 44;
            return (
              <line
                key={i}
                x1={clockSize/2 + Math.cos(angle) * r1}
                y1={clockSize/2 + Math.sin(angle) * r1}
                x2={clockSize/2 + Math.cos(angle) * r2}
                y2={clockSize/2 + Math.sin(angle) * r2}
                stroke={i % 3 === 0 ? COLORS.purpleLight : `${COLORS.muted}88`}
                strokeWidth={i % 3 === 0 ? 4 : 2}
              />
            );
          })}
          {/* Minutes hand */}
          <line
            x1={clockSize/2} y1={clockSize/2}
            x2={clockSize/2 + Math.cos((minutesAngle - 90) * Math.PI / 180) * (clockSize/2 - 50)}
            y2={clockSize/2 + Math.sin((minutesAngle - 90) * Math.PI / 180) * (clockSize/2 - 50)}
            stroke={COLORS.blue} strokeWidth="4" strokeLinecap="round"
          />
          {/* Seconds hand */}
          <line
            x1={clockSize/2} y1={clockSize/2}
            x2={clockSize/2 + Math.cos((secondsAngle - 90) * Math.PI / 180) * (clockSize/2 - 35)}
            y2={clockSize/2 + Math.sin((secondsAngle - 90) * Math.PI / 180) * (clockSize/2 - 35)}
            stroke={COLORS.magenta} strokeWidth="3" strokeLinecap="round"
          />
          {/* Center dot */}
          <circle cx={clockSize/2} cy={clockSize/2} r="8" fill={COLORS.purple} />
        </svg>
      </div>

      {/* Text: phase 1 */}
      <AbsoluteFill style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '130px 60px 0',
        pointerEvents: 'none',
      }}>
        <div style={{
          opacity: text1Opacity,
          translate: `0 ${interpolate(frame, [15, 30], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}px`,
          fontFamily,
          fontSize: 86,
          fontWeight: 800,
          color: COLORS.white,
          lineHeight: 1.1,
          textAlign: 'center',
        }}>
          Uma conversa acontece em{' '}
          <span style={{
            color: COLORS.magenta,
            textShadow: `0 0 60px ${COLORS.magenta}88`,
          }}>tempo real.</span>
        </div>
      </AbsoluteFill>

      {/* Text: phase 2 */}
      <AbsoluteFill style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0 60px 160px',
        pointerEvents: 'none',
      }}>
        <div style={{
          opacity: text2Opacity,
          translate: `0 ${interpolate(frame, [100, 115], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}px`,
          fontFamily,
          fontSize: 60,
          fontWeight: 700,
          color: COLORS.muted,
          lineHeight: 1.25,
          textAlign: 'center',
          background: `${COLORS.bgGlass}`,
          borderRadius: 20,
          padding: '24px 32px',
          border: `1px solid ${COLORS.purple}33`,
          backdropFilter: 'blur(20px)',
        }}>
          Enquanto você revisa a 5ª versão da mesma frase,{' '}
          <span style={{color: COLORS.white}}>as outras pessoas continuam conversando.</span>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{backgroundColor: COLORS.bg, opacity: overlayOpacity}} />
    </AbsoluteFill>
  );
};
