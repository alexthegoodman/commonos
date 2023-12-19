"use client";
import "client-only";

import { useSlidesContext } from "@/context/SlidesContext";
import { createRef, forwardRef, useEffect, useRef, useState } from "react";
import { Stage, Layer, Star, Text, Rect, Transformer } from "react-konva";
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
  const textNodeTransformerRefs = useRef([]);

  console.info("textNodeRefs", textNodeRefs);

  useEffect(() => {
    if (slide?.texts) {
      textNodeRefs.current = slide.texts.map(
        (_, i) => textNodeRefs.current[i] ?? createRef()
      );
      textNodeTransformerRefs.current = slide.texts.map(
        (_, i) => textNodeTransformerRefs.current[i] ?? createRef()
      );
    }
  }, [slide]);

  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [selectedItemX, setSelectedItemX] = useState(null);
  const [selectedItemY, setSelectedItemY] = useState(null);

  const [activeItemId, setActiveItemId] = useState(null);

  useEffect(() => {
    if (activeItemId) {
      // we need to attach transformer manually
      const activeIndex = slide.texts.findIndex(
        (text) => text.id === activeItemId
      );
      textNodeTransformerRefs.current[activeIndex].current.nodes([
        textNodeRefs.current[activeIndex].current,
      ]);
      textNodeTransformerRefs.current[activeIndex].current
        .getLayer()
        .batchDraw();
    }
  }, [activeItemId]);

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
                    width: 200,
                    fontSize: 24,
                    fontStyle: "normal",
                    fontFamily: "Arial",
                    fontVariant: "normal",
                    fill: "black",
                    align: "left",
                    lineHeight: 1,
                  });
                }
                return slide;
              }),
            });
          }}
        >
          Add Text
        </Button>
      </Box>
      <Box>
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

          <Select
            label="Font Family"
            style={{
              height: "40px",
            }}
            disabled={disabled}
            value={
              slide && slide[selectedItemType]
                ? slide[selectedItemType].filter(
                    (text) => text.id === selectedItemId
                  )[0]?.fontFamily
                : "Arial"
            }
            onChange={(e) => {
              // update preview
              const textarea = document.getElementById("slidesTextBox");
              textarea.style.fontFamily = e.target.value;
              // update actual
              dispatch({
                type: "slides",
                payload: state.slides.map((slide) => {
                  if (slide.id === state.currentSlideId) {
                    slide.texts = slide.texts.map((t) => {
                      if (t.id === selectedItemId) {
                        t.fontFamily = e.target.value;
                      }
                      return t;
                    });
                  }
                  return slide;
                }),
              });
            }}
          >
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Helvetica">Helvetica</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            <MenuItem value="Times">Times</MenuItem>
            <MenuItem value="Courier New">Courier New</MenuItem>
            <MenuItem value="Courier">Courier</MenuItem>
            <MenuItem value="Verdana">Verdana</MenuItem>
            <MenuItem value="Georgia">Georgia</MenuItem>
            <MenuItem value="Palatino">Palatino</MenuItem>
            <MenuItem value="Garamond">Garamond</MenuItem>
            <MenuItem value="Bookman">Bookman</MenuItem>
            <MenuItem value="Comic Sans MS">Comic Sans MS</MenuItem>
            <MenuItem value="Trebuchet MS">Trebuchet MS</MenuItem>
            <MenuItem value="Arial Black">Arial Black</MenuItem>
            <MenuItem value="Impact">Impact</MenuItem>
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
              <>
                <Text
                  key={text.id}
                  ref={textNodeRefs.current[i]}
                  text={text.content}
                  fontSize={text.fontSize ?? 24}
                  fontStyle={text?.fontStyle ?? "normal"}
                  fontFamily={text?.fontFamily ?? "Arial"}
                  fontVariant={text?.fontVariant ?? "normal"}
                  fill={text?.fill ?? "black"}
                  align={text?.align ?? "left"}
                  lineHeight={text?.lineHeight ?? 1}
                  x={text.x ?? 0}
                  y={text.y ?? 0}
                  width={text?.width ?? 200}
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
                      x:
                        stageRef.current.container().offsetLeft +
                        textPosition.x,
                      y:
                        stageRef.current.container().offsetTop + textPosition.y,
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
                      textNodeRef.height() -
                      textNodeRef.padding() * 2 +
                      5 +
                      "px";
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
                          textNodeRef.placeholder.length *
                          textNodeRef.fontSize();
                      }
                      // some extra fixes on different browsers
                      var isSafari = /^((?!chrome|android).)*safari/i.test(
                        navigator.userAgent
                      );
                      var isFirefox =
                        navigator.userAgent.toLowerCase().indexOf("firefox") >
                        -1;
                      if (isSafari || isFirefox) {
                        newWidth = Math.ceil(newWidth);
                      }

                      var isEdge =
                        document.documentMode ||
                        /Edge/.test(navigator.userAgent);
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
                  onClick={(e) => {
                    setActiveItemId(text.id);
                  }}
                  onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = textNodeRefs.current[i].current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);

                    // TODO: consider rotation

                    dispatch({
                      type: "slides",
                      payload: state.slides.map((slide) => {
                        if (slide.id === state.currentSlideId) {
                          slide.texts = slide.texts.map((t) => {
                            if (t.id === text.id) {
                              t.x = node.x();
                              t.y = node.y();
                              t.width = Math.max(5, node.width() * scaleX);
                              t.height = Math.max(node.height() * scaleY);
                            }
                            return t;
                          });
                        }
                        return slide;
                      }),
                    });
                  }}
                />
                {activeItemId === text.id && (
                  <Transformer
                    ref={textNodeTransformerRefs.current[i]}
                    flipEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                      // limit resize
                      if (
                        Math.abs(newBox.width) < 5 ||
                        Math.abs(newBox.height) < 5
                      ) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                )}
              </>
            );
          })}
        </Layer>
      </Stage>
    </>
  );
}
