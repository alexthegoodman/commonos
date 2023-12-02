"use client";
import "client-only";

import { Stage, Layer, Star, Text, Rect, Line } from "react-konva";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useDrawingsContext } from "@/context/DrawingsContext";
import { useRef, useState } from "react";
import Konva from "konva";
import { v4 as uuidv4 } from "uuid";

var lastLine = null;

export default function DrawingEditor() {
  const windowSize = useWindowSize();
  const [state, dispatch] = useDrawingsContext();

  console.info("state", state);

  const [mode, setMode] = useState("brush"); // brush or eraser
  const [isPainting, setIsPainting] = useState(false);

  const stageRef = useRef(null);
  const drawLayerRef = useRef(null);

  const stageWidth =
    windowSize.width && windowSize.width < 1400 ? windowSize.width - 400 : 1000;
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

  return (
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
      <Layer ref={drawLayerRef}>
        {state.lines?.map((line) => <Line key={line.id} {...line} />)}
      </Layer>
    </Stage>
  );
}
