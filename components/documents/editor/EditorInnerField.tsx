"use client";
import "client-only";

import * as React from "react";

import "react-quill/dist/quill.snow.css";

import { useDocumentsContext } from "../../../context/DocumentsContext";
import EditorHeader from "./EditorHeader";
import { Box, Typography, styled } from "@mui/material";
var showdown = require("showdown"),
  converter = new showdown.Converter({
    disableForced4SpacesIndentedSublists: true,
  });

// const CustomToolbar = () => (
//   <div id="toolbar">
//     <button className={`ql-toolbar-option ql-header`} value="1"></button>
//     <button className={`ql-toolbar-option ql-bold`}></button>
//     <button className={`ql-toolbar-option ql-italic`}></button>
//     <button className={`ql-toolbar-option ql-list`} value="ordered"></button>
//     <button className={`ql-toolbar-option ql-list`} value="bullet"></button>
//     <button className={`ql-toolbar-option ql-link`} value="button"></button>
//   </div>
// );

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
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "10px",
    // backgroundColor: theme.palette.background.default,
    backgroundColor: "white",
    borderBottom: "1px solid " + theme.palette.divider,
    zIndex: 1,
  },
  ".ql-container": {
    minHeight: "calc(100vh - 200px)",
    height: "auto",
    overflow: "auto",
    padding: "10px",
    // backgroundColor: theme.palette.background.paper,
    backgroundColor: "white",
    borderBottom: "1px solid " + theme.palette.divider,
    zIndex: 1,
  },
  ".ql-editor": {
    minHeight: "calc(100vh - 200px)",
    height: "auto",
    padding: "10px",
    // backgroundColor: theme.palette.background.paper,
    color: "black",
    fontSize: "1rem",
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
  icons["bold"] = `<i class="ph ph-text-bolder-thin"></i>`;
  icons["italic"] = `<i class="ph ph-text-italic-thin"></i>`;
  icons["header"] = `<i class="ph ph-text-h-one-thin"></i>`;
  icons["list"]["bullet"] = `<i class="ph ph-list-bullets-thin"></i>`;
  icons["list"]["ordered"] = `<i class="ph ph-list-numbers-thin"></i>`;
  icons["link"] = `<i class="ph ph-link-thin"></i>`;
  icons["blockquote"] = `<i class="ph ph-text-quotes-left-thin"></i>`;
  icons["code-block"] = `<i class="ph ph-code-thin"></i>`;
  icons["strike"] = `<i class="ph ph-text-strikethrough-thin"></i>`;
  icons["underline"] = `<i class="ph ph-text-underline-thin"></i>`;
  icons["indent"]["-1"] = `<i class="ph ph-text-outdent-thin"></i>`;
  icons["indent"]["+1"] = `<i class="ph ph-text-indent-thin"></i>`;

  const recentTextLength = 35;

  const editorRef = React.useRef<any>();

  const [
    { editorPlaintext, revisedPlaintext, focusModeEnabled, messages },
    dispatch,
  ] = useDocumentsContext();

  const [textLoaded, setTextLoaded] = React.useState(false);

  const totalWords = editorPlaintext
    ? editorPlaintext.match(/(\w+)/g)?.length
    : 0;

  const onFieldChange = (html: any, delta: any, x: any, instance: any) => {
    // console.info("field change", html, delta, instance.getSelection());

    const selectionData = instance.getSelection();

    if (selectionData) {
      // const plaintext = html.replace(/<(.|\n)*?>/g, "");
      const plaintext = instance.getText();

      const markdown = converter.makeMarkdown(html);

      const elem = editorRef.current as any;
      const quill = elem.getEditor();

      console.info("markdown", html, markdown, quill.root.innerHTML);

      dispatch({ type: "editorHtml", payload: html });
      dispatch({ type: "editorJson", payload: instance.getContents() });
      dispatch({ type: "editorPlaintext", payload: plaintext });
      dispatch({ type: "editorMarkdown", payload: markdown });
      // dispatch({
      //   type: "editorRecentText",
      //   payload: recentText,
      // });

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

            // dispatch({ type: "editorRecentText", payload: recentText });
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
    if (typeof editorRef.current !== "undefined") {
      setTextLoaded(true);
      if (!textLoaded) {
        console.info(
          "load documentData?.plaintext",
          documentData?.content,
          documentData?.plaintext
        );
        if (documentData?.plaintext && !documentData?.content) {
          // dispatch({ type: "editorPlaintext", payload: documentData?.plaintext });
          const elem = editorRef.current as any;
          const quill = elem.getEditor();

          quill.setText(documentData?.plaintext);

          dispatch({ type: "editorHtml", payload: quill.root.innerHTML });
          dispatch({ type: "editorJson", payload: quill.getContents() });
          dispatch({
            type: "editorPlaintext",
            payload: documentData?.plaintext,
          });
        }
        if (documentData?.content) {
          const elem = editorRef.current as any;
          const quill = elem.getEditor();

          quill.setContents(documentData?.content);

          dispatch({ type: "editorHtml", payload: quill.root.innerHTML });
          dispatch({ type: "editorJson", payload: quill.getContents() });
          dispatch({
            type: "editorPlaintext",
            payload: documentData?.plaintext,
          });
        }
      }
    }
  }, [documentData?.plaintext]);

  React.useEffect(() => {
    if (documentData?.messages && !messages) {
      dispatch({
        type: "messages",
        payload: documentData.messages,
      });
    }
  }, [documentData?.messages]);

  React.useEffect(() => {
    if (revisedPlaintext) {
      console.info("set revisedPlaintext...", revisedPlaintext);
      const elem = editorRef.current as any;
      const quill = elem.getEditor();

      quill.setText(revisedPlaintext);

      dispatch({ type: "editorJson", payload: quill.getContents() });
      dispatch({
        type: "editorPlaintext",
        payload: revisedPlaintext,
      });
    }
  }, [revisedPlaintext]);

  return (
    <>
      <section>
        <div>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <EditorHeader
              documentId={documentId}
              documentData={documentData}
              refetchDocument={refetch}
            />
            <Box
              display="flex"
              flexDirection="row"
              gap={2}
              justifyContent="flex-end"
            >
              <Typography variant="body1">{totalWords} Words</Typography>
              <Typography variant="body1">
                {editorPlaintext?.length} Characters
              </Typography>
            </Box>
          </Box>

          <QuillWrapper>
            <ReactQuill.default
              ref={editorRef}
              theme="snow"
              onChange={onFieldChange}
              modules={{
                toolbar: [
                  [{ header: 1 }],
                  ["bold", "italic", "underline", "strike"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link"],
                ],
              }}
              placeholder="Begin typing here..."
              formats={formats}
            />
          </QuillWrapper>
        </div>
      </section>
      <style jsx global>{`
        .ph {
          font-size: 1.5rem;
          color: black;
          padding: 0 !important;
          position: relative;
          top: -2px;
          left: -2px;

          &:hover {
            color: #38ef7d !important;
          }
        }
      `}</style>
    </>
  );
};

export default EditorInnerField;
