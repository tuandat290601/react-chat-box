import { Grid } from "@mui/material";
import React from "react";
import BoxContent from "../../components/BoxContent/BoxContent";
import Navbar from "../../components/Navbar/Navbar";

const Home = () => {
  return (
    <Grid container direction="row">
      <Grid item xs={4}>
        <Navbar />
      </Grid>
      <Grid item xs={8}>
        <BoxContent />
      </Grid>
    </Grid>
  );
};

export default Home;
