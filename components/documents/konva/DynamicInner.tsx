"use client";

import React, { useState } from "react";
import { useDocumentsContext } from "@/context/DocumentsContext";
import DocumentPage from "./DocumentPage";
import { Box, IconButton, styled } from "@mui/material";

import {
  ArrowClockwise,
  ArrowCounterClockwise,
  CaretDown,
  Code,
  Link,
  ListBullets,
  ListNumbers,
  Paragraph,
  TextB,
  TextHOne,
  TextHTwo,
  TextIndent,
  TextItalic,
  TextOutdent,
  TextStrikethrough,
} from "@phosphor-icons/react";
import { getAdjustedInsertSpot, getPreText } from "@/helpers/rte";

const ToolbarWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
}));

const Toolbar = styled(Box)(({ theme }) => ({
  top: 0,
  left: 0,
  width: "100%",
  height: "50px",
  zIndex: 10,
}));

const DynamicInner = () => {
  const [{ markdown, revisedMarkdown, plaintext }, dispatch] =
    useDocumentsContext();

  const [textIsSelected, setTextIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragEnd, setDragEnd] = useState({ x: 0, y: 0 });
  const [startPageId, setStartPageId] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endPageId, setEndPageId] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [insertPageId, setInsertPageId] = useState(0);
  const [insertSpot, setInsertSpot] = useState(0);

  const handleBold = () => {
    const begin = startIndex < endIndex ? startIndex : endIndex;
    const end = startIndex < endIndex ? endIndex : startIndex;
    // const preText = markdown.slice(0, begin);
    // const selectedText = markdown.slice(begin, end);
    // const postText = markdown.slice(end);
    const selectedLength = end - begin + 1;

    console.info("selectedLength", selectedLength);

    const preText = getPreText(markdown, begin);
    const adjustedBegin = getAdjustedInsertSpot(markdown, begin);
    // selecting from markdown, but using cleaned indexes, so need to adjust
    const selectedText = markdown.slice(
      adjustedBegin,
      adjustedBegin + selectedLength
    );
    const postText = markdown.slice(adjustedBegin + selectedLength);

    console.info("selectedText", begin, end, selectedText);

    const newMarkdown = preText + "**" + selectedText + "**" + postText;

    dispatch({ type: "markdown", payload: newMarkdown });
  };

  return (
    <>
      <ToolbarWrapper>
        <Toolbar>
          <IconButton>
            <TextHOne weight="thin" />
          </IconButton>
          <IconButton onClick={handleBold}>
            <TextB weight="thin" />
          </IconButton>
          <IconButton>
            <TextItalic weight="thin" />
          </IconButton>
          <IconButton>
            <ListBullets weight="thin" />
          </IconButton>
        </Toolbar>
      </ToolbarWrapper>
      <DocumentPage
        remainingMarkdown={markdown}
        completeMarkdown={markdown}
        dispatch={dispatch}
        setTextIsSelected={setTextIsSelected}
        textIsSelected={textIsSelected}
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
        insertPageId={insertPageId}
        setInsertPageId={setInsertPageId}
        insertSpot={insertSpot}
        setInsertSpot={setInsertSpot}
      />
    </>
  );
};

export default DynamicInner;
