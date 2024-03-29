import {
  presentationQuery,
  myPresentationsQuery,
  newPresentationMutation,
  updatePresentationMutation,
  newPresentationTemplateMutation,
  updatePresentationTemplateMutation,
  presentationTemplatesQuery,
} from "../gql/presentation";
import graphClient from "../helpers/GQLClient";

export const getSlideData = async (token: string, presentationId: string) => {
  graphClient.setupClient(token);

  const { presentation } = (await graphClient?.request(presentationQuery, {
    presentationId,
  })) as any;

  return presentation;
};

export const getSlidesData = async (token: string) => {
  graphClient.setupClient(token);

  const { myPresentations } = (await graphClient?.request(
    myPresentationsQuery
  )) as any;

  return myPresentations;
};

export const newSlide = async (token: string) => {
  graphClient.setupClient(token);

  const { newPresentation } = (await graphClient?.request(
    newPresentationMutation
  )) as any;

  return newPresentation;
};

export const updateSlide = async (
  token: string,
  presentationId: string,
  title: string,
  context: string
) => {
  graphClient.setupClient(token);

  const { updatePresentation } = (await graphClient?.request(
    updatePresentationMutation,
    {
      presentationId,
      title,
      context,
    }
  )) as any;

  return updatePresentation;
};

export const getSlideTemplatesData = async (token: string) => {
  graphClient.setupClient(token);

  const { presentationTemplates } = (await graphClient?.request(
    presentationTemplatesQuery
  )) as any;

  return presentationTemplates;
};

export const newSlideTemplate = async (
  token: string,
  sourceId: string,
  title: string,
  context: any
) => {
  graphClient.setupClient(token);

  const { newPresentationTemplate } = (await graphClient?.request(
    newPresentationTemplateMutation,
    {
      sourceId,
      title,
      context: JSON.stringify(context),
    }
  )) as any;

  return newPresentationTemplate;
};

export const updateSlideTemplate = async (
  token: string,
  presentationTemplateId: string,
  context: string
) => {
  graphClient.setupClient(token);

  const { updatePresentationTemplate } = (await graphClient?.request(
    updatePresentationTemplateMutation,
    {
      presentationTemplateId,
      context: JSON.stringify(context),
    }
  )) as any;

  return updatePresentationTemplate;
};
