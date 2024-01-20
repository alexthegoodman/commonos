"use client";

import React, { useState } from "react";
import { useDocumentsContext } from "@/context/DocumentsContext";
import DocumentPage from "./DocumentPage";

const DynamicInner = () => {
  const [{ markdown, revisedMarkdown, plaintext }, dispatch] =
    useDocumentsContext();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragEnd, setDragEnd] = useState({ x: 0, y: 0 });
  const [startPageId, setStartPageId] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endPageId, setEndPageId] = useState(0);
  const [endIndex, setEndIndex] = useState(0);

  return (
    <DocumentPage
      remainingMarkdown={markdown}
      completeMarkdown={markdown}
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
    />
  );
};

export default DynamicInner;
