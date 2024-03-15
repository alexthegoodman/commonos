import { gql } from "graphql-request";

export const myDomainSettingsQuery = gql`
  query MyDomainSettingsQuery {
    myDomainSettings {
      id
      domainName
      dkimData
      updatedAt
      createdAt
    }
  }
`;

export const putDomainSettingsMutation = gql`
  mutation PutDomainSettingsMutation($domainName: String!) {
    putDomainSettings(domainName: $domainName) {
      id
      domainName
      dkimData
      updatedAt
      createdAt
    }
  }
`;

export const deleteDomainSettingsMutation = gql`
  mutation DeleteDomainSettingsMutation {
    deleteDomainSettings
  }
`;
