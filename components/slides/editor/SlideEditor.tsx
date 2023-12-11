"use client";
import "client-only";

import { useSlidesContext } from "@/context/SlidesContext";
import { createRef, forwardRef, useEffect, useRef, useState } from "react";
import { Stage, Layer, Star, Text, Rect } from "react-konva";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Box, Button, MenuItem, Select, styled } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { Check } from "@mui/icons-material";

const ToolbarWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

export default function SlideEditor({ slide, state, dispatch }) {
  const stageRef = useRef(null);
  const textToolbarRef = useRef(null);
  const textNodeRefs = useRef([]);

  console.info("textNodeRefs", textNodeRefs);

  useEffect(() => {
    if (slide?.texts) {
      textNodeRefs.current = slide.texts.map(
        (_, i) => textNodeRefs.current[i] ?? createRef()
      );
    }
  }, [slide]);

  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [selectedItemX, setSelectedItemX] = useState(null);
  const [selectedItemY, setSelectedItemY] = useState(null);

  const stageWidth = 1000;
  const stageHeight = 650;

  const currentFontSize =
    slide && slide[selectedItemType]
      ? slide[selectedItemType].filter((text) => text.id === selectedItemId)[0]
          ?.fontSize
      : 24;

  const disabled = !selectedItemId || !selectedItemType;

  return (
    <>
      {slide.title}
      <Box display="flex" flexDirection="row">
        <Button
          onClick={() => {
            dispatch({
              type: "slides",
              payload: state.slides.map((slide) => {
                if (slide.id === state.currentSlideId) {
                  slide.texts.push({
                    id: uuidv4(),
                    content: "New Text",
                    x: 50,
                    y: 50,
                    fontSize: 24,
                  });
                }
                return slide;
              }),
            });
          }}
        >
          Add Text
        </Button>
        <ToolbarWrapper
          ref={textToolbarRef}
          style={{
            position: "absolute",
            top: selectedItemY - 75,
            left: selectedItemX,
            zIndex: 10,
            display: !selectedItemY && !selectedItemX ? "none" : "block",
          }}
        >
          <Select
            label="Font Size"
            style={{
              height: "40px",
            }}
            disabled={disabled}
            value={currentFontSize}
            onChange={(e) => {
              // update preview
              const textarea = document.getElementById("slidesTextBox");
              textarea.style.fontSize = e.target.value + "px";
              // update actual
              dispatch({
                type: "slides",
                payload: state.slides.map((slide) => {
                  if (slide.id === state.currentSlideId) {
                    slide.texts = slide.texts.map((t) => {
                      if (t.id === selectedItemId) {
                        t.fontSize = e.target.value;
                      }
                      return t;
                    });
                  }
                  return slide;
                }),
              });
            }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={14}>14</MenuItem>
            <MenuItem value={18}>18</MenuItem>
            <MenuItem value={24}>24</MenuItem>
            <MenuItem value={32}>32</MenuItem>
          </Select>
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              const text = slide.texts.filter(
                (text) => text.id === selectedItemId
              )[0];
              const textarea = document.getElementById("slidesTextBox");
              dispatch({
                type: "slides",
                payload: state.slides.map((slide) => {
                  if (slide.id === state.currentSlideId) {
                    slide.texts = slide.texts.map((t) => {
                      if (t.id === text.id) {
                        t.content = textarea.value;
                      }
                      return t;
                    });
                  }
                  return slide;
                }),
              });

              textarea.parentNode.removeChild(textarea);
              textNodeRefs.current[selectedItemIndex].current.show();

              setSelectedItemId(null);
              setSelectedItemType(null);
              setSelectedItemX(null);
              setSelectedItemY(null);
            }}
          >
            <Check />
          </Button>
        </ToolbarWrapper>
      </Box>
      <Stage ref={stageRef} width={stageWidth} height={stageHeight}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={stageWidth}
            height={stageHeight}
            fill="white"
          />
        </Layer>
        <Layer>
          {slide?.texts?.map((text, i) => {
            return (
              <Text
                key={text.id}
                ref={textNodeRefs.current[i]}
                text={text.content}
                fontSize={text.fontSize}
                x={text.x}
                y={text.y}
                draggable
                onDragEnd={(e) => {
                  dispatch({
                    type: "slides",
                    payload: state.slides.map((slide) => {
                      if (slide.id === state.currentSlideId) {
                        slide.texts = slide.texts.map((t) => {
                          if (t.id === text.id) {
                            t.x = e.target.x();
                            t.y = e.target.y();
                          }
                          return t;
                        });
                      }
                      return slide;
                    }),
                  });
                }}
                onDblClick={(e) => {
                  const textNodeRef = textNodeRefs.current[i].current;

                  if (!textNodeRef) {
                    console.error(
                      "textNodeRefs.current[i] is null",
                      textNodeRefs
                    );
                    return;
                  }

                  setSelectedItemIndex(i);
                  setSelectedItemId(text.id);
                  setSelectedItemType("texts");

                  // hide text node and transformer:
                  textNodeRef.hide();
                  // tr.hide();

                  // create textarea over canvas with absolute position
                  // first we need to find position for textarea
                  // how to find it?

                  // at first lets find position of text node relative to the stage:
                  var textPosition = textNodeRef.absolutePosition();

                  // so position of textarea will be the sum of positions above:
                  var areaPosition = {
                    x: stageRef.current.container().offsetLeft + textPosition.x,
                    y: stageRef.current.container().offsetTop + textPosition.y,
                  };

                  // create textarea and style it
                  var textarea = document.createElement("textarea");
                  document.body.appendChild(textarea);

                  // apply many styles to match text on canvas as close as possible
                  // remember that text rendering on canvas and on the textarea can be different
                  // and sometimes it is hard to make it 100% the same. But we will try...
                  textarea.id = "slidesTextBox";
                  textarea.value = textNodeRef.text();
                  textarea.style.position = "absolute";
                  textarea.style.top = areaPosition.y + "px";
                  textarea.style.left = areaPosition.x + "px";
                  textarea.style.width =
                    textNodeRef.width() - textNodeRef.padding() * 2 + "px";
                  textarea.style.height =
                    textNodeRef.height() - textNodeRef.padding() * 2 + 5 + "px";
                  textarea.style.fontSize = textNodeRef.fontSize() + "px";
                  textarea.style.border = "none";
                  textarea.style.padding = "0px";
                  textarea.style.margin = "0px";
                  textarea.style.overflow = "hidden";
                  textarea.style.background = "none";
                  textarea.style.outline = "none";
                  textarea.style.resize = "none";
                  textarea.style.lineHeight = textNodeRef.lineHeight();
                  textarea.style.fontFamily = textNodeRef.fontFamily();
                  textarea.style.transformOrigin = "left top";
                  textarea.style.textAlign = textNodeRef.align();
                  textarea.style.color = textNodeRef.fill();
                  var rotation = textNodeRef.rotation();
                  var transform = "";
                  if (rotation) {
                    transform += "rotateZ(" + rotation + "deg)";
                  }

                  var px = 0;
                  // also we need to slightly move textarea on firefox
                  // because it jumps a bit
                  var isFirefox =
                    navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
                  if (isFirefox) {
                    px += 2 + Math.round(textNodeRef.fontSize() / 20);
                  }
                  transform += "translateY(-" + px + "px)";

                  textarea.style.transform = transform;

                  // reset height
                  textarea.style.height = "auto";
                  // after browsers resized it we can set actual value
                  textarea.style.height = textarea.scrollHeight + 3 + "px";

                  textarea.focus();

                  // move texttoolbar to this position
                  setSelectedItemX(areaPosition.x);
                  setSelectedItemY(areaPosition.y);

                  function removeTextarea() {
                    textarea.parentNode.removeChild(textarea);
                    window.removeEventListener("click", handleOutsideClick);
                    textNodeRef.show();
                    // tr.show();
                    // tr.forceUpdate();
                  }

                  function setTextareaWidth(newWidth) {
                    if (!newWidth) {
                      // set width for placeholder
                      newWidth =
                        textNodeRef.placeholder.length * textNodeRef.fontSize();
                    }
                    // some extra fixes on different browsers
                    var isSafari = /^((?!chrome|android).)*safari/i.test(
                      navigator.userAgent
                    );
                    var isFirefox =
                      navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
                    if (isSafari || isFirefox) {
                      newWidth = Math.ceil(newWidth);
                    }

                    var isEdge =
                      document.documentMode || /Edge/.test(navigator.userAgent);
                    if (isEdge) {
                      newWidth += 1;
                    }
                    textarea.style.width = newWidth + "px";
                  }

                  function setNewValue() {
                    dispatch({
                      type: "slides",
                      payload: state.slides.map((slide) => {
                        if (slide.id === state.currentSlideId) {
                          slide.texts = slide.texts.map((t) => {
                            if (t.id === text.id) {
                              t.content = textarea.value;
                            }
                            return t;
                          });
                        }
                        return slide;
                      }),
                    });

                    setSelectedItemId(null);
                    setSelectedItemType(null);
                    removeTextarea();
                  }

                  textarea.addEventListener("keydown", function (e) {
                    // hide on enter
                    // but don't hide on shift + enter
                    if (e.keyCode === 13 && !e.shiftKey) {
                      setNewValue();
                    }
                    // on esc do not set value back to node
                    if (e.keyCode === 27) {
                      removeTextarea();
                    }
                  });

                  textarea.addEventListener("keydown", function (e) {
                    var scale = textNodeRef.getAbsoluteScale().x;
                    setTextareaWidth(textNodeRef.width() * scale);
                    textarea.style.height = "auto";
                    textarea.style.height =
                      textarea.scrollHeight + textNodeRef.fontSize() + "px";
                  });

                  // function handleOutsideClick(e) {
                  //   console.info("handleOutsideClick", e.target, textToolbarRef.current);
                  //   if (e.target !== textarea || e.target !== textToolbarRef.current) {
                  //     // textNodeRef.current.text(textarea.value);
                  //     setNewValue();
                  //   }
                  // }

                  // setTimeout(() => {
                  //   window.addEventListener("click", handleOutsideClick);
                  // });
                }}
              />
            );
          })}
        </Layer>
      </Stage>
    </>
  );
}
