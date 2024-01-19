import React from 'react'
import Button from './Button';
import { logEventClickWrapper } from '../util/logEventClickWrapper';
import { FullScreenHandle } from 'react-full-screen';
import { useRecoilState } from 'recoil';
import { currentAmbianceCategoryNameState, currentAmbianceIndexState } from '../state';
import { AmbianceName, ambianceCategories } from '../config/ambiance';
import { getRandomAmbianceIndex } from '../util/getRandomAmbianceIndex';

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
  const [currentAmbianceIndex, setCurrentAmbianceIndex] = useRecoilState(
    currentAmbianceIndexState(undefined),
  );
  const [currentAmbianceCategoryName, setCurrentAmbianceCategoryNameState] = useRecoilState(currentAmbianceCategoryNameState)

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

  return (
    <div style={controlStyle}>
      <div style={controlsButtonsStyle}>
        <Button icon='fullscreen' onClick={handleClick} />
      </div>
      <div style={controlsButtonsStyle}>
        <Button
          icon='wow'
          highlighted={currentAmbianceCategoryName === 'worldOfWarcraft'}
          onClick={
            logEventClickWrapper({
              onClick: () => handleCategoryChanger('worldOfWarcraft'),
              eventData: {
                actionId: 'wowCategory'
              }
            })
          }
        />
        <Button
          icon='lotr'
          highlighted={currentAmbianceCategoryName === 'lotr'}
          onClick={
            logEventClickWrapper({
              onClick: () => handleCategoryChanger('lotr'),
              eventData: {
                actionId: 'lotrCategory'
              }
            })
          }
        />
        <Button
          icon='harryPotter'
          highlighted={currentAmbianceCategoryName === 'harryPotter'}
          onClick={
            logEventClickWrapper({
              onClick: () => handleCategoryChanger('harryPotter'),
              eventData: {
                actionId: 'harryPotterCategory'
              }
            })
          }
        />
        <Button
          icon='animalCrossing'
          highlighted={currentAmbianceCategoryName === 'animalCrossing'}
          onClick={
            logEventClickWrapper({
              onClick: () => handleCategoryChanger('animalCrossing'),
              eventData: {
                actionId: 'animalCrossingCategory'
              }
            })
          }
        />
        <Button
          icon='zelda'
          highlighted={currentAmbianceCategoryName === 'zelda'}
          onClick={
            logEventClickWrapper({
              onClick: () => handleCategoryChanger('zelda'),
              eventData: {
                actionId: 'zeldaCategory'
              }
            })
          }
        />
        <Button
          icon='world'
          highlighted={currentAmbianceCategoryName === 'earth'}
          onClick={
            logEventClickWrapper({
              onClick: () => handleCategoryChanger('earth'),
              eventData: {
                actionId: 'worldCategory'
              }
            })
          }
        />
        <Button
          icon='coffee'
          highlighted={currentAmbianceCategoryName === 'coffee'}
          onClick={
            logEventClickWrapper({
              onClick: () => handleCategoryChanger('coffee'),
              eventData: {
                actionId: 'coffeeCategory'
              }
            })
          }
        />
        <Button
          icon='lofi'
          highlighted={currentAmbianceCategoryName === 'lofi'}
          onClick={
            logEventClickWrapper({
              onClick: () => handleCategoryChanger('lofi'),
              eventData: {
                actionId: 'lofiCategory'
              }
            })
          }
        />
      </div>
    </div>
  );
};
