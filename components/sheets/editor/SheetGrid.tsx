"use client";

import useResizable from "@/hooks/useResizable";
import { Box, styled } from "@mui/material";
import {
  ArrowsOutLineHorizontal,
  ArrowsOutLineVertical,
  Divide,
} from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";

const Cell = styled(Box)(({ theme, selected }) => ({
  userSelect: "none",
  overflow: "hidden",
  backgroundColor: selected ? "rgba(153, 199, 162, 0.5)" : "white",
  transition: "all 0.2s",
  position: "relative",
  borderTop: "1px #E5E5E5 solid",
  borderRight: "1px #E5E5E5 solid",
  borderColor: selected ? "rgba(153, 199, 162, 1.0)" : "#E5E5E5",
  "& svg": {
    opacity: "0",
  },
  "&:hover": {
    backgroundColor: selected ? "rgba(153, 199, 162, 0.75)" : "#E5E5E5",
    cursor: "text",
    transition: "all 0.2s",
    "& svg": {
      opacity: "0.3",
    },
  },
}));

const InnerCell = styled(Box)(({ theme }) => ({
  whiteSpace: "nowrap",
  height: "40px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "3px",
  width: "100%",
  fontFamily: "proxima-nova",
  "& input": {
    height: "100%",
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "16px",
  },
}));

