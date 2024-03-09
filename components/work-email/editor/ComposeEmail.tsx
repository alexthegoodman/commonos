"use client";

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
import React, { useRef } from "react";
import LexicalTheme from "@/components/documents/lexical/LexicalTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import ToolbarPlugin from "@/components/documents/lexical/ToolbarPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import CodeHighlightPlugin from "@/components/documents/lexical/CodeHighlightPlugin";
import PlaygroundAutoLinkPlugin from "@/components/documents/lexical/AutoLinkPlugin";
import ListMaxIndentLevelPlugin from "@/components/documents/lexical/ListMaxIndentLevelPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { Typography } from "@mui/material";
import { $generateHtmlFromNodes } from "@lexical/html";
import { CLEAR_EDITOR_COMMAND } from "lexical";

function Placeholder() {
  // return <div className="editor-placeholder">Enter some text...</div>;
  return <></>;
}

export default function ComposeEmail({
  handleChange,
  clearEffect,
  initialMarkdown = "",
}) {
  const editorRef = useRef(null);

  const onChange = (delta) => {
    console.info("delta", delta);
    if (editorRef.current) {
      editorRef.current.update(() => {
        // const newMarkdown = $convertToMarkdownString(TRANSFORMERS);
        // // console.info("newMarkdown", newMarkdown);
        // dispatch({ type: "markdown", payload: newMarkdown });
        const newHtml = $generateHtmlFromNodes(editorRef.current, null);
        // console.info("newHtml", newHtml);
        handleChange(newHtml);
      });
    }
  };

  const editorConfig = {
    // The editor theme
    theme: LexicalTheme,
    editorState: () =>
      $convertFromMarkdownString(initialMarkdown, TRANSFORMERS),
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

  React.useEffect(() => {
    if (clearEffect) {
      console.info("clear editor");
      editorRef.current.update(() => {
        // editorRef.current.clear();
        editorRef.current.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      });
    }
  }, [clearEffect]);

  return (
    <>
      {/* <Typography variant="h6" gutterBottom>
        Compose Email
      </Typography> */}
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  style={{
                    backgroundColor: "white",
                    minHeight: "500px",
                    width: "100%",
                    padding: "5px 15px",
                    lineHeight: "1.35",
                    fontFamily: "proxima-nova",
                  }}
                  className="editor-input"
                />
              }
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            {/* <TreeViewPlugin /> */}
            <ClearEditorPlugin />
            <AutoFocusPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <LinkPlugin />
            <PlaygroundAutoLinkPlugin />
            <TabIndentationPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <EditorRefPlugin editorRef={editorRef} />
            <OnChangePlugin onChange={onChange} />
          </div>
        </div>
      </LexicalComposer>
      <style jsx global>{`
        .editor-inner {
          position: relative;
        }
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
        .editor-placeholder {
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 100;
        }
      `}</style>
    </>
  );
}
