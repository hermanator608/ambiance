import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Main } from './Main';
import { theme } from './theme';
import { RecoilRoot } from 'recoil';

const App: React.FC = () => {
  return (
    // Add state here
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <Main />
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;