function ResizableCell({
  selected = false,
  children,
  initialWidth,
  onClick,
  onStopResizing,
}) {
  const { width, startResizing, stopResizing, resize } =
    useResizable(initialWidth);

  const handleStopResizing = () => {
    console.info("handleStopResizing");
    stopResizing();
    onStopResizing(width);
  };

  useEffect(() => {
    document.addEventListener("mousemove", resize);
    // document.addEventListener("mouseup", handleStopResizing);
    return () => {
      document.removeEventListener("mousemove", resize);
      // document.removeEventListener("mouseup", handleStopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <Cell selected={selected} style={{ width: `${width}px` }} onClick={onClick}>
      {children}
      <ArrowsOutLineHorizontal
        style={{
          position: "absolute",
          top: "15px",
          right: "0px",
        }}
        onMouseDown={startResizing}
        onMouseUp={handleStopResizing}
      />
    </Cell>
  );
}

const ENGLISH_CAPS = "_ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""); // _ at beginning to count headers

export const SheetGrid = ({
  selectedCells = [],
  rows = [],
  columns = [],
  onSelectionChanged = () => {},
  onCellsChanged = () => {},
  onColumnResized = () => {},
}) => {
  const [primaryCellSelection, setPrimaryCellSelection] = useState(null);
  const [secondaryCellSelection, setSecondaryCellSelection] = useState(null);

  // Helper function to get cell value
  const getCellValue = (cellId, cellValues) => {
    return cellValues[cellId] || 0;
  };

  // Helper functions for basic operations
  const sum = (...args) => args.reduce((a, b) => a + b, 0);
  const average = (...args) => sum(...args) / args.length;
  const min = (...args) => Math.min(...args);
  const max = (...args) => Math.max(...args);
  const count = (...args) => args.length;

  // Enhanced formula evaluator
  const evaluateFormula = (formula, cellValues) => {
    // console.info("evaluate", formula);
    // Remove the '=' at the beginning
    let exp = formula.slice(1);

    // Replace cell references with their values
    exp = exp.replace(/[A-Z]\d+/g, (match) => {
      return getCellValue(match, cellValues);
    });

    // console.info("evaluating...", exp);

    // Replace function names with their JavaScript equivalents
    exp = exp
      .replace(/SUM/g, "sum")
      .replace(/AVERAGE/g, "average")
      .replace(/MIN/g, "min")
      .replace(/MAX/g, "max")
      .replace(/COUNT/g, "count");

    // Replace comparison operators
    exp = exp.replace(/=/g, "==").replace(/\<\>/g, "!=");

    // Use Function constructor instead of eval for better security
    try {
      const func = new Function(
        "sum",
        "average",
        "min",
        "max",
        "count",
        "return " + exp
      );
      const result = func(sum, average, min, max, count);
      // console.info("evaluation result", result);
      return result;
    } catch (error) {
      return "#ERROR!";
    }
  };

  const handleCellClick = (e, cellId) => {
    if (e.shiftKey) {
      setSecondaryCellSelection(cellId);
      const rangeCells = getRangeCells(primaryCellSelection, cellId);
      onSelectionChanged(rangeCells);
    } else {
      setPrimaryCellSelection(cellId);
      onSelectionChanged([cellId]);
    }
  };

  const getRangeCells = (startCellId, endCellId) => {
    let startRow, startCol, endRow, endCol;
    let found = 0;

    // Find the start and end positions
    for (let r = 0; r < rows.length; r++) {
      for (let c = 0; c < rows[r].cells.length; c++) {
        const cellId = rows[r].cells[c].id;
        if (cellId === startCellId || cellId === endCellId) {
          if (found === 0) {
            [startRow, startCol] = [r, c];
          } else {
            [endRow, endCol] = [r, c];
          }
          found++;
        }
        if (found === 2) break;
      }
      if (found === 2) break;
    }

    // Ensure start is always top-left and end is bottom-right
    if (startRow > endRow || (startRow === endRow && startCol > endCol)) {
      [startRow, startCol, endRow, endCol] = [
        endRow,
        endCol,
        startRow,
        startCol,
      ];
    }

    // Collect cells in the range
    const rangeCells = [];
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        rangeCells.push(rows[r].cells[c].id);
      }
    }

    return rangeCells;
  };

  const handleCellInputChange = (e, cellId) => {
    onCellsChanged(cellId, e.target.value);
  };

  const getCellsWithLabels = (rows) => {
    let rowLabel = "";
    let columnLabel = "";
    let cellLabel = "";

    let columnPerRow = 0;
    let cellValues = {};
    rows.forEach((row, i) => {
      columnPerRow = 0;
      row.cells.forEach((cell) => {
        if (cell.type !== "header") {
          columnPerRow++;

          columnLabel = ENGLISH_CAPS[columnPerRow];
          cellLabel = columnLabel + i;

          cellValues[cellLabel] = cell.text;
        }
      });
    });

    return cellValues;
  };

  const cellsWithLabels = getCellsWithLabels(rows);

  // console.info("cellsWIthLabels", cellsWithLabels);

  return (
    <>
      {rows.map((row, i) => {
        // columnPerRow = 0;

        // console.info("cellsWithLabels", cellsWithLabels);

        return (
          <>
            <Box display="flex" flexDirection="row">
              {row.cells.map((cell, i) => {
                const cellInitialWidth = cell?.width ? cell.width : 150;
                const isSelected = selectedCells?.find(
                  (cel) => cel === cell.id
                );

                const cellStyles = { color: cell.color ? cell.color : "black" };

                const cellValue = cell?.formula
                  ? evaluateFormula(cell.formula, cellsWithLabels)
                  : cell.text;

                return (
                  <>
                    <ResizableCell
                      key={i}
                      initialWidth={cellInitialWidth}
                      selected={isSelected ? true : false}
                      onClick={(e) => handleCellClick(e, cell.id)}
                      onStopResizing={(width) => {
                        onColumnResized(cell.id, width);
                      }}
                    >
                      {cell.type === "header" && (
                        <InnerCell>
                          <span style={cellStyles}>{cellValue}</span>
                        </InnerCell>
                      )}
                      {cell.type === "text" && (
                        <InnerCell>
                          {/* <span style={cellStyles}>{cell.text}</span> */}
                          <input
                            type="text"
                            defaultValue={cellValue}
                            value={cellValue}
                            onChange={(e) => handleCellInputChange(e, cell.id)}
                            style={cellStyles}
                          />
                        </InnerCell>
                      )}
                    </ResizableCell>
                  </>
                );
              })}
            </Box>
          </>
        );
      })}
    </>
  );
};
