import * as React from "react";

import { Box, Button, IconButton, styled, TextField } from "@mui/material";
import {
  CurrencyDollar,
  Function,
  Palette,
  TextColumns,
} from "@phosphor-icons/react";
import { Add, Close } from "@mui/icons-material";
import { useSheetsContext } from "@/context/SheetsContext";
import { realDefaultColumns, realDefaultRows } from "@/fixtures/sheets";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
const { DateTime } = require("luxon");

const Header = styled("header")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginBottom: "25px",
  gap: "10px",
}));

const Tab = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  border: "1px #E5E5E5 solid",
  borderRadius: "15px",
}));

const EditorHeader = ({
  title,
  setTitle,
  selectedCells,
  selectedSheet,
  setSelectedSheet,
}) => {
  const [state, dispatch] = useSheetsContext();

  const hasAnySheets = state?.sheets?.length;

  const onTitleChange = (e: any) => {
    console.info("title change", e.target.value);
    setTitle(e.target.value);
  };

  const handleAddSheet = (e: any) => {
    console.info("add sheet");
    let newState = [];
    if (!hasAnySheets) {
      newState = [
        {
          id: uuidv4(),
          name: "New Sheet",
          ...state,
        },
      ];
    } else {
      newState = state.sheets;
    }

    dispatch({
      type: "sheets",
      payload: [
        ...newState,
        {
          id: uuidv4(),
          name: "New Sheet",
          columns: realDefaultColumns,
          rows: realDefaultRows,
        },
      ],
    });
    dispatch({ type: "rows", payload: [] });
    dispatch({ type: "columns", payload: [] });
  };

  const handleSheetClick = (sheetIndex) => {
    setSelectedSheet(sheetIndex);
  };

  const handleColorClick = () => {
    dispatch({
      type: "sheets",
      payload: state.sheets.map((sheet) => {
        return {
          ...sheet,
          rows: sheet.rows.map((row) => {
            return {
              ...row,
              cells: row.cells.map((cell) => {
                const isSelected = selectedCells.find((id) => id === cell.id);

                return {
                  ...cell,
                  color: isSelected ? "red" : cell.color,
                };
              }),
            };
          }),
        };
      }),
    });
  };

  return (
    <>
      <Header>
        <TextField
          onChange={onTitleChange}
          defaultValue={title}
          placeholder="Title"
          style={{
            width: "400px",
            marginRight: "15px",
          }}
        />
        {/** Format Box */}
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          endIcon={<CurrencyDollar size={20} />}
        >
          Format
        </Button>
        {/** Formula Box */}
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          endIcon={<Function size={20} />}
        >
          Formula
        </Button>
        {/** Color Box */}
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          endIcon={<Palette size={20} />}
          onClick={handleColorClick}
        >
          Color
        </Button>
      </Header>
      <Header>
        {!hasAnySheets && (
          <Tab
            style={{
              backgroundColor: selectedSheet === 0 ? "#E5E5E5" : "white",
            }}
          >
            <Button variant="text" onClick={() => handleSheetClick(0)}>
              Sheet 1
            </Button>
            <IconButton size="small">
              <Close />
            </IconButton>
          </Tab>
        )}
        {state?.sheets?.map((sheet, i) => (
          <Tab
            style={{
              backgroundColor: selectedSheet === i ? "#E5E5E5" : "white",
            }}
          >
            <Button
              size="small"
              variant="text"
              onClick={() => handleSheetClick(i)}
            >
              {sheet.name}
            </Button>
            <IconButton size="small">
              <Close />
            </IconButton>
          </Tab>
        ))}
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          endIcon={<Add />}
          onClick={handleAddSheet}
        >
          Add Sheet
        </Button>
      </Header>
    </>
  );
};

export default EditorHeader;
