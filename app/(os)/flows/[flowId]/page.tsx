"use client";

import InnerLayout from "@/components/core/flows/InnerLayout";
import { FlowQuestionsContextState } from "@/context/FlowQuestionsContext";
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
  } = useSWR("flowKey" + flowId, () => getDrawingData(token, flowId), {
    revalidateOnMount: true,
  });

  return !isLoading ? (
    <>
      {flowData && flowData.questionsContext ? (
        <InnerLayout flowId={flowId} context={flowData.questionsContext} />
      ) : (
        <InnerLayout flowId={flowId} context={FlowQuestionsContextState} />
      )}
    </>
  ) : (
    <CircularProgress />
  );
}
