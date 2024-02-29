"use client";

import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import { getFlowData, getFlowsData } from "@/fetchers/flow";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Link,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import useSWR from "swr";

const { DateTime } = require("luxon");

export default function Flows(props) {
  const { params } = props;
  const flowId = params.flowId;

  const router = useRouter();
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: flowData,
    error,
    isLoading,
    mutate,
  } = useSWR("flowHistoryKey", () => getFlowsData(token), {
    revalidateOnMount: true,
  });

  return !isLoading ? (
    <>
      <Box>
        <Typography variant="h3">Flow History</Typography>
        {flowData.map((flow) => {
          const formatedDate = DateTime.fromISO(flow?.createdAt).toLocaleString(
            DateTime.DATE_MED
          );

          return (
            <Card key={flow.id} sx={{ marginBottom: 3 }}>
              <CardActionArea
                onClick={() => {
                  router.push(`/flows/${flow.id}`);
                }}
              >
                <CardContent>
                  <Typography variant="body1" mb={1}>
                    {flow.prompt}
                  </Typography>
                  <Typography variant="body2">{formatedDate}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>
    </>
  ) : (
    <PrimaryLoader />
  );
}
