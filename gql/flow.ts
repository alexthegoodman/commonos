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
