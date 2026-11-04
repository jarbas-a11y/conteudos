import {bodyFont as captionFont} from './fonts';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from './constants';


interface CaptionProps {
  text: string;
  startFrame?: number;
  durationInFrames?: number;
  position?: 'top' | 'center' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  highlight?: string;
  highlightWords?: string[];
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
}

export const Caption: React.FC<CaptionProps> = ({
  text,
  startFrame = 0,
  durationInFrames,
  position = 'bottom',
  size = 'lg',
  color = COLORS.white,
  highlight = COLORS.purpleLight,
  highlightWords = [],
  align = 'center',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  const dur = durationInFrames ?? 60;

  const opacity = interpolate(
    localFrame,
    [0, 8, dur - 10, dur],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}
  );

  const translateY = interpolate(
    localFrame,
    [0, 12],
    [30, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}
  );

  const fontSizeMap = {sm: 52, md: 68, lg: 84};
  const fontSize = fontSizeMap[size];

  const words = text.split(' ');

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: position === 'center' ? 'center' : position === 'bottom' ? 'flex-end' : 'flex-start',
        justifyContent: 'center',
        padding: '0 60px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          opacity,
          translate: position !== 'center' ? `0px ${translateY}px` : undefined,
          fontFamily: captionFont,
          fontSize,
          fontWeight: 700,
          lineHeight: 1.15,
          textAlign: align,
          marginBottom: position === 'bottom' ? 160 : undefined,
          marginTop: position === 'top' ? 160 : undefined,
          ...style,
        }}
      >
        {words.map((word, i) => {
          const isHighlighted = highlightWords.some((hw) =>
            word.toLowerCase().includes(hw.toLowerCase())
          );
          const wordDelay = i * 1.5;
          const wordOpacity = interpolate(
            localFrame,
            [wordDelay, wordDelay + 5],
            [0, 1],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
          );
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: wordOpacity,
                color: isHighlighted ? highlight : color,
                marginRight: '0.25em',
                textShadow: isHighlighted
                  ? `0 0 40px ${highlight}88`
                  : '0 2px 20px rgba(0,0,0,0.9)',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const CaptionBlock: React.FC<{
  lines: Array<{text: string; highlight?: boolean}>;
  startFrame?: number;
  durationInFrames?: number;
  style?: React.CSSProperties;
}> = ({lines, startFrame = 0, durationInFrames = 90, style = {}}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const opacity = interpolate(
    localFrame,
    [0, 8, durationInFrames - 10, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <div style={{opacity, fontFamily: captionFont, ...style}}>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            color: line.highlight ? COLORS.purpleLight : COLORS.white,
            fontWeight: 700,
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};
