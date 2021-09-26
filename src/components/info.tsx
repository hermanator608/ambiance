import React, { useState } from 'react';
import styled, {keyframes} from "styled-components";
import { channels } from '../config/ambiance/channels';
import { logEventClickWrapper } from '../util/logEventClickWrapper';
import Button from './Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  height: 100%;
  align-items: end;
`;

const slideInFromRight = keyframes`
  /* 100% { right: 0; } */
  0% {opacity:0;}
  100% {opacity:1;}
`;

const InfoSection = styled.div`
  z-index: 6;
  position: absolute;
  right: 6;
  bottom: 70px;
  width: 400px;
  height: 200px;
  animation: ${slideInFromRight} 1s forwards;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 25px;

  a {
    color: white;
  }
`;

export const Info: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false)
  const onClick = () => setShowInfo(!showInfo)

  return (
    <Container>
      {showInfo && 
        <InfoSection>
          {
            Object.values(channels).map(({link, name}) => {
              return (
                <>
                  <a href={link}>{name}</a>
                  <br />
                </>
              )
            })
          }
        </InfoSection>
      }
      <Container>
        <Button 
          icon='info'
          onClick={
            logEventClickWrapper({
              onClick: onClick,
              eventData: {
                actionId: ''
              }
            })
          }
        />
      </Container>
    </Container>
  )
}
