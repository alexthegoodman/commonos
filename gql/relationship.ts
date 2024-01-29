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
