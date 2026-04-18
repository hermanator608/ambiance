import React from 'react'
import Button from './Button';
import { logEventClickWrapper } from '../util/logEventClickWrapper';
import { FullScreenHandle } from 'react-full-screen';
import { useAppStore } from '../state';
import { AmbianceName, ambianceCategories } from '../config/ambiance';
import { getRandomAmbianceIndex } from '../util/getRandomAmbianceIndex';
import { ambianceCategoryDetail } from '../config/ambiance/index';

const controlStyle = {
  zIndex: 6,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%'
}

const controlsButtonsStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export const MainControls: React.FC<{fullscreen: FullScreenHandle}> = ({fullscreen}) => {
  const currentAmbianceIndex = useAppStore((s) => s.currentAmbianceIndex);
  const setCurrentAmbianceIndex = useAppStore((s) => s.setCurrentAmbianceIndex);
  const currentAmbianceCategoryName = useAppStore((s) => s.currentAmbianceCategoryName);
  const setCurrentAmbianceCategoryNameState = useAppStore((s) => s.setCurrentAmbianceCategoryName);

  const handleClick = logEventClickWrapper({
    onClick: () => fullscreen.active ? fullscreen.exit() : fullscreen.enter(),
    eventData: {
      actionId: fullscreen.active?  'exitFullscreen' : 'enterFullscreen'
    }
  })

  const handleCategoryChanger = (category: AmbianceName) => {
    setCurrentAmbianceCategoryNameState(category)
    setCurrentAmbianceIndex(getRandomAmbianceIndex(ambianceCategories[category], currentAmbianceIndex))
  }

  const ambianceButtons = Object.entries(ambianceCategoryDetail).map(([key, value]) => {
    return (
      <Button 
        icon={value.icon}
        highlighted={currentAmbianceCategoryName === key}
        onClick={
          logEventClickWrapper({
            onClick: () => handleCategoryChanger(key as any),
            eventData: {
              //using value.icon to preserve previous event names 
              actionId: value.icon + 'Category'
            }
          })
        }
      >
      </Button>
    )
  })

  return (
    <div style={controlStyle}>
      <div style={controlsButtonsStyle}>
        <Button icon='fullscreen' onClick={handleClick} />
      </div>
      <div style={controlsButtonsStyle}>
        { ambianceButtons }
      </div>
    </div>
  );
};
