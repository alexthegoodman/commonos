import React, { useState, useReducer, Dispatch } from "react";

export interface DrawingsContextState {
  lines: any[] | null;
  images: any[] | null;
}

export const DrawingsContextState = {
  lines: [],
  images: [],
};

export const DrawingsContextReducer = (
  state: DrawingsContextState,
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

export const DrawingsContext = React.createContext<
  [DrawingsContextState, Dispatch<any>]
>([DrawingsContextState, () => undefined]);

export const useDrawingsContext = () =>
  React.useContext(DrawingsContext) as unknown as Iterable<any>;
