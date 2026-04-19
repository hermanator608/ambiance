import React from 'react';
import styled from 'styled-components';
import {
  FaExpandAlt,
  FaEye,
  FaForward,
  FaPause,
  FaPlay,
  FaRandom,
  FaStepBackward,
  FaStepForward,
  FaUndo,
  FaInfoCircle,
  FaBroadcastTower,
  FaTwitter,
  FaCoffee,
  FaGlobeAmericas,
  FaShareAlt,
  FaStar,
  FaRegStar,
} from 'react-icons/fa';
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import lofi from '../images/lofi.png';
import wow from '../images/wow.png';
import lotr from '../images/lotr.png';
import zelda from '../images/zelda.png';
import harryPotter from '../images/harryPotter.png';
import animalCrossing from '../images/animalCrossing.png';
import bg3  from '../images/bauldersGate3.png';
import minecraft from '../images/minecraft.png';
import expedition33 from '../images/expedition33.png';
import { IconBaseProps } from 'react-icons';


// https://react-icons.github.io/react-icons/icons?name=fa
const IconMap = {
  play: FaPlay,
  pause: FaPause,
  skip: FaStepForward,
  back: FaStepBackward,
  restart: FaUndo,
  shuffle: FaRandom,
  fullscreen: FaExpandAlt,
  eye: FaEye,
  fastForward: FaForward,
  info: FaInfoCircle,
  live: FaBroadcastTower,
  twitter: FaTwitter,
  coffee: FaCoffee,
  world: FaGlobeAmericas,
  share: FaShareAlt,
  favoriteOn: FaStar,
  favoriteOff: FaRegStar,
  random: GiPerspectiveDiceSixFacesRandom
};

const ImgMap = {
  wow,
  lofi,
  lotr,
  zelda,
  harryPotter,
  animalCrossing,
  bg3,
  minecraft,
  expedition33
};

const size = 30;

const CustomImg = styled.img`
  /* width: ${size}px; */
  height: ${size}px;
`;

export type IconName = keyof typeof IconMap;
export type ImgName = keyof typeof ImgMap;
export type KnownIconName = IconName | ImgName;

export const KNOWN_ICON_NAMES: readonly KnownIconName[] = Object.freeze(
  [...(Object.keys(IconMap) as IconName[]), ...(Object.keys(ImgMap) as ImgName[])].sort(),
);

export interface IconProps {
  icon: KnownIconName;
  color?: IconBaseProps['color']
  size?: number
}

function hasOwn(obj: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function isKnownIconName(value: string): value is KnownIconName {
  return hasOwn(IconMap, value) || hasOwn(ImgMap, value);
}

export function toKnownIconName(value: string | undefined | null): KnownIconName | undefined {
  if (!value) return undefined;
  return isKnownIconName(value) ? value : undefined;
}

function isImgType(name: KnownIconName): name is ImgName {
  return hasOwn(ImgMap, name);
}

export const Icon: React.FC<IconProps> = ({ icon, color, size }) => {
  if (isImgType(icon)) {
    const imgSrc = ImgMap[icon];

    return <CustomImg src={imgSrc} alt={icon} />;
  } else {
    const IconComponent = (IconMap as Record<string, any>)[icon];
    if (!IconComponent) {
      return null;
    }

    return <IconComponent color={!!color ? color : "white"} size={!!size ? size : 30} />;
  }
};
