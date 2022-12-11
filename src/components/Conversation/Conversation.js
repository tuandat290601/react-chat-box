import {
  Avatar,
  Card,
  Grid,
  Typography,
  Badge,
  CardActionArea,
  CardContent,
} from "@mui/material";
import React from "react";
import { AuthContext } from "../../context/authContext";
import { FirebaseContext } from "../../context/firebaseContext";
import useFirestore from "../../customHooks/useFirestore";
import { timeSince } from "../../helperFunctions/convertTime";

const Conversation = ({ conversation }) => {
  const { lastMsg, memberList, lastActive } = conversation;

  const {
    currentUser: { uid },
  } = React.useContext(AuthContext);

  const { currentRoom, setCurrentRoom, setCurrentGuest } =
    React.useContext(FirebaseContext);

  const guestCondition = React.useMemo(() => {
    return {
      name: "uid",
      operator: "==",
      value: memberList[0] === uid ? memberList[1] : memberList[0],
    };
    // eslint-disable-next-line
  }, [currentRoom, uid]);

  const guestData = useFirestore("users", guestCondition);

  return (
    <Card
      style={{
        boxShadow: "none",
        border: "none",
        background:
          conversation.roomId === currentRoom?.roomId
            ? "#eceef2"
            : "transparent",
        cursor: "pointer",
      }}
      onClick={() => {
        setCurrentRoom(conversation);
        setCurrentGuest(guestData[0]);
      }}
    >
      <CardActionArea>
        <CardContent>
          <Grid container direction="row">
            <Grid
              item
              sx={{
                display: "flex",
                justifyContent: "flex-start",
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
                    guestData[0]?.photoURL
                      ? guestData[0].photoURL
                      : "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png"
                  }
                />
              </Badge>
            </Grid>
            <Grid item  sx={{ marginLeft: " 10px" }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {guestData[0]?.displayName}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {lastMsg?.uid === uid
                  ? `You: ${lastMsg?.content}`
                  : `${guestData[0]?.displayName}: ${lastMsg?.content}`}
              </Typography>
            </Grid>
          </Grid>
          <Typography
            sx={{ fontSize: "12px", color: "grey", fontStyle: "italic" }}
            textAlign="end"
          >
            {timeSince(new Date(lastActive?.seconds * 1000)) === "Just now"
              ? "Just now"
              : timeSince(new Date(lastActive?.seconds * 1000)) + " ago"}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Conversation;
