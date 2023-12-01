import { documentQuery, myDocumentsQuery } from "../gql/document";
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
