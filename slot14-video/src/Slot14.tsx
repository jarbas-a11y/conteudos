import React from 'react';
import {TransitionSeries, linearTiming, springTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {Scene01Hook} from './scenes/Scene01Hook';
import {Scene02Thinking} from './scenes/Scene02Thinking';
import {Scene03Words} from './scenes/Scene03Words';
import {Scene04Requirements} from './scenes/Scene04Requirements';
import {Scene05RealTime} from './scenes/Scene05RealTime';
import {Scene06Conversation} from './scenes/Scene06Conversation';
import {Scene07Perfectionism} from './scenes/Scene07Perfectionism';
import {Scene08Conditions} from './scenes/Scene08Conditions';
import {Scene09Trap} from './scenes/Scene09Trap';
import {Scene10Person2} from './scenes/Scene10Person2';
import {Scene11Closing} from './scenes/Scene11Closing';
import {SCENE_DURATIONS} from './constants';

const T = SCENE_DURATIONS.transition;
const S = SCENE_DURATIONS;

export const Slot14: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile('narration-14.wav')} />
      <TransitionSeries>
        {/* Scene 1 — Hook / Person */}
        <TransitionSeries.Sequence name="Hook" durationInFrames={S.s1}>
          <Scene01Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: T})}
        />

        {/* Scene 2 — B-roll Thinking */}
        <TransitionSeries.Sequence name="B-roll Thinking" durationInFrames={S.s2}>
          <Scene02Thinking />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({direction: 'from-right'})}
          timing={linearTiming({durationInFrames: T})}
        />

        {/* Scene 3 — Words / Versions */}
        <TransitionSeries.Sequence name="Words Motion" durationInFrames={S.s3}>
          <Scene03Words />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({direction: 'from-top-right'})}
          timing={springTiming({config: {damping: 200}, durationInFrames: T})}
        />

        {/* Scene 4 — Requirements */}
        <TransitionSeries.Sequence name="Requirements" durationInFrames={S.s4}>
          <Scene04Requirements />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: T})}
        />

        {/* Scene 5 — Real Time */}
        <TransitionSeries.Sequence name="Real Time" durationInFrames={S.s5}>
          <Scene05RealTime />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({direction: 'from-left'})}
          timing={linearTiming({durationInFrames: T})}
        />

        {/* Scene 6 — B-roll Conversation */}
        <TransitionSeries.Sequence name="Conversation B-roll" durationInFrames={S.s6}>
          <Scene06Conversation />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({direction: 'from-bottom-left'})}
          timing={linearTiming({durationInFrames: T})}
        />

        {/* Scene 7 — Perfectionism */}
        <TransitionSeries.Sequence name="Perfectionism" durationInFrames={S.s7}>
          <Scene07Perfectionism />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: T})}
        />

        {/* Scene 8 — Conditions */}
        <TransitionSeries.Sequence name="Conditions" durationInFrames={S.s8}>
          <Scene08Conditions />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({direction: 'from-right'})}
          timing={linearTiming({durationInFrames: T})}
        />

        {/* Scene 9 — The Trap */}
        <TransitionSeries.Sequence name="The Trap" durationInFrames={S.s9}>
          <Scene09Trap />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: T})}
        />

        {/* Scene 10 — Person 2 / Insight */}
        <TransitionSeries.Sequence name="Person 2" durationInFrames={S.s10}>
          <Scene10Person2 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({direction: 'from-top-right'})}
          timing={linearTiming({durationInFrames: T})}
        />

        {/* Scene 11 — Closing */}
        <TransitionSeries.Sequence name="Closing" durationInFrames={S.s11}>
          <Scene11Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
