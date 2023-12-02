"use client";

import AudioTracks from "@/components/sounds/editor/AudioTracks";
import {
  SoundsContext,
  SoundsContextReducer,
  SoundsContextState,
} from "@/context/SoundsContext";
import { Box } from "@mui/material";
import { useReducer } from "react";

export default function Sound() {
  return (
    <SoundsContext.Provider
      value={useReducer(SoundsContextReducer, SoundsContextState)}
    >
      <Box>
        <AudioTracks originalDuration={30000} />
      </Box>
    </SoundsContext.Provider>
  );
}
