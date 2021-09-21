import styled from 'styled-components';
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentAmbianceCategoryState, currentAmbianceIndexState } from '../state';
import { UseAutocompleteProps } from '@mui/core';

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  fieldset:hover {
    border-color: #2196f3 !important;
  }
`;

type Option = { title: string; id: string; group: string; index: number };

export const Selector: React.FC = () => {
  const ambiances = useRecoilValue(
    currentAmbianceCategoryState
  );
  const [currentAmbianceIndex, setCurrentAmbianceIndex] = useRecoilState(currentAmbianceIndexState(undefined));
  const matches = useMediaQuery('(min-width:500px)');

  const options = ambiances.map<Option>((a, index) => ({
    title: a.name,
    id: a.code,
    group: a.group,
    index,
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
        sx={{
          width: matches ? 300 : 200,
        }}
        renderInput={(params) => (
          <TextField {...params} label="Ambiance Selector" sx={{ color: 'white' }} />
        )}
        onChange={onChangeHandler}
      />
    </Wrapper>
  );
};
