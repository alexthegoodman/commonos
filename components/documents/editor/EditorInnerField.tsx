"use client";
import "client-only";

import * as React from "react";

import "react-quill/dist/quill.snow.css";

import { useDocumentsContext } from "../../../context/DocumentsContext";
import EditorHeader from "./EditorHeader";
import { Box, styled } from "@mui/material";

const CustomToolbar = () => (
  <div id="toolbar">
    <button className={`ql-header`} value="1">
      h
    </button>
    <button className={`ql-bold`}>b</button>
    <button className={`ql-italic`}>i</button>
    <button className={`ql-list`} value="ordered">
      li
    </button>
    <button className={`ql-list`} value="bullet">
      bl
    </button>
    <button className={`ql-link`} value="button">
      link
    </button>
  </div>
);

const formats = [
  // 'background',
  "bold",
  "color",
  "font",
  "code",
  "italic",
  "link",
  "size",
  "strike",
  "script",
  "underline",
  "blockquote",
  "header",
  "indent",
  "list",
  "align",
  "direction",
  "code-block",
  "formula",
  // 'image' // disallowed
  // 'video' // disallowed
];

const QuillWrapper = styled(Box)(({ theme }) => ({
  ".ql-toolbar": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 10px",
    backgroundColor: theme.palette.background.default,
    borderBottom: "1px solid " + theme.palette.divider,
    zIndex: 1,
  },
  ".ql-container": {
    height: "calc(100vh - 200px)",
    overflow: "auto",
    padding: "10px",
    backgroundColor: theme.palette.background.paper,
    borderBottom: "1px solid " + theme.palette.divider,
    zIndex: 1,
  },
  ".ql-editor": {
    minHeight: "calc(100vh - 200px)",
    padding: "10px",
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
  },
}));

const EditorInnerField = ({
  Quill = null,
  ReactQuill = null,
  documentId = "",
  documentData = null,
  refetch = () => console.info("refetch"),
}) => {
  // console.info("Quill", Quill.default);
  var icons = Quill.default.import("ui/icons");
  // console.info("icons", icons);
  icons["bold"] = `<i class="ph-text-bolder-thin"></i>`;
  icons["italic"] = `<i class="ph-text-italic-thin"></i>`;
  icons["header"] = `<i class="ph-text-h-one-thin"></i>`;
  icons["list"]["bullet"] = `<i class="ph-list-bullets-thin"></i>`;
  icons["list"]["ordered"] = `<i class="ph-list-numbers-thin"></i>`;
  icons["link"] = `<i class="ph-link-thin"></i>`;

  const recentTextLength = 35;

  const editorRef = React.useRef<any>();

  const [{ editorPlaintext, focusModeEnabled }, dispatch] =
    useDocumentsContext();

  const totalWords = editorPlaintext
    ? editorPlaintext.match(/(\w+)/g)?.length
    : 0;

  const onFieldChange = (html: any, delta: any, x: any, instance: any) => {
    console.info("field change", html, delta, instance.getSelection());

    const selectionData = instance.getSelection();

    if (selectionData) {
      const plaintext = html.replace(/<(.|\n)*?>/g, "");

      const recentText = instance.getText(
        selectionData.index - recentTextLength,
        recentTextLength
      );

      dispatch({ type: "editorValue", payload: html });
      dispatch({ type: "editorJson", payload: instance.getContents() });
      dispatch({ type: "editorPlaintext", payload: plaintext });
      dispatch({
        type: "editorRecentText",
        payload: recentText,
      });

      // refetch(); // need to refetch after doc update, not on field change
    }
  };

  React.useEffect(() => {
    console.info("editorRef", editorRef.current);
    if (typeof editorRef.current !== "undefined") {
      const elem = editorRef.current as any;
      const quill = elem.getEditor();

      // elem.focus();

      // quill.on("text-change", function (delta, oldDelta, source) {
      //   console.info("text change", delta, oldDelta, source);
      // });

      quill.on("selection-change", function (range, oldRange, source) {
        if (range) {
          if (range.length === 0) {
            const recentText = quill.getText(
              range.index - recentTextLength,
              recentTextLength
            );

            console.log("User cursor is on", range.index, recentText);

            dispatch({ type: "editorRecentText", payload: recentText });
          } else {
            // var text = quill.getText(range.index, range.length);
            // console.log('User has highlighted', text);
          }
        } else {
          // console.log('Cursor not in the editor');
        }
      });

      return () => {
        quill.off("selection-change");
      };
    }
  }, [editorRef.current]);

  React.useEffect(() => {
    console.info("documentData?.content", documentData?.content);
  }, [documentData?.content]);

  return (
    <>
      <section>
        <div>
          <section>
            <EditorHeader
              documentId={documentId}
              documentData={documentData}
              refetchDocument={refetch}
            />
          </section>

          <section>
            <CustomToolbar />
            <div>
              <span>{totalWords} Words</span>
              <span>{editorPlaintext.length} Characters</span>
            </div>
          </section>

          <QuillWrapper>
            <ReactQuill.default
              ref={editorRef}
              theme="snow"
              onChange={onFieldChange}
              modules={{
                toolbar: {
                  container: "#toolbar",
                },
              }}
              placeholder="Begin typing here..."
              defaultValue={documentData?.content}
              formats={formats}
            />
          </QuillWrapper>
        </div>
      </section>
    </>
  );
};

export default EditorInnerField;
