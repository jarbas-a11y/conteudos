import {displayFont as fontFamily} from '../fonts';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../constants';


export const Scene11Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const overlayOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Typewriter for closing line
  const closing = 'a conversa continua acontecendo.';
  const charsVisible = Math.floor(interpolate(frame, [15, 90], [0, closing.length], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));

  // Final punchline
  const punchOpacity = interpolate(frame, [100, 125], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const punchScale = interpolate(frame, [100, 125], [0.85, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.spring({damping: 180}),
  });

  // VOX branding fade
  const voxOpacity = interpolate(frame, [140, 160], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // BG particles
  const bgPulse = Math.sin((frame / 25) * Math.PI) * 0.5 + 0.5;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* Animated gradient bg */}
      <AbsoluteFill style={{
        background: `
          radial-gradient(ellipse 100% 80% at 50% 50%,
            ${COLORS.purple}${Math.round(bgPulse * 0.2 * 255).toString(16).padStart(2, '0')} 0%,
            transparent 60%),
          radial-gradient(ellipse 60% 40% at 20% 80%, ${COLORS.blue}22 0%, transparent 50%),
          radial-gradient(ellipse 40% 30% at 80% 20%, ${COLORS.magenta}18 0%, transparent 40%)
        `,
      }} />

      {/* Noise lines */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: 0, right: 0,
          top: `${10 + i * 11}%`,
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${COLORS.purple}${i % 2 === 0 ? '33' : '18'} 50%, transparent 100%)`,
          opacity: interpolate(frame, [i * 8, i * 8 + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }} />
      ))}

      {/* Typewriter line */}
      <div style={{
        position: 'absolute',
        left: 60, right: 60, top: '30%',
        fontFamily,
        fontSize: 46,
        fontWeight: 700,
        color: COLORS.muted,
        lineHeight: 1.4,
        textAlign: 'center',
      }}>
        Enquanto você procura o jeito perfeito de dizer alguma coisa,
        <span style={{color: COLORS.purpleLight}}>
          {' '}{closing.slice(0, charsVisible)}
        </span>
        <span style={{
          display: 'inline-block',
          width: 3, height: '1em',
          background: COLORS.purpleLight,
          marginLeft: 2,
          verticalAlign: 'text-bottom',
          opacity: charsVisible < closing.length ? 1 : Math.sin(frame * 0.3) > 0 ? 1 : 0,
        }} />
      </div>

      {/* Punchline */}
      <div style={{
        position: 'absolute',
        left: 60, right: 60, bottom: 240,
        opacity: punchOpacity,
        scale: String(punchScale),
        transformOrigin: 'center bottom',
        fontFamily,
        fontSize: 76,
        fontWeight: 800,
        lineHeight: 1.2,
        textAlign: 'center',
        background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.blue})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: `drop-shadow(0 0 40px ${COLORS.purple}88)`,
      }}>
        A sua opinião pode ficar só na sua cabeça.
      </div>

      {/* VOX branding */}
      <div style={{
        position: 'absolute',
        bottom: 90, left: 0, right: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        opacity: voxOpacity,
        gap: 12,
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.blue})`,
          borderRadius: 18,
          padding: '12px 32px',
          fontFamily,
          fontSize: 36,
          fontWeight: 800,
          color: COLORS.white,
          letterSpacing: '0.1em',
          boxShadow: `0 8px 40px ${COLORS.purple}66`,
        }}>VOX</div>
        <div style={{
          fontFamily,
          fontSize: 24,
          fontWeight: 700,
          color: `${COLORS.muted}`,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>Comunicação de dentro para fora</div>
      </div>

      <AbsoluteFill style={{backgroundColor: COLORS.bg, opacity: overlayOpacity}} />
    </AbsoluteFill>
  );
};
