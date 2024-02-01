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
import { Button, styled } from "@mui/material";
import { useSheetsContext } from "@/context/SheetsContext";
import { v4 as uuidv4 } from "uuid";

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
  // backgroundColor: theme.palette.background.paper,
  backgroundColor: "rbga(255, 255, 255, 0.3)",
  width: "calc(100vw - 50px)",
  height: "calc(100vh - 225px)",
  overflow: "scroll",
}));

const InnerWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  width: "fit-content",
  backgroundColor: "#E5E5E5",
  "& .columnButton": {
    position: "absolute",
    top: 0,
    right: "-119px",
    height: "100%",
    boxShadow: "none",
  },
  "& .rowButton": {
    position: "absolute",
    bottom: "-37px",
    left: 0,
    width: "100%",
    boxShadow: "none",
  },
}));

export default function SheetEditor() {
  const [state, dispatch] = useSheetsContext();

  const columns = state.columns;
  const rows = state.rows;

  // add index column to columns
  const columnsWithIndex = [
    {
      columnId: "index",
      width: 50,
      reorderable: false,
      resizable: false,
      editorOnly: true,
    },
    ...columns,
  ];

  // add index column to each row
  const rowsWithIndex = rows.map((row, index) => ({
    ...row,
    cells: [
      {
        editorOnly: true,
        type: "header",
        text: `${index + 1}`,
        disabled: true,
      },
      ...row.cells,
    ],
  }));

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

  const addColumn = () => {
    dispatch({
      type: "columns",
      payload: [
        ...columns,
        {
          columnId: uuidv4(),
          width: 100,
          reorderable: true,
          resizable: true,
        },
      ],
    });
    dispatch({
      type: "rows",
      payload: rows.map((row) => ({
        ...row,
        cells: [
          ...row.cells,
          {
            type: "text",
            text: "",
          },
        ],
      })),
    });
  };

  const addRow = () => {
    dispatch({
      type: "rows",
      payload: [
        ...rows,
        {
          rowId: uuidv4(),
          cells: columns.map((column) => ({
            type: "text",
            text: "",
          })),
        },
      ],
    });
  };

  return (
    <>
      <GridWrapper>
        <InnerWrapper>
          <ReactGrid
            rows={rowsWithIndex}
            columns={columnsWithIndex}
            onCellsChanged={handleChanges}
            onColumnResized={handleColumnResize}
            enableRangeSelection
            enableRowSelection
            enableColumnSelection
          />
          <Button
            className="columnButton"
            variant="contained"
            color="secondary"
            onClick={addColumn}
          >
            Add Column
          </Button>
          <Button
            className="rowButton"
            variant="contained"
            color="secondary"
            onClick={addRow}
          >
            Add Row
          </Button>
        </InnerWrapper>
      </GridWrapper>

      <style jsx global>{`
        .rg-cell {
          // color: white !important;
          background-color: #ffffff !important;
          color: black !important;
        }
      `}</style>
    </>
  );
}
