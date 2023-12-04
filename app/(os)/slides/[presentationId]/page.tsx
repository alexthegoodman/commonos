"use client";

import Autosaver from "@/components/slides/editor/Autosaver";
import EditorWrapper from "@/components/slides/editor/EditorWrapper";
import InnerLayout from "@/components/slides/editor/InnerLayout";
import SlideEditor from "@/components/slides/editor/SlideEditor";
import SlideList from "@/components/slides/nav/SlideList";
import {
  SlidesContext,
  SlidesContextReducer,
  SlidesContextState,
} from "@/context/SlidesContext";
import { getSlideData } from "@/fetchers/slide";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useReducer } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function Presentation(props) {
  const { params } = props;
  const presentationId = params.presentationId;
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: slideData,
    error,
    isLoading,
    mutate,
  } = useSWR(
    "slideKey" + presentationId,
    () => getSlideData(token, presentationId),
    {
      revalidateOnMount: true,
    }
  );

  return !isLoading ? (
    <>
      {slideData && slideData.context ? (
        <InnerLayout presentationId={presentationId} slideData={slideData} />
      ) : (
        <InnerLayout
          presentationId={presentationId}
          slideData={{ title: "New Presentation", context: SlidesContextState }}
        />
      )}
    </>
  ) : (
    <CircularProgress />
  );
}
