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

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

// see: https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/Editor.tsx

export default function LexicalRTE({ documentId, documentData, refetch }) {
  const editorRef = useRef(null);

  const [{ markdown, revisedMarkdown, plaintext, messages }, dispatch] =
    useDocumentsContext();

  // console.info("render LexicalRTE", markdown, plaintext);

  useEffect(() => {
    if (revisedMarkdown) {
      console.info("revisedMarkdown", revisedMarkdown);
      editorRef.current.update(() => {
        $convertFromMarkdownString(revisedMarkdown, TRANSFORMERS);
      });

      dispatch({ type: "markdown", payload: revisedMarkdown });
    }
  }, [revisedMarkdown]);

  const onChange = (delta) => {
    console.info("delta", delta);
    if (editorRef.current) {
      editorRef.current.update(() => {
        const newMarkdown = $convertToMarkdownString(TRANSFORMERS);
        // console.info("newMarkdown", newMarkdown);
        dispatch({ type: "markdown", payload: newMarkdown });
      });
    }
  };

  const initialMarkdwn = plaintext && !markdown ? plaintext : markdown;

  const editorConfig = {
    // The editor theme
    theme: LexicalTheme,
    editorState: () => $convertFromMarkdownString(initialMarkdwn, TRANSFORMERS),
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

  const totalWords = markdown?.split(" ").length;

  return (
    <>
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
          <Typography variant="body1">{markdown?.length} Characters</Typography>
        </Box>
      </Box>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  style={{
                    backgroundColor: "white",
                    minHeight: "80vh",
                    padding: "5px 15px",
                    lineHeight: "1.35",
                  }}
                  className="editor-input"
                />
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
      `}</style>
    </>
  );
}
