import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Main } from './Main';
import { theme } from './theme';
import { RecoilRoot } from 'recoil';
import { Route, Routes } from "react-router-dom";
import LoginPage from './login';
import AdminPage from './admin';
import { RequireAuth } from './RequireAuth';
import { AuthProvider } from './AuthProvider';


const App: React.FC = () => {

  return (
    <AuthProvider>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Main />} />
          </Routes>
        </ThemeProvider>
      </RecoilRoot>
    </AuthProvider>
  );
};

export default App;
