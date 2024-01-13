import { gql } from "graphql-request";

export const myOrganiationsQuery = gql`
  query MyOrganizations {
    myOrganizations {
      id
      name

      projects {
        id
        title
      }

      updatedAt
      createdAt
    }
  }
`;

export const createOrganizationMutation = gql`
  mutation CreateOrganization($name: String!) {
    createOrganization(name: $name) {
      id
    }
  }
`;

export const createProjectMutation = gql`
  mutation CreateProject($organizationId: String!, $title: String!) {
    createProject(organizationId: $organizationId, title: $title) {
      id
    }
  }
`;
