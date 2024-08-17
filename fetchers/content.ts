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

  const { myPostTypes } = (await graphClient?.request(myPostTypesQuery)) as any;

  return myPostTypes;
};

export const createPostType = async (
  token: string,
  name: string,
  fields: any
) => {
  graphClient.setupClient(token);

  const { createPostType } = (await graphClient?.request(
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

  const { updatePostType } = (await graphClient?.request(updatePostMutation, {
    postTypeId,
    name,
    fields,
  })) as any;

  return updatePostType;
};

export const getPostType = async (token: string, postTypeId: string) => {
  graphClient.setupClient(token);

  const { postType, postCount } = (await graphClient?.request(postTypeQuery, {
    postTypeId,
  })) as any;

  return { ...postType, postCount };
};

export const createPost = async (
  token: string,
  postTypeId: string,
  title: string,
  markdown: string,
  fields: any
) => {
  graphClient.setupClient(token);

  const { createPost } = (await graphClient?.request(createPostMutation, {
    postTypeId,
    title,
    markdown,
    fields: JSON.stringify(fields),
  })) as any;

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

  const { updatePost } = (await graphClient?.request(updatePostMutation, {
    postId,
    title,
    markdown,
    fields: JSON.stringify(fields),
  })) as any;

  return updatePost;
};

export const myPosts = async (token: string, postTypeId: string) => {
  graphClient.setupClient(token);

  const { rows, count } = (await graphClient?.request(myPostsQuery, {
    postTypeId,
  })) as any;

  return { rows, count };
};

export const getPost = async (token: string, postId: string) => {
  graphClient.setupClient(token);

  const { post } = (await graphClient?.request(postQuery, {
    postId,
  })) as any;

  return post;
};

export const togglePublished = async (token: string, postId: string) => {
  graphClient.setupClient(token);

  const { togglePublished } = (await graphClient?.request(
    togglePublishedMutation,
    {
      postId,
    }
  )) as any;

  return togglePublished;
};

export const deletePost = async (token: string, postId: string) => {
  graphClient.setupClient(token);

  const { deletePost } = (await graphClient?.request(deletePostMutation, {
    postId,
  })) as any;

  return deletePost;
};
