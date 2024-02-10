import { gql } from "graphql-request";

const UserFragment = gql`
  fragment UserFragment on User {
    email
    role
    algoliaApiKey
    subscription
    frequency
    lastTokenReset
    periodTokenUsage
    documentTree
    presentationFiles
    sheetFiles
    drawingFiles
    soundFiles
    videoFiles
    updatedAt
    createdAt
  }
`;

export const getCurrentUserQuery = gql`
  query GetCurrentUser {
    getCurrentUser {
      ...UserFragment
    }
  }
  ${UserFragment}
`;

export const updateUserMutation = gql`
  mutation UpdateUser(
    $documentTree: String
    $presentationFiles: String
    $sheetFiles: String
    $drawingFiles: String
    $soundFiles: String
    $videoFiles: String
  ) {
    updateUser(
      documentTree: $documentTree
      presentationFiles: $presentationFiles
      sheetFiles: $sheetFiles
      drawingFiles: $drawingFiles
      soundFiles: $soundFiles
      videoFiles: $videoFiles
    ) {
      ...UserFragment
    }
  }
  ${UserFragment}
`;

export const authenticateQuery = gql`
  query AuthenticateUser {
    authenticate
  }
`;

export const registerMutation = gql`
  mutation RegisterUser {
    registerUser
  }
`;
