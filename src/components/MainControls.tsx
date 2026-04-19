import React from 'react'
import Button from './Button';
import { logEventAction, logEventClickWrapper } from '../util/logEventClickWrapper';
import { FullScreenHandle } from 'react-full-screen';
import { useAppStore } from '../state';
import { Icon, toKnownIconName } from './Icon';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

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
  const catalog = useAppStore((s) => s.catalog);
  const currentAmbianceCategoryId = useAppStore((s) => s.currentAmbianceCategoryId);
  const setCurrentAmbianceCategoryId = useAppStore((s) => s.setCurrentAmbianceCategoryId);
  const favoriteCategoryId = useAppStore((s) => s.favoriteCategoryId);
  const toggleFavoriteCategory = useAppStore((s) => s.toggleFavoriteCategory);
  const matches = useMediaQuery('(min-width:500px)');

  const handleClick = logEventClickWrapper({
    onClick: () => fullscreen.active ? fullscreen.exit() : fullscreen.enter(),
    eventData: {
      actionId: fullscreen.active?  'exitFullscreen' : 'enterFullscreen'
    }
  })

  const categories = Object.entries(catalog)
    .map(([categoryId, value]) => ({
      id: categoryId,
      name: value?.name ?? categoryId,
      icon: toKnownIconName(value?.icon),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const selectedCategory = categories.find((c) => c.id === currentAmbianceCategoryId);

  return (
    <div style={controlStyle}>
      <div style={controlsButtonsStyle}>
        <Button icon='fullscreen' onClick={handleClick} />
      </div>
      <div style={controlsButtonsStyle}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          <Button
            icon={favoriteCategoryId === currentAmbianceCategoryId ? 'favoriteOn' : 'favoriteOff'}
            tooltip={favoriteCategoryId === currentAmbianceCategoryId ? 'Clear favorite category' : 'Set favorite category'}
            highlighted={favoriteCategoryId === currentAmbianceCategoryId}
            onClick={logEventClickWrapper({
              onClick: () => toggleFavoriteCategory(currentAmbianceCategoryId),
              eventData: {
                actionId: favoriteCategoryId === currentAmbianceCategoryId ? 'clearFavoriteCategory' : 'setFavoriteCategory',
              },
            })}
          />

          <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <Autocomplete
              value={selectedCategory}
              options={categories}
              disableClearable
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => (
                <Box component='li' {...props}>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', minWidth: 30 }}>
                      {option.icon ? <Icon icon={option.icon} /> : null}
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'right' }}>{option.name}</Box>
                  </Box>
                </Box>
              )}
              sx={{
                width: matches ? 260 : 200,
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  slotProps={{
                    ...(params as any).slotProps,
                    input: {
                      ...((params as any).slotProps?.input ?? {}),
                      startAdornment: selectedCategory?.icon ? (
                        <InputAdornment position="start">
                          <Icon icon={selectedCategory.icon} />
                        </InputAdornment>
                      ) : undefined,
                    },
                  }}
                />
              )}
              onChange={(_event, value) => {
                if (!value) return;
                const actionId = ((value.icon ?? value.id) + 'Category');
                logEventAction({ actionId });
                setCurrentAmbianceCategoryId(value.id);
              }}
            />
          </Box>
        </Box>
      </div>
    </div>
  );
};
