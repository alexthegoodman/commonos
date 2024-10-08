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
    $html: String
    $markdown: String
    $masterJson: String
    $masterVisuals: String
    $messages: String
  ) {
    updateDocument(
      documentId: $documentId
      title: $title
      content: $content
      plaintext: $plaintext
      html: $html
      markdown: $markdown
      masterJson: $masterJson
      masterVisuals: $masterVisuals
      messages: $messages
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
      html
      markdown
      messages
      masterJson
      masterVisuals

      creator {
        email
        role
      }

      updatedAt
      createdAt
    }
  }
`;

export const deleteDocumentMutation = gql`
  mutation DeleteDocument($documentId: String!) {
    deleteDocument(documentId: $documentId)
  }
`;

export const generateTitlesMutation = gql`
  mutation GenerateTitles($treeMd: String!) {
    generateTitles(treeMd: $treeMd) {
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
