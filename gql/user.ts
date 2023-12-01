import { gql } from "graphql-request";

export const getCurrentUserQuery = gql`
  query GetCurrentUser {
    getCurrentUser {
      email
      role
      subscription
      frequency
      documentTree
      updatedAt
      createdAt
    }
  }
`;

export const updateUserMutation = gql`
  mutation UpdateUser($documentTree: String) {
    updateUser(documentTree: $documentTree) {
      email
      role
      subscription
      frequency
      documentTree
      updatedAt
      createdAt
    }
  }
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
