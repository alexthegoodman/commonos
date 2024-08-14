"use client";

import SheetEditor from "@/components/sheets/editor/SheetEditor";
import {
  SheetsContext,
  SheetsContextReducer,
  SheetsContextState,
} from "@/context/SheetsContext";
import { Box } from "@mui/material";
import { useReducer, useState } from "react";
import Autosaver from "./Autosaver";
import EditorHeader from "./EditorHeader";

export default function InnerLayout({ sheetId, sheetData }) {
  const [title, setTitle] = useState(sheetData.title);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [selectedCells, setSelectedCells] = useState(null);

  console.info("selectedCells", selectedCells);

  return (
    <SheetsContext.Provider
      value={useReducer(SheetsContextReducer, sheetData.context)}
    >
      <Autosaver id={sheetId} title={title} />
      <EditorHeader
        title={title}
        setTitle={setTitle}
        selectedCells={selectedCells}
        selectedSheet={selectedSheet}
        setSelectedSheet={setSelectedSheet}
      />
      <Box>
        <SheetEditor
          selectedCells={selectedCells}
          setSelectedCells={setSelectedCells}
          selectedSheet={selectedSheet}
          setSelectedSheet={setSelectedSheet}
        />
      </Box>
    </SheetsContext.Provider>
  );
}
