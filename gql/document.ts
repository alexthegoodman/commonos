import { gql } from "graphql-request";

export const newDocumentMutation = gql`
  mutation NewDocumentMutation {
    newDocument {
      id
    }
  }
`;

export const updateDocumentMutation = gql`
  mutation UpdateDocument(
    $documentId: String!
    $title: String
    $content: String
    $plaintext: String
  ) {
    updateDocument(
      documentId: $documentId
      title: $title
      content: $content
      plaintext: $plaintext
    ) {
      id
    }
  }
`;

export const myDocumentsQuery = gql`
  query Documents {
    myDocuments {
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

export const documentQuery = gql`
  query Document($documentId: String!) {
    document(documentId: $documentId) {
      id
      title
      content
      plaintext

      creator {
        email
        role
      }

      updatedAt
      createdAt
    }
  }
`;
