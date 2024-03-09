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

export const inboxQuery = gql`
  query InboxQuery($inboxId: String!) {
    inbox(inboxId: $inboxId) {
      id
      username
      domain {
        id
        domainName
      }
      threads {
        id
        subject
        mostRecentEmail {
          id
          from
          to
          subject
          body
          unread
          draft
          updatedAt
          createdAt
        }
        updatedAt
        createdAt
      }
      updatedAt
      createdAt
    }
  }
`;

export const sendWorkEmailMutation = gql`
  mutation SendWorkEmailMutation(
    $inboxId: String!
    $threadId: String
    $to: String!
    $subject: String!
    $body: String!
  ) {
    sendWorkEmail(
      inboxId: $inboxId
      threadId: $threadId
      to: $to
      subject: $subject
      body: $body
    ) {
      id
      from
      to
      subject
      body
      thread {
        id
      }
      updatedAt
      createdAt
    }
  }
`;

export const myThreadEmailsQuery = gql`
  query MyThreadEmailsQuery($threadId: String!) {
    myThreadEmails(threadId: $threadId) {
      id
      from
      to
      subject
      body
      initialMarkdown
      unread
      draft
      updatedAt
      createdAt
    }
  }
`;
