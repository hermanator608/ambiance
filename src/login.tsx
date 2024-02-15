import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import './index.css';

export default function LoginPage() {
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const auth = getAuth();

  const attemptLogin = async () => {

    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential: any) => {
      // Signed in
      alert("success!");
      setUsername("");
      setPassword("");
      setSignedIn(true);

    })
    .catch((error: any) => {
      console.log(error.code);
      console.log(error.message);
    });

  }

  const attemptSignOut = async () => {
    signOut(auth).then(() => {
      alert("Sign out Success");
      setSignedIn(false);

    }).catch((error) => {
      console.log(error.code);
      console.log(error.message);
    })
  }

 
  return (
    <Box
      id="admin-page"
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: 'auto' },
      }}
      noValidate
      autoComplete="off"
    >
      <Typography className="admin-login-title" variant="h4">Administrative Login Page</Typography>

      {signedIn === false
      ?<div>
        <TextField
          sx={{m:2}}
          className="login-text-field" 
          required={true}
          defaultValue={ username }
          label="Username"
          variant="filled"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setUsername(event.target.value);
          }}
        />
        <TextField
            sx={{m:2}} 
          className="login-text-field"
          type="password"
          required={true}
          defaultValue={ password }
          label= "Password"
          variant="filled"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value);
          }} 
        />
        <div className="login-button">
          <Button 
            variant="contained" 
            size="large"
            onClick={() => {
              attemptLogin();
            }}
          > 
          Sign In 
          </Button>
        </div>
      </div>

      : <Button 
          variant="contained" 
          size="large"
          onClick={() => {
            attemptSignOut();
          }}
        > 
          Sign Out 
        </Button>
      } 

    </Box> 
  )
}


