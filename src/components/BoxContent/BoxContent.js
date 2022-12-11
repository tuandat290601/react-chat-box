import React, { useEffect, useState } from "react";

import {
  Avatar,
  Badge,
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Message from "../Message/Message";
import SendIcon from "@mui/icons-material/Send";
import { FirebaseContext } from "../../context/firebaseContext";
import useFirestore from "../../customHooks/useFirestore";
import { AuthContext } from "../../context/authContext";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

const BoxContent = () => {
  const { currentRoom, currentGuest, setCurrentRoom } =
    React.useContext(FirebaseContext);
  const { currentUser } = React.useContext(AuthContext);

  const [text, setText] = useState("");
  const [isSubmit, setIsSubmit] = useState(false)

  let messageCondition = React.useMemo(() => {
    return {
      name: "roomId",
      operator: "==",
      value: currentRoom?.roomId ? currentRoom.roomId : "",
      orderBy: ["createAt", "desc"],
    };
  }, [currentRoom]);

  const messages = useFirestore("messages", messageCondition);

  const newConversation = async () => {
    if (!currentRoom) {
      const conversationRef = await addDoc(collection(db, "conversations"), {
        lastActive: null,
        lastMsg: {
          content: null,
          uid: null,
        },
        memberList: [currentUser.uid, currentGuest.uid],
        roomId: null,
      });

      let docSnap = await getDoc(conversationRef);

      await updateDoc(conversationRef, {
        roomId: docSnap.id,
      });

      docSnap = await getDoc(conversationRef);

      setCurrentRoom(docSnap.data());
    }
  };


  const handleSendMessage = async () => {
    // add new Message
    if (text.length > 0) {
      await addDoc(collection(db, "messages"), {
        content: text,
        createAt: serverTimestamp(),
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        roomId: currentRoom.roomId,
        uid: currentUser.uid,
      });
      await updateDoc(doc(db, "conversations", currentRoom.roomId), {
        lastMsg: {
          content: text,
          uid: currentUser.uid,
        },
        lastActive: serverTimestamp(),
      });
      setText("");
    }
  };

  useEffect(() => {
    if(isSubmit) {
      newConversation();
      if(currentRoom) {
        handleSendMessage()
        setIsSubmit(false)
      }
    }
    // eslint-disable-next-line
  }, [isSubmit, currentRoom])

  return (
    <>
      {currentGuest ? (
        <Stack
          direction="column"
          padding="20px"
          position="relative"
          height="100vh"
        >
          <Grid
            container
            height="120px"
            sx={{
              display: "flex",
              alignItems: "center",
              zIndex: "9",
            }}
          >
            <Grid
              item
              xs={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Badge
                color="success"
                variant="dot"
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <Avatar
                  src={
                    currentGuest.photoURL
                      ? currentGuest.photoURL
                      : "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png"
                  }
                />
              </Badge>
            </Grid>
            <Grid item xs={10}>
              <Stack>
                <Typography variant="subtitle1" fontWeight="bold">
                  {currentGuest.displayName}
                </Typography>
                <Typography
                  variant="subtitle2"
                  xs={{ marginTop: "-4px", color: "grey" }}
                >
                  Online
                </Typography>
              </Stack>
            </Grid>
            <Grid
              item
              xs={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MoreVertIcon sx={{ color: "grey", cursor: "pointer" }} />
            </Grid>
          </Grid>
          <Divider />
          <Stack
            sx={{
              height: "calc(100vh - 120px - 50px)",
              padding: "16px 0 60px 0",
              overflowX: "hidden",
              overflowY: "scroll",
              position: "relative",
            }}
            direction="column-reverse"
            spacing={1}
          >
            {messages?.map((message, index) => {
              return (
                <Grid item key={index}>
                  <Message
                    message={message}
                    isInterrupt={
                      messages[index]?.uid === messages[index + 1]?.uid
                    }
                  />
                </Grid>
              );
            })}
          </Stack>
          <Grid
            item
            position="absolute"
            sx={{
              width: "calc(100% - 40px)",
              bottom: "10px",
              left: "20px",
              background: "#fff",
            }}
          >
            <form onSubmit={(e) => {
              e.preventDefault()
              setIsSubmit(true)}}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write something..."
                value={text}
                InputProps={{
                  endAdornment: (
                    <Button
                      color="primary"
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                      }}
                      type="submit"
                    >
                      Send
                      <SendIcon
                        sx={{
                          marginLeft: "8px",
                          fontSize: "16px",
                        }}
                      />
                    </Button>
                  ),
                }}
                onChange={(e) => setText(e.target.value)}
              />
            </form>
          </Grid>
        </Stack>
      ) : (
        <Stack
          width="100%"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography color="primary" textAlign="center">
            Choose a conversation
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default BoxContent;
