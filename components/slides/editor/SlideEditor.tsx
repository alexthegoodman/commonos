"use client";
import "client-only";

import { useSlidesContext } from "@/context/SlidesContext";
import {
  Fragment,
  createRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Stage,
  Layer,
  Star,
  Text,
  Rect,
  Transformer,
  RegularPolygon,
  Circle,
  Ellipse,
} from "react-konva";
import { useWindowSize } from "@/hooks/useWindowSize";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  styled,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { Check, Delete } from "@mui/icons-material";
import { MuiColorInput } from "mui-color-input";
import { jsPDF } from "jspdf";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";
import { getUserData } from "@/fetchers/user";
import {
  getSlideTemplatesData,
  newSlideTemplate,
  updateSlideTemplate,
} from "@/fetchers/slide";

const ToolbarWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

export default function SlideEditor({
  presentationId,
  slide,
  state,
  dispatch,
  exporting,
  setExporting,
  exportDoc,
  setExportDoc,
  slidesExported,
  setSlidesExported,
  title,
}) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const { data: userData } = useSWR("homeLayout", () => getUserData(token), {
    revalidateOnMount: true,
  });

  const { data: presentationTemplates } = useSWR(
    "presentationTemplates",
    () => getSlideTemplatesData(token),
    {
      revalidateOnMount: true,
    }
  );

  const presentationTemplateMatch = presentationTemplates?.filter(
    (template) => template.sourceId === presentationId
  )[0];

  const stageRef = useRef(null);
  const textToolbarRef = useRef(null);
  const shapeToolbarRef = useRef(null);

  const textNodeRefs = useRef([]);
  const textNodeTransformerRefs = useRef([]);

  const shapeNodeRefs = useRef([]);
  const shapeNodeTransformerRefs = useRef([]);

  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [selectedItemX, setSelectedItemX] = useState(null);
  const [selectedItemY, setSelectedItemY] = useState(null);

  const [activeItemType, setActiveItemType] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);

  // set up transformers useEffects for resizing nodes
  useEffect(() => {
    if (slide?.texts) {
      textNodeRefs.current = slide.texts.map(
        (_, i) => textNodeRefs.current[i] ?? createRef()
      );
      textNodeTransformerRefs.current = slide.texts.map(
        (_, i) => textNodeTransformerRefs.current[i] ?? createRef()
      );
    }
  }, [slide?.texts.length]);

  useEffect(() => {
    if (slide?.shapes) {
      shapeNodeRefs.current = slide.shapes.map(
        (_, i) => shapeNodeRefs.current[i] ?? createRef()
      );
      shapeNodeTransformerRefs.current = slide.shapes.map(
        (_, i) => shapeNodeTransformerRefs.current[i] ?? createRef()
      );
    }
  }, [slide?.shapes.length]);

  useEffect(() => {
    if (activeItemId && activeItemType === "texts") {
      // we need to attach transformer manually
      const activeIndex = slide.texts.findIndex(
        (text) => text.id === activeItemId
      );
      if (textNodeTransformerRefs.current[activeIndex]) {
        textNodeTransformerRefs.current[activeIndex].current.nodes([
          textNodeRefs.current[activeIndex].current,
        ]);
        textNodeTransformerRefs.current[activeIndex].current
          .getLayer()
          .batchDraw();
      }
    }
  }, [activeItemId, textNodeTransformerRefs.current]);

  useEffect(() => {
    if (activeItemId && activeItemType === "shapes") {
      // we need to attach transformer manually
      const activeIndex = slide.shapes.findIndex(
        (shape) => shape.id === activeItemId
      );
      if (shapeNodeTransformerRefs.current[activeIndex]) {
        shapeNodeTransformerRefs.current[activeIndex].current.nodes([
          shapeNodeRefs.current[activeIndex].current,
        ]);
        shapeNodeTransformerRefs.current[activeIndex].current
          .getLayer()
          .batchDraw();
      }
    }
  }, [activeItemId, shapeNodeTransformerRefs.current]);

  const stageWidth = 1000;
  const stageHeight = 650;

  const currentFontSize =
    slide && slide[selectedItemType]
      ? slide[selectedItemType].filter((text) => text.id === selectedItemId)[0]
          ?.fontSize
      : 24;

  const disabled = !selectedItemId || !selectedItemType;

  const captureNextSlide = () => {
    const dataURL = stageRef.current.toDataURL({
      mimeType: "image/jpeg",
      // quality: 0.5,
      pixelRatio: 2,
    });
    exportDoc.addImage(
      dataURL,
      0,
      slidesExported * stageHeight,
      stageWidth,
      stageHeight
    );
  };

  useEffect(() => {
    if (exporting) {
      captureNextSlide();
    }
  }, [exporting]);

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        mb={2}
      >
        <Box>
          <TextField
            // label="Slide Title"
            value={slide?.title}
            onChange={(e) => {
              dispatch({
                type: "slides",
                payload: state.slides.map((s) => {
                  if (s.id === state.currentSlideId) {
                    s.title = e.target.value;
                  }
                  return s;
                }),
              });
            }}
            style={{
              width: "400px",
            }}
          />
        </Box>
        <Box>
          {userData?.role === "ADMIN" && (
            <>
              {presentationTemplateMatch ? (
                <Button
                  color="success"
                  variant="contained"
                  onClick={async () => {
                    await updateSlideTemplate(
                      token,
                      presentationTemplateMatch.id,
                      JSON.stringify(state)
                    );
                    mutate("presentationTemplates", () =>
                      getSlideTemplatesData(token)
                    );
                    console.info("updated template");
                  }}
                >
                  Update Template
                </Button>
              ) : (
                <Button
                  color="success"
                  variant="contained"
                  onClick={async () => {
                    await newSlideTemplate(
                      token,
                      presentationId,
                      slide?.title,
                      JSON.stringify(state)
                    );
                    mutate("presentationTemplates", () =>
                      getSlideTemplatesData(token)
                    );

                    console.info("created template");
                  }}
                >
                  Save as Template
                </Button>
              )}
            </>
          )}
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              setSelectedItemId(null);
              setSelectedItemType(null);
              setSelectedItemX(null);
              setSelectedItemY(null);
              setActiveItemId(null);
              setActiveItemType(null);
              // disable slidelist buttons, scroll through slides, adding image data to jspdf
              const doc = new jsPDF("p", "px", [
                stageWidth,
                stageHeight * state.slides.length,
              ]);
              setExportDoc(doc);
              setSlidesExported(0);
              setExporting(true);
              dispatch({
                type: "currentSlideId",
                payload: state.slides[0]?.id ?? null,
              });
            }}
          >
            Export PDF
          </Button>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" mb={1}>
        <Button
          color="success"
          variant="contained"
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
                    lineHeight: 1.35,
                  });
                }
                return slide;
              }),
            });
          }}
        >
          Add Text
        </Button>
        <Select
          label="Add Shape"
          placeholder="Add Shape"
          style={{
            height: "40px",
          }}
          value={"init"}
          onChange={(e) => {
            const value = e.target.value;

            if (value === "init") {
              return;
            }

            console.info("add shape", value);

            dispatch({
              type: "slides",
              payload: state.slides.map((slide) => {
                if (slide.id === state.currentSlideId) {
                  slide.shapes.push({
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
                return slide;
              }),
            });
          }}
        >
          <MenuItem value={"init"}>Select Shape</MenuItem>
          <MenuItem value={"star"}>Star</MenuItem>
          <MenuItem value={"circle"}>Circle</MenuItem>
          <MenuItem value={"ellipse"}>Ellipse</MenuItem>
          <MenuItem value={"rectangle"}>Rectangle</MenuItem>
          <MenuItem value={"triangle"}>Triangle</MenuItem>
          <MenuItem value={"polygon"}>Polygon</MenuItem>
        </Select>
      </Box>
      <Box>
        {selectedItemType === "texts" && (
          <ToolbarWrapper
            ref={textToolbarRef}
            style={{
              position: "absolute",
              top: selectedItemY - 75,
              left: selectedItemX,
              zIndex: 10,
              display: !selectedItemY && !selectedItemX ? "none" : "block",
              boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.15)",
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
                textarea.style.lineHeight = 1.35;
                // update actual
                dispatch({
                  type: "slides",
                  payload: state.slides.map((slide) => {
                    if (slide.id === state.currentSlideId) {
                      slide.texts = slide.texts.map((t) => {
                        if (t.id === selectedItemId) {
                          t.fontSize = e.target.value;
                          t.lineHeight = 1.35; // TODO: set server side
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
              <MenuItem value={48}>48</MenuItem>
              <MenuItem value={64}>64</MenuItem>
            </Select>

            <Select
              label="Font Style"
              style={{
                height: "40px",
              }}
              disabled={disabled}
              value={
                slide && slide[selectedItemType]
                  ? slide[selectedItemType].filter(
                      (text) => text.id === selectedItemId
                    )[0]?.fontStyle
                  : "normal"
              }
              onChange={(e) => {
                // update preview
                const textarea = document.getElementById("slidesTextBox");
                textarea.style.fontStyle = e.target.value;
                // update actual
                dispatch({
                  type: "slides",
                  payload: state.slides.map((slide) => {
                    if (slide.id === state.currentSlideId) {
                      slide.texts = slide.texts.map((t) => {
                        if (t.id === selectedItemId) {
                          t.fontStyle = e.target.value;
                        }
                        return t;
                      });
                    }
                    return slide;
                  }),
                });
              }}
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="italic">Italic</MenuItem>
              <MenuItem value="bold">Bold</MenuItem>
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

            <Select
              label="Align"
              style={{
                height: "40px",
              }}
              disabled={disabled}
              value={
                slide && slide[selectedItemType]
                  ? slide[selectedItemType].filter(
                      (text) => text.id === selectedItemId
                    )[0]?.align
                  : "left"
              }
              onChange={(e) => {
                // update preview
                const textarea = document.getElementById("slidesTextBox");
                textarea.style.textAlign = e.target.value;
                // update actual
                dispatch({
                  type: "slides",
                  payload: state.slides.map((slide) => {
                    if (slide.id === state.currentSlideId) {
                      slide.texts = slide.texts.map((t) => {
                        if (t.id === selectedItemId) {
                          t.align = e.target.value;
                        }
                        return t;
                      });
                    }
                    return slide;
                  }),
                });
              }}
            >
              <MenuItem value="left">Left</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="right">Right</MenuItem>
            </Select>

            <MuiColorInput
              sx={{
                height: "40px",
                "& .MuiInputBase-root": {
                  height: "40px",
                  width: "200px",
                },
              }}
              value={
                slide && slide[selectedItemType]
                  ? slide[selectedItemType].filter(
                      (text) => text.id === selectedItemId
                    )[0]?.fill
                  : "black"
              }
              onChange={(color) => {
                console.info("color onChange", color);
                // update preview
                const textarea = document.getElementById("slidesTextBox");
                textarea.style.color = color;
                // update actual
                dispatch({
                  type: "slides",
                  payload: state.slides.map((slide) => {
                    if (slide.id === state.currentSlideId) {
                      slide.texts = slide.texts.map((t) => {
                        if (t.id === selectedItemId) {
                          t.fill = color;
                        }
                        return t;
                      });
                    }
                    return slide;
                  }),
                });
              }}
            />

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
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                const text = slide.texts.filter(
                  (text) => text.id === selectedItemId
                )[0];
                const textarea = document.getElementById("slidesTextBox");
                textarea.parentNode.removeChild(textarea);
                textNodeRefs.current[selectedItemIndex].current.show();

                dispatch({
                  type: "slides",
                  payload: state.slides.map((slide) => {
                    if (slide.id === state.currentSlideId) {
                      slide.texts = slide.texts.filter(
                        (text) => text.id !== selectedItemId
                      );
                    }
                    return slide;
                  }),
                });

                setSelectedItemId(null);
                setSelectedItemType(null);
                setSelectedItemX(null);
                setSelectedItemY(null);
              }}
            >
              <Delete />
            </Button>
          </ToolbarWrapper>
        )}
        {selectedItemType === "shapes" && (
          <ToolbarWrapper
            ref={shapeToolbarRef}
            style={{
              position: "absolute",
              top: selectedItemY - 75,
              left: selectedItemX,
              zIndex: 10,
              display: !selectedItemY && !selectedItemX ? "none" : "block",
              boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.15)",
            }}
          >
            <MuiColorInput
              sx={{
                height: "40px",
                "& .MuiInputBase-root": {
                  height: "40px",
                  width: "200px",
                },
              }}
              value={
                slide && slide[selectedItemType]
                  ? slide[selectedItemType].filter(
                      (shape) => shape.id === selectedItemId
                    )[0]?.fill
                  : "black"
              }
              onChange={(color) => {
                console.info("color onChange", color);
                // update actual
                dispatch({
                  type: "slides",
                  payload: state.slides.map((slide) => {
                    if (slide.id === state.currentSlideId) {
                      slide.shapes = slide.shapes.map((t) => {
                        if (t.id === selectedItemId) {
                          t.fill = color;
                        }
                        return t;
                      });
                    }
                    return slide;
                  }),
                });
              }}
            />

            <Button
              color="success"
              variant="contained"
              onClick={() => {
                setSelectedItemId(null);
                setSelectedItemType(null);
                setSelectedItemX(null);
                setSelectedItemY(null);
              }}
            >
              <Check />
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                const shape = slide.shapes.filter(
                  (shape) => shape.id === selectedItemId
                )[0];
                shapeNodeRefs.current[selectedItemIndex].current.show();

                dispatch({
                  type: "slides",
                  payload: state.slides.map((slide) => {
                    if (slide.id === state.currentSlideId) {
                      slide.shapes = slide.shapes.filter(
                        (shape) => shape.id !== selectedItemId
                      );
                    }
                    return slide;
                  }),
                });

                setSelectedItemId(null);
                setSelectedItemType(null);
                setSelectedItemX(null);
                setSelectedItemY(null);
              }}
            >
              <Delete />
            </Button>
          </ToolbarWrapper>
        )}
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
                  textDecoration={text?.textDecoration ?? ""}
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
                      // window.removeEventListener("click", handleOutsideClick);
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
                    setActiveItemType("texts");
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
                {activeItemType === "texts" && activeItemId === text.id && (
                  <Transformer
                    ref={textNodeTransformerRefs.current[i]}
                    rotateEnabled={false}
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
          {slide?.shapes?.map((shape, i) => {
            let ShapeComponent = Rect;
            switch (shape.kind) {
              case "star":
                ShapeComponent = Star;
                break;
              case "circle":
                ShapeComponent = Circle;
                break;
              case "ellipse":
                ShapeComponent = Ellipse;
                break;
              case "rectangle":
                ShapeComponent = Rect;
                break;
              case "triangle":
                ShapeComponent = RegularPolygon;
                break;
              case "polygon":
                ShapeComponent = RegularPolygon;
                break;
              default:
                ShapeComponent = Rect;
                break;
            }

            return (
              <>
                <ShapeComponent
                  key={shape.id}
                  ref={shapeNodeRefs.current[i]}
                  x={shape.x ?? 0}
                  y={shape.y ?? 0}
                  width={shape.width ?? 100}
                  height={shape.height ?? 100}
                  sides={shape.sides ?? 4}
                  radius={shape.radius ?? 100}
                  fill={shape.fill ?? "black"}
                  draggable
                  onDragEnd={(e) => {
                    dispatch({
                      type: "slides",
                      payload: state.slides.map((slide) => {
                        if (slide.id === state.currentSlideId) {
                          slide.shapes = slide.shapes.map((s) => {
                            if (s.id === shape.id) {
                              s.x = e.target.x();
                              s.y = e.target.y();
                            }
                            return s;
                          });
                        }
                        return slide;
                      }),
                    });
                  }}
                  onDblClick={(e) => {
                    const textNodeRef = shapeNodeRefs.current[i].current;

                    setSelectedItemIndex(i);
                    setSelectedItemId(shape.id);
                    setSelectedItemType("shapes");

                    var textPosition = textNodeRef.absolutePosition();
                    var areaPosition = {
                      x:
                        stageRef.current.container().offsetLeft +
                        textPosition.x,
                      y:
                        stageRef.current.container().offsetTop + textPosition.y,
                    };

                    // move texttoolbar to this position
                    setSelectedItemX(areaPosition.x);
                    setSelectedItemY(areaPosition.y);
                  }}
                  onClick={(e) => {
                    setActiveItemType("shapes");
                    setActiveItemId(shape.id);
                  }}
                  onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = e.target;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);

                    dispatch({
                      type: "slides",
                      payload: state.slides.map((slide) => {
                        if (slide.id === state.currentSlideId) {
                          slide.shapes = slide.shapes.map((s) => {
                            if (s.id === shape.id) {
                              s.x = node.x();
                              s.y = node.y();
                              s.width = Math.max(5, node.width() * scaleX);
                              s.height = Math.max(node.height() * scaleY);
                              s.radius = Math.max(s.radius * scaleX);
                            }
                            return s;
                          });
                        }
                        return slide;
                      }),
                    });
                  }}
                />
                {activeItemType === "shapes" && activeItemId === shape.id && (
                  <Transformer
                    ref={shapeNodeTransformerRefs.current[i]}
                    rotateEnabled={false}
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
