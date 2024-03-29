"use client";

import { Box } from "@mui/material";
import { useReducer, useState } from "react";
// import Autosaver from "./Autosaver";
// import EditorHeader from "./EditorHeader";
import Kanban from "../main/Kanban";
import {
  RelationshipsFunnelsContext,
  RelationshipsFunnelsContextReducer,
} from "@/context/RelationshipsFunnelsContext";
import Autosaver from "./Autosaver";
import EditorHeader from "./EditorHeader";

export default function InnerLayout({ funnelId, funnelData }) {
  const [title, setTitle] = useState(funnelData.title);

  return (
    <RelationshipsFunnelsContext.Provider
      value={useReducer(RelationshipsFunnelsContextReducer, funnelData.context)}
    >
      <Autosaver id={funnelId} title={title} />
      <EditorHeader title={title} setTitle={setTitle} />
      <Box>
        <Kanban kanbanId={funnelId} />
      </Box>
    </RelationshipsFunnelsContext.Provider>
  );
}
