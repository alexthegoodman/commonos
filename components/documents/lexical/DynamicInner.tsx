"use client";

import React from "react";
import { useDocumentsContext } from "@/context/DocumentsContext";
import DynamicLexical from "./DynamicLexical";

const DynamicInner = () => {
  const [{ markdown, revisedMarkdown, plaintext }, dispatch] =
    useDocumentsContext();

  return (
    <DynamicLexical
      remainingMarkdown={markdown}
      completeMarkdown={markdown}
      dispatch={dispatch}
    />
  );
};

export default DynamicInner;
