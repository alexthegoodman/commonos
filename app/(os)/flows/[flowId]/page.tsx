"use client";

import InnerLayout from "@/components/core/flows/InnerLayout";
import PrimaryLoader from "@/components/core/layout/PrimaryLoader";
import { FlowQuestionsContextState } from "@/context/FlowQuestionsContext";
import { getFlowData } from "@/fetchers/flow";
import { CircularProgress } from "@mui/material";
import { useCookies } from "react-cookie";
import useSWR from "swr";

export default function Flow(props) {
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

  return !isLoading ? (
    <>
      {flowData && flowData.questionsContext ? (
        <InnerLayout
          flowId={flowId}
          prompt={flowData.prompt}
          context={flowData.questionsContext}
        />
      ) : (
        <InnerLayout
          flowId={flowId}
          prompt={flowData.prompt}
          context={FlowQuestionsContextState}
        />
      )}
    </>
  ) : (
    <PrimaryLoader />
  );
}
