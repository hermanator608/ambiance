import React, { useState } from 'react';
import styled from 'styled-components';
import { channels } from '../config/ambiance/channels';
import { logEventClickWrapper } from '../util/logEventClickWrapper';
import Button from './Button';
import Fade from '@mui/material/Fade';
import { Twitter } from './Twitter';
import { useRecoilValue } from 'recoil';
import { currentAmbianceIndexState } from '../state';
import { ambianceCategories } from '../config/ambiance';
import { currentAmbianceCategoryNameState } from '../state';

const Container = styled.div`
  z-index: 6;
  display: flex;
  flex-direction: column;
  justify-content: end;
  height: 100%;
  align-items: end;
`;

const InfoSection = styled.div<{ fadeInState: boolean }>`
  z-index: 6;
  position: absolute;
  right: 0;
  bottom: 70px;
  width: calc(100vw - 24px);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 25px;
  padding: 0px 12px 12px 12px;

  filter: var(--brown-glow-drop-shadow);

  a {
    color: white;
  }

  @media (min-width: 500px) {
    width: 500px;
    right: 6;
  }
`;

const Links = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));

  @media (min-width: 500px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

export const Info: React.FC = () => {
  const currentAmbianceIndex = useRecoilValue(currentAmbianceIndexState(undefined));
  const ambianceName = useRecoilValue(currentAmbianceCategoryNameState);
  const ambiances = ambianceCategories[ambianceName];
  const currentAmbiance = ambiances[currentAmbianceIndex];

  const [showInfo, setShowInfo] = useState(false);
  const onClick = () => setShowInfo(!showInfo);

  const onAnimationEnd = () => {
    if (!showInfo) setShowInfo(false);
  };

  return (
    <Container>
      <Fade in={showInfo} timeout={600}>
        <InfoSection fadeInState={showInfo} onAnimationEnd={onAnimationEnd}>
          <h3>Thank you to the following channels for the videos!</h3>
          <Links>
            {Object.values(channels).map(({ link, name }) => {
              return (
                <span>
                  <a href={link}>{name}</a>
                </span>
              );
            })}
          </Links>
          <p>
            Say hi on{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://twitter.com/Brandon_Herman9"
            >
              twitter
            </a>
            ! Would love to hear your feedback on how to make Ambiance.dev better.
          </p>
        </InfoSection>
      </Fade>
      <Container style={{ flexDirection: 'row', justifyItems: 'center' }}>
        {currentAmbiance.channel && (
          <a style={{ color: 'white', fontSize: '24px' }} href={currentAmbiance.channel?.link}>{currentAmbiance.channel?.name}</a>
        )}

        <Button
          icon="info"
          onClick={logEventClickWrapper({
            onClick: onClick,
            eventData: {
              actionId: '',
            },
          })}
        />
        <Twitter />
      </Container>
    </Container>
  );
};
