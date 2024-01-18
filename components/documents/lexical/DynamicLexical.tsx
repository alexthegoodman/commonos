"use client";

import React from "react";
import LexicalRTEDynamic from "./LexicalRTEDynamic";
import { Box, styled } from "@mui/material";

const DynamicLexical = ({ pageId = 1, content }) => {
  const pageSize = 1500; // Set your desired page size

  const calculateTextForPage = (text, pageSize) => {
    // Implement your logic to calculate the text that fits on a page
    return text.slice(0, pageSize);
  };

  const remainingText = content.slice(pageSize);
  const textForPage = calculateTextForPage(content, pageSize);

  return (
    <div>
      <LexicalRTEDynamic pageId={pageId} content={textForPage} />
      {remainingText.length > 0 && (
        <DynamicLexical pageId={pageId + 1} content={remainingText} />
      )}
    </div>
  );
};

export default DynamicLexical;
