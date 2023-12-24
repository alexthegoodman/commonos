"use client";

import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import { getFlowData, getFlowsData } from "@/fetchers/flow";
import { Box, CircularProgress, Link, Typography } from "@mui/material";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function Flows(props) {
  const { params } = props;
  const flowId = params.flowId;
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
          return (
            <Box key={flow.id} mb={3}>
              <Link href={`/flows/${flow.id}`}>
                <Typography variant="body2">{flow.prompt}</Typography>
                <Typography variant="body2">{flow.createdAt}</Typography>
              </Link>
            </Box>
          );
        })}
      </Box>
    </>
  ) : (
    <PrimaryLoader />
  );
}
