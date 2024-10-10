import {
  deleteDocumentMutation,
  documentQuery,
  documentTemplatesQuery,
  generateTitlesMutation,
  myDocumentsQuery,
  newDocumentTemplateMutation,
  updateDocumentTemplateMutation,
} from "../gql/document";
import graphClient from "../helpers/GQLClient";

export const getDocumentData = async (token: string, documentId: string) => {
  graphClient.setupClient(token);

  const { document } = (await graphClient?.request(documentQuery, {
    documentId,
  })) as any;

  return document;
};

export const getDocumentsData = async (token: string) => {
  graphClient.setupClient(token);

  const { myDocuments } = (await graphClient?.request(myDocumentsQuery)) as any;

  return myDocuments;
};

export const deleteDocument = async (token: string, documentId: string) => {
  graphClient.setupClient(token);

  const { deleteDocument } = (await graphClient?.request(
    deleteDocumentMutation,
    {
      documentId,
    }
  )) as any;

  return deleteDocument;
};

export const generateTitles = async (token: string, markdown: string) => {
  graphClient.setupClient(token);

  const { generateTitles } = (await graphClient?.request(
    generateTitlesMutation,
    {
      treeMd: markdown,
    }
  )) as any;

  return generateTitles;
};

export const getDocumentTemplatesData = async (token: string) => {
  graphClient.setupClient(token);

  const { documentTemplates } = (await graphClient?.request(
    documentTemplatesQuery
  )) as any;

  return documentTemplates;
};

export const newDocumentTemplate = async (
  token: string,
  sourceId: string,
  title: string,
  masterVisuals: any
) => {
  graphClient.setupClient(token);

  const { newDocumentTemplate } = (await graphClient?.request(
    newDocumentTemplateMutation,
    {
      sourceId,
      title,
      masterVisuals: JSON.stringify(masterVisuals),
    }
  )) as any;

  return newDocumentTemplate;
};

export const updateDocumentTemplate = async (
  token: string,
  documentTemplateId: string,
  masterVisuals: string
) => {
  graphClient.setupClient(token);

  const { updateDocumentTemplate } = (await graphClient?.request(
    updateDocumentTemplateMutation,
    {
      documentTemplateId,
      masterVisuals: JSON.stringify(masterVisuals),
    }
  )) as any;

  return updateDocumentTemplate;
};
