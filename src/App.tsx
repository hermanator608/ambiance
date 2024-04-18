import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Main } from './Main';
import { theme, adminTheme } from './theme';
import { RecoilRoot } from 'recoil';
import { Route, Routes, useLocation } from "react-router-dom";
import LoginPage from './login';
import AdminPage from './admin';
import { RequireAuth } from './RequireAuth';
import { AuthProvider } from './AuthProvider';
import CssBaseline from '@mui/material/CssBaseline';

const App: React.FC = () => {

  const adminThemeMap = ["/login", "/admin"];
  let location = useLocation()

  return (
    <AuthProvider>
      <RecoilRoot>
        <ThemeProvider theme={adminThemeMap.includes(location.pathname) ? adminTheme : theme}>
          <CssBaseline />
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
