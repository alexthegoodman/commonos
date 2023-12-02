"use client";

import {
  SheetsContext,
  SheetsContextReducer,
  SheetsContextState,
} from "@/context/SheetsContext";
import { useReducer } from "react";

export default function Sheet() {
  return (
    <SheetsContext.Provider
      value={useReducer(SheetsContextReducer, SheetsContextState)}
    ></SheetsContext.Provider>
  );
}
