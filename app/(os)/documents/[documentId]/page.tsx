"use client";

import { useReducer } from "react";
import { useCookies } from "react-cookie";
import {
  DocumentsContext,
  DocumentsContextReducer,
  DocumentsContextState,
  useDocumentsContext,
} from "../../../../context/DocumentsContext";
import useSWR from "swr";
import { getDocumentData } from "../../../../fetchers/document";
import EditorField from "@/components/documents/editor/EditorField";
import { Box, CircularProgress } from "@mui/material";
import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import AutoSidebar from "@/components/documents/editor/AutoSidebar";
import LexicalRTE from "@/components/documents/lexical/LexicalRTE";
import InnerLayout from "@/components/documents/editor/InnerLayout";

export default function Editor(props) {
  const { params } = props;
  const documentId = params.documentId;
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const { data, error, isLoading, mutate } = useSWR(
    "documentKey" + documentId,
    () => getDocumentData(token, documentId),
    {
      revalidateOnMount: true,
    }
  );

  // console.info("document data", data);

  const refetch = async () => {
    const newData = await getDocumentData(token, documentId);
    // console.info("refetch document data", newData);
    mutate(newData);
  };

  const context = {
    ...DocumentsContextState,
    messages: data?.messages || [],
    plaintext: data?.plaintext || "",
    markdown: data?.markdown || "",
  };

  // console.info("context", context);

  return (
    <>
      {!isLoading && !error && context ? (
        <InnerLayout
          context={context}
          documentId={documentId}
          documentData={data}
          refetch={refetch}
        />
      ) : (
        <PrimaryLoader />
      )}
    </>
  );
}
