import React from 'react';
import { Composition } from 'remotion';
import { VenusFactVideo } from './VenusFactVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VenusFact"
        component={VenusFactVideo}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
