import React, { useState } from "react";

import {
  Button,
  Container,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { auth, db } from "../../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { checkExistingEmail } from "../../firebase/firebase.service";
import { addDoc, collection } from "firebase/firestore";

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [passwordType, setPasswordType] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  let navigate = useNavigate();

  const handleError = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        setError("This email is not exist!");
        break;
      case "auth/wrong-password":
        setError("This password is not correct!");
        break;
      case "auth/weak-password":
        setError("This password is too weak!");
        break;
      case "auth/email-already-in-use":
        setError("This email is already exist!");
        break;
      default:
        setError("An unknown error occurred!");
        break;
    }
  };

  const resetForm = (isLogin) => {
    setEmail("");
    setPassword("");
    setError(null);
    if (isLogin) {
      navigate("/");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      setPersistence(auth, browserSessionPersistence).then(async () => {
        return signInWithEmailAndPassword(auth, email, password)
          .then(async (res) => {
            let isExist = await checkExistingEmail(email);
            if (!isExist) {
              addDoc(collection(db, "users"), {
                displayName: res.user.displayName
                  ? res.user.displayName
                  : res.user.uid,
                email: res.user.email,
                photoURL: res.user.photoURL
                  ? res.user.photoURL
                  : "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png",
                uid: res.user.uid,
              });
            }
            resetForm(true);
          })
          .catch((error) => {
            handleError(error.code);
          });
      });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          setIsLogin(true);
          resetForm(false);
        })
        .catch((error) => {
          handleError(error.code);
        });
    }
  };
  return (
    <div id="auth-page">
      <Container
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={20}
          style={{ padding: "30px 20px", width: 400, margin: "auto" }}
        >
          <Typography variant="h4">
            {isLogin ? "Sign in" : "Sign up"}
          </Typography>
          <Typography variant="subtitle1">
            {isLogin ? "Welcome to Chatbox" : "Create a new account"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack direction="column" marginTop="20px" spacing={1}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <TextField
                label="Password"
                fullWidth
                type={passwordType ? "password" : "text"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={() => setPasswordType(!passwordType)}
                      style={{ cursor: "pointer" }}
                    >
                      {passwordType ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="subtitle2" sx={{ color: "red" }}>
                {error ? error : null}
              </Typography>
              <Button
                type="submit"
                variant="contained"
                style={{ marginTop: "16px" }}
              >
                {isLogin ? "Sign in" : "Sign up"}
              </Button>
              <Divider />
              <Typography
                variant="subtitle2"
                align="center"
                color="primary"
                style={{ marginTop: "12px", cursor: "pointer" }}
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Switch to Sign up" : "Switch to Sign in"}
              </Typography>
            </Stack>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Authentication;
