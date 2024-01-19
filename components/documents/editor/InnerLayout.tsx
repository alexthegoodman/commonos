import {
  DocumentsContext,
  DocumentsContextReducer,
  DocumentsContextState,
} from "@/context/DocumentsContext";
import { Box } from "@mui/material";
import AutoSidebar from "./AutoSidebar";
import { useReducer } from "react";
import DynamicInner from "../konva/DynamicInner";

export default function InnerLayout({
  context,
  documentId,
  documentData,
  refetch,
}) {
  const { markdown, plaintext } = context;
  const initialMarkdwn = plaintext && !markdown ? plaintext : markdown;

  return (
    <DocumentsContext.Provider
      value={useReducer(DocumentsContextReducer, context)}
    >
      <Box>
        {/* <LexicalRTE
          documentId={documentId}
          documentData={documentData}
          refetch={refetch}
        /> */}
        <DynamicInner />
        <AutoSidebar documentId={documentId} documentData={documentData} />
      </Box>
    </DocumentsContext.Provider>
  );
}
