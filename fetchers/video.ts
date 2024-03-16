import {
  videoQuery,
  myVideosQuery,
  newVideoMutation,
  updateVideoMutation,
} from "../gql/video";
import graphClient from "../helpers/GQLClient";

export const getVideoData = async (token: string, videoId: string) => {
  graphClient.setupClient(token);

  const { video } = (await graphClient?.request(videoQuery, {
    videoId,
  })) as any;

  return video;
};

export const getVideosData = async (token: string) => {
  graphClient.setupClient(token);

  const { myVideos } = (await graphClient?.request(myVideosQuery)) as any;

  return myVideos;
};

export const newVideo = async (token: string) => {
  graphClient.setupClient(token);

  const { newVideo } = (await graphClient?.request(newVideoMutation)) as any;

  return newVideo;
};

export const updateVideo = async (
  token: string,
  videoId: string,
  title: string,
  context: string
) => {
  graphClient.setupClient(token);

  const { updateVideo } = (await graphClient?.request(updateVideoMutation, {
    videoId,
    title,
    context,
  })) as any;

  return updateVideo;
};
