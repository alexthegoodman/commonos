import React, { useState, useReducer, Dispatch } from "react";

export interface SoundsContextState {
  currentSoundId: string | null;
}

export const SoundsContextState = {
  currentSoundId: null,
};

export const SoundsContextReducer = (
  state: SoundsContextState,
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

export const SoundsContext = React.createContext<
  [SoundsContextState, Dispatch<any>]
>([SoundsContextState, () => undefined]);

export const useSoundsContext = () =>
  React.useContext(SoundsContext) as unknown as Iterable<any>;
