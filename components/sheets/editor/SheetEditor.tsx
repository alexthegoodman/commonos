"use client";

import * as React from "react";
import {
  ReactGrid,
  Column,
  Row,
  CellChange,
  TextCell,
  Id,
} from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { styled } from "@mui/material";
import { useSheetsContext } from "@/context/SheetsContext";

const applyChangesToRow = (
  changes: CellChange<TextCell>[],
  prevRows: Row[],
  prevColumns: Column[]
): Row[] => {
  changes.forEach((change) => {
    const rowIndex = prevRows.findIndex((el) => el.rowId === change.rowId);
    const cellIndex = prevColumns.findIndex(
      (el) => el.columnId === change.columnId
    );
    prevRows[rowIndex].cells[cellIndex].text = change.newCell.text;
  });
  return [...prevRows];
};

const GridWrapper = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  width: "100%",
  height: "calc(100vh - 100px)",
}));

export default function SheetEditor() {
  const [state, dispatch] = useSheetsContext();

  const columns = state.columns;
  const rows = state.rows;

  const handleChanges = (changes: CellChange<TextCell>[]) => {
    dispatch({
      type: "rows",
      payload: applyChangesToRow(changes, rows, columns),
    });
  };

  const handleColumnResize = (ci: Id, width: number) => {
    dispatch({
      type: "columns",
      payload: columns.map((column) => {
        if (column.columnId === ci) {
          return { ...column, width };
        }
        return column;
      }),
    });
  };

  return (
    <GridWrapper>
      <ReactGrid
        rows={rows}
        columns={columns}
        onCellsChanged={handleChanges}
        onColumnResized={handleColumnResize}
        enableRangeSelection
        enableRowSelection
        enableColumnSelection
      />
    </GridWrapper>
  );
}
