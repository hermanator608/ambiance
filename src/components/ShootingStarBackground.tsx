import React from 'react'
import { useRecoilState } from 'recoil';
import styled, { css, keyframes } from 'styled-components';
import { videoShownState } from '../state';

const starsCount = 20

const tail = keyframes`
  0% {
    width: 0;
 }
  30% {
    width: 100px;
 }
  100% {
    width: 0;
 }
`;

const shining = keyframes`
  0% {
    width: 0;
 }
  50% {
    width: 30px;
 }
  100% {
    width: 0;
 }
`;

const shooting = keyframes`
  0% {
    transform: translateX(0);
 }
  100% {
    transform: translateX(300px);
 }
`;

const Backdrop = styled.div`
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  object-fit: cover;
  z-index: 0;
`;

const NightFall = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  object-fit: cover;
  z-index: 0;
  transform: rotateZ(45deg);
`;

function createShootingStartCSS() {
  let styles = '';

  for (let i = 0; i < starsCount; i += 1) {
    const delay = Math.floor(Math.random() * 9999)
    const top = Math.floor(Math.random() * 400)
    const left = Math.floor(Math.random() * 300)

     styles += `
      &:nth-child(${i}) {
        top: calc(50% - ${top - 200}px);
        left: calc(50% - ${left}px);
        animation-delay: ${delay}ms;

        &::before,
        &::after {
          animation-delay: ${delay}ms;
        }
      }
    `
  }

  return css`${styles}`;
}

const ShootingStar = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  height: 2px;
  background: linear-gradient(-45deg, #aaff22, rgba(0, 0, 255, 0));
  border-radius: 999px;
  filter: drop-shadow(0 0 6px rgba(105, 155, 255, 1));
  animation: ${tail} 3000ms ease-in-out infinite, ${shooting} 3000ms ease-in-out infinite;


  ::before {
    content: '';
    position: absolute;
    top: calc(50% - 1px);
    right: 0;
    height: 2px;
    background: linear-gradient(-45deg, rgba(0, 0, 255, 0), #aaff22, rgba(0, 0, 255, 0));
    transform: translateX(50%) rotateZ(45deg);
    border-radius: 100%;
    animation: ${shining} 3000ms ease-in-out infinite;
  }

  ::after {
    content: '';
    position: absolute;
    top: calc(50% - 1px);
    right: 0;
    height: 2px;
    background: linear-gradient(-45deg, rgba(0, 0, 255, 0), #aaff22, rgba(0, 0, 255, 0));
    transform: translateX(50%) rotateZ(45deg);
    border-radius: 100%;
    animation: ${shining} 3000ms ease-in-out infinite;
    transform: translateX(50%) rotateZ(-45deg);
  }

  ${createShootingStartCSS()}
`;

export const ShootingStartBackground: React.FC = () => {
  const [videoShown] = useRecoilState(videoShownState);
  if (videoShown) return null;

  const shootingStars: React.ReactElement[] = []
  for (let i = 0; i < starsCount; i++) {
    shootingStars.push(<ShootingStar key={i} />) // className="shooting_star" />)
  }

  return (
    <Backdrop>
      <NightFall>
        {shootingStars}
      </NightFall>
    </Backdrop>
  );
}
