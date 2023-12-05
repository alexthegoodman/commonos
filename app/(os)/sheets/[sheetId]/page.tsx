"use client";

import InnerLayout from "@/components/sheets/editor/InnerLayout";
import SheetEditor from "@/components/sheets/editor/SheetEditor";
import {
  SheetsContext,
  SheetsContextReducer,
  SheetsContextState,
} from "@/context/SheetsContext";
import { getSheetData } from "@/fetchers/sheet";
import { Box, CircularProgress } from "@mui/material";
import { useReducer } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function Sheet(props) {
  const { params } = props;
  const sheetId = params.sheetId;
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: sheetData,
    error,
    isLoading,
    mutate,
  } = useSWR("sheetKey" + sheetId, () => getSheetData(token, sheetId), {
    revalidateOnMount: true,
  });

  return !isLoading ? (
    <>
      {sheetData && sheetData.context ? (
        <InnerLayout sheetId={sheetId} sheetData={sheetData} />
      ) : (
        <InnerLayout
          sheetId={sheetId}
          sheetData={{ title: "New Sheet", context: SheetsContextState }}
        />
      )}
    </>
  ) : (
    <CircularProgress />
  );
}
