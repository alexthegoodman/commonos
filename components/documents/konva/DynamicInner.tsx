"use client";

import React from "react";
import { useDocumentsContext } from "@/context/DocumentsContext";
import DocumentPage from "./DocumentPage";

const DynamicInner = () => {
  const [{ markdown, revisedMarkdown, plaintext }, dispatch] =
    useDocumentsContext();

  let testMarkdown = `CommonOS Commitment to West Michigan

  At CommonOS, we are committed to the development and growth of the West Michigan economy. We understand the importance of investing in our local community and are dedicated to keeping our headquarters right here in West Michigan. Our mission is to not only support the economy but also create a positive impact on the lives of the people in this region.`;

  return (
    <DocumentPage
      remainingMarkdown={markdown}
      completeMarkdown={markdown}
      dispatch={dispatch}
    />
  );
};

export default DynamicInner;
