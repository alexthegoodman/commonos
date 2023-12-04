import { realDefaultColumns, realDefaultRows } from "@/fixtures/sheets";
import { Column, Row } from "@silevis/reactgrid";
import React, { useState, useReducer, Dispatch } from "react";

export interface SheetsContextState {
  columns: Column[];
  rows: Row[];
}

export const SheetsContextState = {
  columns: realDefaultColumns,
  rows: realDefaultRows,
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
