import { gql } from "graphql-request";

export const myInboxesQuery = gql`
  query MyInboxesQuery {
    myInboxes {
      id
      username
      updatedAt
      createdAt
    }
  }
`;

export const createInboxMutation = gql`
  mutation CreateInboxMutation($username: String!) {
    createInbox(username: $username) {
      id
      username
      updatedAt
      createdAt
    }
  }
`;
