"use client";

import { Box } from "@mui/material";
import { useReducer, useState } from "react";
import Autosaver from "./Autosaver";
import EditorHeader from "./EditorHeader";
import {
  DrawingsContext,
  DrawingsContextReducer,
  DrawingsContextState,
} from "@/context/DrawingsContext";
import { DynamicEditor } from "./DynamicEditor";

export default function InnerLayout({ drawingId, drawingData }) {
  const [title, setTitle] = useState(drawingData.title);

  return (
    <DrawingsContext.Provider
      value={useReducer(DrawingsContextReducer, drawingData.context)}
    >
      <Autosaver id={drawingId} title={title} />
      <EditorHeader title={title} setTitle={setTitle} />
      <Box>
        <DynamicEditor />
      </Box>
    </DrawingsContext.Provider>
  );
}
