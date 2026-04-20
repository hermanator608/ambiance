import React from 'react';
import { Box } from '@mui/material';
import { FullScreenHandle } from 'react-full-screen';
import { useAppStore } from '../state';
import { logEventAction, logEventClickWrapper } from '../util/logEventClickWrapper';
import { IconId, toIconId } from './Icon';
import Button from './Button';

const controlStyle: React.CSSProperties = {
  zIndex: 6,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
};

const controlsButtonsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const categoryIconRowSx = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1,
  flexWrap: 'wrap',
} as const;

const categoryTileSx = {
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 0.25,
  '& .favoriteToggle': {
    opacity: 0,
    transform: 'translateY(-6px)',
    pointerEvents: 'none',
    transition: 'opacity 120ms ease, transform 120ms ease',
  },
  '&[data-favorited="true"] .favoriteToggle': {
    opacity: 1,
    transform: 'translateY(0px)',
    pointerEvents: 'auto',
  },
  '&:hover .favoriteToggle, &:focus-within .favoriteToggle': {
    opacity: 1,
    transform: 'translateY(0px)',
    pointerEvents: 'auto',
  },
} as const;

const favoriteButtonStyle: React.CSSProperties = {
  transform: 'scale(0.85)',
};

export const MainControls: React.FC<{ fullscreen: FullScreenHandle }> = ({ fullscreen }) => {
  const catalog = useAppStore((s) => s.catalog);
  const currentAmbianceCategoryId = useAppStore((s) => s.currentAmbianceCategoryId);
  const setCurrentAmbianceCategoryId = useAppStore((s) => s.setCurrentAmbianceCategoryId);
  const favoriteCategoryId = useAppStore((s) => s.favoriteCategoryId);
  const toggleFavoriteCategory = useAppStore((s) => s.toggleFavoriteCategory);

  const handleClick = logEventClickWrapper({
    onClick: () => (fullscreen.active ? fullscreen.exit() : fullscreen.enter()),
    eventData: {
      actionId: fullscreen.active ? 'exitFullscreen' : 'enterFullscreen',
    },
  });

  const categories = Object.entries(catalog)
    .map(([categoryId, value]) => ({
      id: categoryId,
      name: value?.name ?? categoryId,
      icon: toIconId(value?.icon),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={controlStyle}>
      <div style={controlsButtonsStyle}>
        <Button icon="fullscreen" onClick={handleClick} />
      </div>

      <div style={controlsButtonsStyle}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          <Box role="list" aria-label="Categories" sx={categoryIconRowSx}>
            {categories.map((category) => {
              const isSelected = category.id === currentAmbianceCategoryId;
              const isFavorite = favoriteCategoryId === category.id;
              const icon: IconId = category.icon ?? 'world';

              return (
                <Box
                  key={category.id}
                  role="listitem"
                  sx={categoryTileSx}
                  data-favorited={isFavorite ? 'true' : 'false'}
                >
                  <Button
                    icon={icon}
                    tooltip={category.name}
                    highlighted={isSelected}
                    onClick={(e) => {
                      // Mouse clicks leave the button focused, which would keep the
                      // favorite affordance visible via `:focus-within`. Blur on
                      // pointer clicks only; keep focus for keyboard users.
                      if (e.detail !== 0) (e.currentTarget as HTMLButtonElement).blur();
                      if (isSelected) return;
                      const actionId = (category.icon ?? category.id) + 'Category';
                      logEventAction({ actionId });
                      setCurrentAmbianceCategoryId(category.id);
                    }}
                  />

                  {(isFavorite || isSelected) && (
                    <span className="favoriteToggle">
                      <Button
                        icon={isFavorite ? 'favoriteOn' : 'favoriteOff'}
                        tooltip={isFavorite ? 'Clear favorite category' : 'Set favorite category'}
                        highlighted={isFavorite}
                        style={favoriteButtonStyle}
                        onClick={logEventClickWrapper({
                          onClick: (e) => {
                            e.stopPropagation();
                            if (e.detail !== 0) (e.currentTarget as HTMLButtonElement).blur();
                            toggleFavoriteCategory(category.id);
                          },
                          eventData: {
                            actionId: isFavorite ? 'clearFavoriteCategory' : 'setFavoriteCategory',
                          },
                        })}
                      />
                    </span>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </div>
    </div>
  );
};
