import {
  deleteDomainSettingsMutation,
  myDomainSettingsQuery,
  putDomainSettingsMutation,
} from "@/gql/send-email";
import graphClient from "@/helpers/GQLClient";

export const myDomainSettings = async (token: string) => {
  graphClient.setupClient(token);

  const { myDomainSettings } = (await graphClient.client?.request(
    myDomainSettingsQuery
  )) as any;

  return myDomainSettings;
};

export const putDomainSettings = async (token: string, domainName: string) => {
  graphClient.setupClient(token);

  const { putDomainSettings } = (await graphClient.client?.request(
    putDomainSettingsMutation,
    { domainName }
  )) as any;

  return putDomainSettings;
};

export const deleteDomainSettings = async (token: string) => {
  graphClient.setupClient(token);

  const { deleteDomainSettings } = (await graphClient.client?.request(
    deleteDomainSettingsMutation
  )) as any;

  return deleteDomainSettings;
};
