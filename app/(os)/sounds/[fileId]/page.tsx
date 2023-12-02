"use client";

import {
  SoundsContext,
  SoundsContextReducer,
  SoundsContextState,
} from "@/context/SoundsContext";
import { useReducer } from "react";

export default function Sound() {
  return (
    <SoundsContext.Provider
      value={useReducer(SoundsContextReducer, SoundsContextState)}
    ></SoundsContext.Provider>
  );
}
