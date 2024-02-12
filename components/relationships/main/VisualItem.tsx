"use client";

import BarViz from "@/components/core/viz/BarViz";
import LineViz from "@/components/core/viz/LineViz";
import PieViz from "@/components/core/viz/PieViz";
import { getVisualData } from "@/fetchers/relationship";
import { Box, Card, CardContent, styled } from "@mui/material";
import { useCookies } from "react-cookie";
import useSWR from "swr";

const VisualCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
}));

export default function VisualItem({ viz }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const { data: visualData } = useSWR(
    "visual" + viz.id,
    () => getVisualData(token, viz.item, viz.field),
    {
      revalidateOnMount: true,
    }
  );

  console.log("visualData", visualData);

  return (
    <VisualCard>
      <CardContent sx={{ display: "flex", justifyContent: "center" }}>
        {viz.type === "bar" && visualData && (
          <BarViz analysisData={visualData} />
        )}
        {viz.type === "line" && visualData && (
          <LineViz analysisData={visualData} />
        )}
        {viz.type === "pie" && visualData && (
          <PieViz analysisData={visualData} />
        )}
      </CardContent>
    </VisualCard>
  );
}
