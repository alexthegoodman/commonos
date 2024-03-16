import {
  drawingQuery,
  myDrawingsQuery,
  newDrawingMutation,
  simpleUploadMutation,
  updateDrawingMutation,
} from "../gql/drawing";
import graphClient from "../helpers/GQLClient";

export const getDrawingData = async (token: string, drawingId: string) => {
  graphClient.setupClient(token);

  const { drawing } = (await graphClient?.request(drawingQuery, {
    drawingId,
  })) as any;

  return drawing;
};

export const getDrawingsData = async (token: string) => {
  graphClient.setupClient(token);

  const { myDrawings } = (await graphClient?.request(myDrawingsQuery)) as any;

  return myDrawings;
};

export const newDrawing = async (token: string) => {
  graphClient.setupClient(token);

  const { newDrawing } = (await graphClient?.request(
    newDrawingMutation
  )) as any;

  return newDrawing;
};

export const updateDrawing = async (
  token: string,
  drawingId: string,
  title: string,
  context: string
) => {
  graphClient.setupClient(token);

  const { updateDrawing } = (await graphClient?.request(updateDrawingMutation, {
    drawingId,
    title,
    context,
  })) as any;

  return updateDrawing;
};

export const simpleUpload = async (
  token: string,
  fileName: string,
  fileSize: number,
  fileType: string,
  fileData: string
) => {
  graphClient.setupClient(token);

  const { simpleUpload } = (await graphClient?.request(simpleUploadMutation, {
    fileName,
    fileSize,
    fileType,
    fileData,
  })) as any;

  return simpleUpload;
};
