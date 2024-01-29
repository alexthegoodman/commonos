"use client";

import BarViz from "@/components/core/viz/BarViz";
import LineViz from "@/components/core/viz/LineViz";
import PieViz from "@/components/core/viz/PieViz";
import { Box } from "@mui/material";

export default function Dashboard() {
  return (
    <Box display="flex" flexDirection="row">
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
    </Box>
  );
}
