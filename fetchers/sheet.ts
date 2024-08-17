import {
  sheetQuery,
  mySheetsQuery,
  newSheetMutation,
  updateSheetMutation,
} from "../gql/sheet";
import graphClient from "../helpers/GQLClient";

export const getSheetData = async (token: string, sheetId: string) => {
  graphClient.setupClient(token);

  const { sheet } = (await graphClient?.request(sheetQuery, {
    sheetId,
  })) as any;

  return sheet;
};

export const getSheetsData = async (token: string) => {
  graphClient.setupClient(token);

  const { mySheets } = (await graphClient?.request(mySheetsQuery)) as any;

  return mySheets;
};

export const newSheet = async (token: string) => {
  graphClient.setupClient(token);

  const { newSheet } = (await graphClient?.request(newSheetMutation)) as any;

  return newSheet;
};

export const updateSheet = async (
  token: string,
  sheetId: string,
  title: string,
  context: string
) => {
  graphClient.setupClient(token);

  const { updateSheet } = (await graphClient?.request(updateSheetMutation, {
    sheetId,
    title,
    context,
  })) as any;

  return updateSheet;
};
