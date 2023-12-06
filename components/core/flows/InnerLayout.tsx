"use client";

import { Box } from "@mui/material";
import { useReducer, useState } from "react";
import Autosaver from "./Autosaver";
import FlowEditor from "./FlowEditor";
import {
  FlowQuestionsContext,
  FlowQuestionsContextReducer,
} from "@/context/FlowQuestionsContext";

export default function InnerLayout({ flowId, prompt, context }) {
  return (
    <FlowQuestionsContext.Provider
      value={useReducer(FlowQuestionsContextReducer, context)}
    >
      <Autosaver id={flowId} />
      <Box>
        <FlowEditor id={flowId} prompt={prompt} />
      </Box>
    </FlowQuestionsContext.Provider>
  );
}
