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

export const myWorkEmailFoldersQuery = gql`
  query MyWorkEmailFoldersQuery {
    myWorkEmailFolders {
      id
      name
      updatedAt
      createdAt
    }
  }
`;

export const myWorkEmailFolderTemplatesQuery = gql`
  query MyWorkEmailFolderTemplatesQuery($folderId: String!) {
    myWorkEmailFolderTemplates(folderId: $folderId) {
      id
      subject
      body
      initialMarkdown
      updatedAt
      createdAt
    }
  }
`;

export const workEmailTemplateQuery = gql`
  query WorkEmailTemplateQuery($templateId: String!) {
    workEmailTemplate(templateId: $templateId) {
      id
      subject
      body
      initialMarkdown
      updatedAt
      createdAt
    }
  }
`;

export const createWorkEmailTemplateMutation = gql`
  mutation CreateWorkEmailTemplateMutation(
    $folderId: String!
    $subject: String!
    $body: String!
  ) {
    createWorkEmailTemplate(
      folderId: $folderId
      subject: $subject
      body: $body
    ) {
      id
      updatedAt
      createdAt
    }
  }
`;

export const updateWorkEmailTemplateMutation = gql`
  mutation UpdateWorkEmailTemplateMutation(
    $templateId: String!
    $subject: String
    $body: String
  ) {
    updateWorkEmailTemplate(
      templateId: $templateId
      subject: $subject
      body: $body
    ) {
      id
      updatedAt
      createdAt
    }
  }
`;

export const createWorkEmailFolderMutation = gql`
  mutation CreateWorkEmailFolderMutation($name: String!) {
    createWorkEmailFolder(name: $name) {
      id
      name
      updatedAt
      createdAt
    }
  }
`;
