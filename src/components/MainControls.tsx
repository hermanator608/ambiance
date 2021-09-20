import React from 'react'
import * as CSS from 'csstype'
import Button from './Button';
import { useFullScreenHandle } from 'react-full-screen';
import { logEventClickWrapper } from '../util/logEventClickWrapper';
import { Selector } from './Selector';

const controlStyle: CSS.Properties = {
  zIndex: 6,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%'
}

const controlsButtonsStyle = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
};

export const MainControls: React.FC = () => {
  const fullscreen = useFullScreenHandle()

  const handleClick = logEventClickWrapper({
    onClick: () => fullscreen.active ? fullscreen.exit() : fullscreen.enter(),
    eventData: {
      actionId: fullscreen.active?  'exitFullscreen' : 'enterFullscreen'
    }
  })

  return (
    <div style={controlStyle}>
      <div style={controlsButtonsStyle}>
        <Button icon='fullscreen' onClick={handleClick} />
      </div>
      <Selector />
    </div>
  );
};
