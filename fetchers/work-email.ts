import {
  createInboxMutation,
  createWorkEmailFolderMutation,
  createWorkEmailTemplateMutation,
  inboxQuery,
  myInboxesQuery,
  myThreadEmailsQuery,
  myWorkEmailFolderTemplatesQuery,
  myWorkEmailFoldersQuery,
  sendWorkEmailMutation,
  updateWorkEmailTemplateMutation,
} from "@/gql/work-email";
import graphClient from "@/helpers/GQLClient";

export const myInboxes = async (token: string) => {
  graphClient.setupClient(token);

  const { myInboxes } = (await graphClient?.request(myInboxesQuery)) as any;

  return myInboxes;
};

export const createInbox = async (token: string, username: string) => {
  graphClient.setupClient(token);

  const { createInbox } = (await graphClient?.request(createInboxMutation, {
    username,
  })) as any;

  return createInbox;
};

export const getInbox = async (token: string, inboxId: string) => {
  graphClient.setupClient(token);

  const { inbox } = (await graphClient?.request(inboxQuery, {
    inboxId,
  })) as any;

  return inbox;
};

export const sendWorkEmail = async (
  token: string,
  inboxId: string,
  threadId: string | null,
  to: string,
  subject: string,
  body: string
) => {
  graphClient.setupClient(token);

  const { sendWorkEmail } = (await graphClient?.request(sendWorkEmailMutation, {
    inboxId,
    threadId,
    to,
    subject,
    body,
  })) as any;

  return sendWorkEmail;
};

export const myThreadEmails = async (token: string, threadId: string) => {
  graphClient.setupClient(token);

  const { myThreadEmails } = (await graphClient?.request(myThreadEmailsQuery, {
    threadId,
  })) as any;

  return myThreadEmails;
};

export const myWorkEmailFolders = async (token: string) => {
  graphClient.setupClient(token);

  const { myWorkEmailFolders } = (await graphClient?.request(
    myWorkEmailFoldersQuery
  )) as any;

  return myWorkEmailFolders;
};

export const myWorkEmailFolderTemplates = async (
  token: string,
  folderId: string
) => {
  graphClient.setupClient(token);

  const { myWorkEmailFolderTemplates } = (await graphClient?.request(
    myWorkEmailFolderTemplatesQuery,
    {
      folderId,
    }
  )) as any;

  return myWorkEmailFolderTemplates;
};

export const createWorkEmailTemplate = async (
  token: string,
  folderId: string,
  subject: string,
  body: string
) => {
  graphClient.setupClient(token);

  const { createWorkEmailTemplate } = (await graphClient?.request(
    createWorkEmailTemplateMutation,
    {
      folderId,
      subject,
      body,
    }
  )) as any;

  return createWorkEmailTemplate;
};

export const updateWorkEmailTemplate = async (
  token: string,
  templateId: string,
  subject: string,
  body: string
) => {
  graphClient.setupClient(token);

  const { updateWorkEmailTemplate } = (await graphClient?.request(
    updateWorkEmailTemplateMutation,
    {
      templateId,
      subject,
      body,
    }
  )) as any;

  return updateWorkEmailTemplate;
};

export const createWorkEmailFolder = async (token: string, name: string) => {
  graphClient.setupClient(token);

  const { createWorkEmailFolder } = (await graphClient?.request(
    createWorkEmailFolderMutation,
    {
      name,
    }
  )) as any;

  return createWorkEmailFolder;
};
