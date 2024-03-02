import React, { useContext } from 'react';
import './index.css';
import { AuthContext } from "./AuthProvider";
import { Button } from '@mui/material';

export default function AdminPage() {
  const { currentUser, signOut } = useContext(AuthContext);


  return (

    <div id="admin-page" data-testid='admin'>
      <h1>Admin Page</h1>
      <p>Welcome {currentUser?.email}</p>

      <div className="login-button-parent">
        <Button
          sx={{ '&:hover': { bgcolor: 'white' } }}
          variant="contained"
          size="large"
          onClick={signOut}
        >
          Sign Out
        </Button>
      </div>

    </div>

  );
} 