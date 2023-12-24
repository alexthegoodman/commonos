"use client";

import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import DrawingEditor from "@/components/drawings/editor/DrawingEditor";
import InnerLayout from "@/components/drawings/editor/InnerLayout";
import {
  DrawingsContext,
  DrawingsContextReducer,
  DrawingsContextState,
} from "@/context/DrawingsContext";
import { getDrawingData } from "@/fetchers/drawing";
import { Box, CircularProgress } from "@mui/material";
import { useReducer } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function Drawing(props) {
  const { params } = props;
  const drawingId = params.drawingId;
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: drawingData,
    error,
    isLoading,
    mutate,
  } = useSWR("drawingKey" + drawingId, () => getDrawingData(token, drawingId), {
    revalidateOnMount: true,
  });

  return !isLoading ? (
    <>
      {drawingData && drawingData.context ? (
        <InnerLayout drawingId={drawingId} drawingData={drawingData} />
      ) : (
        <InnerLayout
          drawingId={drawingId}
          drawingData={{ title: "New Drawing", context: DrawingsContextState }}
        />
      )}
    </>
  ) : (
    <PrimaryLoader />
  );
}
