"use client";

import { useCanvasRTE } from "@/hooks/useCanvasRTE";
import { useRef } from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";

export default function MultiPageRTE({ markdown = "" }) {
  const stageRef = useRef(null);

  const pxPerIn = 96;
  const marginSizeIn = {
    x: 1,
    y: 0.5,
  };
  const marginSize = {
    x: marginSizeIn.x * pxPerIn,
    y: marginSizeIn.y * pxPerIn,
  };
  const documentSizeIn = {
    width: 8.3,
    height: 11.7,
  };
  const documentSize = {
    width: documentSizeIn.width * pxPerIn,
    height: documentSizeIn.height * pxPerIn,
  };
  const mainTextSize = {
    width: (documentSizeIn.width - marginSizeIn.x * 2) * pxPerIn,
    height: (documentSizeIn.height - marginSizeIn.y * 2) * pxPerIn,
  };

  const { jsonByPage, handleCanvasClick, handleTextClick } = useCanvasRTE(
    markdown,
    mainTextSize
  );

  console.info("jsonByPage", jsonByPage);

  return (
    <>
      <Stage
        ref={stageRef}
        width={documentSize.width}
        height={documentSize.height * Object.keys(jsonByPage).length}
        // onMouseDown={handleMouseDown}
        // onMousemove={handleMouseMove}
        // onMouseup={handleMouseUp}
        // onMouseDown={handleCanvasClick}
      >
        {Object.keys(jsonByPage).map((key, i) => {
          const masterJson = jsonByPage[key];

          return (
            <>
              <Layer>
                <Rect
                  x={0}
                  y={documentSize.height * i}
                  width={documentSize.width}
                  height={documentSize.height}
                  fill="#e5e5e5"
                />
              </Layer>
              <Layer>
                <Rect
                  x={marginSize.x}
                  y={documentSize.height * i + marginSize.y}
                  width={mainTextSize.width}
                  height={mainTextSize.height}
                  fill="#fff"
                  onMouseDown={handleCanvasClick}
                />
              </Layer>
              <Layer>
                <Group
                  x={marginSize.x}
                  y={documentSize.height * i + marginSize.y}
                >
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
                          x={charText?.position?.x}
                          y={charText?.position?.y}
                          text={charText.character}
                          fontSize={charText.style.fontSize}
                          fontFamily={charText.style.fontFamily}
                          fontStyle={
                            charText.style.italic ? "italic" : "normal"
                          }
                          fill={charText.style.color}
                          onClick={handleTextClick}
                        />
                      </>
                    );
                  })}
                </Group>
              </Layer>
            </>
          );
        })}
      </Stage>
      <style jsx>{`
        @font-face {
          font-family: "Inter";
          src: url("/fonts/Inter-Regular.ttf");
          font-weight: normal;
          font-style: normal;
        }
      `}</style>
      <div className="preloadFont" style={{ fontFamily: "Inter" }}>
        .
      </div>
    </>
  );
}
