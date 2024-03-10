"use client";

import { useCanvasRTE } from "@/hooks/useCanvasRTE";
import { useRef } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";

export default function MultiPageRTE() {
  const stageRef = useRef(null);

  const { masterJson, handleCanvasClick, handleTextClick } =
    useCanvasRTE("Hello World!");

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
        // onMouseDown={handleMouseDown}
        // onMousemove={handleMouseMove}
        // onMouseup={handleMouseUp}
        onMouseDown={handleCanvasClick}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={documentSize.width}
            height={documentSize.height}
            fill="#e5e5e5"
          />
        </Layer>
        <Layer>
          {masterJson.map((charText, i) => {
            return (
              <Text
                key={`${charText.characterId}-${i}`}
                id={charText.characterId}
                x={charText.position.x}
                y={charText.position.y}
                text={charText.character}
                fontSize={charText.style.fontSize}
                fontFamily={charText.style.fontFamily}
                fontStyle={charText.style.italic ? "italic" : "normal"}
                fill={charText.style.color}
                onClick={handleTextClick}
              />
            );
          })}
          {/* <Text
                  key={`${pageId}-${charText}-${i}`}
                  id={charText.id}
                  x={charText.x}
                  y={charText.y}
                  text={charText.text}
                  fontSize={charText.fontSize}
                  fontFamily={charText.fontFamily}
                  fontStyle={charText.fontStyle}
                  fill="black"
                /> */}
        </Layer>
      </Stage>
    </>
  );
}
