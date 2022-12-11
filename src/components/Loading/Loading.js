import { CircularProgress, Container } from "@mui/material";
import React, { useEffect } from "react";

const Loading = () => {
  return (
    <Container
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="primary" />
    </Container>
  );
};

export default Loading;
