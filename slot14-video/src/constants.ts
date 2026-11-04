export const COLORS = {
  bg: '#06030F',
  bgGlass: 'rgba(10,5,25,0.88)',
  purple: '#7C3AED',
  purpleLight: '#A78BFA',
  purpleDim: '#4C1D95',
  blue: '#3B82F6',
  blueLight: '#93C5FD',
  magenta: '#EC4899',
  white: '#F5F3FF',
  muted: '#6B7280',
  gold: '#F59E0B',
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const SCENE_DURATIONS = {
  s1: 200, s2: 180, s3: 280, s4: 300, s5: 190,
  s6: 280, s7: 280, s8: 280, s9: 280, s10: 250, s11: 203,
  transition: 10,
};

export const TOTAL_FRAMES = 2623;

import {staticFile} from 'remotion';

export const IMGS = {
  thinking: [
    staticFile('images/thinking1.jpg'),
    staticFile('images/thinking2.jpg'),
    staticFile('images/thinking3.jpg'),
  ],
  conversation: [
    staticFile('images/conv1.jpg'),
    staticFile('images/conv2.jpg'),
    staticFile('images/conv3.jpg'),
    staticFile('images/conv4.jpg'),
  ],
  stress: [
    staticFile('images/stress1.jpg'),
    staticFile('images/stress2.jpg'),
  ],
};
