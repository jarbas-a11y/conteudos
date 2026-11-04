import {displayFont as fontFamily} from '../fonts';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../constants';


const conditions = [
  {text: '"Eu só vou falar quando tiver certeza."', delay: 0},
  {text: '"Vou esperar encontrar uma maneira melhor."', delay: 70},
  {text: '"Depois eu comento."', delay: 140},
];

const ConditionCard: React.FC<{
  text: string;
  delay: number;
  totalDuration: number;
  index: number;
}> = ({text, delay, totalDuration, index}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;

  const opacity = interpolate(local, [0, 15, totalDuration - delay - 20, totalDuration - delay], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const x = interpolate(local, [0, 18], [120, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const colors = [COLORS.purple, COLORS.blue, COLORS.magenta];
  const color = colors[index % colors.length];

  // Strikethrough animation - appears after all cards
  const strikeWidth = interpolate(frame, [220, 250 + index * 10], [0, 100], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      opacity,
      translate: `${x}px 0`,
      marginBottom: 24,
      position: 'relative',
      padding: '26px 36px',
      borderRadius: 24,
      border: `1.5px solid ${color}55`,
      background: `linear-gradient(135deg, ${color}18, transparent)`,
      backdropFilter: 'blur(20px)',
      overflow: 'hidden',
    }}>
      {/* Strike-through bar */}
      <div style={{
        position: 'absolute',
        left: 0, top: '50%',
        height: 3,
        width: `${strikeWidth}%`,
        background: `linear-gradient(90deg, ${COLORS.magenta}, ${COLORS.purple})`,
        marginTop: -1,
        borderRadius: 2,
        boxShadow: `0 0 20px ${COLORS.magenta}88`,
      }} />

      <span style={{
        fontFamily,
        fontSize: 50,
        fontWeight: 700,
        color: frame > 215 ? `${COLORS.muted}` : COLORS.white,
        lineHeight: 1.3,
        fontStyle: 'italic',
        display: 'block',
      }}>
        {text}
      </span>
    </div>
  );
};

export const Scene08Conditions: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const overlayOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const conclusionOpacity = interpolate(frame, [210, 230, durationInFrames - 15, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // BG scan line
  const scanY = (frame * 8) % 1920;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* BG gradient */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 90% 70% at 50% 50%, ${COLORS.purple}1a 0%, transparent 65%)`,
      }} />

      {/* Scan line */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        top: scanY,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${COLORS.purple}44, transparent)`,
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 60px',
      }}>
        {/* Header */}
        <div style={{
          opacity: headerOpacity,
          fontFamily,
          fontSize: 38,
          fontWeight: 700,
          color: COLORS.muted,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 36,
        }}>As condições que cria...</div>

        {/* Condition cards */}
        {conditions.map((c, i) => (
          <ConditionCard
            key={i}
            text={c.text}
            delay={c.delay}
            totalDuration={durationInFrames}
            index={i}
          />
        ))}

        {/* Conclusion */}
        <div style={{
          opacity: conclusionOpacity,
          marginTop: 36,
          fontFamily,
          fontSize: 60,
          fontWeight: 800,
          color: COLORS.white,
          lineHeight: 1.25,
          textAlign: 'center',
          padding: '28px 20px',
          borderRadius: 24,
          background: `linear-gradient(135deg, ${COLORS.purple}33, ${COLORS.blue}22)`,
          border: `1.5px solid ${COLORS.purple}44`,
        }}>
          Quanto mais espera,{' '}
          <span style={{color: COLORS.magenta}}>menos oportunidades</span>{' '}
          de experimentar.
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{backgroundColor: COLORS.bg, opacity: overlayOpacity}} />
    </AbsoluteFill>
  );
};
