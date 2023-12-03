"use client";
import "client-only";

import { useSlidesContext } from "@/context/SlidesContext";
import SlideEditor from "./SlideEditor";

export default function EditorWrapper() {
  const [state, dispatch] = useSlidesContext();

  const currentSlideData = state.slides.filter(
    (slide) => slide.id === state.currentSlideId
  )[0];

  return currentSlideData ? (
    <SlideEditor key={currentSlideData.id} slide={currentSlideData} />
  ) : (
    <></>
  );
}
