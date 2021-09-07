import React from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { GifBackground } from './components/GifBackground';
import { MainControls } from './components/MainControls';
import { YoutubePlayer } from './components/YoutubePlayer';
import { worldOfWarcraft } from './config/ambiance';
import wowGif from './images/gifs/wow.gif';

export const Main: React.FC = () => {
  const fullscreen = useFullScreenHandle()

  return (
    <FullScreen handle={fullscreen}>
      <div id="MainContainer">
        <GifBackground src={wowGif} show={true} />
        <MainControls fullscreen={fullscreen} />
        <YoutubePlayer ambiances={worldOfWarcraft} fullscreen={fullscreen} />
      </div>
    </FullScreen>
  );
};
