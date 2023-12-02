"use client";

import SheetEditor from "@/components/sheets/editor/SheetEditor";
import {
  SheetsContext,
  SheetsContextReducer,
  SheetsContextState,
} from "@/context/SheetsContext";
import { Box } from "@mui/material";
import { useReducer } from "react";

export default function Sheet() {
  return (
    <SheetsContext.Provider
      value={useReducer(SheetsContextReducer, SheetsContextState)}
    >
      <Box>
        <SheetEditor />
      </Box>
    </SheetsContext.Provider>
  );
}
