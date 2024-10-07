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
import { SheetGrid } from "./SheetGrid";

// const applyChangesToRow = (
//   changes: CellChange<TextCell>[],
//   prevRows: Row[],
//   prevColumns: Column[]
// ): Row[] => {
//   changes.forEach((change) => {
//     const rowIndex = prevRows.findIndex((el) => el.rowId === change.rowId);
//     const cellIndex = prevColumns.findIndex(
//       (el) => el.columnId === change.columnId
//     );
//     prevRows[rowIndex].cells[cellIndex].text = change.newCell.text;
//   });
//   return [...prevRows];
// };

const GridWrapper = styled("div")(({ theme }) => ({
  // backgroundColor: theme.palette.background.paper,
  backgroundColor: "rbga(255, 255, 255, 0.3)",
  width: "calc(100vw - 50px)",
  // height: "calc(100vh - 225px)",
  // overflow: "scroll",
}));

const InnerWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  width: "fit-content",
  backgroundColor: "#E5E5E5",
  marginBottom: "50px",
  "& .columnButton": {
    position: "absolute",
    top: 0,
    right: "-119px",
    height: "100%",
    boxShadow: "none",
  },
  "& .rowButton": {
    position: "absolute",
    bottom: "-70px",
    left: 0,
    width: "calc(100% - 15px)",
    boxShadow: "none",
  },
  "& .rowButton, & .columnButton": {
    backgroundColor: "white",
    color: "#515151",
    border: "1px solid rgb(232, 232, 232)",
    borderRadius: "0px !important",
  },
}));

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export default function SheetEditor({
  selectedCells = null,
  setSelectedCells = () => {},
  selectedSheet,
  setSelectedSheet,
}) {
  const [state, dispatch] = useSheetsContext();

  selectedSheet = selectedSheet ? selectedSheet : 0;

  const hasAnySheets = state?.sheets?.length;
  const currentSheet = hasAnySheets ? state.sheets[selectedSheet] : state;

  let selectedSheetId = currentSheet.id;

  const columns = currentSheet.columns;
  const rows = currentSheet.rows;

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
  const rowsWithIndex = [
    {
      rowId: uuidv4(),
      height: 30,
      cells: columnsWithIndex.map((column, i) => ({
        type: "header",
        text: i === 0 ? "" : alphabet.charAt(i - 1),
      })),
    },
    ...rows.map((row, index) => ({
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
    })),
  ];

  const handleChanges = (cellId, value) => {
    if (!cellId) {
      return;
    }

    dispatch({
      type: "sheets",
      payload: state.sheets.map((sheet) => {
        if (sheet.id === selectedSheetId) {
          return {
            ...sheet,
            rows: rows.map((row) => {
              return {
                ...row,
                cells: row.cells.map((cell) => {
                  console.info("check", cell.id, cellId);
                  if (cell.id === cellId) {
                    return { ...cell, text: value };
                  }
                  return { ...cell };
                }),
              };
            }),
          };
        }
        return sheet;
      }),
    });
  };

  const handleColumnResize = (ci: string, width: number) => {
    // dispatch({
    //   type: "columns",
    //   payload: columns.map((column) => {
    //     if (column.columnId === ci) {
    //       return { ...column, width };
    //     }
    //     return column;
    //   }),
    // });
    // dispatch({
    //   type: "rows",
    //   payload: rows.map((row) => {
    //     return {
    //       ...row,
    //       cells: row.cells.map((cell) => {
    //         if (cell.id === ci) {
    //           return { ...cell, width };
    //         }
    //         return cell;
    //       }),
    //     };
    //   }),
    // });

    console.info("handleCOlumnResize", ci, width);

    if (!ci) {
      return;
    }

    dispatch({
      type: "sheets",
      payload: state.sheets.map((sheet) => {
        if (sheet.id === selectedSheetId) {
          return {
            ...sheet,
            rows: sheet.rows.map((row) => {
              return {
                ...row,
                cells: row.cells.map((cell) => {
                  if (cell.id === ci) {
                    console.info("match cell");
                    return { ...cell, width };
                  }
                  return cell;
                }),
              };
            }),
            // no need to maintain
            // columns: sheet.columns.map((column) => {
            //   if (column.columnId === ci) {
            //     console.info("match column");
            //     return {
            //       ...column,
            //       width,
            //     };
            //   }
            //   return column;
            // }),
          };
        }
        return sheet;
      }),
    });
  };

  const addColumn = () => {
    // dispatch({
    //   type: "columns",
    //   payload: [
    //     ...columns,
    //     {
    //       columnId: uuidv4(),
    //       width: 100,
    //       reorderable: true,
    //       resizable: true,
    //     },
    //   ],
    // });
    // dispatch({
    //   type: "rows",
    //   payload: rows.map((row) => ({
    //     ...row,
    //     cells: [
    //       ...row.cells,
    //       {
    //         type: "text",
    //         text: "",
    //       },
    //     ],
    //   })),
    // });
    dispatch({
      type: "sheets",
      payload: state.sheets.map((sheet) => {
        if (sheet.id === selectedSheetId) {
          return {
            ...sheet,
            columns: [
              ...columns,
              {
                columnId: uuidv4(),
                width: 100,
                reorderable: true,
                resizable: true,
              },
            ],
            rows: rows.map((row) => ({
              ...row,
              cells: [
                ...row.cells,
                {
                  type: "text",
                  text: "",
                },
              ],
            })),
          };
        }
        return sheet;
      }),
    });
  };

  const addRow = () => {
    // dispatch({
    //   type: "rows",
    //   payload: [
    //     ...rows,
    //     {
    //       rowId: uuidv4(),
    //       cells: columns.map((column) => ({
    //         type: "text",
    //         text: "",
    //       })),
    //     },
    //   ],
    // });
    dispatch({
      type: "sheets",
      payload: state.sheets.map((sheet) => {
        if (sheet.id === selectedSheetId) {
          return {
            ...sheet,
            rows: [
              ...rows,
              {
                rowId: uuidv4(),
                cells: columns.map((column) => ({
                  type: "text",
                  text: "",
                })),
              },
            ],
          };
        }
        return sheet;
      }),
    });
  };

  const handleSelectionChange = (selectedRanges) => {
    console.info("selectedRanges", selectedRanges);

    setSelectedCells(selectedRanges);
  };

  return (
    <>
      <GridWrapper>
        <InnerWrapper>
          {/* <ReactGrid
            rows={rowsWithIndex}
            columns={columnsWithIndex}
            onCellsChanged={handleChanges}
            onColumnResized={handleColumnResize}
            enableRangeSelection
            enableRowSelection
            enableColumnSelection
            onSelectionChanged={handleSelectionChange}
          /> */}
          <SheetGrid
            rows={rowsWithIndex}
            columns={columnsWithIndex}
            selectedCells={selectedCells}
            onSelectionChanged={handleSelectionChange}
            onCellsChanged={handleChanges}
            onColumnResized={handleColumnResize}
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
