import {
  createOrganizationMutation,
  createProjectMutation,
  myOrganiationsQuery,
} from "@/gql/collaboration";
import graphClient from "../helpers/GQLClient";

export const getOrganizationsData = async (token: string) => {
  graphClient.setupClient(token);

  const { myOrganizations } = (await graphClient?.request(
    myOrganiationsQuery
  )) as any;

  return myOrganizations;
};

export const createOrganization = async (token: string, name: string) => {
  graphClient.setupClient(token);

  const { createOrganization } = (await graphClient?.request(
    createOrganizationMutation,
    { name }
  )) as any;

  return createOrganization;
};

export const createProject = async (
  token: string,
  organizationId: string,
  title: string
) => {
  graphClient.setupClient(token);

  const { createProject } = (await graphClient?.request(createProjectMutation, {
    organizationId,
    title,
  })) as any;

  return createProject;
};
