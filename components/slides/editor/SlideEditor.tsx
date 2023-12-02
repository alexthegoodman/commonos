"use client";
import "client-only";

import { useSlidesContext } from "@/context/SlidesContext";
import { useState } from "react";
import { Stage, Layer, Star, Text, Rect } from "react-konva";
import { useWindowSize } from "@/hooks/useWindowSize";

export default function SlideEditor() {
  const windowSize = useWindowSize();
  const [state, dispatch] = useSlidesContext();

  const stageWidth =
    windowSize.width && windowSize.width < 1400 ? windowSize.width - 400 : 1000;
  const stageHeight = stageWidth * 0.65;

  return (
    <Stage width={stageWidth} height={stageHeight}>
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
        <Text text="Your Presentation Title" fontSize={24} x={350} y={300} />
      </Layer>
    </Stage>
  );
}
