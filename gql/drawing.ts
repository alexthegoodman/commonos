import { gql } from "graphql-request";

export const newDrawingMutation = gql`
  mutation NewDrawingMutation {
    newDrawing {
      id
    }
  }
`;

export const updateDrawingMutation = gql`
  mutation UpdateDrawing(
    $drawingId: String!
    $title: String
    $context: String
  ) {
    updateDrawing(drawingId: $drawingId, title: $title, context: $context) {
      id
    }
  }
`;

export const myDrawingsQuery = gql`
  query Drawings {
    myDrawings {
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

export const drawingQuery = gql`
  query Drawing($drawingId: String!) {
    drawing(drawingId: $drawingId) {
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
