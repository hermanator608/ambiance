import React from 'react';
import { useRecoilValue } from 'recoil';
import { createGlobalStyle } from 'styled-components';
import { AmbianceName } from '../config/ambiance';
import { currentAmbianceCategoryNameState } from '../state';

import wowDefault from '../images/cursors/wow_default.png';
import wowActive from '../images/cursors/wow_active.png';
import zeldaDefault from '../images/cursors/zelda_default.png';
import zeldaActive from '../images/cursors/zelda_active.gif';
import harryPotterDefault from '../images/cursors/harryPotter_default.png';
import harryPotterActive from '../images/cursors/harryPotter_active.gif';
import lotrDefault from '../images/cursors/lotr_default.gif';
import lotrActive from '../images/cursors/lotr_active.gif';
import coffeeDefault from '../images/cursors/coffee_default.png';
import coffeeActive from '../images/cursors/coffee_active.png';
import lofiDefault from '../images/cursors/lofi_default.gif';
import lofiActive from '../images/cursors/lofi_active.gif';
import bg3Default from '../images/cursors/dnd_default.png';
import bg3Active from '../images/cursors/dnd_active.png';


type MouseStyle = {
  default: string;
  pointer: string;
};

const getMouseStyle = (ambianceCategoryName: AmbianceName): MouseStyle | undefined => {
  switch (ambianceCategoryName) {
    case 'worldOfWarcraft':
      return { default: wowDefault, pointer: wowActive };
    case 'zelda':
      return { default: zeldaDefault, pointer: zeldaActive };
    case 'harryPotter':
      return { default: harryPotterDefault, pointer: harryPotterActive };
    case 'lotr':
      return { default: lotrDefault, pointer: lotrActive };
    case 'coffee':
      return { default: coffeeDefault, pointer: coffeeActive };
    case 'lofi':
        return { default: lofiDefault, pointer: lofiActive };
    case 'bg3':
        return { default: bg3Default, pointer: bg3Active};
    default:
      return undefined;
  }
};

export const MouseStyles: React.FC = () => {
  const ambianceName = useRecoilValue(currentAmbianceCategoryNameState);

  const currentMouse = getMouseStyle(ambianceName);

  console.log(currentMouse);

  const GlobalMouseStyles = createGlobalStyle`
    body {
      cursor: url(${currentMouse?.default}), default !important;
    }

    button,
    select,
    .pointer,
    .pause,
    a {
      cursor: url(${currentMouse?.pointer}), pointer !important;
    }
  `;

  return <GlobalMouseStyles />;
};
