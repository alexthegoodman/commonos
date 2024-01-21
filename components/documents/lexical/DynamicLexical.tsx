"use client";

import React from "react";
import LexicalRTEDynamic from "./LexicalRTEDynamic";
import { pageCharacterCount } from "@/helpers/defs";
import LexicalKonva from "./LexicalKonva";

const DynamicLexical = ({
  pageId = 1,
  dispatch,
  remainingMarkdown,
  completeMarkdown,
}) => {
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
      {/* <LexicalRTEDynamic
        pageId={pageId}
        completeMarkdown={completeMarkdown}
        markdown={textForPage}
        dispatch={dispatch}
      /> */}
      <LexicalKonva
        pageId={pageId}
        completeMarkdown={completeMarkdown}
        textForPage={textForPage}
        dispatch={dispatch}
      />
      {remainingText.length > 0 && (
        <DynamicLexical
          pageId={pageId + 1}
          completeMarkdown={completeMarkdown}
          remainingMarkdown={remainingText}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

export default DynamicLexical;
