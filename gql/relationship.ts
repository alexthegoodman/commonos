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
