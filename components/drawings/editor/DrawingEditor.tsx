"use client";
import "client-only";

import {
  Stage,
  Layer,
  Star,
  Text,
  Rect,
  Line,
  Image as KonvaImage,
} from "react-konva";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useDrawingsContext } from "@/context/DrawingsContext";
import { useRef, useState } from "react";
import Konva from "konva";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@mui/material";
import FormUpload from "@/components/core/fields/FormUpload";
import { FormProvider, useForm } from "react-hook-form";
import { simpleUpload } from "@/fetchers/drawing";
import { useCookies } from "react-cookie";

var lastLine = null;

export default function DrawingEditor() {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const windowSize = useWindowSize();
  const [state, dispatch] = useDrawingsContext();

  console.info("state", state);

  const [mode, setMode] = useState("brush"); // brush or eraser
  const [isPainting, setIsPainting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const stageRef = useRef(null);
  const drawLayerRef = useRef(null);

  const methods = useForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const stageWidth = 1000;
  const stageHeight = stageWidth;

  const startPaint = (e) => {
    setIsPainting(true);
    var pos = stageRef.current.getPointerPosition();
    lastLine = {
      id: uuidv4(),
      stroke: "#df4b26",
      strokeWidth: 5,
      globalCompositeOperation:
        mode === "brush" ? "source-over" : "destination-out",
      // round cap for smoother lines
      lineCap: "round",
      lineJoin: "round",
      // add point twice, so we have some drawings even on a simple click
      points: [pos.x, pos.y, pos.x, pos.y],
    };
    // drawLayerRef.current.add(lastLine);
    dispatch({
      type: "lines",
      payload: [...state.lines, lastLine],
    });
  };

  const endPaint = () => {
    setIsPainting(false);
  };

  const movePaint = (e) => {
    if (!isPainting) {
      return;
    }

    // prevent scrolling on touch devices
    e.evt.preventDefault();

    // const pos = stageRef.current.getPointerPosition();
    // var newPoints = lastLine.points().concat([pos.x, pos.y]);
    // lastLine.points(newPoints);

    var pos = stageRef.current.getPointerPosition();
    var newPoints = lastLine.points.concat([pos.x, pos.y]);
    lastLine.points = newPoints;

    const newLines = state.lines.map((line) => {
      if (line.id === lastLine.id) {
        return lastLine;
      }
      return line;
    });

    dispatch({
      type: "lines",
      payload: newLines,
    });
  };

  const onSubmit = async (formValues) => {
    console.info("formValues", formValues);
  };

  const onError = (error) => console.error(error);

  const onFinishUpload = async (file, base64) => {
    console.info("onFinishUpload file", file);
    setIsUploading(true);
    const blob = await simpleUpload(
      token,
      file.name,
      file.size,
      file.type,
      base64
    );

    var imageObj = new Image();
    imageObj.onload = function () {
      dispatch({
        type: "images",
        payload: [
          ...state.images,
          {
            id: uuidv4(),
            imageData: imageObj,
            x: 0,
            y: 0,
            width: stageWidth,
            height: stageHeight,
          },
        ],
      });

      setIsUploading(false);
      console.info("onFinishUpload blob", blob);
    };
    imageObj.src = blob.url;
  };

  return (
    <>
      <FormProvider {...methods}>
        <form className="form" onSubmit={handleSubmit(onSubmit, onError)}>
          <FormUpload
            name="file"
            placeholder={"Upload Image"}
            accept="image/*"
            aria-label="Upload Image"
            register={register}
            errors={errors}
            validation={{
              required: true,
            }}
            onFinishFile={onFinishUpload}
            disabled={isUploading}
          />
          {/* <Button type="submit">Add Image</Button> */}
        </form>
      </FormProvider>
      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        onMouseDown={startPaint}
        onTouchStart={startPaint}
        onMouseUp={endPaint}
        onTouchEnd={endPaint}
        onMouseMove={movePaint}
        onTouchMove={movePaint}
      >
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
          {state.images?.map((image) => (
            <KonvaImage
              key={image.id}
              image={image.imageData}
              x={image.x}
              y={image.y}
              width={image.width}
              height={image.height}
            />
          ))}
        </Layer>
        <Layer ref={drawLayerRef}>
          {state.lines?.map((line) => <Line key={line.id} {...line} />)}
        </Layer>
      </Stage>
    </>
  );
}
