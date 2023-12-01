"use client";

import { Button, Grid } from "@mui/material";

export default function Slides() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <Button>Add Presentation</Button>
      </Grid>
    </Grid>
  );
}
