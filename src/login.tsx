import React, { useContext, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import './index.css';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { CircularProgress } from "@mui/material";

export default function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const { signIn, currentUser } = useContext(AuthContext);

  // Check if the current user exists
  useEffect(() => {
    if (currentUser) {
      navigate('/admin')
    }
  }, [currentUser, navigate])

  const attemptLogin = () => {
    setError(undefined);

    signIn(username, password)
      .then(() => {
        navigate("/admin", { replace: true });
      })
      .catch(e => {

        if (e.code === "auth/invalid-credential" || e.code === "auth/invalid-email") {
          setError("Invalid Username or Password");
        } else {
          setError("Sign in error");
        }

        setPassword("");
        setUsername("");

      })
  }

  //If user is undefined, because we're waiting on firebase response, only display loading bar
  if (currentUser === undefined) {
    return (
      <Box id="login-page" sx={{ width: '100%' }} data-testid='login-spinner'>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      id="login-page"
      data-testid='login'
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: 'auto' },
      }}
      noValidate
      autoComplete="off"
    >
      <Typography className="admin-login-title" variant="h4">Administrative Login Page</Typography>
      <TextField
        sx={{ m: 2 }}
        required={true}
        value={username}
        label="Username"
        variant="filled"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setUsername(event.target.value);
        }}
      />
      <TextField
        sx={{ m: 2 }}
        type="password"
        required={true}
        value={password}
        label="Password"
        variant="filled"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setPassword(event.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            attemptLogin()
          }
        }}
      />
      <div className="error-placeholder">
        {error && <p>{error}</p>}
      </div>
      <div className="login-button-parent">
        <Button
          sx={{ '&:hover': { bgcolor: 'white' } }}
          variant="contained"
          size="large"
          onClick={attemptLogin}
        >
          Sign In
        </Button>
      </div>
    </Box>
  )
}


