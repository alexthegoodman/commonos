import {
  DocumentsContext,
  DocumentsContextReducer,
  DocumentsContextState,
} from "@/context/DocumentsContext";
import { Box } from "@mui/material";
import LexicalRTE from "../lexical/LexicalRTE";
import AutoSidebar from "./AutoSidebar";
import { useReducer } from "react";
import DynamicLexical from "../lexical/DynamicLexical";

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
        <DynamicLexical content={initialMarkdwn} />
        <AutoSidebar documentId={documentId} documentData={documentData} />
      </Box>
    </DocumentsContext.Provider>
  );
}
