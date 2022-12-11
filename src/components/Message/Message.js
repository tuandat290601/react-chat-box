import { Stack, Avatar, Typography } from "@mui/material";
import React from "react";
import { AuthContext } from "../../context/authContext";
import { FirebaseContext } from "../../context/firebaseContext";

const Message = ({ message, isInterrupt }) => {
  const {
    currentUser: { uid },
  } = React.useContext(AuthContext);

  const { currentGuest } = React.useContext(FirebaseContext);
  return (
    <Stack>
      {message.uid === uid ? null : (
        <>
          {isInterrupt ? null : (
            <Avatar
              src={
                currentGuest.photoURL
                  ? currentGuest.photoURL
                  : "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png"
              }
              sx={{ width: 30, height: 30 }}
            />
          )}
        </>
      )}
      <Typography
        sx={{
          maxWidth: "60%",
          marginLeft: message.uid === uid ? "auto" : "30px",
          marginRight: message.uid === uid ? "20px" : "auto",
          padding: "10px",
          fontSize: "14px",
          backgroundColor: message.uid === uid ? "#e3f2fd" : "#42a5f5",
          color: message.uid === uid ? "black" : "white",
          borderRadius: "5px",
        }}
      >
        {message.content}
      </Typography>
    </Stack>
  );
};

export default Message;
