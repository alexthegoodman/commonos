"use client";

import { Box } from "@mui/material";
import { useReducer, useState } from "react";
import Autosaver from "./Autosaver";
import {
  DrawingsContext,
  DrawingsContextReducer,
  DrawingsContextState,
} from "@/context/DrawingsContext";
import FlowEditor from "./FlowEditor";

export default function InnerLayout({ flowId, context }) {
  return (
    <DrawingsContext.Provider
      value={useReducer(DrawingsContextReducer, context)}
    >
      <Autosaver id={flowId} />
      <Box>
        <FlowEditor />
      </Box>
    </DrawingsContext.Provider>
  );
}
