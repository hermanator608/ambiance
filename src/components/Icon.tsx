import React from "react";
import { FaExpandAlt, FaEye, FaForward, FaPause, FaPlay, FaRandom, FaStepBackward, FaStepForward, FaUndo } from "react-icons/fa";

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
  'fastForward': FaForward
}

export type IconName = keyof typeof IconMap

interface IconProps {
  icon: IconName
}

export const Icon: React.FC<IconProps> = ({icon, ...rest}) => {
  const IconComponent = IconMap[icon]

  return <IconComponent color='white' size={30} />
}
