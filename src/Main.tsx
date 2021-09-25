import React from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { MainControls } from './components/MainControls';
import { Selector } from './components/Selector';
import { ShootingStartBackground } from './components/ShootingStarBackground';
import { YoutubePlayer } from './components/YoutubePlayer';
import { FlexColumn } from './globalStyles';

export const Main: React.FC = () => {
  const fullscreen = useFullScreenHandle()

  return (
    <FullScreen handle={fullscreen}>
      <div id="MainContainer" data-testid='main'>
        <ShootingStartBackground />
        <MainControls fullscreen={fullscreen} />
        <FlexColumn>
          <Selector />
          <YoutubePlayer fullscreen={fullscreen} />
        </FlexColumn>
      </div>
    </FullScreen>
  );
};
