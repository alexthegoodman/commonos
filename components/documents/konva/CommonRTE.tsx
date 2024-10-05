import { Button } from "@mui/material";
import { initializeMultiPageRTE } from "common-rte/dist";
import {
  defaultStyle,
  // DocumentSize,
  loadFont,
  MultiPageEditor,
} from "common-rte/dist";
import { useEffect } from "react";
// import testJson from "./src/testJson.json";

const pxPerIn = 96;
const marginSizeIn = { x: 1, y: 0.5 };
const documentSizeIn = {
  width: 8.3,
  height: 11.7,
};

const marginSize = {
  x: marginSizeIn.x * pxPerIn,
  y: marginSizeIn.y * pxPerIn,
};

const documentSize = {
  width: documentSizeIn.width * pxPerIn,
  height: documentSizeIn.height * pxPerIn,
};

const mainTextSize = {
  width: (documentSizeIn.width - marginSizeIn.x * 2) * pxPerIn,
  height: (documentSizeIn.height - marginSizeIn.y * 2) * pxPerIn,
};

let rteMounted = 0;

export default function CommonRTE({
  markdown = "",
  documentId,
  documentData,
  refetch,
}) {
  const startEditor = () => {
    const debounceCallback = (content, masterJson) =>
      console.info("debounce content", documentId, masterJson);

    const detachHandlers = initializeMultiPageRTE(
      markdown,
      null,
      // testJson,
      mainTextSize,
      documentSize,
      marginSize,
      debounceCallback,
      "/fonts/Inter-Regular.ttf"
    );

    return detachHandlers;
  };

  useEffect(() => {
    rteMounted++;

    if (
      (process.env.NODE_ENV === "development" && rteMounted === 2) ||
      (process.env.NODE_ENV === "production" && rteMounted === 1)
    ) {
      console.info("start editor", process.env.NODE_ENV);

      const detachHandlers = startEditor();

      return () => {
        rteMounted = 0;
        detachHandlers();
      };
    }
  }, []);

  return (
    <>
      <div className="toolbar">
        <label>Alter Text:</label>
        <Button size="small" id="cmnColor">
          Color
        </Button>
        <select id="cmnFontSize">
          <option value="10">10</option>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
          <option value="24">24</option>
          <option value="36">36</option>
          <option value="48">48</option>
        </select>
        <Button size="small" id="cmnBold">
          Bold
        </Button>
        <Button size="small" id="cmnItalic">
          Italic
        </Button>
        <Button size="small" id="cmnUnderline">
          Underline
        </Button>
        <label>Add Visuals:</label>
        <Button size="small" id="cmnCircle">
          Circle
        </Button>
        <Button size="small" id="cmnRectangle">
          Rectangle
        </Button>
        <Button size="small" id="cmnImageButton">
          Image
        </Button>
        <input id="cmnImageFile" type="file" className="hidden" />
        <span>Last Saved:</span>
        <span id="cmnLastSaved"></span>
      </div>
      <div id="cmnContainer"></div>
      <style>
        {`@font-face {
              font-family: "Inter";
              src: url("/fonts/Inter-Regular.ttf");
              font-weight: normal;
              font-style: normal;
            }
            .toolbar {
              display: flex;
              flex-direction: row;
              gap: 5px;
              z-index: 2;
            }
              .toolbar button, .toolbar a {
              height: 40px; 
              min-width: 20px;
              width: auto;
              }
            .hidden {
              display: none;
            }
              #cmnContainer {
              display: flex;
    justify-content: center;
    }
            `}
      </style>
      <div className="preloadFont" style={{ fontFamily: "Inter" }}>
        .
      </div>
    </>
  );
}
