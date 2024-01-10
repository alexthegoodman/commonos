"use client";
import "client-only";

import { useSlidesContext } from "@/context/SlidesContext";
import EmptyNotice from "@/components/core/layout/EmptyNotice";
import { useEffect } from "react";
import { DynamicEditor } from "./DynamicEditor";

export default function EditorWrapper({
  presentationId,
  exporting,
  setExporting,
  exportDoc,
  setExportDoc,
  slidesExported,
  setSlidesExported,
  title,
}) {
  const [state, dispatch] = useSlidesContext();

  const currentSlideData = state.slides.filter(
    (slide) => slide.id === state.currentSlideId
  )[0];

  useEffect(() => {
    if (exportDoc) {
      // captureNextSlide();
      setTimeout(() => {
        console.info("captured slide", slidesExported, state.slides.length);
        if (slidesExported === state.slides.length - 1) {
          setExporting(false);
          const santizedTitle = title.replace(/[^a-zA-Z0-9]/g, "");
          exportDoc.save(santizedTitle + ".pdf");
          return;
        }

        dispatch({
          type: "currentSlideId",
          payload: state.slides[slidesExported + 1]?.id ?? null,
        });
        setSlidesExported(slidesExported + 1);
      }, 1000);
    }
  }, [slidesExported]);

  return currentSlideData ? (
    <DynamicEditor
      key={currentSlideData.id}
      presentationId={presentationId}
      slide={currentSlideData}
      state={state}
      dispatch={dispatch}
      exporting={exporting}
      title={title}
      setExporting={setExporting}
      exportDoc={exportDoc}
      setExportDoc={setExportDoc}
      slidesExported={slidesExported}
      setSlidesExported={setSlidesExported}
    />
  ) : (
    <EmptyNotice message="Select a slide" />
  );
}
