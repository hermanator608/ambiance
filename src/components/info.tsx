import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { logEventClickWrapper } from '../util/logEventClickWrapper';
import Button from './Button';
import Fade from '@mui/material/Fade';
import { Twitter } from './Twitter';
import { useAppStore } from '../state';
import type { Channel } from '../config/ambiance/channels';

const Container = styled.div`
  z-index: 6;
  display: flex;
  flex-direction: column;
  justify-content: end;
  height: 100%;
  align-items: end;
`;

const InfoSection = styled.div`
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
  const currentAmbianceIndex = useAppStore((s) => s.currentAmbianceIndex);
  const catalog = useAppStore((s) => s.catalog);
  const currentAmbianceCategoryId = useAppStore((s) => s.currentAmbianceCategoryId);
  const ambiances = catalog[currentAmbianceCategoryId]?.videos ?? [];
  const currentAmbiance = ambiances[currentAmbianceIndex] ?? ambiances[0];

  const channelsFromVideos = useMemo(() => {
    const byLinkOrName = new Map<string, Channel>();

    Object.values(catalog).forEach((category) => {
      const categoryVideos = category.videos ?? [];
      categoryVideos.forEach((video) => {
        if (!video.channel?.name || !video.channel?.link) return;

        const key = video.channel.link || video.channel.name;
        if (!byLinkOrName.has(key)) {
          byLinkOrName.set(key, { name: video.channel.name, link: video.channel.link });
        }
      });
    });

    return Array.from(byLinkOrName.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [catalog]);

  const [showInfo, setShowInfo] = useState(false);
  const onClick = () => setShowInfo(!showInfo);

  return (
    <Container>
      <Fade in={showInfo} timeout={600}>
        <InfoSection>
          <h3>Thank you to the following channels for the videos!</h3>
          <Links>
            {channelsFromVideos.map(({ link, name }) => {
              const key = link || name;
              return (
                <span key={key}>
                  <a target="_blank" rel="noopener noreferrer" href={link}>{name}</a>
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
        {currentAmbiance?.channel && (
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
