import React, { useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { MainControls } from './components/MainControls';
import { ShootingStartBackground } from './components/ShootingStarBackground';
import { YoutubePlayer } from './components/YoutubePlayer';
import { worldOfWarcraft } from './config/ambiance';


export const Main: React.FC = () => {
  const fullscreen = useFullScreenHandle()

  // Convert to global state
  const [showVideo, setShowVideo] = useState(true)

  return (
    <FullScreen handle={fullscreen}>
      <div id="MainContainer" data-testid='main'>
        <ShootingStartBackground show={!showVideo} /> 
        <MainControls fullscreen={fullscreen} />
        <YoutubePlayer ambiances={worldOfWarcraft} fullscreen={fullscreen} toggleShow={() => setShowVideo(!showVideo)}/>
      </div>
    </FullScreen>
  );
};
