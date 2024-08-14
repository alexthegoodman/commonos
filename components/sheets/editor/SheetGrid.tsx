"use client";

import useResizable from "@/hooks/useResizable";
import { Box, styled } from "@mui/material";
import {
  ArrowsOutLineHorizontal,
  ArrowsOutLineVertical,
  Divide,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

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
}));

function ResizableCell({ selected = false, children, initialWidth, onClick }) {
  const { width, startResizing, stopResizing, resize } =
    useResizable(initialWidth);

  useEffect(() => {
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
    return () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
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
      />
    </Cell>
  );
}

export const SheetGrid = ({
  selectedCells = [],
  rows = [],
  columns = [],
  onSelectionChanged = () => {},
}) => {
  console.info("SHeetGrid", rows, columns);
  const [primaryCellSelection, setPrimaryCellSelection] = useState(null);
  const [secondaryCellSelection, setSecondaryCellSelection] = useState(null);

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

  return (
    <>
      {rows.map((row) => {
        return (
          <>
            <Box display="flex" flexDirection="row">
              {row.cells.map((cell, i) => {
                const cellInitialWidth = 150;
                const isSelected = selectedCells?.find(
                  (cel) => cel === cell.id
                );

                const cellStyles = { color: cell.color ? cell.color : "black" };

                return (
                  <>
                    <ResizableCell
                      key={i}
                      initialWidth={cellInitialWidth}
                      selected={isSelected ? true : false}
                      onClick={(e) => handleCellClick(e, cell.id)}
                    >
                      {cell.type === "header" && (
                        <InnerCell>
                          <span style={cellStyles}>{cell.text}</span>
                        </InnerCell>
                      )}
                      {cell.type === "text" && (
                        <InnerCell>
                          <span style={cellStyles}>{cell.text}</span>
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
