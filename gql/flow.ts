import { gql } from "graphql-request";

export const newFlowMutation = gql`
  mutation NewFlowMutation($prompt: String!, $typeCode: String!) {
    createFlow(prompt: $prompt, typeCode: $typeCode) {
      id
    }
  }
`;

export const updateFlowMutation = gql`
  mutation UpdateFlow(
    $flowId: String!
    $questionsContext: String
    $resultsContext: String
  ) {
    updateFlow(
      flowId: $flowId
      questionsContext: $questionsContext
      resultsContext: $resultsContext
    ) {
      id
    }
  }
`;

export const myFlowsQuery = gql`
  query Flows {
    myFlows {
      id
      prompt

      updatedAt
      createdAt
    }
  }
`;

export const flowQuery = gql`
  query Flow($flowId: String!) {
    flow(flowId: $flowId) {
      id

      prompt
      type {
        name
        code
      }

      questionsContext
      resultsContext

      updatedAt
      createdAt
    }
  }
`;

export const getFileListQuery = gql`
  query getFileList($flowId: String!, $getThis: String!) {
    getFileList(flowId: $flowId, getThis: $getThis)
  }
`;

export const getQuestionsQuery = gql`
  query getQuestions(
    $flowId: String!
    $fileApp: String!
    $fileTitle: String!
    $getThis: String!
  ) {
    getQuestions(
      flowId: $flowId
      fileApp: $fileApp
      fileTitle: $fileTitle
      getThis: $getThis
    )
  }
`;

export const createFileMutation = gql`
  mutation createFile($prompt: String!, $flowId: String!, $fileId: String!) {
    createFile(prompt: $prompt, flowId: $flowId, fileId: $fileId)
  }
`;

export const getGuideQuestionsQuery = gql`
  query getGuideQuestions(
    $fileApp: String!
    $fileTitle: String!
    $sectionContent: String!
  ) {
    getGuideQuestions(
      fileApp: $fileApp
      fileTitle: $fileTitle
      sectionContent: $sectionContent
    )
  }
`;

export const getRevisedContentQuery = gql`
  query getRevisedContent(
    $fileApp: String!
    $fileTitle: String!
    $sectionContent: String!
    $sectionQuestions: String!
  ) {
    getRevisedContent(
      fileApp: $fileApp
      fileTitle: $fileTitle
      sectionContent: $sectionContent
      sectionQuestions: $sectionQuestions
    )
  }
`;
