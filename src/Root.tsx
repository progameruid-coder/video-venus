import React from 'react';
import { Composition } from 'remotion';
import { PlanetSurvival } from './PlanetSurvival';
import { NoOxygen5s } from './NoOxygen5s';
import { ZeroGravity5s } from './ZeroGravity5s';
import { WorldBoxEp4 } from './WorldBoxEp4';
import { WorldBoxEp3 } from './WorldBoxEp3';
import { WorldBoxEp2 } from './WorldBoxEp2';
import { WorldBoxEp1 } from './WorldBoxEp1';
import { GolfFactVideo } from './GolfFactVideo';
import { NeptuneFactVideo } from './NeptuneFactVideo';
import { VenusFactVideo } from './VenusFactVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="PlanetSurvival" component={PlanetSurvival} durationInFrames={1346} fps={30} width={1080} height={1920} />
      <Composition id="NoOxygen5s" component={NoOxygen5s} durationInFrames={1388} fps={30} width={1080} height={1920} />
      <Composition id="ZeroGravity5s" component={ZeroGravity5s} durationInFrames={1358} fps={30} width={1080} height={1920} />
      <Composition id="WorldBoxEp4" component={WorldBoxEp4} durationInFrames={1200} fps={30} width={1080} height={1920} />
      <Composition id="WorldBoxEp3" component={WorldBoxEp3} durationInFrames={1140} fps={30} width={1080} height={1920} />
      <Composition id="WorldBoxEp2" component={WorldBoxEp2} durationInFrames={1260} fps={30} width={1080} height={1920} />
      <Composition id="WorldBoxEp1" component={WorldBoxEp1} durationInFrames={1260} fps={30} width={1080} height={1920} />
      <Composition id="GolfFact" component={GolfFactVideo} durationInFrames={1110} fps={30} width={1080} height={1920} />
      <Composition id="NeptuneFact" component={NeptuneFactVideo} durationInFrames={1110} fps={30} width={1080} height={1920} />
      <Composition id="VenusFact" component={VenusFactVideo} durationInFrames={1110} fps={30} width={1080} height={1920} />
    </>
  );
};
