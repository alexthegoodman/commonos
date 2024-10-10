import React, { useState, useReducer, Dispatch } from "react";

export interface SlideVisual {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SlideText extends SlideVisual {
  id: string;
  fontFamily: string;
  fontStyle: string;
  fontSize: string;
  lineHeight: number;
  fill: string;
  content: string;
  align: string;
}

export interface SlideShape extends SlideVisual {
  id: string;
  fill: string;
  sides: number;
  radius: number;
}

export interface Slide {
  id: string;
  title: string;
  texts: SlideText[] | null;
  shapes: SlideShape[] | null;
  images: any[] | null;
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
