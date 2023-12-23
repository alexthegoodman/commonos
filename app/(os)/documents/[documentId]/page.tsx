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
    console.info("refetch document data", newData);
    mutate(newData);
  };

  // console.info("document data", documentId, data, error, isLoading);

  let body = <></>;

  if (isLoading) body = <CircularProgress />;
  if (error) body = <span>Error...</span>;
  if (!isLoading && !error)
    body = (
      <EditorField
        documentId={documentId}
        documentData={data}
        refetch={refetch}
      />
    );

  return (
    <DocumentsContext.Provider
      value={useReducer(DocumentsContextReducer, DocumentsContextState)}
    >
      <Box>{body}</Box>
    </DocumentsContext.Provider>
  );
}
