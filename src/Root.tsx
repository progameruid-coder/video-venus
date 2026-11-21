import React from 'react';
import { Composition } from 'remotion';
import { VenusFactVideo } from './VenusFactVideo';
import { NeptuneFactVideo } from './NeptuneFactVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="NeptuneFact" component={NeptuneFactVideo} durationInFrames={1110} fps={30} width={1080} height={1920} />
      <Composition id="VenusFact" component={VenusFactVideo} durationInFrames={1110} fps={30} width={1080} height={1920} />
    </>
  );
};
