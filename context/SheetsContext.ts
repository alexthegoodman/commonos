import { realDefaultColumns, realDefaultRows } from "@/fixtures/sheets";
// import { Column, Row } from "@silevis/reactgrid";
import React, { useState, useReducer, Dispatch } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Cell {
  type: string;
  text: string;
  formula?: string;
  width?: number;
}

export interface Row {
  rowId: string;
  cells: Cell[];
  height: number;
  reorderable: boolean;
}

export interface Column {
  columnId: string;
  width: number;
  reorderable: boolean;
  resizable: boolean;
}

export interface Sheet {
  id: string;
  name: string;
  columns: Column[];
  rows: Row[];
}

export interface SheetsContextState {
  sheets: Sheet[];
}

export const SheetsContextState = {
  sheets: [
    {
      id: uuidv4(),
      name: "Sheet 1",
      columns: realDefaultColumns,
      rows: realDefaultRows,
    },
  ],
};

export const SheetsContextReducer = (
  state: SheetsContextState,
  action: any
) => {
  switch (action.type) {
    // case value:
    //   break;

    default:
      return {
        ...state,
        [action.type]: action.payload,
      };
      break;
  }
};

export const SheetsContext = React.createContext<
  [SheetsContextState, Dispatch<any>]
>([SheetsContextState, () => undefined]);

export const useSheetsContext = () =>
  React.useContext(SheetsContext) as unknown as Iterable<any>;
