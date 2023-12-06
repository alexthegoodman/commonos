import {
  flowQuery,
  getFileListQuery,
  myFlowsQuery,
  newFlowMutation,
  //   updateFlowMutation,
} from "../gql/flow";
import graphClient from "../helpers/GQLClient";

export const getFlowData = async (token: string, flowId: string) => {
  graphClient.setupClient(token);

  const { flow } = (await graphClient.client?.request(flowQuery, {
    flowId,
  })) as any;

  return flow;
};

export const getFlowsData = async (token: string) => {
  graphClient.setupClient(token);

  const { myFlows } = (await graphClient.client?.request(myFlowsQuery)) as any;

  return myFlows;
};

export const newFlow = async (
  token: string,
  prompt: string,
  typeCode: string
) => {
  graphClient.setupClient(token);

  const { createFlow } = (await graphClient.client?.request(newFlowMutation, {
    prompt,
    typeCode,
  })) as any;

  return createFlow;
};

// export const updateFlow = async (
//   token: string,
//   flowId: string,
//   title: string,
//   context: string
// ) => {
//   graphClient.setupClient(token);

//   const { updateFlow } = (await graphClient.client?.request(
//     updateFlowMutation,
//     {
//       flowId,
//       title,
//       context,
//     }
//   )) as any;

//   return updateFlow;
// };

var callingFileList = false;
export const getFileListData = async (token: string, flowId: string) => {
  graphClient.setupClient(token);

  if (callingFileList) {
    return null;
  }

  callingFileList = true;

  console.info("calling getFileListData", flowId);

  const { getFileList } = (await graphClient.client?.request(getFileListQuery, {
    flowId,
  })) as any;

  callingFileList = false;

  return getFileList;
};
