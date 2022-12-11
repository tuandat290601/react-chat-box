import React, { useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { FirebaseContext } from "../../context/firebaseContext";
import {
  Grid,
  ListItemButton,
  Stack,
  TextField,
  List,
  Avatar,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
  getAConversation,
  searchByEmail,
} from "../../firebase/firebase.service";

const SearchLoading = () => {
  return (
    <>
      <ListItemButton
        disabled
        sx={{ fontSize: 14, fontStyle: "italic", color: "grey" }}
      >
        Waiting for searching...
      </ListItemButton>
    </>
  );
};

const SearchBox = () => {
  const {
    currentUser: { uid },
  } = React.useContext(AuthContext);

  const { setCurrentRoom, setCurrentGuest } = React.useContext(FirebaseContext);

  const [key, setKey] = useState("");
  const [result, setResult] = useState([]);

  const [loading, setLoading] = useState(false);

  const submitSearch = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const getSearchList = async () => {
      const list = await searchByEmail(key);
      setResult(list);
      setLoading(false);
    };
    if (!loading) {
      setLoading(true);
    }
    const timeout = setTimeout(async () => {
      if (key.length > 0) {
        getSearchList();
      }
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line
  }, [key]);

  const onSetBoxContent = async (member) => {
    getAConversation(uid, member.uid).then((res) => {
      setCurrentRoom(res);
      setCurrentGuest(member);
      onClose()
    });
  };

  const onClose = () => {
    setKey("");
    setResult([]);
    setLoading(false);
  };
  return (
    <form onSubmit={submitSearch}>
      <Stack sx={{ position: "relative" }}>
        <TextField
          label="Email"
          size="small"
          style={{ marginTop: "10px" }}
          value={key}
          InputProps={{
            endAdornment: (
              <>
                {key.length > 0 ? (
                  <CloseIcon
                    style={{
                      cursor: "pointer",
                      color: "error",
                    }}
                    onClick={onClose}
                  />
                ) : (
                  <SearchIcon
                    style={{
                      cursor: "pointer",
                    }}
                  />
                )}
              </>
            ),
          }}
          onChange={(e) => setKey(e.target.value)}
        />
        {key.length > 0 && (
          <List
            sx={{
              position: "absolute",
              top: "110%",
              left: 0,
              background: "#f5f7fb",
              width: "100%",
              border: 1,
              borderRadius: "5px",
              borderColor: "grey.400",
              zIndex: 99,
            }}
          >
            {loading ? (
              <SearchLoading />
            ) : (
              <>
                {result.length > 0 ? (
                  result.map((user) => {
                    return (
                      <ListItemButton
                        key={user.uid}
                        onClick={() => onSetBoxContent(user)}
                      >
                        <Grid container>
                          <Grid item xs={2} alignItems="center">
                            <Avatar
                              src={
                                user.photoURL
                                  ? user.photoURL
                                  : "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png"
                              }
                            />
                          </Grid>
                          <Grid item xs={10}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {user.displayName}
                            </Typography>
                            <Typography variant="subtitle2">
                              {user.email}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItemButton>
                    );
                  })
                ) : (
                  <>
                    <ListItemButton
                      item
                      sx={{
                        fontSize: 14,
                        fontStyle: "italic",
                        color: "grey",
                      }}
                    >
                      No user found
                    </ListItemButton>
                  </>
                )}
              </>
            )}
          </List>
        )}
      </Stack>
    </form>
  );
};

export default SearchBox;
