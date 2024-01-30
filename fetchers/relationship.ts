import {
  companySettingsQuery,
  contactSettingsQuery,
  createCompanyMutation,
  createContactMutation,
  myCompaniesQuery,
  myContactsQuery,
  putCompanySettingsMutation,
  putContactSettingsMutation,
  updateCompanyMutation,
  updateContactMutation,
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

export const getMyCompanies = async (
  token: string,
  rowsPerPage: number,
  page: number
) => {
  graphClient.setupClient(token);

  const { rows, count } = (await graphClient.client?.request(myCompaniesQuery, {
    skip: rowsPerPage * page,
    take: rowsPerPage,
  })) as any;

  return { rows, count };
};

export const getMyContacts = async (
  token: string,
  rowsPerPage: number,
  page: number
) => {
  graphClient.setupClient(token);

  const { rows, count } = (await graphClient.client?.request(myContactsQuery, {
    skip: rowsPerPage * page,
    take: rowsPerPage,
  })) as any;

  return { rows, count };
};

export const createCompany = async (token: string, fields: any) => {
  graphClient.setupClient(token);

  const { createCompany } = (await graphClient.client?.request(
    createCompanyMutation,
    {
      fields: JSON.stringify(fields),
    }
  )) as any;

  return createCompany;
};

export const createContact = async (token: string, fields: any) => {
  graphClient.setupClient(token);

  const { createContact } = (await graphClient.client?.request(
    createContactMutation,
    {
      fields: JSON.stringify(fields),
    }
  )) as any;

  return createContact;
};

export const updateCompany = async (
  token: string,
  companyId: string,
  fields: any
) => {
  graphClient.setupClient(token);

  const { updateCompany } = (await graphClient.client?.request(
    updateCompanyMutation,
    {
      companyId,
      fields: JSON.stringify(fields),
    }
  )) as any;

  return updateCompany;
};

export const updateContact = async (
  token: string,
  contactId: string,
  fields: any
) => {
  graphClient.setupClient(token);

  const { updateContact } = (await graphClient.client?.request(
    updateContactMutation,
    {
      contactId,
      fields: JSON.stringify(fields),
    }
  )) as any;

  return updateContact;
};
