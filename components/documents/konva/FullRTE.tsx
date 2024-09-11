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
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  styled,
  Typography,
} from "@mui/material";
import { useDocumentsContext } from "@/context/DocumentsContext";
import { v4 as uuidv4 } from "uuid";
import EditorHeader from "../editor/EditorHeader";
import {
  HandSwipeRight,
  TextB,
  TextItalic,
  TextStrikethrough,
  TextUnderline,
} from "@phosphor-icons/react";
import { Resizable } from "re-resizable";
import { HandSwipeLeft } from "@phosphor-icons/react/dist/ssr";

const ResizableInner = styled(Box)(({ theme, vertical }) => ({
  display: "flex",
  flexDirection: vertical ? "column" : "row",
  alignItems: "center",
  justifyContent: "space-between",
  height: "100%",
  background: "#F7F7F7",
}));

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

  const {
    masterJson,
    jsonByPage,
    firstSelectedNode,
    lastSelectedNode,
    handleCanvasClick,
    handleTextClick,
    handleTextMouseDown,
    handleTextMouseMove,
    handleTextMouseUp,
    handleFormattingDown,
  } = useMultiPageRTE(markdown, mainTextSize);

  const onWidthResize = () => {};

  //   console.info("page index", currentPageIndex);

  //   if (Object.keys(jsonByPage).length < 1) {
  //     return <PrimaryLoader />;
  //   }

  console.info("selectedTextNodes", firstSelectedNode, lastSelectedNode);

  let isSelected = false;

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

            handleFormattingDown({
              fontSize: value,
            });
          }}
        >
          <MenuItem value={"init"}>Font Size</MenuItem>
          <MenuItem value={10}>10px</MenuItem>
          <MenuItem value={14}>14px</MenuItem>
          <MenuItem value={18}>18px</MenuItem>
          <MenuItem value={24}>24px</MenuItem>
          <MenuItem value={32}>32px</MenuItem>
          <MenuItem value={48}>48px</MenuItem>
        </Select>
        <IconButton
          onClick={() => {
            handleFormattingDown({
              fontWeight: "600",
            });
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
            handleFormattingDown({
              italic: true,
            });
          }}
          className={"toolbar-item spaced " + (false ? "active" : "")}
          aria-label="Format Italics"
        >
          {/* <i className="ph ph-text-italic-thin"></i> */}
          <TextItalic weight="thin" />
        </IconButton>
        <IconButton
          onClick={() => {
            handleFormattingDown({
              underline: true,
            });
          }}
          className={"toolbar-item spaced " + (false ? "active" : "")}
          aria-label="Format Underline"
        >
          {/* <i className="ph ph-text-strikethrough-thin"></i> */}
          <TextUnderline weight="thin" />
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
      <Box display="flex" flexDirection="column" alignItems="center">
        <Resizable
          // style={{ position: "absolute" }}
          style={{ marginLeft: "25px" }}
          grid={[25, 25]}
          defaultSize={{
            width: mainTextSize.width,
            height: 25,
          }}
          minHeight={25}
          maxHeight={25}
          minWidth={25}
          maxWidth={documentSize.width}
          onResize={onWidthResize}
          // onResizeStop={onResizeStop}
        >
          <ResizableInner>
            <HandSwipeLeft />
            <HandSwipeRight />
          </ResizableInner>
        </Resizable>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Resizable
            // style={{ position: "absolute" }}

            grid={[25, 25]}
            defaultSize={{
              width: 25,
              height: mainTextSize.height,
            }}
            minHeight={25}
            maxHeight={documentSize.height}
            minWidth={25}
            maxWidth={25}
            onResize={onWidthResize}
            // onResizeStop={onResizeStop}
          >
            <ResizableInner vertical={true}>
              <HandSwipeLeft />
              <HandSwipeRight />
            </ResizableInner>
          </Resizable>
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
                      fill="#e5e5e5"
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
                        const charId = `${charText.char}-${charText.page}-${i}`;
                        // const isSelected = selectedTextNodes.includes(charId);
                        if (firstSelectedNode === charId && lastSelectedNode) {
                          isSelected = true;
                        }

                        if (lastSelectedNode === charId) {
                          isSelected = false;
                        }

                        return (
                          <>
                            {isSelected && (
                              <Rect
                                id={`${charText.char}-${charText.page}-${i}-sel`}
                                key={`${charText.char}-${charText.page}-${i}-sel`}
                                fill="#38ef7d"
                                height={26}
                                width={charText.width + 2}
                                x={charText?.x}
                                y={charText?.y}
                              />
                            )}

                            <Text
                              // key={`${charText.characterId}-${i}`}
                              // id={charText.characterId}
                              id={charId}
                              key={charId}
                              x={charText?.x}
                              y={charText?.y}
                              text={charText.char}
                              fontSize={charText.format.fontSize}
                              fontFamily={charText.format.fontFamily}
                              fontStyle={
                                charText.format.italic
                                  ? "italic"
                                  : charText.format.fontWeight
                              }
                              fill={charText.format.color}
                              textDecoration={
                                charText.format.underline ? "underline" : ""
                              }
                              onClick={handleTextClick}
                              onMouseDown={handleTextMouseDown}
                              onMouseMove={handleTextMouseMove}
                              onMouseUp={handleTextMouseUp}
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
        </Box>
      </Box>
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
