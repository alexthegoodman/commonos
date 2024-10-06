import {
  getCurrentUserQuery,
  getPortalUrlQuery,
  newCheckoutMutation,
  updateUserMutation,
} from "../gql/user";
import graphClient from "../helpers/GQLClient";

export const getUserData = async (token: string) => {
  if (!token) {
    throw new Error("No token provided");
  }

  graphClient.setupClient(token);

  const { getCurrentUser } = await graphClient?.request(getCurrentUserQuery);

  return getCurrentUser;
};

export const updateLauncherContext = async (token: string, context: any) => {
  graphClient.setupClient(token);

  const { updateUser } = await graphClient?.request(updateUserMutation, {
    launcherContext: JSON.stringify(context),
  });

  return updateUser;
};

export const updateDocumentTree = async (token: string, documentTree) => {
  graphClient.setupClient(token);

  const { updateUser } = await graphClient?.request(updateUserMutation, {
    documentTree: JSON.stringify(documentTree),
  });

  return updateUser;
};

export const updatePresentationFiles = async (
  token: string,
  presentationFiles
) => {
  graphClient.setupClient(token);

  const { updateUser } = await graphClient?.request(updateUserMutation, {
    presentationFiles: JSON.stringify(presentationFiles),
  });

  return updateUser;
};

export const updateSheetFiles = async (token: string, sheetFiles) => {
  graphClient.setupClient(token);

  const { updateUser } = await graphClient?.request(updateUserMutation, {
    sheetFiles: JSON.stringify(sheetFiles),
  });

  return updateUser;
};

export const updateDrawingFiles = async (token: string, drawingFiles) => {
  graphClient.setupClient(token);

  const { updateUser } = await graphClient?.request(updateUserMutation, {
    drawingFiles: JSON.stringify(drawingFiles),
  });

  return updateUser;
};

export const updateSoundFiles = async (token: string, soundFiles) => {
  graphClient.setupClient(token);

  const { updateUser } = await graphClient?.request(updateUserMutation, {
    soundFiles: JSON.stringify(soundFiles),
  });

  return updateUser;
};

export const updateVideoFiles = async (token: string, videoFiles) => {
  graphClient.setupClient(token);

  const { updateUser } = await graphClient?.request(updateUserMutation, {
    videoFiles: JSON.stringify(videoFiles),
  });

  return updateUser;
};

export const newCheckout = async (token: string) => {
  graphClient.setupClient(token);

  const { newCheckout } = await graphClient?.request(newCheckoutMutation);

  return newCheckout;
};

export const getPortalUrl = async (token: string) => {
  graphClient.setupClient(token);

  const { getPortalUrl } = await graphClient?.request(getPortalUrlQuery);

  return getPortalUrl;
};
