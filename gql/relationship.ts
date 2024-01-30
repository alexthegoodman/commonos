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
