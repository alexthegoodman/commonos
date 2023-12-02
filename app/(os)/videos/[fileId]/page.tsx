"use client";

import {
  VideosContext,
  VideosContextReducer,
  VideosContextState,
} from "@/context/VideosContext";
import { useReducer } from "react";

export default function Video() {
  return (
    <VideosContext.Provider
      value={useReducer(VideosContextReducer, VideosContextState)}
    ></VideosContext.Provider>
  );
}
