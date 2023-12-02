import React, { useState, useReducer, Dispatch } from "react";

export interface Slide {
  id: string;
}

export interface SlidesContextState {
  slides: Slide[];
  currentSlideId: string | null;
}

const testDefaultSlides: Slide[] = [
  {
    id: "1",
  },
  {
    id: "2",
  },
  {
    id: "3",
  },
];

export const SlidesContextState = {
  slides: testDefaultSlides,
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
