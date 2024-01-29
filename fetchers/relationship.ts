import {
  companySettingsQuery,
  contactSettingsQuery,
  putCompanySettingsMutation,
  putContactSettingsMutation,
} from "@/gql/relationship";
import graphClient from "@/helpers/GQLClient";

export const getContactSettings = async (token: string) => {
  graphClient.setupClient(token);

  const { myContactSettings } = (await graphClient.client?.request(
    contactSettingsQuery
  )) as any;

  return myContactSettings;
};

export const getCompanySettings = async (token: string) => {
  graphClient.setupClient(token);

  const { myCompanySettings } = (await graphClient.client?.request(
    companySettingsQuery
  )) as any;

  return myCompanySettings;
};

export const putContactSettings = async (token: string, fields: any) => {
  graphClient.setupClient(token);

  const { putContactSettings } = (await graphClient.client?.request(
    putContactSettingsMutation,
    {
      fields: JSON.stringify(fields),
    }
  )) as any;

  return putContactSettings;
};

export const putCompanySettings = async (token: string, fields: any) => {
  graphClient.setupClient(token);

  const { putCompanySettings } = (await graphClient.client?.request(
    putCompanySettingsMutation,
    {
      fields: JSON.stringify(fields),
    }
  )) as any;

  return putCompanySettings;
};
