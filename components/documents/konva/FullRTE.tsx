"use client";

import {
  defaultStyle,
  MultiPageEditor,
  useMultiPageRTE,
} from "@/hooks/useMultiPageRTE";
import { useEffect, useRef, useState } from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import * as fontkit from "fontkit";

const blobToBuffer = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
};

const loadFont = async (setFont: (font: fontkit.Font) => void) => {
  try {
    const response = await fetch("/fonts/Inter-Regular.ttf");
    const blob = await response.blob();
    const buffer = await blobToBuffer(blob);
    const font = fontkit.create(buffer);
    setFont(font as fontkit.Font);
  } catch (error) {
    console.error("Error loading font", error);
    // TODO: show snackbar, disable loading of initial text, possibly try loading other font
  }
};

export default function FullRTE({ markdown = "" }) {
  const stageRef = useRef(null);
  const [fontData, setFontData] = useState(null);

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

  useEffect(() => {
    loadFont(setFontData);
  }, []);

  useEffect(() => {
    if (fontData) {
      console.info("fontdata loaded, intializing editor");
      const multiPageEditor = new MultiPageEditor(mainTextSize, 100, fontData);
      multiPageEditor.insert(0, "Hello World", defaultStyle);
      const renderable = multiPageEditor.renderVisible();
      console.info("renderable: ", renderable);
    }
  }, [fontData]);

  const {} = useMultiPageRTE(markdown, mainTextSize);

  return <>RTE</>;

  //   console.info("masterJson", masterJson);

  //   return (
  //     <>
  //       <Stage
  //         ref={stageRef}
  //         width={documentSize.width}
  //         height={documentSize.height * Object.keys(jsonByPage).length}
  //         // height={documentSize.height}
  //         // onMouseDown={handleMouseDown}
  //         // onMousemove={handleMouseMove}
  //         // onMouseup={handleMouseUp}
  //         // onMouseDown={handleCanvasClick}
  //       >
  //         <Layer>
  //           {Object.keys(jsonByPage).map((key, i) => {
  //             const masterJson = jsonByPage[key];

  //             return (
  //               <>
  //                 <Rect
  //                   x={0}
  //                   y={documentSize.height * i}
  //                   width={documentSize.width}
  //                   height={documentSize.height}
  //                   fill="#e5e5e5"
  //                 />
  //                 <Rect
  //                   x={marginSize.x}
  //                   y={documentSize.height * i + marginSize.y}
  //                   width={mainTextSize.width}
  //                   height={mainTextSize.height}
  //                   fill="#fff"
  //                   onMouseDown={handleCanvasClick}
  //                 />
  //                 <Group
  //                   x={marginSize.x}
  //                   y={documentSize.height * i + marginSize.y}
  //                 >
  //                   {masterJson.map((charText, i) => {
  //                     const randomColor = `#${Math.floor(
  //                       Math.random() * 16777215
  //                     ).toString(16)}`;

  //                     return (
  //                       <>
  //                         <Text
  //                           key={`${charText.characterId}-${i}`}
  //                           id={charText.characterId}
  //                           x={charText?.position?.x}
  //                           y={charText?.position?.y}
  //                           text={charText.character}
  //                           fontSize={charText.style.fontSize}
  //                           fontFamily={charText.style.fontFamily}
  //                           fontStyle={
  //                             charText.style.italic ? "italic" : "normal"
  //                           }
  //                           fill={charText.style.color}
  //                           onClick={handleTextClick}
  //                         />
  //                       </>
  //                     );
  //                   })}
  //                 </Group>
  //               </>
  //             );
  //           })}
  //         </Layer>
  //         {/* <Layer>
  //           <Rect
  //             x={0}
  //             y={0}
  //             width={documentSize.width}
  //             height={documentSize.height}
  //             fill="#e5e5e5"
  //           />
  //           <Rect
  //             x={marginSize.x}
  //             y={0}
  //             width={mainTextSize.width}
  //             height={mainTextSize.height}
  //             fill="#fff"
  //             onMouseDown={handleCanvasClick}
  //           />
  //           {masterJson.map((charText, i) => {
  //             return (
  //               <>
  //                 <Text
  //                   key={`${charText.characterId}-${i}`}
  //                   id={charText.characterId}
  //                   x={charText?.position?.x}
  //                   y={charText?.position?.y}
  //                   text={charText.character}
  //                   fontSize={charText.style.fontSize}
  //                   fontFamily={charText.style.fontFamily}
  //                   fontStyle={charText.style.italic ? "italic" : "normal"}
  //                   fill={charText.style.color}
  //                   onClick={handleTextClick}
  //                 />
  //               </>
  //             );
  //           })}
  //         </Layer> */}
  //       </Stage>
  //       <style jsx>{`
  //         @font-face {
  //           font-family: "Inter";
  //           src: url("/fonts/Inter-Regular.ttf");
  //           font-weight: normal;
  //           font-style: normal;
  //         }
  //       `}</style>
  //       <div className="preloadFont" style={{ fontFamily: "Inter" }}>
  //         .
  //       </div>
  //     </>
  //   );
}
