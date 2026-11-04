import {displayFont as fontFamily} from '../fonts';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../constants';


const req = [
  {text: 'inteligente', icon: '✦', color: COLORS.purpleLight},
  {text: 'palavras bem escolhidas', icon: '✦', color: COLORS.blueLight},
  {text: 'que ninguém interprete errado', icon: '✦', color: COLORS.magenta},
  {text: 'que todo mundo ache interessante', icon: '✦', color: COLORS.gold},
];

const RequirementItem: React.FC<{
  text: string;
  icon: string;
  color: string;
  startFrame: number;
  durationInFrames: number;
  highlight?: boolean;
}> = ({text, icon, color, startFrame, durationInFrames, highlight = false}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  const opacity = interpolate(local, [0, 12, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const x = interpolate(local, [0, 15], [-80, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const scale = interpolate(local, [0, 15], [0.9, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      opacity,
      translate: `${x}px 0`,
      scale: String(scale),
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '22px 36px',
      borderRadius: 20,
      marginBottom: 18,
      background: highlight
        ? `linear-gradient(135deg, ${color}22, ${color}11)`
        : `${COLORS.bgGlass}`,
      border: `1.5px solid ${color}44`,
      backdropFilter: 'blur(20px)',
    }}>
      <span style={{
        fontSize: 28,
        color,
        textShadow: `0 0 20px ${color}`,
      }}>{icon}</span>
      <span style={{
        fontFamily,
        fontSize: 48,
        fontWeight: 700,
        color: highlight ? color : COLORS.white,
        lineHeight: 1.2,
      }}>{text}</span>
    </div>
  );
};

export const Scene04Requirements: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const headerY = interpolate(frame, [0, 20], [-40, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const overlayOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Problem label appears late
  const problemOpacity = interpolate(frame, [220, 240], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const orbs = [
    {x: -100, y: 300, color: COLORS.purple, size: 500, speed: 0.3},
    {x: 900, y: 1200, color: COLORS.blue, size: 400, speed: 0.2},
    {x: 400, y: 1600, color: COLORS.magenta, size: 300, speed: 0.4},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* Background orbs */}
      {orbs.map((orb, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: orb.x + Math.sin(frame * orb.speed * 0.05) * 20,
          top: orb.y + Math.cos(frame * orb.speed * 0.05) * 15,
          width: orb.size,
          height: orb.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${orb.color}25 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      ))}

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
          translate: `0 ${headerY}px`,
          fontFamily,
          fontSize: 42,
          fontWeight: 700,
          color: `${COLORS.muted}`,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 30,
        }}>Você quer que sua opinião seja...</div>

        {/* Requirements list */}
        {req.map((r, i) => (
          <RequirementItem
            key={r.text}
            text={r.text}
            icon={r.icon}
            color={r.color}
            startFrame={30 + i * 40}
            durationInFrames={durationInFrames - 30 - i * 40}
            highlight={i < 2}
          />
        ))}

        {/* Problem statement */}
        <div style={{
          opacity: problemOpacity,
          marginTop: 40,
          padding: '28px 36px',
          borderRadius: 20,
          background: `linear-gradient(135deg, ${COLORS.purple}33, ${COLORS.magenta}22)`,
          border: `1.5px solid ${COLORS.magenta}55`,
        }}>
          <div style={{
            fontFamily,
            fontSize: 54,
            fontWeight: 800,
            color: COLORS.white,
            lineHeight: 1.2,
          }}>
            Mas existe um <span style={{color: COLORS.magenta}}>problema</span> nisso.
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{backgroundColor: COLORS.bg, opacity: overlayOpacity}} />
    </AbsoluteFill>
  );
};
