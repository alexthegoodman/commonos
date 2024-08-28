"use client";

import {
  defaultStyle,
  MultiPageEditor,
  RenderItem,
  useMultiPageRTE,
} from "@/hooks/useMultiPageRTE";
import { useEffect, useRef, useState } from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import * as fontkit from "fontkit";
import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import { Box, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { useDocumentsContext } from "@/context/DocumentsContext";
import { v4 as uuidv4 } from "uuid";
import EditorHeader from "../editor/EditorHeader";
import { TextB, TextItalic, TextStrikethrough } from "@phosphor-icons/react";

export default function FullRTE({
  markdown = "",
  documentId,
  documentData,
  refetch,
}) {
  const [state, dispatch] = useDocumentsContext();

  const [currentPageIndex, setCurrentPageIndex] = useState(0);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window) {
        const scrollTop = window.scrollY;
        const newPageIndex = Math.floor(scrollTop / documentSize.height);
        setCurrentPageIndex(newPageIndex);
      }
    };

    if (window) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (window) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [documentSize.height]);

  const { masterJson, jsonByPage, handleCanvasClick, handleTextClick } =
    useMultiPageRTE(markdown, mainTextSize);

  //   console.info("page index", currentPageIndex);

  //   if (Object.keys(jsonByPage).length < 1) {
  //     return <PrimaryLoader />;
  //   }

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        // justifyContent="space-between"
        gap={3}
        mb={2}
      >
        <EditorHeader
          documentId={documentId}
          documentData={documentData}
          refetchDocument={refetch}
        />

        {/* <Typography variant="body1">{totalWords} Words</Typography> */}
        <Typography variant="body1">{markdown?.length} Characters</Typography>
      </Box>
      <Box
        mb={2}
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={2}
      >
        <Select
          label="Font Size"
          placeholder="Font Size"
          style={{
            width: "160px",
          }}
          value={"init"}
          onChange={(e) => {
            const value = e.target.value;

            if (value === "init") {
              return;
            }

            console.info("update font size of selected text", value);
          }}
        >
          <MenuItem value={"init"}>Font Size</MenuItem>
          <MenuItem value={"10px"}>10px</MenuItem>
          <MenuItem value={"14px"}>14px</MenuItem>
          <MenuItem value={"18px"}>18px</MenuItem>
          <MenuItem value={"24px"}>24px</MenuItem>
          <MenuItem value={"32px"}>32px</MenuItem>
          <MenuItem value={"48px"}>48px</MenuItem>
        </Select>
        <IconButton
          onClick={() => {
            //   editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
          className={"toolbar-item spaced " + (false ? "active" : "")}
          aria-label="Format Bold"
        >
          {/* <i className="format bold" /> */}
          {/* <i className="ph ph-text-bolder-thin" /> */}
          <TextB weight="thin" />
        </IconButton>
        <IconButton
          onClick={() => {
            //   editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
          className={"toolbar-item spaced " + (false ? "active" : "")}
          aria-label="Format Italics"
        >
          {/* <i className="ph ph-text-italic-thin"></i> */}
          <TextItalic weight="thin" />
        </IconButton>
        <IconButton
          onClick={() => {
            //   editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          }}
          className={"toolbar-item spaced " + (false ? "active" : "")}
          aria-label="Format Strikethrough"
        >
          {/* <i className="ph ph-text-strikethrough-thin"></i> */}
          <TextStrikethrough weight="thin" />
        </IconButton>
        <Select
          label="Add Shape"
          placeholder="Add Shape"
          style={{
            width: "160px",
          }}
          value={"init"}
          onChange={(e) => {
            const value = e.target.value;

            if (value === "init") {
              return;
            }

            console.info("add shape", value);

            dispatch({
              type: "pages",
              payload: state.pages.map((page) => {
                if (page.index === currentPageIndex) {
                  page.shapes.push({
                    id: uuidv4(),
                    x: 50,
                    y: 50,
                    width: 100,
                    height: 100,
                    sides: value === "triangle" ? 3 : 4,
                    radius: 100,
                    fill: "black",
                    kind: value,
                  });
                }
                return page;
              }),
            });
          }}
        >
          <MenuItem value={"init"}>Add Shape</MenuItem>
          <MenuItem value={"star"}>Star</MenuItem>
          <MenuItem value={"circle"}>Circle</MenuItem>
          <MenuItem value={"ellipse"}>Ellipse</MenuItem>
          <MenuItem value={"rectangle"}>Rectangle</MenuItem>
          <MenuItem value={"triangle"}>Triangle</MenuItem>
          <MenuItem value={"polygon"}>Polygon</MenuItem>
        </Select>
      </Box>
      <Stage
        ref={stageRef}
        width={documentSize.width}
        height={documentSize.height * Object.keys(jsonByPage).length}
        // height={documentSize.height}
        // onMouseDown={handleMouseDown}
        // onMousemove={handleMouseMove}
        // onMouseup={handleMouseUp}
        // onMouseDown={handleCanvasClick}
      >
        <Layer>
          {Object.keys(jsonByPage).map((key, i) => {
            const masterJson = jsonByPage[key];

            return (
              <>
                <Rect
                  x={0}
                  y={documentSize.height * i}
                  width={documentSize.width}
                  height={documentSize.height}
                  fill="#FFF"
                />
                <Rect
                  x={marginSize.x}
                  y={documentSize.height * i + marginSize.y}
                  width={mainTextSize.width}
                  height={mainTextSize.height}
                  fill="#fff"
                  onMouseDown={handleCanvasClick}
                />
                <Group
                  x={marginSize.x}
                  y={documentSize.height * i + marginSize.y}
                >
                  {masterJson.map((charText: RenderItem, i) => {
                    // const randomColor = `#${Math.floor(
                    //   Math.random() * 16777215
                    // ).toString(16)}`;

                    return (
                      <>
                        <Text
                          // key={`${charText.characterId}-${i}`}
                          // id={charText.characterId}
                          id={`${charText.char}-${charText.page}-${i}`}
                          key={`${charText.char}-${charText.page}-${i}`}
                          x={charText?.x}
                          y={charText?.y}
                          text={charText.char}
                          fontSize={charText.format.fontSize}
                          fontFamily={charText.format.fontFamily}
                          fontStyle={
                            charText.format.italic ? "italic" : "normal"
                          }
                          fill={charText.format.color}
                          onClick={handleTextClick}
                        />
                      </>
                    );
                  })}
                </Group>
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
      <div className="preloadFont" style={{ fontFamily: "Inter" }}>
        .
      </div>
    </>
  );
}
