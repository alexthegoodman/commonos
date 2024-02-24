import {
  DocumentsContext,
  DocumentsContextReducer,
  DocumentsContextState,
} from "@/context/DocumentsContext";
import { Box } from "@mui/material";
import LexicalRTE from "../lexical/LexicalRTE";
import AutoSidebar from "./AutoSidebar";
import { useReducer } from "react";

export default function InnerLayout({
  context,
  documentId,
  documentData,
  refetch,
}) {
  return (
    <DocumentsContext.Provider
      value={useReducer(DocumentsContextReducer, context)}
    >
      <Box pl={2}>
        <LexicalRTE
          documentId={documentId}
          documentData={documentData}
          refetch={refetch}
        />
        <AutoSidebar documentId={documentId} documentData={documentData} />
      </Box>
    </DocumentsContext.Provider>
  );
}
