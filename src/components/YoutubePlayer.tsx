import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import styled, { css } from 'styled-components';
import { Ambiance } from '../config/ambiance';
import Button from './Button';
import { ReactPlayerProps } from 'react-player';
import { FullScreenHandle } from 'react-full-screen';

const reactPlayerStyle: ReactPlayerProps['style'] = {
  pointerEvents: 'none',
  userSelect: 'none',
  zIndex: -1,
  borderRadius: '8px',
};

const ReactPlayerContainer = styled.div<{ hidden: boolean; fullscreen: boolean }>`
  padding: ${({ fullscreen }) => (fullscreen ? '0' : '0 30px 0')};

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
`;

const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const MediaControlContainer = styled.div`
  z-index: 6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  button {
    margin-right: 15px;
  }
`;

const controlsButtonsStyle = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
};

export const getRandomAbianceIndex = (arr: Ambiance[], currentIndex: number): number => {
  const randomIndex = Math.floor(Math.random() * arr.length);

  return randomIndex === currentIndex
    ? getRandomAbianceIndex(arr, currentIndex)
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
    getRandomAbianceIndex(ambiances, -1),
  );
  const [totalTime, setTotalTime] = useState<number | undefined>(0);
  const [currentTime, setCurrentTime] = useState<number | undefined>(0);

  const reactPlayerRef = useRef<ReactPlayer>(null);

  const handleShuffle = useCallback(() => {
    const randomAbianceIndex = getRandomAbianceIndex(ambiances, currentAmbianceIndex);
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MediaControlContainer>
        <div style={controlsButtonsStyle}>
          <Button
            icon={isPlaying ? 'pause' : 'play'}
            onClick={() => setIsPlaying(!isPlaying)}
          />
          <Button icon="fastForward" onClick={handleFastForward} />
          <Button icon="shuffle" onClick={handleShuffle} />
          <Button icon="back" onClick={handleBack} />
          <Button icon="skip" onClick={handleSkip} />
          <Button icon="restart" onClick={handleRestart} />
          <Button icon="eye" onClick={toggleHide} />
          {/* TODO: Maybe volume? */}
        </div>
      </MediaControlContainer>
      <MediaControlContainer>
        <span style={{ color: 'white', fontSize: '20px' }}>
          {ambiances[currentAmbianceIndex].name}
          <br />
          {!!currentTime &&
            new Date(currentTime * 1000).toISOString().substr(11, 8)} /{' '}
          {!!totalTime && new Date(totalTime * 1000).toISOString().substr(11, 8)}
        </span>
      </MediaControlContainer>
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
    </div>
  );
};
