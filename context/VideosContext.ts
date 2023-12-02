import React, { useState, useReducer, Dispatch } from "react";

export interface VideosContextState {
  currentVideoId: string | null;
}

export const VideosContextState = {
  currentVideoId: null,
};

export const VideosContextReducer = (
  state: VideosContextState,
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

export const VideosContext = React.createContext<
  [VideosContextState, Dispatch<any>]
>([VideosContextState, () => undefined]);

export const useVideosContext = () =>
  React.useContext(VideosContext) as unknown as Iterable<any>;
