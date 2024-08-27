import {
  DocumentsContext,
  DocumentsContextReducer,
  DocumentsContextState,
} from "@/context/DocumentsContext";
import { Box } from "@mui/material";
import AutoSidebar from "./AutoSidebar";
import { useReducer } from "react";
import DynamicInner from "../konva/DynamicInner";
import MultiPageRTE from "../konva/MultiPageRTE";
import FullRTE from "../konva/FullRTE";

export default function InnerLayout({
  context,
  documentId,
  documentData,
  refetch,
}) {
  const { markdown, plaintext } = context;
  const initialMarkdown = plaintext && !markdown ? plaintext : markdown;

  // console.info("double check", initialMarkdown);

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
        {/* <DynamicInner /> */}
        {/* <MultiPageRTE markdown={initialMarkdown} /> */}
        <FullRTE markdown={initialMarkdown} />
        {/* <AutoSidebar documentId={documentId} documentData={documentData} /> */}
      </Box>
    </DocumentsContext.Provider>
  );
}
