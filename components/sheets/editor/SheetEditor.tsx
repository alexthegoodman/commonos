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

interface Person {
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  column5: string;
}

const getColumns = (): Column[] => [
  { columnId: "column1", width: 250, resizable: true },
  { columnId: "column2", width: 250, resizable: true },
  { columnId: "column3", width: 250, resizable: true },
  { columnId: "column4", width: 250, resizable: true },
  { columnId: "column5", width: 250, resizable: true },
];

const headerRow: Row = {
  rowId: "header",
  cells: [
    { type: "header", text: "Column 1" },
    { type: "header", text: "Column 2" },
    { type: "header", text: "Column 3" },
    { type: "header", text: "Column 4" },
    { type: "header", text: "Column 5" },
  ],
};

const getPeople = (): Person[] => [
  {
    column1: "John",
    column2: "Doe",
    column3: "Test",
    column4: "Test",
    column5: "Test",
  },
  {
    column1: "Jane",
    column2: "Doe",
    column3: "Test",
    column4: "Test",
    column5: "Test",
  },
  {
    column1: "John",
    column2: "Smith",
    column3: "Test",
    column4: "Test",
    column5: "Test",
  },
  {
    column1: "Jane",
    column2: "Smith",
    column3: "Test",
    column4: "Test",
    column5: "Test",
  },
  {
    column1: "John",
    column2: "Doe",
    column3: "Test",
    column4: "Test",
    column5: "Test",
  },
];

const getRows = (people: Person[]): Row[] => [
  headerRow,
  ...people.map<Row>((person, idx) => ({
    rowId: idx,
    cells: [
      { type: "text", text: person.column1 },
      { type: "text", text: person.column2 },
      { type: "text", text: person.column3 },
      { type: "text", text: person.column4 },
      { type: "text", text: person.column5 },
    ],
  })),
];

const applyChangesToPeople = (
  changes: CellChange<TextCell>[],
  prevPeople: Person[]
): Person[] => {
  changes.forEach((change) => {
    const personIndex = change.rowId;
    const fieldName = change.columnId;
    prevPeople[personIndex][fieldName] = change.newCell.text;
  });
  return [...prevPeople];
};

const GridWrapper = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  width: "100%",
  height: "calc(100vh - 100px)",
}));

export default function SheetEditor() {
  const [people, setPeople] = React.useState<Person[]>(getPeople());
  const [columns, setColumns] = React.useState<Column[]>(getColumns());
  const rows = getRows(people);

  const handleChanges = (changes: CellChange<TextCell>[]) => {
    setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
  };

  const handleColumnResize = (ci: Id, width: number) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex((el) => el.columnId === ci);
      const resizedColumn = prevColumns[columnIndex];
      const updatedColumn = { ...resizedColumn, width };
      prevColumns[columnIndex] = updatedColumn;
      return [...prevColumns];
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
