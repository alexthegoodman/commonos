"use client";

import {
  FlowResultsContext,
  FlowResultsContextReducer,
} from "@/context/FlowResultsContext";
import { AutoAwesome } from "@mui/icons-material";
import { Box, Button, Grid, Typography, styled } from "@mui/material";
import { useReducer } from "react";
import ResultsHeader from "./ResultsHeader";
import ResultsViewer from "./ResultsViewer";
import ResultsAutosaver from "./ResultsAutosaver";

export default function InnerResults({ flowId, prompt, context }) {
  return (
    <FlowResultsContext.Provider
      value={useReducer(FlowResultsContextReducer, context)}
    >
      <ResultsAutosaver id={flowId} />
      <ResultsHeader />
      <Box>
        <ResultsViewer />
      </Box>
    </FlowResultsContext.Provider>
  );
}
