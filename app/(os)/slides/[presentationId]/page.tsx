"use client";

import SlideEditor from "@/components/slides/editor/SlideEditor";
import SlideList from "@/components/slides/nav/SlideList";
import {
  SlidesContext,
  SlidesContextReducer,
  SlidesContextState,
} from "@/context/SlidesContext";
import { Button, Grid } from "@mui/material";
import { useReducer } from "react";

export default function Presentation() {
  return (
    <SlidesContext.Provider
      value={useReducer(SlidesContextReducer, SlidesContextState)}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <SlideList />
        </Grid>
        <Grid item xs={12} md={9}>
          <SlideEditor />
        </Grid>
      </Grid>
    </SlidesContext.Provider>
  );
}
