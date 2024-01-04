import { getCurrentUserQuery, updateUserMutation } from "../gql/user";
import graphClient from "../helpers/GQLClient";

export const getUserData = async (token: string) => {
  try {
    graphClient.setupClient(token);

    const { getCurrentUser } =
      await graphClient.client?.request(getCurrentUserQuery);

    return getCurrentUser;
  } catch (error) {
    console.error("getUserData error", error);
    if (error.message.includes("JWT EXPIRED")) {
      window.location.href = "/login";
    }
  }
};

export const updateDocumentTree = async (token: string, documentTree) => {
  graphClient.setupClient(token);

  const { updateUser } = await graphClient.client?.request(updateUserMutation, {
    documentTree: JSON.stringify(documentTree),
  });

  return updateUser;
};

export const updatePresentationFiles = async (
  token: string,
  presentationFiles
) => {
  graphClient.setupClient(token);

  const { updateUser } = await graphClient.client?.request(updateUserMutation, {
    presentationFiles: JSON.stringify(presentationFiles),
  });

  return updateUser;
};

export const updateSheetFiles = async (token: string, sheetFiles) => {
  graphClient.setupClient(token);

  const { updateUser } = await graphClient.client?.request(updateUserMutation, {
    sheetFiles: JSON.stringify(sheetFiles),
  });

  return updateUser;
};

export const updateDrawingFiles = async (token: string, drawingFiles) => {
  graphClient.setupClient(token);

  const { updateUser } = await graphClient.client?.request(updateUserMutation, {
    drawingFiles: JSON.stringify(drawingFiles),
  });

  return updateUser;
};

export const updateSoundFiles = async (token: string, soundFiles) => {
  graphClient.setupClient(token);

  const { updateUser } = await graphClient.client?.request(updateUserMutation, {
    soundFiles: JSON.stringify(soundFiles),
  });

  return updateUser;
};

export const updateVideoFiles = async (token: string, videoFiles) => {
  graphClient.setupClient(token);

  const { updateUser } = await graphClient.client?.request(updateUserMutation, {
    videoFiles: JSON.stringify(videoFiles),
  });

  return updateUser;
};
