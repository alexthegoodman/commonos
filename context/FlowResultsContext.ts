import React, { useState, useReducer, Dispatch } from "react";

export interface FlowResultsContextState {
  lines: any[] | null;
  images: any[] | null;
}

export const FlowResultsContextState = {
  lines: [],
  images: [],
};

export const FlowResultsContextReducer = (
  state: FlowResultsContextState,
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

export const FlowResultsContext = React.createContext<
  [FlowResultsContextState, Dispatch<any>]
>([FlowResultsContextState, () => undefined]);

export const useFlowResultsContext = () =>
  React.useContext(FlowResultsContext) as unknown as Iterable<any>;
