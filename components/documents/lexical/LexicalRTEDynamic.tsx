"use client";

import LexicalTheme from "./LexicalTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import TreeViewPlugin from "./TreeViewPlugin";
import ToolbarPlugin from "./ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import ListMaxIndentLevelPlugin from "./ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./CodeHighlightPlugin";
import AutoLinkPlugin from "./AutoLinkPlugin";
import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useDocumentsContext } from "@/context/DocumentsContext";
import EditorHeader from "../editor/EditorHeader";
import styled from "@emotion/styled";
import { pageCharacterCount } from "@/helpers/defs";

function Placeholder() {
  return <div className="editor-placeholder">Enter some text...</div>;
}

const OuterPaper = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  backgroundColor: "white",
  marginBottom: "25px",
}));

// see: https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/Editor.tsx

export default function LexicalRTEDynamic({
  pageId,
  completeMarkdown,
  markdown,
  dispatch,
}) {
  const editorRef = useRef(null);

  // // console.info("render LexicalRTE", markdown, plaintext);

  // useEffect(() => {
  //   if (revisedMarkdown) {
  //     console.info("revisedMarkdown", revisedMarkdown);
  //     editorRef.current.update(() => {
  //       $convertFromMarkdownString(revisedMarkdown, TRANSFORMERS);
  //     });

  //     dispatch({ type: "markdown", payload: revisedMarkdown });
  //   }
  // }, [revisedMarkdown]);

  useEffect(() => {
    if (markdown) {
      // update each editor when any completeMarkdown changes
      console.info("updated completeMarkdown", markdown);
      editorRef.current.update(() => {
        $convertFromMarkdownString(markdown, TRANSFORMERS);
      });
    }
  }, [completeMarkdown]);

  const onChange = (delta) => {
    console.info("delta", delta);
    if (editorRef.current) {
      editorRef.current.update(() => {
        const startingPoint = pageCharacterCount * (pageId - 1);

        const newSectionMarkdown = $convertToMarkdownString(TRANSFORMERS);

        // if (newSectionMarkdown.length > pageCharacterCount) {
        //   console.info("beyond edge of page");
        //   return;
        // }

        const newContent =
          completeMarkdown.slice(0, startingPoint) +
          newSectionMarkdown +
          completeMarkdown.slice(startingPoint + newSectionMarkdown.length);

        console.info("newContent", startingPoint, newContent);

        dispatch({ type: "markdown", payload: newContent });
      });
    }
  };

  // const initialMarkdwn = plaintext && !markdown ? plaintext : markdown;

  const editorConfig = {
    // The editor theme
    theme: LexicalTheme,
    editorState: () => $convertFromMarkdownString(markdown, TRANSFORMERS),
    // Handling of errors during update
    onError(error) {
      throw error;
    },
    // Any custom nodes go here
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  // const totalWords = markdown?.split(" ").length;

  const paperSize = {
    width: "8.3in",
    height: "11.7in",
  };

  const marginSize = {
    padding: "0.5in 1in",
  };

  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <OuterPaper sx={{ ...paperSize, ...marginSize }}>
                  <ContentEditable
                    style={{
                      boxSizing: "border-box",
                      backgroundColor: "white",
                      lineHeight: "1.35",
                    }}
                    className="editor-input"
                  />
                </OuterPaper>
              }
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            {/* <TreeViewPlugin /> */}
            <AutoFocusPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <LinkPlugin />
            <AutoLinkPlugin />
            <TabIndentationPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <EditorRefPlugin editorRef={editorRef} />
            <OnChangePlugin onChange={onChange} />
          </div>
        </div>
      </LexicalComposer>
      <style jsx global>{`
        .editor-nested-listitem {
          list-style: none;
        }
        .editor-text-strikethrough {
          text-decoration: line-through;
        }
        .editor-text-underline {
          text-decoration: underline;
        }
        .editor-heading-h1 {
          font-size: 1.5rem;
        }
        .editor-heading-h2 {
          font-size: 1.25rem;
        }
      `}</style>
    </>
  );
}
