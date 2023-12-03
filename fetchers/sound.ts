import {
  soundQuery,
  mySoundsQuery,
  newSoundMutation,
  updateSoundMutation,
} from "../gql/sound";
import graphClient from "../helpers/GQLClient";

export const getSoundData = async (token: string, soundId: string) => {
  graphClient.setupClient(token);

  const { sound } = (await graphClient.client?.request(soundQuery, {
    soundId,
  })) as any;

  return sound;
};

export const getSoundsData = async (token: string) => {
  graphClient.setupClient(token);

  const { mySounds } = (await graphClient.client?.request(
    mySoundsQuery
  )) as any;

  return mySounds;
};

export const newSound = async (token: string) => {
  graphClient.setupClient(token);

  const { newSound } = (await graphClient.client?.request(
    newSoundMutation
  )) as any;

  return newSound;
};

export const updateSound = async (
  token: string,
  soundId: string,
  title: string,
  context: string
) => {
  graphClient.setupClient(token);

  const { updateSound } = (await graphClient.client?.request(
    updateSoundMutation,
    {
      soundId,
      title,
      context,
    }
  )) as any;

  return updateSound;
};
