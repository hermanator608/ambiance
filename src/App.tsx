import React, { useContext, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Main } from './Main';
import { theme } from './theme';
import { RecoilRoot } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { Route, Routes } from "react-router-dom";
import LoginPage from './login';
import AdminPage from './admin';
import { AuthContext } from './AuthProvider';
import { RequireAuth } from './RequireAuth';


const App: React.FC = () => {
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  // Check if the current user exists on the initial render.
  useEffect(() => {
    if (currentUser) {
      navigate('/admin')
    }
  }, [currentUser, navigate])

  return (
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
  );
};

export default App;
