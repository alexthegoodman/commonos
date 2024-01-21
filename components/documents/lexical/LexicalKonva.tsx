"use client";

import { useRef } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { Html } from "react-konva-utils";
import LexicalRTEDynamic from "./LexicalRTEDynamic";

export default function LexicalKonva({
  pageId,
  completeMarkdown,
  textForPage,
  dispatch,
}) {
  const stageRef = useRef(null);

  const pxPerIn = 96;
  const marginSize = {
    x: 1 * 2,
    y: 0.5 * 2,
  };
  const documentSize = {
    width: 8.3 * pxPerIn,
    height: 11.7 * pxPerIn,
  };
  const mainTextSize = {
    width: (8.3 - marginSize.x) * pxPerIn,
    height: (11.7 - marginSize.y) * pxPerIn,
  };

  return (
    <>
      <Stage
        ref={stageRef}
        width={documentSize.width}
        height={documentSize.height}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={documentSize.width}
            height={documentSize.height}
            fill="white"
          />
          <Rect
            x={(marginSize.x / 2) * pxPerIn}
            y={(marginSize.y / 2) * pxPerIn}
            width={mainTextSize.width}
            height={mainTextSize.height}
            // fill="red"
          />
        </Layer>
        <Layer>
          <Html
            divProps={{
              style: {
                width: mainTextSize.width,
                height: mainTextSize.height,
                position: "absolute",
                top: (marginSize.y / 2) * pxPerIn + "px",
                left: (marginSize.x / 2) * pxPerIn + "px",
              },
            }}
          >
            <LexicalRTEDynamic
              pageId={pageId}
              completeMarkdown={completeMarkdown}
              markdown={textForPage}
              dispatch={dispatch}
              mainTextSize={mainTextSize}
            />
          </Html>
        </Layer>
        <Layer>
          <Rect x={50} y={50} width={100} height={100} fill="blue" draggable />
        </Layer>
      </Stage>
    </>
  );
}
