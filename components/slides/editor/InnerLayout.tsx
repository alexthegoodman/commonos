"use client";

import Autosaver from "@/components/slides/editor/Autosaver";
import EditorWrapper from "@/components/slides/editor/EditorWrapper";
import SlideList from "@/components/slides/nav/SlideList";
import {
  SlidesContext,
  SlidesContextReducer,
  SlidesContextState,
} from "@/context/SlidesContext";
import { Button, Grid } from "@mui/material";
import { useReducer } from "react";

export default function InnerLayout({ presentationId, slideData }) {
  return (
    <SlidesContext.Provider
      value={useReducer(SlidesContextReducer, slideData.context)}
    >
      <Autosaver id={presentationId} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <SlideList />
        </Grid>
        <Grid item xs={12} md={9}>
          <EditorWrapper />
        </Grid>
      </Grid>
    </SlidesContext.Provider>
  );
}
