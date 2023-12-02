import React, { useState, useReducer, Dispatch } from "react";

export interface Track {
  id: string;
  name: string;
  start: number;
  end: number;
}

export interface SoundsContextState {
  tracks: Track[] | null;
  selectedTrack: string | null;
  currentTime: number;
  playing: boolean;
  stopped: boolean;
  exporting: boolean;
}

export const SoundsContextState = {
  tracks: null,
  selectedTrack: null,
  currentTime: 0,
  playing: false,
  stopped: true,
  exporting: false,
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
