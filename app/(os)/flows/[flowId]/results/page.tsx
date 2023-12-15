"use client";

import InnerResults from "@/components/core/flows/InnerResults";
import { getFlowData } from "@/fetchers/flow";
import { AutoAwesome } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  styled,
} from "@mui/material";
import { useCookies } from "react-cookie";
import useSWR from "swr";

enum Status {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export default function FlowResults(props) {
  const { params } = props;
  const flowId = params.flowId;
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const {
    data: flowData,
    error,
    isLoading,
    mutate,
  } = useSWR("flowKey" + flowId, () => getFlowData(token, flowId), {
    revalidateOnMount: true,
  });

  let context = flowData?.resultsContext;
  if (!context && flowData?.questionsContext) {
    context = {
      files: flowData.questionsContext.files.map((file) => {
        return {
          id: file.id,
          name: file.name,
          app: file.app,
          status: Status.PENDING,
        };
      }),
    };
  }

  return !isLoading && context ? (
    <InnerResults flowId={flowId} prompt={flowData.prompt} context={context} />
  ) : (
    <CircularProgress />
  );
}
