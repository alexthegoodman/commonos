"use client";

import {
  DrawingsContext,
  DrawingsContextReducer,
  DrawingsContextState,
} from "@/context/DrawingsContext";
import { useReducer } from "react";

export default function Drawing() {
  return (
    <DrawingsContext.Provider
      value={useReducer(DrawingsContextReducer, DrawingsContextState)}
    ></DrawingsContext.Provider>
  );
}
