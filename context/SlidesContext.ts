import React, { useState, useReducer, Dispatch } from "react";

export interface Slide {
  id: string;
  title: string;
}

export interface SlidesContextState {
  slides: Slide[];
  currentSlideId: string | null;
}

export const SlidesContextState = {
  slides: [],
  currentSlideId: null,
};

export const SlidesContextReducer = (
  state: SlidesContextState,
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

export const SlidesContext = React.createContext<
  [SlidesContextState, Dispatch<any>]
>([SlidesContextState, () => undefined]);

export const useSlidesContext = () =>
  React.useContext(SlidesContext) as unknown as Iterable<any>;
