import {
  deleteDocumentMutation,
  documentQuery,
  generateTitlesMutation,
  myDocumentsQuery,
} from "../gql/document";
import graphClient from "../helpers/GQLClient";

export const getDocumentData = async (token: string, documentId: string) => {
  graphClient.setupClient(token);

  const { document } = (await graphClient.client?.request(documentQuery, {
    documentId,
  })) as any;

  return document;
};

export const getDocumentsData = async (token: string) => {
  graphClient.setupClient(token);

  const { myDocuments } = (await graphClient.client?.request(
    myDocumentsQuery
  )) as any;

  return myDocuments;
};

export const deleteDocument = async (token: string, documentId: string) => {
  graphClient.setupClient(token);

  const { deleteDocument } = (await graphClient.client?.request(
    deleteDocumentMutation,
    {
      documentId,
    }
  )) as any;

  return deleteDocument;
};

export const generateTitles = async (token: string, markdown: string) => {
  graphClient.setupClient(token);

  const { generateTitles } = (await graphClient.client?.request(
    generateTitlesMutation,
    {
      treeMd: markdown,
    }
  )) as any;

  return generateTitles;
};
