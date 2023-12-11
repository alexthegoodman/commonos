"use client";
import "client-only";

import { useSlidesContext } from "@/context/SlidesContext";
import { useRef, useState } from "react";
import { Stage, Layer, Star, Text, Rect } from "react-konva";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Box, Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

function InnerText({ stageRef, text, state, dispatch }) {
  const textNodeRef = useRef(null);

  return (
    <Text
      key={text.id}
      ref={textNodeRef}
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
        if (!textNodeRef.current) {
          console.error("textNodeRef.current is null");
          return;
        }

        // hide text node and transformer:
        textNodeRef.current.hide();
        // tr.hide();

        // create textarea over canvas with absolute position
        // first we need to find position for textarea
        // how to find it?

        // at first lets find position of text node relative to the stage:
        var textPosition = textNodeRef.current.absolutePosition();

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
        textarea.value = textNodeRef.current.text();
        textarea.style.position = "absolute";
        textarea.style.top = areaPosition.y + "px";
        textarea.style.left = areaPosition.x + "px";
        textarea.style.width =
          textNodeRef.current.width() -
          textNodeRef.current.padding() * 2 +
          "px";
        textarea.style.height =
          textNodeRef.current.height() -
          textNodeRef.current.padding() * 2 +
          5 +
          "px";
        textarea.style.fontSize = textNodeRef.current.fontSize() + "px";
        textarea.style.border = "none";
        textarea.style.padding = "0px";
        textarea.style.margin = "0px";
        textarea.style.overflow = "hidden";
        textarea.style.background = "none";
        textarea.style.outline = "none";
        textarea.style.resize = "none";
        textarea.style.lineHeight = textNodeRef.current.lineHeight();
        textarea.style.fontFamily = textNodeRef.current.fontFamily();
        textarea.style.transformOrigin = "left top";
        textarea.style.textAlign = textNodeRef.current.align();
        textarea.style.color = textNodeRef.current.fill();
        var rotation = textNodeRef.current.rotation();
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
          px += 2 + Math.round(textNodeRef.current.fontSize() / 20);
        }
        transform += "translateY(-" + px + "px)";

        textarea.style.transform = transform;

        // reset height
        textarea.style.height = "auto";
        // after browsers resized it we can set actual value
        textarea.style.height = textarea.scrollHeight + 3 + "px";

        textarea.focus();

        function removeTextarea() {
          textarea.parentNode.removeChild(textarea);
          window.removeEventListener("click", handleOutsideClick);
          textNodeRef.current.show();
          // tr.show();
          // tr.forceUpdate();
        }

        function setTextareaWidth(newWidth) {
          if (!newWidth) {
            // set width for placeholder
            newWidth =
              textNodeRef.current.placeholder.length *
              textNodeRef.current.fontSize();
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
        }

        textarea.addEventListener("keydown", function (e) {
          // hide on enter
          // but don't hide on shift + enter
          if (e.keyCode === 13 && !e.shiftKey) {
            setNewValue();
            removeTextarea();
          }
          // on esc do not set value back to node
          if (e.keyCode === 27) {
            removeTextarea();
          }
        });

        textarea.addEventListener("keydown", function (e) {
          var scale = textNodeRef.current.getAbsoluteScale().x;
          setTextareaWidth(textNodeRef.current.width() * scale);
          textarea.style.height = "auto";
          textarea.style.height =
            textarea.scrollHeight + textNodeRef.current.fontSize() + "px";
        });

        function handleOutsideClick(e) {
          if (e.target !== textarea) {
            // textNodeRef.current.text(textarea.value);
            setNewValue();
            removeTextarea();
          }
        }

        setTimeout(() => {
          window.addEventListener("click", handleOutsideClick);
        });
      }}
    />
  );
}

export default function SlideEditor({ slide, state, dispatch }) {
  const stageRef = useRef(null);
  const windowSize = useWindowSize();
  const stageWidth =
    windowSize.width && windowSize.width < 1400 ? windowSize.width - 400 : 1000;
  const stageHeight = stageWidth * 0.65;

  return (
    <>
      {slide.title}
      <Box>
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
                    fontSize: 20,
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
          {slide?.texts?.map((text) => {
            return (
              <InnerText
                key={text.id}
                stageRef={stageRef}
                state={state}
                text={text}
                dispatch={dispatch}
              />
            );
          })}
        </Layer>
      </Stage>
    </>
  );
}
