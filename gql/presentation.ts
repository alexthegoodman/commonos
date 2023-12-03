import { gql } from "graphql-request";

export const newPresentationMutation = gql`
  mutation NewPresentationMutation {
    newPresentation {
      id
    }
  }
`;

export const updatePresentationMutation = gql`
  mutation UpdatePresentation(
    $presentationId: String!
    $title: String
    $context: String
  ) {
    updatePresentation(
      presentationId: $presentationId
      title: $title
      context: $context
    ) {
      id
    }
  }
`;

export const myPresentationsQuery = gql`
  query Presentations {
    myPresentations {
      id
      title

      creator {
        email
        role
      }

      updatedAt
      createdAt
    }
  }
`;

export const presentationQuery = gql`
  query Presentation($presentationId: String!) {
    presentation(presentationId: $presentationId) {
      id
      title
      context

      creator {
        email
        role
      }

      updatedAt
      createdAt
    }
  }
`;
