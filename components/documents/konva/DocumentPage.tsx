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
  setIsDragging,
  setDragStart,
  setDragEnd,
  setStartPageId,
  setStartIndex,
  setEndPageId,
  setEndIndex,
  isDragging,
  startPageId,
  startIndex,
  endPageId,
  endIndex,
  setTextIsSelected,
  textIsSelected,
  insertSpot,
  setInsertSpot,
  insertPageId,
  setInsertPageId,
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
          setIsDragging={setIsDragging}
          setDragStart={setDragStart}
          setDragEnd={setDragEnd}
          setStartPageId={setStartPageId}
          setStartIndex={setStartIndex}
          setEndPageId={setEndPageId}
          setEndIndex={setEndIndex}
          isDragging={isDragging}
          startPageId={startPageId}
          startIndex={startIndex}
          endPageId={endPageId}
          endIndex={endIndex}
          setTextIsSelected={setTextIsSelected}
          textIsSelected={textIsSelected}
          insertSpot={insertSpot}
          setInsertSpot={setInsertSpot}
          insertPageId={insertPageId}
          setInsertPageId={setInsertPageId}
        />
      </Box>
      {remainingText.length > 0 && (
        <DocumentPage
          pageId={pageId + 1}
          completeMarkdown={completeMarkdown}
          remainingMarkdown={remainingText}
          dispatch={dispatch}
          setIsDragging={setIsDragging}
          setDragStart={setDragStart}
          setDragEnd={setDragEnd}
          setStartPageId={setStartPageId}
          setStartIndex={setStartIndex}
          setEndPageId={setEndPageId}
          setEndIndex={setEndIndex}
          isDragging={isDragging}
          startPageId={startPageId}
          startIndex={startIndex}
          endPageId={endPageId}
          endIndex={endIndex}
          setTextIsSelected={setTextIsSelected}
          textIsSelected={textIsSelected}
          insertSpot={insertSpot}
          setInsertSpot={setInsertSpot}
          insertPageId={insertPageId}
          setInsertPageId={setInsertPageId}
        />
      )}
    </div>
  );
};

export default DocumentPage;
