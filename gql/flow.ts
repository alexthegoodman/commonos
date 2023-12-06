import { gql } from "graphql-request";

export const newFlowMutation = gql`
  mutation NewFlowMutation($prompt: String!, $typeCode: String!) {
    createFlow(prompt: $prompt, typeCode: $typeCode) {
      id
    }
  }
`;

export const updateFlowQuestionsMutation = gql`
  mutation UpdateFlow($flowId: String!, $questionsContext: String) {
    updateFlow(flowId: $flowId, questionsContext: $questionsContext) {
      id
    }
  }
`;

export const myFlowsQuery = gql`
  query Flows {
    myFlows {
      id

      creator {
        email
        role
      }

      updatedAt
      createdAt
    }
  }
`;

export const flowQuery = gql`
  query Flow($flowId: String!) {
    flow(flowId: $flowId) {
      id

      creator {
        email
        role
      }

      updatedAt
      createdAt
    }
  }
`;
