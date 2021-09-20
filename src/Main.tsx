import React from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { MainControls } from './components/MainControls';
import { ShootingStartBackground } from './components/ShootingStarBackground';
import { YoutubePlayer } from './components/YoutubePlayer';

export const Main: React.FC = () => {
  const fullscreen = useFullScreenHandle()

  return (
    <FullScreen handle={fullscreen}>
      <div id="MainContainer" data-testid='main'>
        <ShootingStartBackground />
        <MainControls />
        <YoutubePlayer />
      </div>
    </FullScreen>
  );
};
