import {
  createInboxMutation,
  inboxQuery,
  myInboxesQuery,
  myThreadEmailsQuery,
  sendWorkEmailMutation,
} from "@/gql/work-email";
import graphClient from "@/helpers/GQLClient";

export const myInboxes = async (token: string) => {
  graphClient.setupClient(token);

  const { myInboxes } = (await graphClient.client?.request(
    myInboxesQuery
  )) as any;

  return myInboxes;
};

export const createInbox = async (token: string, username: string) => {
  graphClient.setupClient(token);

  const { createInbox } = (await graphClient.client?.request(
    createInboxMutation,
    {
      username,
    }
  )) as any;

  return createInbox;
};

export const getInbox = async (token: string, inboxId: string) => {
  graphClient.setupClient(token);

  const { inbox } = (await graphClient.client?.request(inboxQuery, {
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

  const { sendWorkEmail } = (await graphClient.client?.request(
    sendWorkEmailMutation,
    {
      inboxId,
      threadId,
      to,
      subject,
      body,
    }
  )) as any;

  return sendWorkEmail;
};

export const myThreadEmails = async (token: string, threadId: string) => {
  graphClient.setupClient(token);

  const { myThreadEmails } = (await graphClient.client?.request(
    myThreadEmailsQuery,
    {
      threadId,
    }
  )) as any;

  return myThreadEmails;
};
