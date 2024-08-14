import * as React from "react";

import { Box, Button, styled, TextField } from "@mui/material";
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
const { DateTime } = require("luxon");

const Header = styled("header")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginBottom: "25px",
  gap: "10px",
}));

const EditorHeader = ({ title, setTitle }) => {
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
        >
          Color
        </Button>
      </Header>
      <Header>
        {!hasAnySheets && (
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            endIcon={<Close />}
          >
            Sheet 1
          </Button>
        )}
        {state?.sheets?.map((sheet) => (
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            endIcon={<Close />}
          >
            {sheet.name}
          </Button>
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
