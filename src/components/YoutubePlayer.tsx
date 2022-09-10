import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactPlayer, {
  YouTubePlayerProps as ReactPlayerYouTubeProps,
} from 'react-player/youtube';
import styled, { css } from 'styled-components';
import { ReactPlayerProps } from 'react-player';
import { FullScreenHandle } from 'react-full-screen';
import { Slider, SliderProps } from '@mui/material';
import { FlexColumn } from '../globalStyles';
import { Icon } from './Icon';
import Button from './Button';
import { logEventClickWrapper } from '../util/logEventClickWrapper';
import debounce from 'lodash.debounce';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentAmbianceCategoryNameState,
  currentAmbianceIndexState,
  videoShownState,
} from '../state';
import { getRandomAmbianceIndex } from '../util/getRandomAmbianceIndex';
import { DotDotDot } from './DotDotDot';
import { Pause } from './Pause';
import { ambianceCategories } from '../config/ambiance';

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
`;

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

const VolumeSlider = styled(Slider)`
  color: white;
  width: 100%;
  margin-top: 0;

  @media (min-width: 500px) {
    width: 400px;
    margin-top: 12px;
  }

  h1 {
    filter: none;
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
  /* @media (max-width: 500px) {
    width: 10%;
  } */
`;

const CenteredDiv = styled.div`
  display: flex;
  align-items: center;
`;

const MarginDiv = styled.div`
  margin-right: 12px;
`;

export const YoutubePlayer: React.FC<{ fullscreen: FullScreenHandle }> = ({
  fullscreen,
}) => {
  // Global State
  const [videoShown, setVideoShown] = useRecoilState(videoShownState);
  const [currentAmbianceIndex, setCurrentAmbianceIndex] = useRecoilState(
    currentAmbianceIndexState(undefined),
  );
  const ambianceName = useRecoilValue(currentAmbianceCategoryNameState);

  // Local State
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [totalTime, setTotalTime] = useState<number | undefined>(0);
  const [currentTime, setCurrentTime] = useState<number | undefined>(0);

  const reactPlayerRef = useRef<ReactPlayer>(null);

  const ambiances = ambianceCategories[ambianceName];
  const currentAmbiance = ambiances[currentAmbianceIndex];

  // Handlers
  const handleShuffle = useCallback(() => {
    const randomAbianceIndex = getRandomAmbianceIndex(ambiances, currentAmbianceIndex);
    setCurrentAmbianceIndex(randomAbianceIndex);
  }, [currentAmbianceIndex, setCurrentAmbianceIndex, ambiances]);

  // const handleSkip = () => {
  //   setCurrentAmbianceIndex((currentAmbianceIndex + 1) % ambiances.length);
  // };

  // const handleBack = () => {
  //   if (currentAmbianceIndex === 0) {
  //     setCurrentAmbianceIndex(ambiances.length - 1);
  //   } else {
  //     setCurrentAmbianceIndex(currentAmbianceIndex - 1);
  //   }
  // };

  const handleRestart = () => {
    reactPlayerRef.current?.seekTo(currentAmbiance.startTimeS || 1, 'seconds');
  };

  const handleStarted = () => {
    setTotalTime(reactPlayerRef.current?.getDuration());
  };

  const handleFastForward = () => {
    const nextTime = (currentTime || 0) + 60 * 10; // Add 10 minutes

    reactPlayerRef.current?.seekTo(nextTime, 'seconds');
  };

  const debounceVolumeHandler = useMemo(() => {
    const handleVolume: NonNullable<SliderProps['onChange']> = (_event, value) => {
      const newVolume = Array.isArray(value) ? value[0] : value;
      console.log(newVolume);
      setVolume(newVolume);
    };

    return debounce(handleVolume, 100);
  }, [setVolume]);

  const handleOnProgress: ReactPlayerYouTubeProps['onProgress'] = (data) => {
    setCurrentTime(data.playedSeconds);
  };

  const logData = { currentAmbiance: currentAmbiance.name };
  let url = `https://www.youtube.com/embed/${currentAmbiance.code}`;
  if (!currentAmbiance.livestream || !!currentAmbiance.startTimeS) {
    url += `?start=${currentAmbiance.startTimeS || 1}`;
  }

  return (
    <>
      <FlexColumn>
        <MediaControlContainer>
          <Button
            icon={isPlaying ? 'pause' : 'play'}
            tooltip={isPlaying ? 'pause' : 'play'}
            onClick={logEventClickWrapper({
              eventData: { ...logData, actionId: isPlaying ? 'pause' : 'play' },
              onClick: () => setIsPlaying(!isPlaying),
            })}
          />
          <Button
            icon="shuffle"
            tooltip="Shuffle"
            onClick={logEventClickWrapper({
              eventData: { ...logData, actionId: 'shuffle' },
              onClick: handleShuffle,
            })}
          />
          {!currentAmbiance.livestream && (
            <>
              <Button
                icon="fastForward"
                tooltip="Fast Forward 10m"
                onClick={logEventClickWrapper({
                  eventData: { ...logData, actionId: 'fastForward' },
                  onClick: handleFastForward,
                })}
              />
              <Button
                icon="restart"
                tooltip="Restart"
                onClick={logEventClickWrapper({
                  eventData: { ...logData, actionId: 'restart' },
                  onClick: handleRestart,
                })}
              />
            </>
          )}
          {/* <Button
            icon="back"
            tooltip="Back"
            onClick={logEventClickWrapper({
              eventData: { ...logData, actionId: 'back' },
              onClick: handleBack,
            })}
          />
          <Button
            icon="skip"
            tooltip="Skip"
            onClick={logEventClickWrapper({
              eventData: { ...logData, actionId: 'skip' },
              onClick: handleSkip,
            })}
          /> */}
          <Button
            icon="eye"
            tooltip="Toggle Video"
            onClick={logEventClickWrapper({
              eventData: { ...logData, actionId: 'toggleVideo' },
              onClick: () => setVideoShown(!videoShown),
            })}
          />
        </MediaControlContainer>
        <MediaContainerBase>
          <VolumeSlider
            defaultValue={1}
            aria-label="Volume"
            onChange={debounceVolumeHandler}
            valueLabelDisplay="off"
            step={0.02}
            marks
            min={0}
            max={1}
          />
        </MediaContainerBase>
        <MediaContainerBase>
          <span style={{ color: 'white', fontSize: '20px' }}>
            {currentAmbiance.livestream ? (
              <CenteredDiv>
                <MarginDiv>
                  <Icon icon="live" />
                </MarginDiv>
                Live Stream <DotDotDot />
              </CenteredDiv>
            ) : (
              <>
                {!!currentTime &&
                  new Date(currentTime * 1000).toISOString().substr(11, 8)}{' '}
                / {!!totalTime && new Date(totalTime * 1000).toISOString().substr(11, 8)}
              </>
            )}
          </span>
        </MediaContainerBase>
      </FlexColumn>
      <Pause isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      <ReactPlayerContainer hidden={!videoShown} fullscreen={fullscreen.active}>
        <InnerContainer>
          <ReactPlayer
            controls={false}
            playing={isPlaying}
            url={url}
            style={reactPlayerStyle}
            width="100vw"
            height="200vw"
            volume={volume}
            config={{
              playerVars: {
                modestbranding: true,
                color: 'black',
                onUnstarted: () => {
                  console.error('Failed to auto-start');
                },
              },
            }}
            playsinline={true}
            // onReady={handleOnReady}
            // onError={} // TODO: Implement Error Handling
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            // onBuffer={() => setIsBuffering(true)}
            // onBufferEnd={() => setIsBuffering(false)}
            onStart={handleStarted}
            onEnded={handleShuffle}
            onProgress={handleOnProgress}
            ref={reactPlayerRef}
          />
        </InnerContainer>
      </ReactPlayerContainer>
    </>
  );
};

// TODO: Hide controls after a certain amount of time? Come back after mouse move
