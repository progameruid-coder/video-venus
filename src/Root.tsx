import React from 'react';
import { Composition } from 'remotion';
import { VenusFactVideo } from './VenusFactVideo';
import { NeptuneFactVideo } from './NeptuneFactVideo';
import { GolfFactVideo } from './GolfFactVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="GolfFact" component={GolfFactVideo} durationInFrames={1110} fps={30} width={1080} height={1920} />
      <Composition id="NeptuneFact" component={NeptuneFactVideo} durationInFrames={1110} fps={30} width={1080} height={1920} />
      <Composition id="VenusFact" component={VenusFactVideo} durationInFrames={1110} fps={30} width={1080} height={1920} />
    </>
  );
};
