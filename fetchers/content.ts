import {
  createPostTypeMutation,
  myPostTypesQuery,
  updatePostMutation,
  postTypeQuery,
  createPostMutation,
  myPostsQuery,
  postQuery,
  togglePublishedMutation,
  deletePostMutation,
} from "@/gql/content";
import graphClient from "../helpers/GQLClient";

export const myPostTypes = async (token: string) => {
  graphClient.setupClient(token);

  const { myPostTypes } = (await graphClient.client?.request(
    myPostTypesQuery
  )) as any;

  return myPostTypes;
};

export const createPostType = async (
  token: string,
  name: string,
  fields: any
) => {
  graphClient.setupClient(token);

  const { createPostType } = (await graphClient.client?.request(
    createPostTypeMutation,
    {
      name,
      fields: JSON.stringify(fields),
    }
  )) as any;

  return createPostType;
};

export const updatePostType = async (
  token: string,
  postTypeId: string,
  name: string,
  fields: string
) => {
  graphClient.setupClient(token);

  const { updatePostType } = (await graphClient.client?.request(
    updatePostMutation,
    { postTypeId, name, fields }
  )) as any;

  return updatePostType;
};

export const getPostType = async (token: string, postTypeId: string) => {
  graphClient.setupClient(token);

  const { postType } = (await graphClient.client?.request(postTypeQuery, {
    postTypeId,
  })) as any;

  return postType;
};

export const createPost = async (
  token: string,
  postTypeId: string,
  title: string,
  markdown: string,
  fields: any
) => {
  graphClient.setupClient(token);

  const { createPost } = (await graphClient.client?.request(
    createPostMutation,
    {
      postTypeId,
      title,
      markdown,
      fields: JSON.stringify(fields),
    }
  )) as any;

  return createPost;
};

export const updatePost = async (
  token: string,
  postId: string,
  title: string,
  markdown: string,
  fields: any
) => {
  graphClient.setupClient(token);

  const { updatePost } = (await graphClient.client?.request(
    updatePostMutation,
    {
      postId,
      title,
      markdown,
      fields: JSON.stringify(fields),
    }
  )) as any;

  return updatePost;
};

export const myPosts = async (token: string, postTypeId: string) => {
  graphClient.setupClient(token);

  const { myPosts } = (await graphClient.client?.request(myPostsQuery, {
    postTypeId,
  })) as any;

  return myPosts;
};

export const getPost = async (token: string, postId: string) => {
  graphClient.setupClient(token);

  const { post } = (await graphClient.client?.request(postQuery, {
    postId,
  })) as any;

  return post;
};

export const togglePublished = async (token: string, postId: string) => {
  graphClient.setupClient(token);

  const { togglePublished } = (await graphClient.client?.request(
    togglePublishedMutation,
    {
      postId,
    }
  )) as any;

  return togglePublished;
};

export const deletePost = async (token: string, postId: string) => {
  graphClient.setupClient(token);

  const { deletePost } = (await graphClient.client?.request(
    deletePostMutation,
    {
      postId,
    }
  )) as any;

  return deletePost;
};
