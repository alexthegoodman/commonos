import {
  createFileMutation,
  flowQuery,
  getFileListQuery,
  getGuideQuestionsQuery,
  getQuestionsQuery,
  getRevisedContentQuery,
  myFlowsQuery,
  newFlowMutation,
  updateFlowMutation,
  //   updateFlowMutation,
} from "../gql/flow";
import graphClient from "../helpers/GQLClient";
import MicroModal from "micromodal"; // es6 module

const handleTokenUsageError = (e: any) => {
  const tokenLimitReached = e.message.includes("Token usage limit reached");
  if (tokenLimitReached) {
    MicroModal.show("tokenLimitReached");
  }
};

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

export const updateFlow = async (
  token: string,
  flowId: string,
  whichContext: string,
  context: string
) => {
  graphClient.setupClient(token);

  const variables: any = {
    flowId,
  };

  if (whichContext === "questions") {
    variables.questionsContext = context;
  }
  if (whichContext === "results") {
    variables.resultsContext = context;
  }

  const { updateFlow } = (await graphClient.client?.request(
    updateFlowMutation,
    variables
  )) as any;

  return updateFlow;
};

var callingFileList = false;
export const getFileListData = async (
  token: string,
  flowId: string,
  getThis: string
) => {
  try {
    graphClient.setupClient(token);

    if (callingFileList) {
      return null;
    }

    callingFileList = true;

    console.info("calling getFileListData", flowId);

    const { getFileList } = (await graphClient.client?.request(
      getFileListQuery,
      {
        flowId,
        getThis,
      }
    )) as any;

    callingFileList = false;

    return getFileList;
  } catch (e) {
    console.error(e);
    handleTokenUsageError(e);
  }
};

var callingQuestions = false;
export const getQuestionsData = async (
  token: string,
  flowId: string,
  fileApp: string,
  fileTitle: string,
  getThis: string
) => {
  try {
    graphClient.setupClient(token);

    if (callingQuestions) {
      return null;
    }

    callingQuestions = true;

    console.info("calling getQuestionsData", fileTitle);

    const { getQuestions } = (await graphClient.client?.request(
      getQuestionsQuery,
      {
        flowId,
        fileApp,
        fileTitle,
        getThis,
      }
    )) as any;

    callingQuestions = false;

    return getQuestions;
  } catch (e) {
    console.error(e);
    handleTokenUsageError(e);
  }
};

export const createFile = async (
  token: string,
  prompt: string,
  flowId: string,
  fileId: string
) => {
  try {
    graphClient.setupClient(token);

    const variables: any = {
      prompt,
      flowId,
      fileId,
    };

    const { createFile } = (await graphClient.client?.request(
      createFileMutation,
      variables
    )) as any;

    return createFile;
  } catch (e) {
    console.error(e);
    handleTokenUsageError(e);
  }
};

export const getGuideQuestionsData = async (
  token: string,
  fileApp: string,
  fileTitle: string,
  sectionContent: any
) => {
  try {
    graphClient.setupClient(token);

    const { getGuideQuestions } = (await graphClient.client?.request(
      getGuideQuestionsQuery,
      {
        fileApp,
        fileTitle,
        sectionContent: JSON.stringify(sectionContent),
      }
    )) as any;

    return getGuideQuestions;
  } catch (e) {
    console.error(e);
    handleTokenUsageError(e);
  }
};

export const getRevisedContentData = async (
  token: string,
  fileApp: string,
  fileTitle: string,
  sectionContent: any,
  sectionQuestions: any
) => {
  try {
    graphClient.setupClient(token);

    const { getRevisedContent } = (await graphClient.client?.request(
      getRevisedContentQuery,
      {
        fileApp,
        fileTitle,
        sectionContent: JSON.stringify(sectionContent),
        sectionQuestions: JSON.stringify(sectionQuestions),
      }
    )) as any;

    return getRevisedContent;
  } catch (e) {
    console.error(e);
    handleTokenUsageError(e);
  }
};
