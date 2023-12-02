"use client";

import DrawingEditor from "@/components/drawings/editor/DrawingEditor";
import {
  DrawingsContext,
  DrawingsContextReducer,
  DrawingsContextState,
} from "@/context/DrawingsContext";
import { Box } from "@mui/material";
import { useReducer } from "react";

export default function Drawing() {
  return (
    <DrawingsContext.Provider
      value={useReducer(DrawingsContextReducer, DrawingsContextState)}
    >
      <Box>
        <DrawingEditor />
      </Box>
    </DrawingsContext.Provider>
  );
}
