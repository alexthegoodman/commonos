"use client";

import React from "react";
import { pageCharacterCount } from "@/helpers/defs";
import KonvaRTE from "./KonvaRTE";
import { Box } from "@mui/material";

const DocumentPage = ({
  pageId = 1,
  dispatch,
  remainingMarkdown,
  completeMarkdown,
}) => {
  //   const pageSize = 1500; // Set your desired page size

  const calculateTextForPage = (text, pageSize) => {
    // Implement your logic to calculate the text that fits on a page
    return text.slice(0, pageSize);
  };

  const remainingText = remainingMarkdown.slice(pageCharacterCount);
  const textForPage = calculateTextForPage(
    remainingMarkdown,
    pageCharacterCount
  );

  return (
    <div>
      <Box mb={5}>
        <KonvaRTE
          pageId={pageId}
          completeMarkdown={completeMarkdown}
          markdown={textForPage}
          dispatch={dispatch}
        />
      </Box>
      {remainingText.length > 0 && (
        <DocumentPage
          pageId={pageId + 1}
          completeMarkdown={completeMarkdown}
          remainingMarkdown={remainingText}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

export default DocumentPage;
