"use client";
import "client-only";

import * as React from "react";

import EditorInnerField from "./EditorInnerField";
import { CircularProgress } from "@mui/material";
import AutoSidebar from "./AutoSidebar";
import PrimaryLoader from "@/components/core/layout/PrimaryLoader";

const EditorField = ({
  documentId = "",
  documentData = null,
  refetch = () => console.info("refetch"),
}) => {
  const [Quill, setQuill] = React.useState<any>(null);
  const [ReactQuill, setReactQuill] = React.useState<any>(null);

  const loadQuillJs = async () => {
    const quill = await import("quill");
    const reactQuill = await import("react-quill");
    setQuill(quill);
    setReactQuill(reactQuill);
  };

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      loadQuillJs();
    }
  }, []);

  return (
    <section>
      <div>
        {ReactQuill ? (
          <>
            <EditorInnerField
              documentId={documentId}
              documentData={documentData}
              refetch={refetch}
              Quill={Quill}
              ReactQuill={ReactQuill}
            />
            {/* <AutoSidebar documentId={documentId} documentData={documentData} /> */}
          </>
        ) : (
          <PrimaryLoader />
        )}
      </div>
    </section>
  );
};

export default EditorField;
