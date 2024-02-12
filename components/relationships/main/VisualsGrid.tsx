"use client";

import Dropdown from "@/components/core/fields/Dropdown";
import BarViz from "@/components/core/viz/BarViz";
import LineViz from "@/components/core/viz/LineViz";
import PieViz from "@/components/core/viz/PieViz";
import { useRelationshipsDashboardsContext } from "@/context/RelationshipsDashboardsContext";
import { Box, Grid } from "@mui/material";
import CreateVisual from "./CreateVisual";
import VisualItem from "./VisualItem";

export default function VisualsGrid() {
  const [state, dispatch] = useRelationshipsDashboardsContext();

  return (
    <>
      <Grid container spacing={3}>
        {state.visuals.map((viz, index) => {
          return (
            <Grid item xs={12} md={4} key={index}>
              <VisualItem viz={viz} />
            </Grid>
          );
        })}
        <Grid item xs={12} md={4}>
          <Box>
            <CreateVisual />
          </Box>
        </Grid>
      </Grid>
      {/* <Box display="flex" flexDirection="row">
      <BarViz
        analysisData={[
          {
            label: "2019",
            value: 100,
          },
          {
            label: "2020",
            value: 200,
          },
          {
            label: "2021",
            value: 150,
          },
        ]}
      />
      <LineViz
        analysisData={[
          {
            date: "2019-01-01",
            value: 100,
          },
          {
            date: "2020-01-02",
            value: 200,
          },
          {
            date: "2021-01-03",
            value: 150,
          },
        ]}
      />
      <PieViz
        analysisData={[
          {
            label: "2019",
            value: 100,
          },
          {
            label: "2020",
            value: 200,
          },
          {
            label: "2021",
            value: 150,
          },
        ]}
      />
    </Box> */}
    </>
  );
}
