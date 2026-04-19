import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import styled, { css } from 'styled-components';
import { FullScreenHandle } from 'react-full-screen';
import { Slider, SliderProps } from '@mui/material';
import { FlexColumn } from '../globalStyles';
import { Icon } from './Icon';
import Button from './Button';
import { logEventAction, logEventClickWrapper } from '../util/logEventClickWrapper';
import debounce from 'lodash.debounce';
import { useAppStore } from '../state';
import { getRandomAmbianceIndex } from '../util/getRandomAmbianceIndex';
import { DotDotDot } from './DotDotDot';
import { Pause } from './Pause';
import { doc, getFirestore, serverTimestamp, setDoc, updateDoc, increment } from 'firebase/firestore';

const reactPlayerStyle: React.ComponentProps<typeof ReactPlayer>['style'] = {
  pointerEvents: 'none',
  userSelect: 'none',
  zIndex: -1,
  borderRadius: '8px',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
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

  iframe,
  video {
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
  const VOLUME_STORAGE_KEY = 'ambiance:volume:v1';

  const readInitialVolume = (): number => {
    try {
      const raw = window.localStorage.getItem(VOLUME_STORAGE_KEY);
      if (!raw) return 1;
      const parsed = Number.parseFloat(raw);
      if (!Number.isFinite(parsed)) return 1;
      // clamp to [0,1]
      return Math.max(0, Math.min(1, parsed));
    } catch {
      return 1;
    }
  };

  // Global State
  const videoShown = useAppStore((s) => s.videoShown);
  const setVideoShown = useAppStore((s) => s.setVideoShown);
  const currentAmbianceIndex = useAppStore((s) => s.currentAmbianceIndex);
  const setCurrentAmbianceIndex = useAppStore((s) => s.setCurrentAmbianceIndex);
  const catalog = useAppStore((s) => s.catalog);
  const currentAmbianceCategoryId = useAppStore((s) => s.currentAmbianceCategoryId);

  // Local State
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(readInitialVolume);
  const [totalTime, setTotalTime] = useState<number | undefined>(0);
  const [currentTime, setCurrentTime] = useState<number | undefined>(0);

  const reactPlayerRef = useRef<HTMLVideoElement>(null);
  const lastReportedRef = useRef<{ categoryId: string; code: string; atMs: number } | null>(null);

  const ambiances = catalog[currentAmbianceCategoryId]?.videos ?? [];
  const currentAmbiance = ambiances[currentAmbianceIndex] ?? ambiances[0];

  const reportVideoFailure = useCallback(async (categoryId: string, code: string, name: string) => {
    // Throttle: avoid spamming increments if player fires repeated errors for same video.
    const now = Date.now();
    const last = lastReportedRef.current;
    if (last && last.categoryId === categoryId && last.code === code && now - last.atMs < 30_000) {
      return;
    }
    lastReportedRef.current = { categoryId, code, atMs: now };

    logEventAction({ actionId: 'videoError', categoryId, code, currentAmbiance: name });

    const db = getFirestore();
    const reportId = `${categoryId}_${code}`;
    const ref = doc(db, 'reports', reportId);

    try {
      await updateDoc(ref, {
        count: increment(1),
        lastReportedAt: serverTimestamp(),
      });
    } catch {
      // If doc doesn't exist yet (or update not allowed), create it.
      try {
        await setDoc(ref, {
          categoryId,
          videoCode: code,
          count: 1,
          createdAt: serverTimestamp(),
          lastReportedAt: serverTimestamp(),
        });
      } catch {
        // ignore
      }
    }
  }, []);

  // Handlers
  const handleShuffle = useCallback(() => {
    const randomAbianceIndex = getRandomAmbianceIndex(ambiances, currentAmbianceIndex);
    setCurrentAmbianceIndex(randomAbianceIndex);
  }, [currentAmbianceIndex, setCurrentAmbianceIndex, ambiances]);

  const handleError = useCallback(async () => {
    if (!currentAmbiance) {
      return;
    }

    await reportVideoFailure(currentAmbianceCategoryId, currentAmbiance.code, currentAmbiance.name);

    // Always try to move forward after an error.
    const nextIndex = getRandomAmbianceIndex(ambiances, currentAmbianceIndex);
    setCurrentAmbianceIndex(nextIndex);
  }, [ambiances, currentAmbiance, currentAmbianceCategoryId, currentAmbianceIndex, reportVideoFailure, setCurrentAmbianceIndex]);

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
    if (!reactPlayerRef.current) {
      return;
    }

    reactPlayerRef.current.currentTime = currentAmbiance.startTimeS || 1;
  };

  const handleStarted = () => {
    if (!reactPlayerRef.current) {
      return;
    }

    const duration = reactPlayerRef.current.duration;
    if (Number.isFinite(duration)) {
      setTotalTime(duration);
    }
  };

  const handleFastForward = () => {
    if (!reactPlayerRef.current) {
      return;
    }

    const nextTime = (reactPlayerRef.current.currentTime || 0) + 60 * 10; // Add 10 minutes
    reactPlayerRef.current.currentTime = nextTime;
  };

  const debounceVolumeHandler = useMemo(() => {
    const handleVolume: NonNullable<SliderProps['onChange']> = (_event, value) => {
      const newVolume = Array.isArray(value) ? value[0] : value;
      setVolume(newVolume);
    };

    return debounce(handleVolume, 100);
  }, [setVolume]);

  useEffect(() => {
    try {
      window.localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
    } catch {
      // ignore
    }
  }, [volume]);

  const handleTimeUpdate: React.ReactEventHandler<HTMLVideoElement> = (event) => {
    setCurrentTime(event.currentTarget.currentTime);
    const duration = event.currentTarget.duration;
    if (Number.isFinite(duration)) {
      setTotalTime(duration);
    }
  };

  if (!currentAmbiance) {
    return null;
  }

  const logData = { currentAmbiance: currentAmbiance.name };
  const url = `https://www.youtube.com/watch?v=${currentAmbiance.code}`;

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
            value={volume}
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
            src={url}
            style={reactPlayerStyle}
            volume={volume}
            config={{
              youtube: {
                color: 'white',
                start: currentAmbiance.startTimeS || 1,
              }
            }}
            playsInline={true}
            // onReady={handleOnReady}
            onError={handleError}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            // onBuffer={() => setIsBuffering(true)}
            // onBufferEnd={() => setIsBuffering(false)}
            onStart={handleStarted}
            onEnded={handleShuffle}
            onTimeUpdate={handleTimeUpdate}
            ref={reactPlayerRef}
          />
        </InnerContainer>
      </ReactPlayerContainer>
    </>
  );
};

// TODO: Hide controls after a certain amount of time? Come back after mouse move
