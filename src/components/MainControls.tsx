import React from 'react'
import * as CSS from 'csstype'
import Button from './Button';
import { logEventClickWrapper } from '../util/logEventClickWrapper';
import { FullScreenHandle } from 'react-full-screen';
import { useRecoilState } from 'recoil';
import { currentAmbianceCategoryState, currentAmbianceIndexState } from '../state';
import { worldOfWarcraft, lofi, Ambiance, coffee, lotr, zelda } from '../config/ambiance';
import { getRandomAmbianceIndex } from '../util/getRandomAmbianceIndex';
import { earth } from '../config/ambiance/earth';

const controlStyle: CSS.Properties = {
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
  const [, setCurrentAmbianceCategoryState] = useRecoilState(currentAmbianceCategoryState)

  const handleClick = logEventClickWrapper({
    onClick: () => fullscreen.active ? fullscreen.exit() : fullscreen.enter(),
    eventData: {
      actionId: fullscreen.active?  'exitFullscreen' : 'enterFullscreen'
    }
  })

  const handleCategoryChanger = (category: Ambiance[]) => {
    setCurrentAmbianceCategoryState(category)
    setCurrentAmbianceIndex(getRandomAmbianceIndex(category, currentAmbianceIndex))
  }

  return (
    <div style={controlStyle}>
      <div style={controlsButtonsStyle}>
        <Button icon='fullscreen' onClick={handleClick} />
      </div>
      <div style={controlsButtonsStyle}>
        <Button
          icon='wow'
          onClick={
            logEventClickWrapper({
              onClick: () => handleCategoryChanger(worldOfWarcraft),
              eventData: {
                actionId: 'wowCategory'
              }
            })
          }
        />
        <Button
          icon='lotr'
          onClick={
            logEventClickWrapper({
              onClick: () => handleCategoryChanger(lotr),
              eventData: {
                actionId: 'lotrCategory'
              }
            })
          }
        />
        <Button
          icon='zelda'
          onClick={
            logEventClickWrapper({
              onClick: () => handleCategoryChanger(zelda),
              eventData: {
                actionId: 'zeldaCategory'
              }
            })
          }
        />
        <Button
          icon='world'
          onClick={
            logEventClickWrapper({
              onClick: () => handleCategoryChanger(earth),
              eventData: {
                actionId: 'worldCategory'
              }
            })
          }
        />
        <Button
          icon='coffee'
          onClick={
            logEventClickWrapper({
              onClick: () => handleCategoryChanger(coffee),
              eventData: {
                actionId: 'coffeeCategory'
              }
            })
          }
        />
        <Button
          icon='lofi'
          onClick={
            logEventClickWrapper({
              onClick: () => handleCategoryChanger(lofi),
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
