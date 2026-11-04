import {displayFont as fontFamily} from '../fonts';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../constants';


const FloatingWord: React.FC<{
  word: string;
  startFrame: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation?: number;
  strikethrough?: boolean;
  duration?: number;
}> = ({word, startFrame, x, y, size, color, rotation = 0, strikethrough = false, duration = 120}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  const opacity = interpolate(local, [0, 10, duration - 15, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const scale = interpolate(local, [0, 12], [0.7, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.spring({damping: 180, stiffness: 200}),
  });
  const drift = interpolate(local, [0, duration], [0, rotation > 0 ? 8 : -8], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      transform: `translate(-50%, -50%)`,
      opacity,
      scale: String(scale),
      translate: `0px ${drift}px`,
      rotate: `${rotation}deg`,
      fontFamily,
      fontSize: size,
      fontWeight: 800,
      color,
      textAlign: 'center',
      whiteSpace: 'nowrap',
      textDecoration: strikethrough ? 'line-through' : 'none',
      textShadow: `0 0 60px ${color}66`,
    }}>
      {word}
    </div>
  );
};

const TypedWord: React.FC<{
  word: string;
  startFrame: number;
  x: number;
  y: number;
  size: number;
  color: string;
  targetWord?: string;
}> = ({word, startFrame, x, y, size, color, targetWord}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  const showTarget = targetWord && local > 40;

  const opacity = interpolate(local, [0, 8, 200, 220], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const targetOpacity = interpolate(local, [40, 55], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`, top: `${y}%`,
      transform: 'translate(-50%, -50%)',
      opacity,
      fontFamily,
      fontSize: size,
      fontWeight: 800,
      textAlign: 'center',
    }}>
      <span style={{color: showTarget ? `${color}44` : color, textDecoration: showTarget ? 'line-through' : 'none'}}>
        {word}
      </span>
      {showTarget && (
        <span style={{
          color: COLORS.purpleLight,
          opacity: targetOpacity,
          marginLeft: 12,
          display: 'inline-block',
          animation: 'none',
        }}>
          {targetWord}
        </span>
      )}
    </div>
  );
};

export const Scene03Words: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const bgPulse = interpolate(
    Math.sin((frame / 20) * Math.PI),
    [-1, 1], [0.08, 0.14],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const overlayOpacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Large central counter
  const counterOpacity = interpolate(frame, [60, 75, 220, 235], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const version = Math.min(5, Math.floor((frame - 60) / 35) + 1);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* Animated bg grid */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${COLORS.purple}18 1px, transparent 1px),
                          linear-gradient(90deg, ${COLORS.purple}18 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        backgroundPosition: `${frame * 0.3}px ${frame * 0.2}px`,
      }} />

      {/* Gradient radial */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 70% 50% at 50% 50%, ${COLORS.blue}${Math.round(bgPulse * 255).toString(16).padStart(2, '0')} 0%, transparent 60%)`,
      }} />

      {/* Phase 1: Dúvidas das palavras */}
      {frame < 100 && (
        <>
          <FloatingWord word="perfeita" startFrame={0} x={50} y={30} size={110} color={COLORS.white} />
          <FloatingWord word="errada?" startFrame={15} x={50} y={52} size={80} color={`${COLORS.muted}`} rotation={-2} />
          <FloatingWord word="certa?" startFrame={30} x={50} y={70} size={80} color={`${COLORS.muted}`} rotation={1} />
        </>
      )}

      {/* Phase 2: Versões sendo criadas */}
      {frame >= 80 && frame < 200 && (
        <>
          <TypedWord word="versão 1" startFrame={80} x={50} y={25} size={72} color={COLORS.white} targetWord="versão 2" />
          <TypedWord word="versão 2" startFrame={110} x={50} y={42} size={72} color={COLORS.purpleLight} targetWord="versão 3" />
          <TypedWord word="versão 3" startFrame={140} x={50} y={59} size={72} color={COLORS.blue} targetWord="versão 4" />
          <TypedWord word="versão 4" startFrame={165} x={50} y={76} size={72} color={`${COLORS.muted}`} />
        </>
      )}

      {/* Phase 3: Contador de versões */}
      {frame >= 190 && (
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: counterOpacity,
          textAlign: 'center',
          fontFamily,
        }}>
          <div style={{
            fontSize: 220,
            fontWeight: 800,
            color: COLORS.purple,
            lineHeight: 1,
            textShadow: `0 0 120px ${COLORS.purple}88`,
          }}>{Math.min(version, 5)}</div>
          <div style={{
            fontSize: 52,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: '0.08em',
          }}>versões da mesma frase</div>
        </div>
      )}

      {/* Top label */}
      <AbsoluteFill style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '90px 60px 0',
      }}>
        <div style={{
          opacity: interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          fontFamily,
          fontSize: 36,
          fontWeight: 700,
          color: `${COLORS.purpleLight}cc`,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>Enquanto você revisa...</div>
      </AbsoluteFill>

      <AbsoluteFill style={{backgroundColor: COLORS.bg, opacity: overlayOpacity}} />
    </AbsoluteFill>
  );
};
