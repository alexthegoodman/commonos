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
            const randomColor = `#${Math.floor(
              Math.random() * 16777215
            ).toString(16)}`;

            return (
              <>
                {/* <Rect
                  key={`${charText.characterId}-${i}`}
                  x={charText.position.x}
                  y={charText.position.y}
                  width={charText.size.width}
                  height={charText.size.height}
                  fill={randomColor}
                /> */}
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
              </>
            );
          })}
        </Layer>
      </Stage>
      <style jsx>{`
        @font-face {
          font-family: "Inter";
          src: url("/fonts/Inter-Regular.ttf");
          font-weight: normal;
          font-style: normal;
        }
      `}</style>
    </>
  );
}
