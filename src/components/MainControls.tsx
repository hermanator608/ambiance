import React from 'react'
import * as CSS from 'csstype'
import Button from './Button';
import { FullScreenHandle } from 'react-full-screen';

const controlStyle: CSS.Properties = {
  zIndex: 6,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'end',
  width: '100%'
}

const controlsButtonsStyle = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
};

type MainControlsProps = {
  fullscreen: FullScreenHandle
}

export const MainControls: React.FC<MainControlsProps> = ({fullscreen}) => {
  return (
    <div style={controlStyle}>
      <div style={controlsButtonsStyle}>
        <Button icon={'fullscreen'} onClick={() => fullscreen.active ? fullscreen.exit() : fullscreen.enter()} />
      </div>
    </div>
  );
};
