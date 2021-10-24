import React from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import styled from 'styled-components';
import { Info } from './components/info';
import { MainControls } from './components/MainControls';
import { MouseStyles } from './components/MouseStyles';
import { Selector } from './components/Selector';
import { ShootingStartBackground } from './components/ShootingStarBackground';
import { YoutubePlayer } from './components/YoutubePlayer';
import { FlexColumn } from './globalStyles';

const SpreadDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const Main: React.FC = () => {
  const fullscreen = useFullScreenHandle()



  return (
    <FullScreen handle={fullscreen}>
      <MouseStyles />
      <div id="MainContainer" data-testid='main'>
        <ShootingStartBackground />
        <MainControls fullscreen={fullscreen} />
        <SpreadDiv>
          <FlexColumn>
            <Selector />
            <YoutubePlayer fullscreen={fullscreen} />
          </FlexColumn>
          <Info />
        </SpreadDiv>
      </div>
    </FullScreen>
  );
};
