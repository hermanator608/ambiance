import React from "react";
import styled from 'styled-components'
import { FaExpandAlt, FaEye, FaForward, FaPause, FaPlay, FaRandom, FaStepBackward, FaStepForward, FaUndo, FaInfoCircle, FaBroadcastTower, FaTwitter } from "react-icons/fa";
import lofi from '../images/lofi.png';
import wow from '../images/wow.png';
import lotr from '../images/lotr.png';
import zelda from '../images/zelda.png';

// https://react-icons.github.io/react-icons/icons?name=fa
const IconMap = {
  'play': FaPlay,
  'pause': FaPause,
  'skip': FaStepForward,
  'back': FaStepBackward,
  'restart': FaUndo,
  'shuffle': FaRandom,
  'fullscreen': FaExpandAlt,
  'eye': FaEye,
  'fastForward': FaForward,
  'info': FaInfoCircle,
  'live': FaBroadcastTower,
  'twitter': FaTwitter
}

const ImgMap = {
  'wow': wow,
  'lofi': lofi,
  'lotr': lotr,
  'zelda': zelda
}

const size = 30

const CustomImg = styled.img`
  /* width: ${size}px; */
  height: ${size}px;
`;

export type IconName = keyof typeof IconMap
export type ImgName = keyof typeof ImgMap

export interface IconProps {
  icon: IconName | ImgName
}

function isImgType(name: IconName | ImgName): name is ImgName {
  return Object.keys(ImgMap).includes(name)
}

export const Icon: React.FC<IconProps> = ({icon}) => {
  if (isImgType(icon)) {
    const imgSrc = ImgMap[icon]

    return <CustomImg src={imgSrc} alt={icon} />
  } else {
    const IconComponent = IconMap[icon]

    return <IconComponent color='white' size={size} />
  }
}
