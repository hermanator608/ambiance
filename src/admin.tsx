import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Typography, Button, Box, TextField } from "@mui/material";


export default function AdminPage() {
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const auth = getAuth();

  const attemptLogin = async () => {

    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential: any) => {
      // Signed in
      var user = userCredential.user;
      alert("success?");
      window.location.replace("http://localhost:3000/");

      // ...
    })
    .catch((error: any) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });

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
      <Typography variant="h3">Administrative Login Page</Typography>
      <Typography variant="h6">Let's get authenticated:</Typography>
      <TextField 
        id="login-text-field" 
        defaultValue={ username }
        label="Username"
        variant="filled"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setUsername(event.target.value);
        }}
      />
      <TextField 
        id="login-text-field" 
        label= "Password"
        defaultValue={ password }
        variant="filled"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setPassword(event.target.value);
        }} 
      />
      <div>
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
      
    </Box> 

  )
}


