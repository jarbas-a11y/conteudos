import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const displayFont = 'SpaceGrotesk';
export const bodyFont = 'DMSans';

const fontPromise = Promise.all([
  loadFont({
    family: displayFont,
    url: staticFile('fonts/SpaceGrotesk-700.ttf'),
    weight: '700',
    style: 'normal',
  }),
  loadFont({
    family: bodyFont,
    url: staticFile('fonts/DMSans-700.ttf'),
    weight: '700',
    style: 'normal',
  }),
]);

export const waitForFonts = () => fontPromise;
