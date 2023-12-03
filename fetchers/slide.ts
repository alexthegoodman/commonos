import {
  presentationQuery,
  myPresentationsQuery,
  newPresentationMutation,
  updatePresentationMutation,
} from "../gql/presentation";
import graphClient from "../helpers/GQLClient";

export const getSlideData = async (token: string, slideId: string) => {
  graphClient.setupClient(token);

  const { presentation } = (await graphClient.client?.request(
    presentationQuery,
    {
      slideId,
    }
  )) as any;

  return presentation;
};

export const getSlidesData = async (token: string) => {
  graphClient.setupClient(token);

  const { myPresentations } = (await graphClient.client?.request(
    myPresentationsQuery
  )) as any;

  return myPresentations;
};

export const newSlide = async (token: string) => {
  graphClient.setupClient(token);

  const { newPresentation } = (await graphClient.client?.request(
    newPresentationMutation
  )) as any;

  return newPresentation;
};

export const updateSlide = async (
  token: string,
  slideId: string,
  title: string,
  context: string
) => {
  graphClient.setupClient(token);

  const { updatePresentation } = (await graphClient.client?.request(
    updatePresentationMutation,
    {
      slideId,
      title,
      context,
    }
  )) as any;

  return updatePresentation;
};
