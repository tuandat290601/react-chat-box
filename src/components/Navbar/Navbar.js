import React from "react";
import Conversation from "../Conversation/Conversation";

import { Button, Divider, Stack, Typography } from "@mui/material";
import LaunchSharpIcon from "@mui/icons-material/LaunchSharp";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

import { FirebaseContext } from "../../context/firebaseContext";
import { Link } from "react-router-dom";
import SearchBox from "../SearchBox/SearchBox";

const Navbar = () => {
  const { conversations, setCurrentRoom, setCurrentGuest } =
    React.useContext(FirebaseContext);
  const handleLogout = () => {
    setCurrentRoom(null);
    setCurrentGuest(null);
    signOut(auth);
  };

  return (
    <Stack
      sx={{
        backgroundColor: "#f5f7fb",
        height: "100vh",
        position: "relative",
        padding: "20px",
      }}
    >
      <Stack direction="column" height="120px">
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4">Chats</Typography>
          <Button
            LinkComponent={Link}
            to={"/profile"}
            sx={{ display: "flex", alignItems: "center" }}
          >
            Edit Profile
            <LaunchSharpIcon
              sx={{ fontSize: "16px", margin: "-4px 0 0 10px" }}
            />
          </Button>
        </Stack>
        <SearchBox />
      </Stack>
      <Divider />
      <Stack direction="column">
        {conversations.map((conversation) => {
          return <Conversation conversation={conversation} key={conversation.roomId} />;
        })}
      </Stack>
      <Button
        sx={{ zIndex: "tooltip", position: "absolute", bottom: 10, left: 0 }}
        fullWidth
        onClick={handleLogout}
      >
        Log out
      </Button>
    </Stack>
  );
};

export default Navbar;
