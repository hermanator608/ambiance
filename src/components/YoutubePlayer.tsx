import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import styled, { css } from 'styled-components';
import { Ambiance } from '../config/ambiance';
import { ReactPlayerProps } from 'react-player';
import { FullScreenHandle } from 'react-full-screen';
import { FlexColumn } from '../globalStyles';
import Button from './Button';
import { logEventClickWrapper } from '../util/logEventClickWrapper';

const reactPlayerStyle: ReactPlayerProps['style'] = {
  pointerEvents: 'none',
  userSelect: 'none',
  zIndex: -1,
  borderRadius: '8px',
};

const commonStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`
const ReactPlayerContainer = styled.div<{ hidden: boolean; fullscreen: boolean }>`
  ${(props) =>
    props.hidden
      ? css`
          pointer-events: none;
          user-select: none;
          position: fixed;
          top: 100%;
          left: 100%;
        `
      : css`
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          background: black;
  `}

  iframe {
    ${commonStyles}
  }
`;

const InnerContainer = styled.div`
  ${commonStyles}
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  @media (min-aspect-ratio: 16/9) {
    height: 300%;
    top: -100%;
  }
  @media (max-aspect-ratio: 16/9) {
    width: 300%;
    left: -100%;
  }

  @media (max-width: 500px) {
    width: 400%;
    left: -150%;
  }
`;

// TODO: Add inset shadow
// const InsetShadow = styled.div`
//   ${commonStyles}
//   box-shadow: inset 0 0 50px #000000;
//   z-index: 10;
// `;

const MediaContainerBase = styled.div`
  z-index: 6;
  display: flex;
  flex-direction: column;
  width: 100%;

  button {
    margin-bottom: 25px;
  }

  @media (min-width: 500px) {
    flex-direction: row;

    button {
      margin-bottom: 0;
      margin-right: 20px;
    }
  }
`;

const MediaControlContainer = styled(MediaContainerBase)`
  @media (max-width: 500px) {
    width: 10%;
  }
`;

export const getRandomAmbianceIndex = (arr: Ambiance[], currentIndex: number): number => {
  const randomIndex = Math.floor(Math.random() * arr.length);

  return randomIndex === currentIndex
    ? getRandomAmbianceIndex(arr, currentIndex)
    : randomIndex;
};

type YoutubePlayerProps = {
  ambiances: Ambiance[];
  fullscreen: FullScreenHandle;
};

export const YoutubePlayer: React.FC<YoutubePlayerProps> = ({
  ambiances,
  fullscreen,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [ytVideoShown, setYtVideoShown] = useState(true);
  const [currentAmbianceIndex, setCurrentAmbianceIndex] = useState<number>(
    getRandomAmbianceIndex(ambiances, -1),
  );
  const [totalTime, setTotalTime] = useState<number | undefined>(0);
  const [currentTime, setCurrentTime] = useState<number | undefined>(0);

  const reactPlayerRef = useRef<ReactPlayer>(null);

  const handleShuffle = useCallback(() => {
    const randomAbianceIndex = getRandomAmbianceIndex(ambiances, currentAmbianceIndex);
    setCurrentAmbianceIndex(randomAbianceIndex);
  }, [currentAmbianceIndex, ambiances]);

  function handleSkip() {
    setCurrentAmbianceIndex((currentAmbianceIndex + 1) % ambiances.length);
  }

  function handleBack() {
    if (currentAmbianceIndex === 0) {
      setCurrentAmbianceIndex(ambiances.length - 1);
    } else {
      setCurrentAmbianceIndex(currentAmbianceIndex - 1);
    }
  }

  function handleRestart() {
    reactPlayerRef.current?.seekTo(1, 'seconds');
  }

  function handleOnReady() {
    setIsPlaying(true);
  }

  function handleStarted() {
    setTotalTime(reactPlayerRef.current?.getDuration());
  }

  function handleFastForward() {
    const nextTime = (currentTime || 0) + 60 * 10; // Add 10 minutes

    reactPlayerRef.current?.seekTo(nextTime, 'seconds');
  }

  // TODO: Move this up to MainControls and use global state
  function toggleHide() {
    setYtVideoShown(!ytVideoShown);
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(reactPlayerRef.current?.getCurrentTime());
      }, 1000);
    } else if (!isPlaying && currentTime !== 0) {
      // @ts-ignore
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime]);

  const logData = { currentAmbiance: ambiances[currentAmbianceIndex].name }

  return (
    <>
      <FlexColumn>
        <MediaControlContainer>
          {/* <div style={controlsButtonsStyle}> */}
            <Button
              icon={isPlaying ? 'pause' : 'play'}
              tooltip={isPlaying ? 'pause' : 'play'}
              onClick={
                logEventClickWrapper({eventData: { ...logData, actionId: isPlaying ? 'pause' : 'play' },  onClick: () => setIsPlaying(!isPlaying) })
              }
            />
            <Button icon="fastForward" tooltip='Fast Forward 10m' onClick={logEventClickWrapper({eventData: { ...logData, actionId: 'fastForward' },  onClick: handleFastForward })} />
            <Button icon="shuffle" tooltip='Shuffle' onClick={logEventClickWrapper({eventData: { ...logData, actionId: 'shuffle' },  onClick: handleShuffle })} />
            <Button icon="back" tooltip='Back' onClick={logEventClickWrapper({eventData: { ...logData, actionId: 'back' },  onClick: handleBack })} />
            <Button icon="skip" tooltip='Skip' onClick={logEventClickWrapper({eventData: { ...logData, actionId: 'skip' },  onClick: handleSkip })} />
            <Button icon="restart" tooltip='Restart' onClick={logEventClickWrapper({eventData: { ...logData, actionId: 'restart' },  onClick: handleRestart })} />
            <Button icon="eye" tooltip='Toggle Video' onClick={logEventClickWrapper({eventData: { ...logData, actionId: 'toggleVideo' },  onClick: toggleHide })} />
            {/* TODO: Maybe volume? */}
          {/* </div> */}
        </MediaControlContainer>
        <MediaContainerBase>
          <span style={{ color: 'white', fontSize: '20px' }}>
            {ambiances[currentAmbianceIndex].name}
            <br />
            {!!currentTime &&
              new Date(currentTime * 1000).toISOString().substr(11, 8)} /{' '}
            {!!totalTime && new Date(totalTime * 1000).toISOString().substr(11, 8)}
          </span>
        </MediaContainerBase>
      </FlexColumn>
      <ReactPlayerContainer hidden={!ytVideoShown} fullscreen={fullscreen.active}>
        <InnerContainer>
          <ReactPlayer
            controls={false}
            playing={isPlaying}
            url={`https://www.youtube.com/embed/${ambiances[currentAmbianceIndex].code}?start=1`}
            style={reactPlayerStyle}
            width="100vw"
            height="200vw"
            // volume={playerVolume}
            config={{
              playerVars: {
                modestbranding: true,
                color: 'black',
              },
            }}
            playsinline={true}
            onReady={handleOnReady}
            // onError={}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            // onBuffer={}
            // onBufferEnd={}
            onStart={handleStarted}
            onEnded={handleShuffle}
            ref={reactPlayerRef}
          />
        </InnerContainer>
      </ReactPlayerContainer>
    </>
  );
};
