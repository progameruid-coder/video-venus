import React from 'react';
import { Composition } from 'remotion';
import { WorldBoxEp1 } from './WorldBoxEp1';
import { GolfFactVideo } from './GolfFactVideo';
import { NeptuneFactVideo } from './NeptuneFactVideo';
import { VenusFactVideo } from './VenusFactVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="WorldBoxEp1" component={WorldBoxEp1} durationInFrames={1260} fps={30} width={1080} height={1920} />
      <Composition id="GolfFact" component={GolfFactVideo} durationInFrames={1110} fps={30} width={1080} height={1920} />
      <Composition id="NeptuneFact" component={NeptuneFactVideo} durationInFrames={1110} fps={30} width={1080} height={1920} />
      <Composition id="VenusFact" component={VenusFactVideo} durationInFrames={1110} fps={30} width={1080} height={1920} />
    </>
  );
};
