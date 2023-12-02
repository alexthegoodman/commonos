import React, { useState, useReducer, Dispatch } from "react";

export interface SheetsContextState {
  currentSheetId: string | null;
}

export const SheetsContextState = {
  currentSheetId: null,
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
