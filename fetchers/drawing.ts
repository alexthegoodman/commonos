import {
  drawingQuery,
  myDrawingsQuery,
  newDrawingMutation,
  updateDrawingMutation,
} from "../gql/drawing";
import graphClient from "../helpers/GQLClient";

export const getDrawingData = async (token: string, drawingId: string) => {
  graphClient.setupClient(token);

  const { drawing } = (await graphClient.client?.request(drawingQuery, {
    drawingId,
  })) as any;

  return drawing;
};

export const getDrawingsData = async (token: string) => {
  graphClient.setupClient(token);

  const { myDrawings } = (await graphClient.client?.request(
    myDrawingsQuery
  )) as any;

  return myDrawings;
};

export const newDrawing = async (token: string) => {
  graphClient.setupClient(token);

  const { newDrawing } = (await graphClient.client?.request(
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

  const { updateDrawing } = (await graphClient.client?.request(
    updateDrawingMutation,
    {
      drawingId,
      title,
      context,
    }
  )) as any;

  return updateDrawing;
};
