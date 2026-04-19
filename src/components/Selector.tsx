import styled from 'styled-components';
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAppStore } from '../state';
import type { UseAutocompleteProps } from '@mui/base/useAutocomplete';
import { Icon } from './Icon';
import { Box } from '@mui/material';

const Wrapper = styled.div`
  z-index: 6;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

type Option = { title: string; id: string; group: string; index: number; live?: boolean };

export const Selector: React.FC = () => {
  const catalog = useAppStore((s) => s.catalog);
  const currentAmbianceCategoryId = useAppStore((s) => s.currentAmbianceCategoryId);
  const currentAmbianceIndex = useAppStore((s) => s.currentAmbianceIndex);
  const setCurrentAmbianceIndex = useAppStore((s) => s.setCurrentAmbianceIndex);
  const matches = useMediaQuery('(min-width:500px)');

  const videos = catalog[currentAmbianceCategoryId]?.videos ?? [];

  const options = videos.map<Option>((a, index) => ({
    title: a.name,
    id: a.code,
    group: a.group,
    index,
    live: a.livestream,
  }));

  const onChangeHandler: UseAutocompleteProps<
    Option,
    undefined,
    undefined,
    undefined
  >['onChange'] = (e, value) => {
    console.log(value);
    if (!!value && value?.index >= 0) {
      setCurrentAmbianceIndex(value.index);
    }
  };

  return (
    <Wrapper>
      <Autocomplete
        value={options[currentAmbianceIndex]}
        options={options.sort((a, b) => -b.group.localeCompare(a.group))}
        groupBy={(option) => option.group}
        getOptionLabel={(option) => option.title}
        renderOption={(props, option) => (
          <Box component='li' {...props}>
            {option.live === true 
              ? <><Icon icon='live'/> &nbsp; {option.title}</>
              : <>{option.title}</>
            }
          </Box>
        )}
        sx={{
          width: matches ? 400 : 200,
        }}
        renderInput={(params) => (
          <TextField {...params} label="Ambiance Selector" sx={{ color: 'white' }} />
        )}
        onChange={onChangeHandler}
      />
    </Wrapper>
  );
};
