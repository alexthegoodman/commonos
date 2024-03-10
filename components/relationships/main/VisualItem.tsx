"use client";

import BarViz from "@/components/core/viz/BarViz";
import LineViz from "@/components/core/viz/LineViz";
import PieViz from "@/components/core/viz/PieViz";
import { useRelationshipsDashboardsContext } from "@/context/RelationshipsDashboardsContext";
import {
  getCompanySettings,
  getContactSettings,
  getVisualData,
} from "@/fetchers/relationship";
import { Close } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import { useCookies } from "react-cookie";
import useSWR from "swr";

const VisualCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
}));

export default function VisualItem({ viz }) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useRelationshipsDashboardsContext();

  const { data: visualData } = useSWR(
    "visual" + viz.id,
    () => getVisualData(token, viz.item, viz.field),
    {
      revalidateOnMount: true,
    }
  );

  const { data: companySettingsData } = useSWR(
    "companySettingsKey",
    () => getCompanySettings(token),
    {
      revalidateOnMount: true,
    }
  );

  const { data: contactSettingsData } = useSWR(
    "contactSettingsKey",
    () => getContactSettings(token),
    {
      revalidateOnMount: true,
    }
  );

  console.log("visualData", visualData);

  let vizTitle = "";

  if (viz.item === "companies") {
    const companyField = companySettingsData?.fields.find(
      (field) => field.id === viz.field
    );
    vizTitle = companyField?.name;
  } else if (viz.item === "contacts") {
    const contactField = contactSettingsData?.fields.find(
      (field) => field.id === viz.field
    );
    vizTitle = contactField?.name;
  }

  return (
    <>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h6">{vizTitle}</Typography>
        <IconButton
          onClick={() => {
            dispatch({
              type: "visuals",
              payload: state.visuals.filter((visual) => visual.id !== viz.id),
            });
          }}
          sx={{
            opacity: 0.5,
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <Close />
        </IconButton>
      </Box>

      <VisualCard>
        <CardContent sx={{ display: "flex", justifyContent: "center" }}>
          {viz.type === "bar" &&
            typeof visualData !== "undefined" &&
            visualData.length > 0 && <BarViz analysisData={visualData} />}
          {viz.type === "line" &&
            typeof visualData !== "undefined" &&
            visualData.length > 0 && <LineViz analysisData={visualData} />}
          {viz.type === "pie" &&
            typeof visualData !== "undefined" &&
            visualData.length > 0 && <PieViz analysisData={visualData} />}
          {typeof visualData !== "undefined" && visualData.length === 0 && (
            <Typography sx={{ color: "black" }}>No data available</Typography>
          )}
        </CardContent>
      </VisualCard>
    </>
  );
}
