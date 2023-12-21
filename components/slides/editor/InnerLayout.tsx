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
import { useReducer, useState } from "react";
import EditorHeader from "./EditorHeader";
import AutoSidebar from "./AutoSidebar";

export default function InnerLayout({ presentationId, slideData }) {
  const [title, setTitle] = useState(slideData.title);
  const [exporting, setExporting] = useState(false);
  const [exportDoc, setExportDoc] = useState(null);
  const [slidesExported, setSlidesExported] = useState(null); // initially null for useEffect detection

  return (
    <SlidesContext.Provider
      value={useReducer(SlidesContextReducer, slideData.context)}
    >
      <Autosaver id={presentationId} title={title} />
      <EditorHeader title={title} setTitle={setTitle} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <SlideList exporting={exporting} />
        </Grid>
        <Grid item xs={12} md={10}>
          <EditorWrapper
            title={title}
            exporting={exporting}
            setExporting={setExporting}
            exportDoc={exportDoc}
            setExportDoc={setExportDoc}
            slidesExported={slidesExported}
            setSlidesExported={setSlidesExported}
          />
        </Grid>
      </Grid>
      <AutoSidebar />
    </SlidesContext.Provider>
  );
}
