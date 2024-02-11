import { gql } from "graphql-request";

export const contactSettingsQuery = gql`
  query ContactSettingsQuery {
    myContactSettings {
      id
      fields
      updatedAt
      createdAt
    }
  }
`;

export const companySettingsQuery = gql`
  query CompanySettingsQuery {
    myCompanySettings {
      id
      fields
      updatedAt
      createdAt
    }
  }
`;

export const putContactSettingsMutation = gql`
  mutation PutContactSettingsMutation($fields: String!) {
    putContactSettings(fields: $fields)
  }
`;

export const putCompanySettingsMutation = gql`
  mutation PutCompanySettingsMutation($fields: String!) {
    putCompanySettings(fields: $fields)
  }
`;

export const companyQuery = gql`
  query CompanyQuery($companyId: String!) {
    company(companyId: $companyId) {
      id
      fields
      updatedAt
      createdAt
    }
  }
`;

export const contactQuery = gql`
  query ContactQuery($contactId: String!) {
    contact(contactId: $contactId) {
      id
      fields
      updatedAt
      createdAt
    }
  }
`;

export const myCompaniesQuery = gql`
  query MyCompaniesQuery($skip: Int!, $take: Int!) {
    rows: myCompanies(skip: $skip, take: $take) {
      id
      fields
      updatedAt
      createdAt
    }
    count: countCompanies
  }
`;

export const myContactsQuery = gql`
  query MyContactsQuery($skip: Int!, $take: Int!) {
    rows: myContacts(skip: $skip, take: $take) {
      id
      fields
      updatedAt
      createdAt
    }
    count: countContacts
  }
`;

export const createCompanyMutation = gql`
  mutation CreateCompanyMutation($fields: String!) {
    createCompany(fields: $fields) {
      id
      fields
      updatedAt
      createdAt
    }
  }
`;

export const createContactMutation = gql`
  mutation CreateContactMutation($fields: String!) {
    createContact(fields: $fields) {
      id
      fields
      updatedAt
      createdAt
    }
  }
`;

export const updateCompanyMutation = gql`
  mutation UpdateCompanyMutation($companyId: String!, $fields: String!) {
    updateCompany(companyId: $companyId, fields: $fields) {
      id
      fields
      updatedAt
      createdAt
    }
  }
`;

export const updateContactMutation = gql`
  mutation UpdateContactMutation($contactId: String!, $fields: String!) {
    updateContact(contactId: $contactId, fields: $fields) {
      id
      fields
      updatedAt
      createdAt
    }
  }
`;

export const deleteContactMutation = gql`
  mutation DeleteContactMutation($contactId: String!) {
    deleteContact(contactId: $contactId)
  }
`;

export const deleteCompanyMutation = gql`
  mutation DeleteCompanyMutation($companyId: String!) {
    deleteCompany(companyId: $companyId)
  }
`;

export const funnelQuery = gql`
  query FunnelQuery($funnelId: String!) {
    funnel(funnelId: $funnelId) {
      id
      title
      context
      updatedAt
      createdAt
    }
  }
`;

export const dashboardQuery = gql`
  query DashboardQuery {
    dashboard {
      id
      title
      context
      updatedAt
      createdAt
    }
  }
`;

export const searchContactsQuery = gql`
  query SearchContactsQuery($query: String!) {
    searchContacts(query: $query) {
      id
      fields
      updatedAt
      createdAt
    }
  }
`;

export const contactsByIdsQuery = gql`
  query ContactsByIdsQuery($ids: [String!]!) {
    contactsByIds(ids: $ids) {
      id
      fields
      updatedAt
      createdAt
    }
  }
`;

export const createFunnelMutation = gql`
  mutation CreateFunnelMutation {
    createFunnel {
      id
    }
  }
`;

export const myFunnelsQuery = gql`
  query MyFunnelsQuery {
    myFunnels {
      id
      title
      context
      updatedAt
      createdAt
    }
  }
`;

export const updateFunnelMutation = gql`
  mutation UpdateFunnelMutation(
    $funnelId: String!
    $title: String
    $context: String
  ) {
    updateFunnel(funnelId: $funnelId, title: $title, context: $context) {
      id
      title
      context
      updatedAt
      createdAt
    }
  }
`;

export const myDashboardsQuery = gql`
  query MyDashboardsQuery {
    myDashboards {
      id
      title
      context
      updatedAt
      createdAt
    }
  }
`;

export const createDashboardMutation = gql`
  mutation CreateDashboardMutation {
    createDashboard {
      id
    }
  }
`;

export const updateDashboardMutation = gql`
  mutation UpdateDashboardMutation(
    $dashboardId: String!
    $title: String
    $context: String
  ) {
    updateDashboard(
      dashboardId: $dashboardId
      title: $title
      context: $context
    ) {
      id
      title
      context
      updatedAt
      createdAt
    }
  }
`;
