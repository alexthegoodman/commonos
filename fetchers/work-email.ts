import { createInboxMutation, myInboxesQuery } from "@/gql/work-email";
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
