import {displayFont as fontFamily} from '../fonts';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../constants';


const Particle: React.FC<{x: number; y: number; size: number; color: string; speed: number; phase: number}> =
  ({x, y, size, color, speed, phase}) => {
  const frame = useCurrentFrame();
  const dy = (frame * speed + phase * 100) % 1920;
  const dx = Math.sin((frame + phase * 20) * 0.03) * 30;
  const opacity = interpolate(dy, [0, 200, 1700, 1920], [0, 0.6, 0.6, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      position: 'absolute',
      left: x + dx,
      top: 1920 - dy,
      width: size, height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity,
    }} />
  );
};

export const Scene07Perfectionism: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const overlayOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Central word animation
  const wordScale = interpolate(frame, [0, 20], [0.5, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.spring({damping: 150, stiffness: 300}),
  });
  const wordOpacity = interpolate(frame, [0, 15, durationInFrames - 15, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Orbit rings
  const orbitAngle = frame * 1.5;
  const orbit2Angle = -(frame * 1.2);

  // Explanation text phases
  const exp1Opacity = interpolate(frame, [60, 80, 170, 185], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const exp2Opacity = interpolate(frame, [180, 200, durationInFrames - 15, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const particles = [
    {x: 100, y: 400, size: 8, color: COLORS.purple, speed: 2.5, phase: 0},
    {x: 300, y: 800, size: 5, color: COLORS.blue, speed: 1.8, phase: 0.3},
    {x: 700, y: 200, size: 10, color: COLORS.magenta, speed: 3, phase: 0.7},
    {x: 900, y: 1200, size: 6, color: COLORS.purpleLight, speed: 2, phase: 0.5},
    {x: 500, y: 600, size: 7, color: COLORS.blue, speed: 2.2, phase: 0.9},
    {x: 200, y: 1600, size: 9, color: COLORS.purple, speed: 1.5, phase: 0.2},
    {x: 800, y: 1000, size: 5, color: COLORS.magenta, speed: 2.8, phase: 0.6},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* Particles */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* BG gradient */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 45%, ${COLORS.purple}22 0%, transparent 65%)`,
      }} />

      {/* SVG Orbit rings */}
      <svg style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%'}} viewBox="0 0 1080 1920">
        <ellipse
          cx="540" cy="860"
          rx="380" ry="140"
          fill="none"
          stroke={`${COLORS.purple}44`}
          strokeWidth="2"
          transform={`rotate(${orbitAngle} 540 860)`}
        />
        <ellipse
          cx="540" cy="860"
          rx="500" ry="180"
          fill="none"
          stroke={`${COLORS.blue}33`}
          strokeWidth="1.5"
          transform={`rotate(${orbit2Angle} 540 860)`}
        />
        {/* Orbit dots */}
        <circle
          cx={540 + 380 * Math.cos((orbitAngle * Math.PI) / 180)}
          cy={860 + 140 * Math.sin((orbitAngle * Math.PI) / 180)}
          r="10" fill={COLORS.purple}
        />
        <circle
          cx={540 + 500 * Math.cos((orbit2Angle * Math.PI) / 180)}
          cy={860 + 180 * Math.sin((orbit2Angle * Math.PI) / 180)}
          r="7" fill={COLORS.blue}
        />
      </svg>

      {/* Central PERFECCIONISMO word */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '45%',
        transform: 'translate(-50%, -50%)',
        opacity: wordOpacity,
        scale: String(wordScale),
        textAlign: 'center',
        fontFamily,
      }}>
        <div style={{
          fontSize: 92,
          fontWeight: 800,
          color: COLORS.white,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}>
          PERFEC
        </div>
        <div style={{
          fontSize: 92,
          fontWeight: 800,
          background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.blue})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}>
          CIONISMO
        </div>
      </div>

      {/* Explanation 1 */}
      <div style={{
        position: 'absolute',
        left: 60, right: 60, bottom: 350,
        opacity: exp1Opacity,
        fontFamily,
        fontSize: 56,
        fontWeight: 700,
        color: COLORS.white,
        lineHeight: 1.3,
        textAlign: 'center',
      }}>
        vem com um medo muito grande de{' '}
        <span style={{color: COLORS.magenta}}>errar</span> ou ser{' '}
        <span style={{color: COLORS.magenta}}>avaliado</span> negativamente.
      </div>

      {/* Explanation 2 */}
      <div style={{
        position: 'absolute',
        left: 60, right: 60, bottom: 180,
        opacity: exp2Opacity,
        fontFamily,
        fontSize: 56,
        fontWeight: 700,
        color: COLORS.muted,
        lineHeight: 1.3,
        textAlign: 'center',
      }}>
        Então a pessoa cria{' '}
        <span style={{
          color: COLORS.purpleLight,
          fontWeight: 800,
        }}>condições para agir.</span>
      </div>

      <AbsoluteFill style={{backgroundColor: COLORS.bg, opacity: overlayOpacity}} />
    </AbsoluteFill>
  );
};
