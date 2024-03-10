"use client";

import { Box } from "@mui/material";
import { useReducer, useState } from "react";
// import Autosaver from "./Autosaver";
// import EditorHeader from "./EditorHeader";
import Kanban from "../main/Kanban";
import {
  RelationshipsDashboardsContext,
  RelationshipsDashboardsContextReducer,
} from "@/context/RelationshipsDashboardsContext";
import Autosaver from "./Autosaver";
import EditorHeader from "./EditorHeader";
import VisualsGrid from "../main/VisualsGrid";

export default function InnerLayout({ dashboardId, dashboardData }) {
  const [title, setTitle] = useState(dashboardData.title);

  return (
    <RelationshipsDashboardsContext.Provider
      value={useReducer(
        RelationshipsDashboardsContextReducer,
        dashboardData.context
      )}
    >
      <Autosaver id={dashboardId} title={title} />
      <EditorHeader title={title} setTitle={setTitle} />
      <Box>
        <VisualsGrid />
      </Box>
    </RelationshipsDashboardsContext.Provider>
  );
}
