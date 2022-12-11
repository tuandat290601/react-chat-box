import React, { useEffect, useState } from "react";

import {
  Avatar,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


import { AuthContext } from "../../context/authContext";
import {
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getDocIdByEmail } from "../../firebase/firebase.service";
import { updateProfile } from "firebase/auth";

import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser } = React.useContext(AuthContext);

  const [userRef, setUserRef] = useState(null)

  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const initProfile = () => {
    setDisplayName(
      currentUser?.displayName ? currentUser?.displayName : currentUser?.uid
    );
    setPhotoURL(
      currentUser?.photoURL
        ? currentUser?.photoURL
        : "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png"
    );
  };

  useEffect(() => {
    const getRef = async () => {
      const ref = await getDocIdByEmail(currentUser?.email)
      setUserRef(ref)
    }
    if (currentUser) {
      initProfile();
      getRef()
    }
    // eslint-disable-next-line
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(currentUser, {
      displayName: displayName,
      photoURL: photoURL,
    }).then(() => {
      initProfile();
    })
    updateDoc(doc(db, "users", userRef), {
      displayName: displayName,
      email: currentUser.email,
      photoURL: photoURL,
      uid: currentUser.uid,
    })
  };

  return (
    <Container
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        posistion: "relative",
      }}
    >
    <Button variant="contained" LinkComponent={Link} to = {-1} sx ={{position: 'absolute', top: 20, left: 20}}>
      <KeyboardBackspaceIcon/>
      Back
    </Button>
      <Paper elevation={24} sx={{ width: "500px", padding: "20px" }}>
        <Typography variant="h5" color="primary">
          Edit Profile
        </Typography>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          margin="20px"
        >
          <Avatar
            sx={{ width: 72, height: 72, marginBottom: "8px" }}
            src={photoURL}
          />
        </Stack>
        <form onSubmit={handleSubmit}>
          <Grid>
            <TextField
              fullWidth
              size="small"
              sx={{ marginBottom: "8px" }}
              value={displayName}
              label="Display Name"
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              sx={{ marginBottom: "8px" }}
              value={currentUser?.email}
              disabled
              label="Email"
            />
            <TextField
              fullWidth
              size="small"
              sx={{ marginBottom: "8px" }}
              value={photoURL}
              label="Photo URL"
              onChange={(e) => setPhotoURL(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              sx={{ marginBottom: "8px" }}
              value={currentUser?.uid}
              disabled
              label="User ID"
            />
          </Grid>
          <Grid display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained">
              Change
            </Button>
            <Button
              type="button"
              variant="outlined"
              sx={{ marginLeft: "10px" }}
            >
              Cancel
            </Button>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;
